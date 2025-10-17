# Subgraph Composition

Build reusable, modular workflow components that can be nested and composed for maximum code reuse.

## Overview

Subgraphs allow you to:
- Create reusable workflow components
- Build modular, maintainable agent systems
- Test workflows independently
- Compose complex workflows from simple building blocks

## Creating Subgraphs

### Basic Subgraph

```python
from langvel.routing.builder import GraphBuilder

class AuthenticationFlow:
    """Reusable authentication subgraph."""

    @staticmethod
    def build() -> GraphBuilder:
        auth = GraphBuilder(AuthState)
        return (
            auth
            .then(AuthenticationFlow.verify_token)
            .then(AuthenticationFlow.load_user)
            .then(AuthenticationFlow.check_permissions)
            .end()
        )

    @staticmethod
    async def verify_token(state):
        # Token verification logic
        if state.token and len(state.token) > 10:
            state.authenticated = True
        return state

    @staticmethod
    async def load_user(state):
        if state.authenticated:
            state.user = await db.get_user_by_token(state.token)
        return state

    @staticmethod
    async def check_permissions(state):
        if state.user:
            state.permissions = await db.get_permissions(state.user.id)
        return state
```

## Using Subgraphs

### Embed in Main Graph

```python
class MainAgent(Agent):
    state_model = MainState

    def build_graph(self):
        return (
            self.start()

            # Embed authentication subgraph
            .subgraph(AuthenticationFlow.build(), name='auth')

            # Continue main flow
            .then(self.process_request)
            .then(self.send_response)
            .end()
        )
```

### Multiple Subgraphs

```python
class ComplexAgent(Agent):
    def build_graph(self):
        return (
            self.start()

            # Authentication
            .subgraph(AuthenticationFlow.build(), name='auth')

            # Validation
            .subgraph(ValidationFlow.build(), name='validation')

            # Processing
            .subgraph(ProcessingFlow.build(), name='processing')

            .then(self.finalize)
            .end()
        )
```

## Common Subgraph Patterns

### 1. Authentication Subgraph

```python
class AuthenticationFlow:
    @staticmethod
    def build() -> GraphBuilder:
        return (
            GraphBuilder(AuthState)
            .then(AuthenticationFlow.verify_token)
            .then(AuthenticationFlow.load_user)
            .then(AuthenticationFlow.check_permissions)
            .end()
        )
```

### 2. Validation Subgraph

```python
class ValidationFlow:
    @staticmethod
    def build() -> GraphBuilder:
        return (
            GraphBuilder(ValidationState)
            .then(ValidationFlow.validate_schema)
            .then(ValidationFlow.validate_business_rules)
            .then(ValidationFlow.validate_permissions)
            .end()
        )
```

### 3. Data Processing Subgraph

```python
class DataProcessingFlow:
    @staticmethod
    def build() -> GraphBuilder:
        return (
            GraphBuilder(ProcessingState)
            .then(DataProcessingFlow.extract)
            .then(DataProcessingFlow.transform)
            .then(DataProcessingFlow.validate)
            .then(DataProcessingFlow.load)
            .end()
        )
```

### 4. Notification Subgraph

```python
class NotificationFlow:
    @staticmethod
    def build() -> GraphBuilder:
        return (
            GraphBuilder(NotificationState)
            .parallel(
                NotificationFlow.send_email,
                NotificationFlow.send_sms,
                NotificationFlow.send_push,
                auto_merge=True
            )
        )
```

## Complete Example

### Order Processing System

