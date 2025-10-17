# Human-in-the-Loop

Pause agent execution for human approval, review, or input before continuing the workflow.

## Overview

Human-in-the-loop workflows allow you to:
- Pause execution at specific points
- Wait for human approval or input
- Review and modify state before continuing
- Implement approval workflows
- Handle sensitive operations safely

## Basic Interrupt

Mark a point in your workflow where human intervention is required:

```python
class ApprovalAgent(Agent):
    state_model = ApprovalState
    checkpointer = 'postgres'  # Required for interrupts!

    def build_graph(self):
        return (
            self.start()
            .then(self.classify_request)

            # Pause here for human review
            .interrupt()

            # Only continues after human approval
            .then(self.execute_action)
            .end()
        )
```

## Complete Workflow

### Step 1: Start Execution

```python
async def run_workflow():
    agent = ApprovalAgent()

    # Must provide thread_id for checkpointing
    config = {"configurable": {"thread_id": "workflow-123"}}

    # Start execution - will pause at interrupt
    try:
        result = await agent.invoke(
            {'query': 'Delete user data'},
            config=config
        )
    except Exception:
        # Workflow paused at interrupt point
        print("Workflow paused for approval")
```

### Step 2: Check State

```python
# Get current state at interrupt point
state = agent.get_state(config)
print(f"Current state: {state}")
print(f"Awaiting approval for: {state['query']}")
```

### Step 3: Update State

```python
# Human reviews and makes decision
agent.update_state(config, {
    'approved': True,
    'approved_by': 'admin@example.com',
    'approval_time': datetime.now()
})
```

### Step 4: Resume Execution

```python
# Resume execution after approval
result = await agent.resume(config)
print(f"Workflow completed: {result}")
```

## Multiple Interrupt Points

You can have multiple approval points in a workflow:

```python
def build_graph(self):
    return (
        self.start()

        # First approval point
        .then(self.validate_request)
        .interrupt()

        # Execute first step
        .then(self.step1)

        # Second approval point
        .interrupt()

        # Execute final step
        .then(self.step2)
        .end()
    )
```

## Conditional Interrupts

Only interrupt for specific conditions:

```python
class ConditionalApprovalAgent(Agent):
    def build_graph(self):
        return (
            self.start()
            .then(self.classify)

            # Branch based on risk level
            .branch({
                'high_risk': self.high_risk_flow,
                'low_risk': self.low_risk_flow
            })

            .merge(self.finalize)
            .end()
        )

    async def high_risk_flow(self, state):
        # Mark for interrupt
        builder = self.get_builder()
        builder.interrupt()

        return state

    async def low_risk_flow(self, state):
        # No interrupt for low risk
        return state
```

## Complete Example: Order Approval System

```python
from langvel.core.agent import Agent
from langvel.state.base import StateModel
from pydantic import Field
from datetime import datetime

class OrderState(StateModel):
    order_id: str
    amount: float
    customer_id: str
    approved: bool = False
    approved_by: str = None
    approval_time: datetime = None
    rejection_reason: str = None

class OrderApprovalAgent(Agent):
    state_model = OrderState
    checkpointer = 'postgres'  # Required for interrupts

    def build_graph(self):
        return (
            self.start()
            .then(self.validate_order)
            .then(self.check_risk_level)

            # Interrupt for high-value orders
            .branch({
                'high_value': self.require_approval,
                'normal': self.auto_approve
            })

            .merge(self.process_order)
            .then(self.send_notification)
            .end()
        )

    async def validate_order(self, state):
        # Validate order details
        if state.amount <= 0:
            raise ValueError("Invalid order amount")
        return state

    async def check_risk_level(self, state):
        # Classify based on amount
        if state.amount > 10000:
            state.set_next('high_value')
        else:
            state.set_next('normal')
        return state

    async def require_approval(self, state):
        # This branch will hit the interrupt
        # Actual interrupt is set in the graph
        return state

    async def auto_approve(self, state):
        # Auto-approve low-value orders
        state.approved = True
        state.approved_by = 'system'
        state.approval_time = datetime.now()
        return state

    async def process_order(self, state):
        if not state.approved:
            state.set_error("Order not approved")
            return state

        # Process the order
        # ...

        return state

# Usage
async def handle_order():
    agent = OrderApprovalAgent()

    # High-value order
    config = {"configurable": {"thread_id": f"order-{order_id}"}}

    try:
        result = await agent.invoke({
            'order_id': 'ORD-123',
            'amount': 15000,
            'customer_id': 'CUST-456'
        }, config=config)
    except Exception:
        # Workflow paused - notify admin
        state = agent.get_state(config)
        await notify_admin(f"Approval needed for order {state['order_id']}")

        # Admin reviews in UI and approves
        # ...

        # Resume workflow
        agent.update_state(config, {
            'approved': True,
            'approved_by': 'admin@company.com',
            'approval_time': datetime.now()
        })

        result = await agent.resume(config)

    return result
```

