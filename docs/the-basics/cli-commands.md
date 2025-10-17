# CLI Commands

Langvel provides a powerful CLI (Command Line Interface) inspired by Laravel's Artisan, making it easy to scaffold, manage, and test your AI agents.

## Installation

The CLI is included with Langvel. After installation, you can use it with:

```bash
langvel [command]
```

## Quick Reference

```bash
# Project Setup
langvel init                          # Initialize new project
langvel setup                         # Complete setup with venv
langvel setup --with-venv            # Setup with virtual environment

# Code Generation (make:*)
langvel make:agent MyAgent            # Create new agent
langvel make:tool my_tool             # Create new tool
langvel make:middleware AuthMiddleware # Create new middleware
langvel make:state OrderState         # Create new state model

# Agent Management
langvel agent list                    # List all registered agents
langvel agent serve                   # Start development server
langvel agent serve --reload          # Start with auto-reload
langvel agent test /my-agent          # Test an agent
langvel agent graph /my-agent         # Visualize agent graph
```

## Project Initialization

### `langvel init`

Initialize a new Langvel project with the recommended directory structure.

```bash
langvel init
```

**Creates:**
- `app/agents/` - Agent implementations
- `app/middleware/` - Middleware classes
- `app/tools/` - Custom tools
- `app/models/` - State models
- `app/providers/` - Service providers
- `config/` - Configuration files
- `routes/` - Agent route definitions
- `storage/logs/` - Application logs
- `storage/checkpoints/` - State checkpoints
- `tests/` - Test files
- `config/langvel.py` - Main configuration
- `routes/agent.py` - Agent router
- `.env` - Environment variables

**Example:**

```bash
mkdir my-agent-project
cd my-agent-project
langvel init
```

### `langvel setup`

Complete setup including virtual environment creation and dependency installation.

```bash
langvel setup --with-venv
```

**Options:**
- `--with-venv` - Also create virtual environment and install dependencies

**What it does:**
1. Creates virtual environment (if `--with-venv`)
2. Upgrades pip
3. Installs Langvel and all dependencies
4. Initializes project structure
5. Creates configuration files

**Example:**

```bash
# Complete setup with venv
langvel setup --with-venv

# Activate virtual environment
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Verify installation
langvel --version
```

## Code Generation

### `langvel make:agent`

Generate a new agent with boilerplate code.

```bash
langvel make:agent <name> [--state StateModel]
```

**Arguments:**
- `name` - Agent class name (e.g., `CustomerSupport`)

**Options:**
- `--state` - State model to use (default: `StateModel`)

**Generated File:**
- `app/agents/{name_lower}.py`

**Example:**

```bash
# Create basic agent
langvel make:agent CustomerSupport

# Create agent with custom state
langvel make:agent OrderProcessor --state OrderState
```

**Generated Code:**

```python
"""
CustomerSupport Agent
"""

from langvel.core.agent import Agent
from langvel.state.base import StateModel
from langvel.tools.decorators import tool


class CustomerSupport(Agent):
    """
    CustomerSupport agent.

    Handles...
    """

    state_model = StateModel
    middleware = []  # Add middleware like ['auth', 'rate_limit']

    def build_graph(self):
        """Define the agent workflow."""
        return (
            self.start()
            .then(self.process)
            .end()
        )

    async def process(self, state: StateModel) -> StateModel:
        """
        Main processing logic.

        Args:
            state: Current state

        Returns:
            Updated state
        """
        # Your logic here
        state.add_message("assistant", "Response from CustomerSupport")
        return state

    @tool(description="Example custom tool")
    async def example_tool(self, input_text: str) -> str:
        """
        Example tool implementation.

        Args:
            input_text: Input text to process

        Returns:
            Processed text
        """
        return f"Processed: {input_text}"
```

**Next Steps:**
1. Register the agent in `routes/agent.py`
2. Implement the `build_graph()` method
3. Add custom tools and nodes

### `langvel make:tool`

Generate a new tool.

```bash
langvel make:tool <name>
```

**Arguments:**
- `name` - Tool function name (e.g., `search_database`)

**Generated File:**
- `app/tools/{name_lower}.py`

**Example:**

```bash
langvel make:tool search_database
```

**Generated Code:**

```python
"""
search_database Tool
"""

from langvel.tools.decorators import tool


@tool(description="search_database tool")
async def search_database(input_data: str) -> str:
    """
    search_database implementation.

    Args:
        input_data: Input data

    Returns:
        Processed result
    """
    # Your implementation here
    return f"Result from search_database"
```

