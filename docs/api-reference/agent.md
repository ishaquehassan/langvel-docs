# Agent API Reference

The `Agent` class is the base class for all Langvel agents. It provides a Laravel Controller-like interface for building LangGraph workflows.

## Class: `Agent`

```python
from langvel.core.agent import Agent
```

### Class Attributes

#### `state_model`
- **Type**: `Type[StateModel]`
- **Default**: `None`
- **Description**: The Pydantic state model defining the data structure for this agent

```python
class MyAgent(Agent):
    state_model = MyStateModel
```

#### `middleware`
- **Type**: `List[str]`
- **Default**: `[]`
- **Description**: List of middleware names to apply to this agent

```python
class MyAgent(Agent):
    middleware = ['logging', 'auth', 'rate_limit']
```

#### `checkpointer`
- **Type**: `Optional[str]`
- **Default**: `"memory"`
- **Options**: `"memory"`, `"postgres"`, `"redis"`, `None`
- **Description**: The checkpointer type for state persistence

```python
class MyAgent(Agent):
    checkpointer = 'postgres'  # Use PostgreSQL for persistence
```

### Instance Attributes

#### `llm`
- **Type**: `LLMManager`
- **Description**: Automatically initialized LLM client for this agent

```python
async def process(self, state):
    response = await self.llm.invoke("Your prompt")
    return state
```

#### `tool_registry`
- **Type**: `ToolRegistry`
- **Description**: Registry of tools defined in this agent

#### `middleware_manager`
- **Type**: `MiddlewareManager`
- **Description**: Manager for running middleware

#### `rag_manager`
- **Type**: `RAGManager`
- **Description**: Manager for RAG (Retrieval-Augmented Generation) operations

#### `mcp_manager`
- **Type**: `MCPManager`
- **Description**: Manager for MCP (Model Context Protocol) server interactions

### Abstract Methods

#### `build_graph()`

**Must be implemented by all agents.**

```python
@abstractmethod
def build_graph(self) -> GraphBuilder:
    """Define the agent's workflow graph."""
    pass
```

**Returns**: `GraphBuilder` - The graph builder instance

**Example**:
```python
def build_graph(self):
    return (
        self.start()
        .then(self.classify)
        .then(self.process)
        .end()
    )
```

### Methods

#### `__init__()`

Initialize the agent with tools, middleware, and LLM.

```python
def __init__(self):
    ...
```

**Description**:
- Initializes tool registry
- Sets up middleware manager
- Initializes RAG and MCP managers
- Configures LLM client
- Registers tools and middleware

**Example**:
```python
agent = MyAgent()
```

---

#### `compile()`

Compile the agent into a LangGraph StateGraph.

```python
def compile(self) -> StateGraph:
    ...
```

**Returns**: `StateGraph` - The compiled graph ready for execution

**Description**:
- Builds the graph using `build_graph()`
- Sets up the configured checkpointer
- Compiles into an executable StateGraph
- Caches the compiled graph

**Example**:
```python
agent = MyAgent()
graph = agent.compile()
```

---

#### `invoke()`

Execute the agent synchronously with input data.

```python
async def invoke(
    self,
    input_data: Dict[str, Any],
    config: Optional[RunnableConfig] = None
) -> Dict[str, Any]:
    ...
```

**Parameters**:
- `input_data` (`Dict[str, Any]`): Input state data as a dictionary
- `config` (`Optional[RunnableConfig]`): Optional LangGraph configuration

**Returns**: `Dict[str, Any]` - The final state after execution

**Raises**: Any exceptions from agent execution

**Description**:
- Starts observability tracing
- Runs before middleware
- Executes the compiled graph
- Runs after middleware
- Ends tracing with results

**Example**:
```python
agent = MyAgent()
result = await agent.invoke({
    "query": "What is Python?",
    "user_id": "user123"
})
print(result)  # {'query': 'What is Python?', 'response': '...', ...}
```

---

#### `stream()`

Stream agent execution with real-time updates.

```python
async def stream(
    self,
    input_data: Dict[str, Any],
    config: Optional[RunnableConfig] = None
) -> AsyncIterator[Dict[str, Any]]:
    ...
```

**Parameters**:
- `input_data` (`Dict[str, Any]`): Input state data
- `config` (`Optional[RunnableConfig]`): Optional LangGraph configuration

**Yields**: `Dict[str, Any]` - State updates as they occur

**Description**:
- Runs before middleware
- Streams graph execution
- Yields each state update

**Example**:
```python
agent = MyAgent()
async for chunk in agent.stream({"query": "Hello"}):
    print(chunk)
```

---

#### `start()`

Begin building the agent's graph.

```python
def start(self) -> GraphBuilder:
    ...
```

**Returns**: `GraphBuilder` - A new graph builder instance