## Web API Integration

### FastAPI Endpoint for Approval

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class ApprovalRequest(BaseModel):
    thread_id: str
    approved: bool
    approved_by: str
    notes: str = None

@app.post("/approve")
async def approve_workflow(request: ApprovalRequest):
    agent = OrderApprovalAgent()
    config = {"configurable": {"thread_id": request.thread_id}}

    # Get current state
    state = agent.get_state(config)
    if not state:
        raise HTTPException(404, "Workflow not found")

    # Update with approval
    agent.update_state(config, {
        'approved': request.approved,
        'approved_by': request.approved_by,
        'approval_notes': request.notes
    })

    # Resume execution
    result = await agent.resume(config)

    return {"status": "completed", "result": result}

@app.get("/pending-approvals")
async def list_pending():
    # Query checkpointer for workflows at interrupt points
    # Implementation depends on checkpointer backend
    pass
```

## Requirements

### 1. Checkpointer Required

Human-in-the-loop requires a persistent checkpointer:

```python
class MyAgent(Agent):
    # Must use persistent checkpointer
    checkpointer = 'postgres'  # or 'redis'

    # Won't work with memory checkpointer for production
    # checkpointer = 'memory'  # Only for testing
```

### 2. Thread ID Required

Always provide a thread_id:

```python
# Good - unique thread ID
config = {"configurable": {"thread_id": f"workflow-{uuid4()}"}}

# Good - use business ID
config = {"configurable": {"thread_id": f"order-{order_id}"}}

# Bad - no thread ID
config = {}
```

### 3. State Must Be Serializable

All state data must be JSON serializable:

```python
class MyState(StateModel):
    # Good
    order_id: str
    amount: float
    created_at: datetime  # Pydantic handles datetime serialization

    # Bad - not serializable
    # database_connection: Connection
    # file_handle: File
```

## Best Practices

### 1. Timeout Handling

Set timeouts for approval workflows:

```python
async def run_with_timeout():
    config = {"configurable": {"thread_id": "workflow-123"}}

    try:
        result = await agent.invoke(input, config=config)
    except Exception:
        # Workflow paused

        # Set timeout (e.g., 24 hours)
        timeout = datetime.now() + timedelta(hours=24)

        # Store timeout in separate table
        await db.set_approval_timeout("workflow-123", timeout)

        # Check timeouts periodically
        # If expired, auto-reject or escalate
```

### 2. Audit Trail

Track all approvals:

```python
agent.update_state(config, {
    'approved': True,
    'approved_by': user.email,
    'approved_at': datetime.now(),
    'approval_ip': request.client.host,
    'approval_notes': notes
})

# Log to audit table
await audit_log.record({
    'workflow_id': thread_id,
    'action': 'approved',
    'user': user.email,
    'timestamp': datetime.now()
})
```

### 3. Rejection Handling

Handle rejections gracefully:

```python
if not approved:
    agent.update_state(config, {
        'approved': False,
        'rejected': True,
        'rejected_by': user.email,
        'rejection_reason': reason
    })

    # Resume will execute rejection path
    result = await agent.resume(config)
```

## Troubleshooting

### Interrupt Not Working

**Problem**: Workflow doesn't pause

**Solutions**:
1. Check checkpointer is configured:
   ```python
   checkpointer = 'postgres'  # or 'redis', NOT 'memory'
   ```

2. Verify thread_id is provided:
   ```python
   config = {"configurable": {"thread_id": "unique-id"}}
   ```

3. Ensure `.interrupt()` is in graph

### Cannot Resume

**Problem**: `resume()` fails

**Solutions**:
1. Verify thread_id matches:
   ```python
   # Same thread_id used for invoke and resume
   config = {"configurable": {"thread_id": "workflow-123"}}
   ```

2. Check state was updated:
   ```python
   state = agent.get_state(config)
   print(state)  # Verify state exists
   ```

3. Ensure checkpointer is accessible

## Related Topics

- [Checkpointers](/advanced/checkpointers) - Persistent state storage
- [Loops](/advanced/loops) - Add retry logic
- [Graph Validation](/advanced/graph-validation) - Validate interrupt points