### `langvel make:middleware`

Generate a new middleware.

```bash
langvel make:middleware <name>
```

**Arguments:**
- `name` - Middleware class name (e.g., `AuthMiddleware`)

**Generated File:**
- `app/middleware/{name_lower}.py`

**Example:**

```bash
langvel make:middleware RateLimit
```

**Generated Code:**

```python
"""
RateLimit Middleware
"""

from typing import Any, Dict
from langvel.middleware.base import Middleware


class RateLimit(Middleware):
    """
    RateLimit middleware.

    Handles...
    """

    async def before(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute before agent runs.

        Args:
            state: Input state

        Returns:
            Modified state
        """
        # Your before logic here
        return state

    async def after(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute after agent runs.

        Args:
            state: Output state

        Returns:
            Modified state
        """
        # Your after logic here
        return state
```

### `langvel make:state`

Generate a new state model.

```bash
langvel make:state <name>
```

**Arguments:**
- `name` - State model class name (e.g., `OrderState`)

**Generated File:**
- `app/models/{name_lower}.py`

**Example:**

```bash
langvel make:state OrderState
```

**Generated Code:**

```python
"""
OrderState State Model
"""

from typing import Optional
from pydantic import Field
from langvel.state.base import StateModel


class OrderState(StateModel):
    """
    OrderState state.

    Manages...
    """

    # Add your custom fields here
    query: str = Field(description="User query")
    response: Optional[str] = Field(default=None, description="Agent response")

    class Config:
        checkpointer = "memory"  # or "postgres", "redis"
        interrupts = []  # Add interrupt points like ['before_response']
```

## Agent Management

### `langvel agent list`

List all registered agents with their routes and middleware.

```bash
langvel agent list
```

**Output:**

```
                    Registered Agents
┏━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┓
┃ Path            ┃ Agent              ┃ Middleware   ┃
┡━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━┩
│ /support        │ CustomerSupport    │ logging      │
│ /order          │ OrderProcessor     │ auth, rate   │
│ /search         │ SearchAgent        │ -            │
└─────────────────┴────────────────────┴──────────────┘
```

**Example:**

```bash
# List all agents
langvel agent list

# Verify your agent is registered
langvel agent list | grep MyAgent
```

### `langvel agent serve`

Start the Langvel development server.

```bash
langvel agent serve [--host HOST] [--port PORT] [--reload]
```

**Options:**
- `--host` - Host to bind to (default: `0.0.0.0`)
- `--port` - Port to bind to (default: `8000`)
- `--reload` - Enable auto-reload on code changes

**Example:**

```bash
# Start basic server
langvel agent serve

# Start with auto-reload
langvel agent serve --reload

# Custom host and port
langvel agent serve --host localhost --port 3000

# Production-like setup
langvel agent serve --host 0.0.0.0 --port 8080
```

**Output:**

```
Starting Langvel server on 0.0.0.0:8000
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Access:**
- API: `http://localhost:8000`
- Docs: `http://localhost:8000/docs`
- OpenAPI: `http://localhost:8000/openapi.json`

### `langvel agent test`

Test an agent with sample input.

```bash
langvel agent test <agent_path> [--input JSON]
```

**Arguments:**
- `agent_path` - Agent route path (e.g., `/support`)

**Options:**
- `-i, --input` - Input JSON data

**Example:**

```bash
# Test with default input
langvel agent test /support

# Test with custom input
langvel agent test /order --input '{"order_id": "123", "amount": 99.99}'

# Test with complex input
langvel agent test /search -i '{
  "query": "best practices",
  "filters": {"category": "tech"},
  "limit": 10
}'
```

**Output:**

```
Testing agent: /support

Result:
{
  "messages": [
    {
      "role": "user",
      "content": "test query"
    },
    {
      "role": "assistant",
      "content": "Response from CustomerSupport"
    }
  ],
  "query": "test query",
  "response": "How can I help you?"
}
```

### `langvel agent graph`

Visualize an agent's workflow graph.

```bash
langvel agent graph <agent_path> [--output FILE]
```

**Arguments:**
- `agent_path` - Agent route path (e.g., `/support`)

**Options:**
- `-o, --output` - Output file path (default: `graph.png`)

**Example:**