```python
# Auth subgraph
class AuthFlow:
    @staticmethod
    def build():
        return (
            GraphBuilder(AuthState)
            .then(AuthFlow.verify_token)
            .then(AuthFlow.load_user)
            .end()
        )

# Payment subgraph
class PaymentFlow:
    @staticmethod
    def build():
        return (
            GraphBuilder(PaymentState)
            .then(PaymentFlow.validate_payment_method)
            .then(PaymentFlow.charge_payment)
            .then(PaymentFlow.record_transaction)
            .end()
        )

# Inventory subgraph
class InventoryFlow:
    @staticmethod
    def build():
        return (
            GraphBuilder(InventoryState)
            .then(InventoryFlow.check_stock)
            .then(InventoryFlow.reserve_items)
            .then(InventoryFlow.update_inventory)
            .end()
        )

# Main order processing agent
class OrderProcessingAgent(Agent):
    state_model = OrderState

    def build_graph(self):
        return (
            self.start()

            # Authentication
            .subgraph(AuthFlow.build(), name='auth')

            # Validate order
            .then(self.validate_order)

            # Parallel payment and inventory checks
            .parallel(
                lambda s: self.run_subgraph(PaymentFlow.build(), s),
                lambda s: self.run_subgraph(InventoryFlow.build(), s),
                auto_merge=False
            )
            .merge(self.consolidate_results)

            # Process order if both succeed
            .then(self.process_order)
            .then(self.send_confirmation)
            .end()
        )
```

## Subgraph with Conditional Logic

```python
class SmartProcessingFlow:
    @staticmethod
    def build():
        return (
            GraphBuilder(ProcessingState)
            .then(SmartProcessingFlow.analyze_complexity)
            .branch({
                'simple': SmartProcessingFlow.simple_process,
                'complex': SmartProcessingFlow.complex_process
            })
            .merge(SmartProcessingFlow.validate_result)
            .end()
        )
```

## Nested Subgraphs

Subgraphs can contain other subgraphs:

```python
class ParentFlow:
    @staticmethod
    def build():
        return (
            GraphBuilder(ParentState)
            .then(ParentFlow.initialize)

            # Nested subgraph
            .subgraph(ChildFlow.build(), name='child')

            .then(ParentFlow.finalize)
            .end()
        )

class ChildFlow:
    @staticmethod
    def build():
        return (
            GraphBuilder(ChildState)
            .then(ChildFlow.step1)

            # Another level of nesting
            .subgraph(GrandchildFlow.build(), name='grandchild')

            .then(ChildFlow.step2)
            .end()
        )
```

## Testing Subgraphs

### Unit Testing Subgraphs

```python
import pytest
from langvel.routing.builder import GraphBuilder

async def test_auth_flow():
    # Build subgraph
    auth_graph = AuthenticationFlow.build()

    # Compile it
    from langvel.core.agent import Agent

    class TestAgent(Agent):
        state_model = AuthState

        def build_graph(self):
            return auth_graph

    agent = TestAgent()

    # Test with valid token
    result = await agent.invoke({
        'token': 'valid_token_12345'
    })

    assert result['authenticated'] == True
    assert 'user' in result
```

## Best Practices

### 1. Keep Subgraphs Pure

Make subgraphs stateless and reusable:

```python
# Good - stateless, pure
class AuthFlow:
    @staticmethod
    def build():
        return GraphBuilder(AuthState).then(...).end()

# Bad - stateful, not reusable
class AuthFlow:
    def __init__(self):
        self.cache = {}  # State makes it non-reusable

    def build(self):
        return GraphBuilder(AuthState).then(...).end()
```

### 2. Use Descriptive Names

Name subgraphs clearly:

```python
# Good
.subgraph(AuthenticationFlow.build(), name='auth')
.subgraph(PaymentProcessingFlow.build(), name='payment')

# Bad
.subgraph(flow1.build(), name='f1')
.subgraph(flow2.build(), name='f2')
```

### 3. Document Dependencies

```python
class OrderFlow:
    """
    Order processing subgraph.

    Dependencies:
    - Requires authenticated user (AuthFlow must run first)
    - Expects OrderState with validated data

    State mutations:
    - Adds order_id
    - Sets order_status
    - Updates inventory_reserved
    """
    @staticmethod
    def build():
        return ...
```

### 4. Single Responsibility

Each subgraph should do one thing:

```python
# Good - focused responsibility
class EmailNotificationFlow:
    """Handles email notifications only."""

# Good - focused responsibility
class SMSNotificationFlow:
    """Handles SMS notifications only."""

# Bad - mixed responsibilities
class NotificationFlow:
    """Handles email, SMS, push, webhooks, logging, etc."""
```

## Related Topics

- [Loops](/advanced/loops) - Add loops in subgraphs
- [Human-in-the-Loop](/advanced/human-in-loop) - Add approvals
- [Graph Validation](/advanced/graph-validation) - Validate subgraphs
