# Directory Structure

Understanding Langvel's project structure will help you navigate and organize your code effectively.

## Project Layout

After installation, your Langvel project has this structure:

```
langvel/
├── app/                      # Your application code
│   ├── agents/              # Agent classes (like Controllers)
│   │   ├── __init__.py
│   │   ├── customer_support_agent.py
│   │   └── code_review_agent.py
│   ├── middleware/          # Custom middleware
│   │   ├── __init__.py
│   │   └── custom_middleware.py
│   ├── tools/              # Custom tools
│   │   ├── __init__.py
│   │   └── custom_tool.py
│   ├── models/             # State models
│   │   ├── __init__.py
│   │   └── states.py
│   └── providers/          # Service providers
│       ├── __init__.py
│       └── custom_provider.py
│
├── config/                  # Configuration files
│   ├── __init__.py
│   └── langvel.py          # Main configuration
│
├── routes/                  # Route definitions
│   ├── __init__.py
│   └── agent.py            # Agent routes
│
├── langvel/                 # Framework core (don't modify)
│   ├── core/               # Core agent & graph builder
│   ├── routing/            # Router & route management
│   ├── state/              # State models & checkpointers
│   ├── tools/              # Tool system
│   ├── middleware/         # Middleware engine
│   ├── rag/                # RAG integration
│   ├── mcp/                # MCP server integration
│   ├── llm/                # LLM manager
│   ├── auth/               # Authentication & authorization
│   ├── logging/            # Structured logging
│   ├── cli/                # CLI commands
│   └── server.py           # FastAPI server
│
├── data/                    # Data storage
│   └── chroma/             # Vector store data
│
├── logs/                    # Log files
│   └── langvel.log
│
├── .env                     # Environment variables
├── .env.example            # Example environment
├── .gitignore              # Git ignore rules
├── setup.py                # Setup script
├── pyproject.toml          # Python project config
└── README.md               # Project README
```

## Directory Details

### app/

Your application code lives here. This is where you'll spend most of your time.

#### app/agents/

Agent classes define your workflow logic:

```python
# app/agents/customer_support_agent.py
from langvel.core.agent import Agent

class CustomerSupportAgent(Agent):
    def build_graph(self):
        return self.start().then(self.handle).end()
```

Generate new agents:
```bash
langvel make:agent CustomerSupport
```

#### app/middleware/

Custom middleware for cross-cutting concerns:

```python
# app/middleware/custom_middleware.py
from langvel.middleware.base import Middleware

class CustomMiddleware(Middleware):
    async def before(self, state):
        # Run before agent
        return state

    async def after(self, state):
        # Run after agent
        return state
```

Generate new middleware:
```bash
langvel make:middleware Custom
```

#### app/tools/

Custom tool implementations:

```python
# app/tools/sentiment_analyzer.py
from langvel.tools.decorators import tool

@tool(description="Analyze sentiment")
async def analyze_sentiment(text: str) -> str:
    # Your logic
    return "positive"
```

Generate new tools:
```bash
langvel make:tool SentimentAnalyzer
```

#### app/models/

State models define data structures:

```python
# app/models/states.py
from langvel.state.base import StateModel

class CustomerSupportState(StateModel):
    query: str
    response: str = ""
```

Generate new states:
```bash
langvel make:state CustomerSupportState
```

### config/

Configuration files for your application.

#### config/langvel.py

Main configuration file:

```python
# LLM
LLM_PROVIDER = 'anthropic'
LLM_MODEL = 'claude-3-5-sonnet-20241022'

# RAG
RAG_PROVIDER = 'chroma'

# MCP Servers
MCP_SERVERS = {
    'slack': {...}
}
```

[Learn more about Configuration →](/getting-started/configuration)

### routes/

Define how agents are exposed via HTTP:

```python
# routes/agent.py
from langvel.routing.router import router
from app.agents.customer_support_agent import CustomerSupportAgent

@router.flow('/customer-support')
class CustomerSupportFlow(CustomerSupportAgent):
    pass
```

[Learn more about Routing →](/the-basics/routing)

### langvel/

Framework core - don't modify these files directly!