**Description**: Creates a new GraphBuilder initialized with the agent's state model

**Example**:
```python
def build_graph(self):
    return self.start().then(self.handle).end()
```

## Class: `GraphBuilder`

Fluent interface for building LangGraph workflows with a Laravel-like chainable API.

```python
from langvel.core.agent import GraphBuilder
```

### Methods

#### `then()`

Add a sequential node to the graph.

```python
def then(
    self,
    func: Callable,
    name: Optional[str] = None
) -> GraphBuilder:
    ...
```

**Parameters**:
- `func` (`Callable`): The function to execute in this node
- `name` (`Optional[str]`): Optional custom name for the node

**Returns**: `GraphBuilder` - Self for chaining

**Example**:
```python
def build_graph(self):
    return (
        self.start()
        .then(self.classify)
        .then(self.process)
        .then(self.respond)
        .end()
    )
```

---

#### `branch()`

Add conditional branching to the graph.

```python
def branch(
    self,
    conditions: Dict[str, Callable],
    condition_func: Optional[Callable] = None
) -> GraphBuilder:
    ...
```

**Parameters**:
- `conditions` (`Dict[str, Callable]`): Mapping of condition results to handler functions
- `condition_func` (`Optional[Callable]`): Function that returns which branch to take

**Returns**: `GraphBuilder` - Self for chaining

**Example**:
```python
def build_graph(self):
    return (
        self.start()
        .then(self.classify)
        .branch(
            {
                'urgent': self.handle_urgent,
                'normal': self.handle_normal,
                'low': self.handle_low
            },
            condition_func=lambda state: state.priority
        )
        .end()
    )
```

---

#### `merge()`

Merge multiple branches back together.

```python
def merge(
    self,
    func: Callable,
    name: Optional[str] = None
) -> GraphBuilder:
    ...
```

**Parameters**:
- `func` (`Callable`): The function to execute after merging
- `name` (`Optional[str]`): Optional custom name

**Returns**: `GraphBuilder` - Self for chaining

**Example**:
```python
def build_graph(self):
    return (
        self.start()
        .then(self.process)
        .branch({...})
        .merge(self.finalize)
        .end()
    )
```

---

#### `end()`

Mark the end of the graph definition.

```python
def end(self) -> GraphBuilder:
    ...
```

**Returns**: `GraphBuilder` - Self for chaining

**Example**:
```python
def build_graph(self):
    return self.start().then(self.handle).end()
```

## Complete Example

```python
from langvel.core.agent import Agent
from langvel.state.base import StateModel
from langvel.tools.decorators import rag_tool
from typing import Optional

class CustomerSupportState(StateModel):
    query: str
    category: Optional[str] = None
    retrieved_docs: Optional[list] = None
    response: str = ""
    confidence: float = 0.0

class CustomerSupportAgent(Agent):
    """Production-ready customer support agent."""

    state_model = CustomerSupportState
    middleware = ['logging', 'rate_limit']
    checkpointer = 'postgres'

    def build_graph(self):
        return (
            self.start()
            .then(self.classify_query)
            .branch(
                {
                    'technical': self.handle_technical,
                    'billing': self.handle_billing,
                    'general': self.handle_general
                },
                condition_func=lambda state: state.category
            )
            .merge(self.finalize_response)
            .end()
        )

    async def classify_query(self, state: CustomerSupportState):
        """Classify the customer query."""
        prompt = f"Classify this query: {state.query}"
        result = await self.llm.invoke(prompt)
        state.category = result.strip().lower()
        return state

    @rag_tool(collection='tech_docs', k=5)
    async def handle_technical(self, state: CustomerSupportState):
        """Handle technical queries with RAG."""
        # Documents automatically retrieved and added to state
        return state

    async def handle_billing(self, state: CustomerSupportState):
        """Handle billing queries."""
        # Billing-specific logic
        return state

    async def handle_general(self, state: CustomerSupportState):
        """Handle general queries."""
        # General query logic
        return state

    async def finalize_response(self, state: CustomerSupportState):
        """Generate final response."""
        context = state.retrieved_docs or []
        prompt = f"Answer: {state.query}\nContext: {context}"
        state.response = await self.llm.invoke(prompt)
        state.confidence = 0.9
        return state


# Usage
async def main():
    agent = CustomerSupportAgent()

    # Invoke agent
    result = await agent.invoke({
        "query": "How do I reset my password?"
    })
    print(result.response)

    # Stream agent
    async for chunk in agent.stream({
        "query": "What are your pricing plans?"
    }):
        print(chunk)

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
```

## See Also

- [StateModel API](/api-reference/state-model) - Define your state structure
- [Middleware API](/api-reference/middleware) - Add cross-cutting concerns
- [Tools API](/api-reference/tools) - Extend agent capabilities
- [Agents Guide](/architecture/agents) - Learn more about agents