```bash
# Generate graph with default name
langvel agent graph /support

# Custom output file
langvel agent graph /order --output order_workflow.png

# Generate graph to specific directory
langvel agent graph /search -o docs/graphs/search.png
```

**Output:**

```
Generating graph for: /support
✓ Graph saved to: graph.png
```

The generated PNG shows:
- All nodes in the workflow
- Edges and transitions
- Conditional branches
- Parallel execution paths
- Loop structures

### `langvel agent studio`

Launch LangGraph Studio for visual debugging and interactive testing of your agents.

```bash
langvel agent studio <agent_path> [--port PORT]
```

**Arguments:**
- `agent_path` - Agent route path (e.g., `/support`)

**Options:**
- `--port` - Port to run Studio on (default: `8123`)

**Example:**

```bash
# Launch Studio with default port
langvel agent studio /support

# Custom port
langvel agent studio /order --port 8200
```

**What Happens:**
1. ✓ Checks for required API keys (prompts if missing)
2. ✓ Automatically saves keys to `.env` file
3. ✓ Generates Studio-compatible graph
4. ✓ Generates `langgraph.json` configuration
5. ✓ Auto-installs `langgraph-cli[inmem]` if needed
6. ✓ Launches Studio server
7. ✓ Opens browser automatically
8. ✓ Cleans up temp files on exit

**Studio automatically opens at:**
```
https://smith.langchain.com/studio/?baseUrl=http://127.0.0.1:8123
```

**Studio Features:**
- 📊 **Visual Graph**: See your workflow as a visual diagram
- ▶️ **Step-by-Step Execution**: Run nodes one at a time
- 🔍 **State Inspection**: View state at each step
- 🐛 **Live Debugging**: See exactly what's happening
- ⏸️ **Breakpoints**: Pause at interrupt points
- 📝 **Execution History**: Review all past runs
- 🧪 **Interactive Testing**: Test with different inputs
- 📈 **Performance Metrics**: Track execution times

**Requirements:**
- OpenAI or Anthropic API key (for LLM agents)
- LangSmith API key (optional, for tracing)

**Example Session:**

```bash
$ langvel agent studio /customer-support

🎨 Launching LangGraph Studio

Agent: /customer-support
Port: 8123

Checking API keys...
✓ OpenAI API key found
✓ LangSmith API key found

✓ Generated Studio entry point
✓ Generated langgraph.json

🚀 Starting LangGraph Studio on port 8123

Studio URLs:
  • Studio UI: https://smith.langchain.com/studio/?baseUrl=http://127.0.0.1:8123
  • API: http://127.0.0.1:8123
  • Docs: http://127.0.0.1:8123/docs

Press Ctrl+C to stop
```

**First-Time Setup:**

If API keys are not configured, Studio will prompt you:

```bash
⚠  OpenAI API key not found or invalid in .env
Enter your OpenAI API key (or press Enter to skip): sk-...
✓ OpenAI API key saved to .env

⚠  LangSmith API key not found (optional for tracing)
Enter your LangSmith API key (or press Enter to skip): lsv2_pt_...
✓ LangSmith API key saved to .env
```

**Use Cases:**
- 🐛 **Debug Complex Workflows**: Step through execution to find issues
- 🧪 **Test Edge Cases**: Try different inputs interactively
- 📊 **Understand Flow**: Visualize how data moves through nodes
- 👀 **Live Development**: See changes as you modify your agent
- 🎓 **Learn LangGraph**: Understand how agents work visually
- 🔍 **Inspect State**: View state transformations at each step

**Tips:**
- Keep Studio open while developing for quick testing
- Use breakpoints (`.interrupt()`) for approval flows
- Check state changes between nodes to verify logic
- Test with real-world inputs to catch edge cases

