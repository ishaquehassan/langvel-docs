# Tools API Reference

Tool decorators for extending agent capabilities.

## Decorators

### `@tool`

Define custom tools for agents.

```python
from langvel.tools.decorators import tool

@tool(description="Analyze sentiment of text")
async def analyze_sentiment(self, text: str) -> str:
    # Your tool logic
    return "positive"

# In agent
class MyAgent(Agent):
    @tool(description="Process data")
    async def process_data(self, state):
        # Tool automatically registered
        return state
```

### `@rag_tool`

Retrieval-Augmented Generation tool.

```python
from langvel.tools.decorators import rag_tool

class MyAgent(Agent):
    @rag_tool(collection='docs', k=5)
    async def search_docs(self, state):
        # Documents automatically retrieved
        # Available in state.retrieved_docs
        return state
```

**Parameters**:
- `collection` (str): Vector store collection name
- `k` (int): Number of documents to retrieve
- `embedding_model` (str, optional): Override default embedding model

### `@mcp_tool`

Model Context Protocol tool.

```python
from langvel.tools.decorators import mcp_tool

class MyAgent(Agent):
    @mcp_tool(server='slack', tool_name='send_message')
    async def notify_slack(self, state):
        # Calls MCP server automatically
        return state
```

**Parameters**:
- `server` (str): MCP server name from config
- `tool_name` (str): Tool name on the server

### `@http_tool`

HTTP API tool.

```python
from langvel.tools.decorators import http_tool

class MyAgent(Agent):
    @http_tool(
        method='POST',
        url='https://api.example.com/data',
        headers={'Authorization': 'Bearer {token}'}
    )
    async def call_api(self, state):
        # HTTP request made automatically
        return state
```

### `@llm_tool`

LLM-powered tool.

```python
from langvel.tools.decorators import llm_tool

class MyAgent(Agent):
    @llm_tool(system_prompt="You are a code reviewer")
    async def review_code(self, code: str) -> str:
        # LLM called with system prompt
        pass
```

## Complete Example

```python
from langvel.core.agent import Agent
from langvel.state.base import StateModel
from langvel.tools.decorators import tool, rag_tool, mcp_tool

class MyState(StateModel):
    query: str
    result: str = ""

class MyAgent(Agent):
    state_model = MyState
    
    @tool(description="Custom processing")
    async def custom_tool(self, state):
        # Custom logic
        return state
    
    @rag_tool(collection='knowledge', k=3)
    async def retrieve_docs(self, state):
        # Auto-retrieval
        return state
    
    @mcp_tool(server='slack', tool_name='send')
    async def notify(self, state):
        # MCP integration
        return state
```

## See Also

- [Agent API](/api-reference/agent)
- [Tools Guide](/the-basics/tools)
