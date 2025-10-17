# Agents

Agents are the core building blocks of Langvel. They're similar to Controllers in Laravel - they define the logic and workflow for handling requests.

## What is an Agent?

An Agent orchestrates a workflow using LangGraph under the hood. It defines:

- **State**: What data flows through the workflow
- **Nodes**: Individual processing steps
- **Edges**: How nodes connect
- **Logic**: What happens at each step

## Basic Agent

Here's the simplest possible agent:

```python
from langvel.core.agent import Agent

class HelloAgent(Agent):
    def build_graph(self):
        return self.start().then(self.greet).end()

    async def greet(self, state: dict):
        state['message'] = 'Hello, World!'
        return state
```

## Agent with State Model

For type safety and validation, use a State Model:

```python
from langvel.core.agent import Agent
from langvel.state.base import StateModel

class GreetingState(StateModel):
    name: str
    greeting: str = ""

class GreetingAgent(Agent):
    state_model = GreetingState

    def build_graph(self):
        return self.start().then(self.greet).end()

    async def greet(self, state: GreetingState):
        state.greeting = f"Hello, {state.name}!"
        return state
```

## Built-in LLM Access

Every agent has `self.llm` ready to use:

```python
class ChatAgent(Agent):
    state_model = ChatState

    async def respond(self, state: ChatState):
        # Simple invocation
        response = await self.llm.invoke(state.query)
        state.response = response
        return state
```

[Learn more about LLM Integration →](/the-basics/llm-integration)

## Agent Lifecycle

```
┌─────────────────────────────────────────┐
│ 1. Initialize Agent                     │
│    - Load configuration                 │
│    - Setup LLM                          │
│    - Initialize middleware              │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│ 2. Build Graph                          │
│    - Define nodes                       │
│    - Connect edges                      │
│    - Add conditional logic              │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│ 3. Compile (LangGraph)                  │
│    - Validate structure                 │
│    - Optimize execution                 │
│    - Setup checkpointing                │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│ 4. Execute                              │
│    - Run middleware (before)            │
│    - Execute nodes in order             │
│    - Handle errors                      │
│    - Run middleware (after)             │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│ 5. Return Result                        │
│    - Final state                        │
│    - Metadata                           │
│    - Trace information                  │
└─────────────────────────────────────────┘
```

## Multi-Step Workflows

Chain multiple nodes together:

```python
class DataProcessingAgent(Agent):
    def build_graph(self):
        return (
            self.start()
            .then(self.validate)
            .then(self.transform)
            .then(self.enrich)
            .then(self.save)
            .end()
        )

    async def validate(self, state):
        # Validation logic
        return state

    async def transform(self, state):
        # Transformation logic
        return state

    async def enrich(self, state):
        # Enrichment logic
        return state

    async def save(self, state):
        # Save logic
        return state
```

## Conditional Branching

Route based on state:

```python
class CustomerAgent(Agent):
    def build_graph(self):
        return (
            self.start()
            .then(self.classify)
            .branch(
                self.is_premium,
                {
                    True: self.premium_flow,
                    False: self.standard_flow
                }
            )
            .then(self.finalize)
            .end()
        )

    async def classify(self, state):
        # Classify customer
        return state

    def is_premium(self, state) -> bool:
        return state.customer_tier == 'premium'

    async def premium_flow(self, state):
        # Premium customer logic
        return state

    async def standard_flow(self, state):
        # Standard customer logic
        return state

    async def finalize(self, state):
        # Common finalization
        return state
```

## Middleware

Add cross-cutting concerns:

```python
class SecureAgent(Agent):
    state_model = MyState
    middleware = ['logging', 'auth', 'rate_limit']

    def build_graph(self):
        return self.start().then(self.handle).end()

    async def handle(self, state):
        # Your logic
        return state
```

[Learn more about Middleware →](/the-basics/middleware)

## Error Handling

Handle errors gracefully:

```python
class ResilientAgent(Agent):
    async def process(self, state):
        try:
            result = await self.external_api_call()
            state.result = result
        except Exception as e:
            self.logger.error(f"API call failed: {e}")
            state.error = str(e)
            state.fallback = True
        return state

    async def external_api_call(self):
        # Call external API
        pass
```

[Learn more about Error Handling →](/the-basics/error-handling)

## Invoking Agents

### Direct Invocation