**Related:**
- [LangSmith Setup Guide](/advanced/observability) - Configure tracing
- [Graph Visualization](/the-basics/cli-commands#langvel-agent-graph) - Generate static graph images

## Version

Display the current version of Langvel.

```bash
langvel --version
```

**Output:**

```
langvel, version 0.1.0
```

## Help

Get help for any command.

```bash
# General help
langvel --help

# Help for specific command
langvel make:agent --help
langvel agent serve --help
```

## Common Workflows

### Creating a New Agent

```bash
# 1. Create agent
langvel make:agent CustomerSupport

# 2. Create custom state
langvel make:state SupportState

# 3. Create custom tools
langvel make:tool search_knowledge_base
langvel make:tool create_ticket

# 4. Register agent in routes/agent.py
# Edit routes/agent.py and add:
# @router.flow('/support', middleware=['logging'])
# class CustomerSupport(Agent):
#     ...

# 5. Test the agent
langvel agent test /support

# 6. Visualize workflow
langvel agent graph /support

# 7. Start server
langvel agent serve --reload
```

### Setting Up a New Project

```bash
# 1. Create directory
mkdir my-agent-project
cd my-agent-project

# 2. Full setup with venv
langvel setup --with-venv

# 3. Activate venv
source venv/bin/activate

# 4. Update .env with API keys
nano .env

# 5. Create first agent
langvel make:agent MyFirstAgent

# 6. Register in routes/agent.py
# Edit routes/agent.py

# 7. Start development server
langvel agent serve --reload
```

### Testing and Debugging

```bash
# 1. List all agents
langvel agent list

# 2. Test specific agent
langvel agent test /my-agent --input '{"query": "test"}'

# 3. Visualize graph
langvel agent graph /my-agent -o debug_graph.png

# 4. Check graph structure
# Open debug_graph.png to verify workflow

# 5. Run with reload for quick iteration
langvel agent serve --reload

# 6. Test via HTTP
curl -X POST http://localhost:8000/my-agent \
  -H "Content-Type: application/json" \
  -d '{"query": "test"}'
```

## Environment Variables

The CLI respects the following environment variables:

```bash
# LLM Configuration
LLM_PROVIDER=anthropic
LLM_MODEL=claude-3-5-sonnet-20241022
ANTHROPIC_API_KEY=your_key

# State Management
STATE_CHECKPOINTER=memory  # or postgres, redis

# Database (for postgres)
DATABASE_URL=postgresql://localhost/langvel

# Redis (for redis)
REDIS_URL=redis://localhost:6379

# Server
HOST=0.0.0.0
PORT=8000
```

## Tips and Best Practices

### 1. Use Auto-Reload During Development

```bash
langvel agent serve --reload
```

Changes to code will automatically restart the server.

### 2. Test Before Deploying

```bash
# Test all critical paths
langvel agent test /agent1 -i '{"scenario": "edge_case"}'
langvel agent test /agent2 -i '{"scenario": "normal"}'
```

### 3. Visualize Complex Graphs

```bash
# Generate graph for review
langvel agent graph /complex-agent -o workflow.png
```

### 4. Use Descriptive Names

```bash
# Good
langvel make:agent CustomerSupportBot
langvel make:tool search_knowledge_base

# Avoid
langvel make:agent agent1
langvel make:tool tool1
```

### 5. Organize by Feature

```bash
# Create related components together
langvel make:agent OrderProcessor
langvel make:state OrderState
langvel make:tool validate_order
langvel make:tool process_payment
langvel make:middleware order_auth
```

### 6. Version Control

Add to `.gitignore`:

```
venv/
storage/logs/
storage/checkpoints/
.env
__pycache__/
*.pyc
*.png  # if generating graphs locally
```

## Troubleshooting

### Command Not Found

**Problem**: `langvel: command not found`

**Solution**:
```bash
# Ensure Langvel is installed
pip install -e .

# Or install from PyPI
pip install langvel

# Verify installation
which langvel
```

### Agent Not Found

**Problem**: `Error: Agent not found at path '/my-agent'`

**Solution**:
```bash
# 1. Verify agent is registered
langvel agent list

# 2. Check routes/agent.py for registration
cat routes/agent.py

# 3. Ensure agent is imported and decorated
# @router.flow('/my-agent')
```

### Import Errors

**Problem**: `ModuleNotFoundError: No module named 'app'`

**Solution**:
```bash
# Run commands from project root
cd /path/to/project
langvel agent test /my-agent

# Ensure __init__.py exists
touch app/__init__.py
touch app/agents/__init__.py
```

### Server Won't Start

**Problem**: Server fails to start or crashes

**Solution**:
```bash
# Check for port conflicts
lsof -i :8000

# Use different port
langvel agent serve --port 8001

# Check logs
tail -f storage/logs/langvel.log
```

## Related Topics

- [Getting Started](/getting-started/installation) - Installation guide
- [Agents](/architecture/agents) - Agent architecture
- [Tools](/the-basics/tools) - Creating custom tools
- [Middleware](/the-basics/middleware) - Middleware system
- [Testing](/advanced/testing) - Testing agents
