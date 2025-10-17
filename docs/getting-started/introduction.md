# Introduction

## What is Langvel?

Langvel is a Laravel-inspired framework for building LangGraph agents with elegant developer experience. It brings the beloved Laravel development patterns to AI agent development, making it easy to build powerful, production-ready agents.

## Why Langvel?

### Laravel's Elegance Meets LangGraph's Power

If you've ever built a web application with Laravel, you know the joy of working with clean, expressive syntax. Langvel brings that same experience to AI agent development:

```python
# This feels familiar if you know Laravel
class CustomerSupportAgent(Agent):
    state_model = CustomerSupportState
    middleware = ['logging', 'auth', 'rate_limit']

    def build_graph(self):
        return (
            self.start()
            .then(self.classify)
            .then(self.search_knowledge)
            .then(self.generate_response)
            .end()
        )
```

### Problems Langvel Solves

#### 1. **Boilerplate Hell**
LangGraph is powerful but verbose. Langvel eliminates repetitive setup code:

::: code-group

```python [❌ Without Langvel]
from langgraph.graph import StateGraph
from langchain_anthropic import ChatAnthropic
from typing import TypedDict

class State(TypedDict):
    query: str
    response: str

# Manually setup LLM
llm = ChatAnthropic(
    model="claude-3-5-sonnet-20241022",
    api_key=os.getenv("ANTHROPIC_API_KEY")
)

# Manually build graph
graph = StateGraph(State)
graph.add_node("process", process_node)
graph.add_edge(START, "process")
graph.add_edge("process", END)
app = graph.compile()
```

```python [✅ With Langvel]
from langvel.core.agent import Agent
from langvel.state.base import StateModel

class MyState(StateModel):
    query: str
    response: str = ""

class MyAgent(Agent):
    state_model = MyState

    def build_graph(self):
        return self.start().then(self.process).end()

    async def process(self, state):
        # self.llm is ready to use!
        state.response = await self.llm.invoke(state.query)
        return state
```

:::

#### 2. **Integration Complexity**
Langvel provides built-in integrations that just work:

- **LLM**: Every agent has `self.llm` configured automatically
- **RAG**: Add `@rag_tool(collection='docs')` decorator
- **MCP**: Connect external tools with `@mcp_tool(server='slack')`
- **Auth**: Protect nodes with `@requires_auth`
- **Observability**: Automatic LangSmith/Langfuse tracing

#### 3. **Production Gaps**
Langvel includes production essentials out of the box:

- ✅ Authentication & authorization (JWT, API keys, RBAC)
- ✅ Structured JSON logging (ELK, Datadog, CloudWatch)
- ✅ Rate limiting
- ✅ Error handling
- ✅ Checkpointers (PostgreSQL, Redis)
- ✅ Multi-agent coordination
- ✅ Streaming responses

## Core Philosophy

### 1. Convention Over Configuration

Langvel makes sensible defaults so you can focus on building, not configuring:

```python
# No configuration needed - it just works!
class MyAgent(Agent):
    async def process(self, state):
        # LLM configured from environment
        response = await self.llm.invoke("Hello")
        return state
```

### 2. Progressive Disclosure

Start simple, add complexity when needed:

```python
# Simple agent
class SimpleAgent(Agent):
    def build_graph(self):
        return self.start().then(self.handle).end()

# Advanced agent with everything
class AdvancedAgent(Agent):
    state_model = CustomState
    middleware = ['auth', 'rate_limit', 'logging']

    def build_graph(self):
        return (
            self.start()
            .then(self.preprocess)
            .then(self.conditional_branch)
            .end()
        )

    @rag_tool(collection='kb', k=5)
    @requires_permission('admin')
    @rate_limit(10, 60)
    async def handle(self, state):
        pass
```

### 3. Developer Joy

Every API is designed to be intuitive and delightful:

- 🎨 Beautiful CLI with progress bars and colors
- 📝 Comprehensive error messages
- 🔍 Automatic type checking with Pydantic
- 🚀 One-command setup
- 📚 Extensive documentation

## When to Use Langvel

### ✅ Perfect For

- Building production AI agents
- Teams familiar with Laravel patterns
- Projects needing RAG, MCP, or multi-agent systems
- Applications requiring authentication/authorization
- Systems that need observability and monitoring

### ⚠️ Consider Alternatives If

- You need raw LangGraph control (though you can still access it!)
- You're building something extremely custom without standard patterns
- You prefer unopinionated frameworks

## Laravel Comparison

If you're coming from Laravel, here's how concepts map:

| Laravel | Langvel | Purpose |
|---------|---------|---------|
| Controller | Agent | Request handling logic |
| Model | StateModel | Data structure |
| Route | @router.flow() | Endpoint definition |
| Middleware | Middleware | Cross-cutting concerns |
| Artisan | langvel CLI | Command-line tool |
| Service Provider | Service Provider | Dependency injection |
| Config | config/langvel.py | Configuration |

## Architecture Overview

```
┌─────────────────────────────────────────┐
│           Your Application              │
├─────────────────────────────────────────┤
│  Agents (Controllers)                   │
│  State Models (Models)                  │
│  Routes (Routes)                        │
│  Middleware (Middleware)                │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│              Langvel                    │
├─────────────────────────────────────────┤
│  Agent Builder                          │
│  Router                                 │
│  Middleware Engine                      │
│  Tool Registry                          │
│  LLM Manager                            │
│  RAG Manager                            │
│  MCP Manager                            │
│  Auth Manager                           │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│             LangGraph                   │
├─────────────────────────────────────────┤
│  Graph Compilation                      │
│  State Management                       │
│  Checkpointing                          │
│  Streaming                              │
└─────────────────────────────────────────┘
```

## Next Steps

Ready to get started? Here's your learning path:

1. **[Installation →](/getting-started/installation)** - Install Langvel in 5 minutes
2. **[Quick Start →](/getting-started/quick-start)** - Build your first agent
3. **[Configuration →](/getting-started/configuration)** - Configure LLM, RAG, and more
4. **[Agents →](/architecture/agents)** - Deep dive into agent architecture

## Need Help?

- 📚 [Read the docs](/getting-started/installation)
- 💬 [Join Discord](https://discord.gg/langvel)
- 🐛 [Report issues](https://github.com/yourusername/langvel/issues)
- 💡 [Request features](https://github.com/yourusername/langvel/discussions)