```python
agent = MyAgent()
result = await agent.invoke({'input': 'data'})
print(result)
```

### Via HTTP

```python
# routes/agent.py
@router.flow('/my-agent')
class MyAgentFlow(MyAgent):
    pass
```

```bash
curl -X POST http://localhost:8000/agents/my-agent \
  -H "Content-Type: application/json" \
  -d '{"input": {"query": "test"}}'
```

[Learn more about Routing →](/the-basics/routing)

## Agent Configuration

### Using Class Attributes

```python
class ConfiguredAgent(Agent):
    # State model
    state_model = MyState

    # Middleware
    middleware = ['logging', 'auth']

    # Checkpointing
    checkpointer = 'postgres'

    # Interrupts
    interrupts = ['before_save']

    def build_graph(self):
        return self.start().then(self.handle).end()
```

### Using __init__

```python
class DynamicAgent(Agent):
    def __init__(self, custom_config: dict):
        super().__init__()
        self.config = custom_config

    async def handle(self, state):
        # Use self.config
        return state
```

## Testing Agents

### Unit Testing

```python
import pytest
from app.agents.my_agent import MyAgent

@pytest.mark.asyncio
async def test_my_agent():
    agent = MyAgent()
    result = await agent.invoke({'query': 'test'})

    assert result['response'] is not None
    assert result['status'] == 'success'
```

### CLI Testing

```bash
langvel agent test my-agent -i '{"query": "test"}'
```

[Learn more about Testing →](/advanced/testing)

## Best Practices

### 1. Single Responsibility

Each agent should have one clear purpose:

```python
# ✅ Good - focused purpose
class EmailValidationAgent(Agent):
    pass

class EmailSendingAgent(Agent):
    pass

# ❌ Bad - too many responsibilities
class EmailAgent(Agent):
    pass  # Validates, sends, logs, tracks, etc.
```

### 2. Type-Safe States

Always use State Models:

```python
# ✅ Good
class MyState(StateModel):
    query: str
    response: str = ""

class MyAgent(Agent):
    state_model = MyState

# ❌ Bad
class MyAgent(Agent):
    async def handle(self, state: dict):  # No type safety!
        pass
```

### 3. Small, Focused Nodes

Keep node functions small and focused:

```python
# ✅ Good
async def validate(self, state):
    # Only validation
    return state

async def transform(self, state):
    # Only transformation
    return state

# ❌ Bad
async def validate_and_transform_and_save(self, state):
    # Too much in one function
    return state
```

### 4. Error Handling

Always handle errors gracefully:

```python
async def api_call(self, state):
    try:
        result = await self.external_api()
        state.result = result
    except APIError as e:
        self.logger.error(f"API failed: {e}")
        state.fallback = True
    return state
```

### 5. Logging

Use structured logging:

```python
async def process(self, state):
    self.logger.info(
        "Processing started",
        extra={"user_id": state.user_id, "query": state.query}
    )
    # ... processing
    return state
```

## Advanced Patterns

### Parallel Execution

```python
def build_graph(self):
    return (
        self.start()
        .parallel([
            self.fetch_user,
            self.fetch_products,
            self.fetch_recommendations
        ])
        .then(self.combine_results)
        .end()
    )
```

### Loop Until Condition

```python
def build_graph(self):
    return (
        self.start()
        .then(self.process)
        .loop_until(self.is_complete, self.refine)
        .then(self.finalize)
        .end()
    )

def is_complete(self, state) -> bool:
    return state.confidence > 0.9
```

### Human-in-the-Loop

```python
def build_graph(self):
    return (
        self.start()
        .then(self.generate_draft)
        .interrupt('human_review')  # Pause for human review
        .then(self.finalize)
        .end()
    )
```

## Next Steps

- **[State Models →](/architecture/state-models)** - Learn about typed state
- **[Graph Building →](/architecture/graph-building)** - Master graph construction
- **[Middleware →](/the-basics/middleware)** - Add cross-cutting concerns
- **[Tools →](/the-basics/tools)** - Extend agent capabilities

## Examples

Check out full working examples:

- **[Customer Support Agent](/tutorials/customer-support)** - Complete support workflow
- **[Code Review Agent](/tutorials/code-review)** - Review code with AI
- **[Multi-Agent Research](/tutorials/multi-agent-research)** - Coordinate multiple agents