- `core/` - Agent & graph building
- `routing/` - HTTP routing
- `state/` - State management
- `tools/` - Tool system
- `middleware/` - Middleware engine
- `rag/` - RAG integration
- `mcp/` - MCP servers
- `llm/` - LLM management
- `auth/` - Authentication
- `logging/` - Logging
- `cli/` - CLI commands
- `server.py` - Web server

### data/

Persistent data storage:

- `chroma/` - Vector store database
- Add to `.gitignore` for large datasets

### logs/

Application logs:

- `langvel.log` - Main log file
- JSON format for production
- Text format for development

## File Naming Conventions

Follow these conventions for consistency:

### Agents

```
app/agents/
├── customer_support_agent.py    # snake_case with _agent suffix
├── code_review_agent.py
└── data_processing_agent.py
```

### State Models

```
app/models/
├── customer_support_state.py    # snake_case with _state suffix
├── code_review_state.py
└── data_processing_state.py
```

### Middleware

```
app/middleware/
├── auth_middleware.py           # snake_case with _middleware suffix
├── rate_limit_middleware.py
└── logging_middleware.py
```

### Tools

```
app/tools/
├── sentiment_analyzer.py        # snake_case, descriptive name
├── email_validator.py
└── data_enricher.py
```

## Laravel Comparison

If you're coming from Laravel, here's how directories map:

| Laravel | Langvel | Purpose |
|---------|---------|---------|
| `app/Http/Controllers/` | `app/agents/` | Request handlers |
| `app/Models/` | `app/models/` | Data structures |
| `app/Http/Middleware/` | `app/middleware/` | Middleware |
| `routes/web.php` | `routes/agent.py` | Route definitions |
| `config/` | `config/` | Configuration |
| `app/Providers/` | `app/providers/` | Service providers |

## Customizing Structure

### Custom Directories

Add your own directories under `app/`:

```
app/
├── agents/
├── services/         # Business logic
├── repositories/     # Data access
├── validators/       # Input validation
└── transformers/     # Data transformation
```

### Module Structure

For large projects, use modules:

```
app/
├── customer_support/
│   ├── agents/
│   ├── models/
│   └── tools/
├── billing/
│   ├── agents/
│   ├── models/
│   └── tools/
└── analytics/
    ├── agents/
    ├── models/
    └── tools/
```

## Import Patterns

### Absolute Imports (Recommended)

```python
from app.agents.customer_support_agent import CustomerSupportAgent
from app.models.states import CustomerSupportState
from config.langvel import LLM_PROVIDER
```

### Relative Imports

```python
# In app/agents/customer_support_agent.py
from ..models.states import CustomerSupportState
from ..tools.sentiment_analyzer import analyze_sentiment
```

## Environment Files

### .env

```bash
# Production secrets (never commit!)
ANTHROPIC_API_KEY=sk-ant-...
JWT_SECRET_KEY=...
```

### .env.example

```bash
# Template for new developers (commit this)
ANTHROPIC_API_KEY=your-key-here
JWT_SECRET_KEY=generate-secret-key
```

### .env.local

```bash
# Local overrides (never commit!)
DEBUG=true
LOG_LEVEL=DEBUG
```

## Best Practices

### 1. Keep app/ Clean

```
✅ app/agents/customer_support_agent.py
✅ app/models/customer_support_state.py
❌ app/random_script.py
❌ app/temp_file.py
```

### 2. Use Descriptive Names

```python
# ✅ Good
class CustomerSupportAgent(Agent):
    pass

# ❌ Bad
class Agent1(Agent):
    pass
```

### 3. One Class Per File

```python
# ✅ Good - customer_support_agent.py
class CustomerSupportAgent(Agent):
    pass

# ❌ Bad - agents.py with multiple classes
class CustomerSupportAgent(Agent):
    pass

class BillingAgent(Agent):
    pass
```

### 4. Group Related Code

```
app/customer_support/
├── agents/
│   └── customer_support_agent.py
├── models/
│   └── customer_support_state.py
└── tools/
    └── ticket_creator.py
```

## Next Steps

- **[Agents →](/architecture/agents)** - Start building agents
- **[Routing →](/the-basics/routing)** - Expose agents via HTTP
- **[Configuration →](/getting-started/configuration)** - Configure your app

## Need Help?

- 💬 [Join Discord](https://discord.gg/langvel)
- 📚 [Read Documentation](/getting-started/installation)
