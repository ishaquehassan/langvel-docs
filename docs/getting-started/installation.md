# Installation

## Requirements

Before installing Langvel, ensure you have:

- **Python 3.10+** (Python 3.11 recommended)
- **pip** package manager
- **Git** (for cloning the repository)
- **Node.js 18+** (optional, for MCP servers)

## Quick Installation

The fastest way to get started with Langvel:

```bash
# Clone the repository
git clone https://github.com/yourusername/langvel.git
cd langvel

# Run automated setup
python setup.py

# Activate virtual environment
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate     # Windows
```

That's it! The setup script will:
- ✅ Create a virtual environment
- ✅ Install all dependencies
- ✅ Initialize project structure
- ✅ Create configuration files

## Alternative Installation Methods

### Method 1: Using CLI Setup Command

For a beautiful interactive setup experience:

```bash
# Install Langvel
pip install -e .

# Run interactive setup with progress bars
langvel setup --with-venv
```

### Method 2: Manual Installation

For full control over the installation process:

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Install Langvel
pip install -e .

# Initialize project
langvel init
```

### Method 3: Using pip (Coming Soon)

Once Langvel is published to PyPI:

```bash
pip install langvel
langvel init my-project
cd my-project
```

## Configuration

After installation, configure your environment variables:

```bash
# Copy example environment file
cp .env.example .env

# Edit with your API keys
nano .env
```

### Required Environment Variables

```bash
# LLM Provider (required)
ANTHROPIC_API_KEY=sk-ant-...        # For Claude models
# or
OPENAI_API_KEY=sk-...               # For GPT models

# Optional: Observability
LANGSMITH_API_KEY=lsv2_...          # For LangSmith tracing
LANGFUSE_PUBLIC_KEY=pk-...          # For Langfuse tracing
LANGFUSE_SECRET_KEY=sk-...

# Optional: MCP Servers
SLACK_BOT_TOKEN=xoxb-...
GITHUB_TOKEN=ghp_...

# Optional: Database (for checkpointers)
DATABASE_URL=postgresql://user:pass@localhost/langvel
REDIS_URL=redis://localhost:6379
```

### Configure LLM Provider

Edit `config/langvel.py`:

```python
# Choose your LLM provider
LLM_PROVIDER = 'anthropic'  # or 'openai'
LLM_MODEL = 'claude-3-5-sonnet-20241022'
LLM_TEMPERATURE = 0.7
LLM_MAX_TOKENS = 4096

# Optional: Override with specific credentials
# ANTHROPIC_API_KEY = 'your-key'  # If not using .env
```

## Verify Installation

Test your installation:

```bash
# Check version
langvel --version

# List available commands
langvel --help

# Verify project structure
langvel agent list
```

You should see:

```
✓ Langvel v1.0.0
✓ Python 3.11.7
✓ LangGraph 0.2.40
```

## Project Structure

After installation, your project will have this structure:

```
langvel/
├── app/
│   ├── agents/              # Your agent classes
│   ├── middleware/          # Custom middleware
│   ├── tools/              # Custom tools
│   └── models/             # State models
├── config/
│   └── langvel.py          # Configuration
├── routes/
│   └── agent.py            # Route definitions
├── langvel/                # Framework core
├── .env                    # Environment variables
├── .env.example           # Example environment
└── setup.py               # Setup script
```

## Optional Dependencies

### For RAG Support

```bash
# Install Chroma (vector store)
pip install chromadb

# Or Pinecone
pip install pinecone-client

# Or Weaviate
pip install weaviate-client
```

### For PostgreSQL Checkpointer

```bash
pip install asyncpg psycopg2-binary
```

### For Redis Checkpointer

```bash
pip install redis[asyncio]
```

### For MCP Servers

```bash
# Install Node.js, then:
npm install -g @modelcontextprotocol/server-slack
npm install -g @modelcontextprotocol/server-github
```

## Troubleshooting

### Python Version Issues

If you see `Python 3.10+ required`:

```bash
# Install Python 3.11
brew install python@3.11  # macOS
# or use pyenv
pyenv install 3.11.7
pyenv local 3.11.7
```

### Virtual Environment Issues

If activation fails:

```bash
# Recreate virtual environment
rm -rf venv
python3.11 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -e .
```

### Permission Errors

If you see permission errors:

```bash
# Don't use sudo! Use virtual environment instead
python -m venv venv
source venv/bin/activate
pip install -e .
```

### Import Errors

If imports fail after installation:

```bash
# Reinstall in editable mode
pip install -e . --force-reinstall

# Or clear cache
pip cache purge
pip install -e .
```

### API Key Issues

If you see "No API key found":

```bash
# Verify .env exists
ls -la .env

# Check .env has correct format (no spaces around =)
cat .env

# Ensure environment is activated
source venv/bin/activate
```

### M1/M2 Mac Issues

For Apple Silicon Macs:

```bash
# Use arm64 architecture
arch -arm64 python -m venv venv
source venv/bin/activate
pip install -e .
```

## Upgrading

To upgrade Langvel to the latest version:

```bash
# Pull latest changes
git pull origin main

# Upgrade dependencies
pip install -e . --upgrade

# Run migrations if needed
langvel migrate
```

## Uninstalling

To completely remove Langvel:

```bash
# Deactivate virtual environment
deactivate

# Remove installation
rm -rf venv/
pip uninstall langvel

# Remove project files (optional)
rm -rf langvel/
```

## Docker Installation (Coming Soon)

For containerized deployment:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY . .
RUN pip install -e .

CMD ["langvel", "agent", "serve"]
```

```bash
docker build -t langvel .
docker run -p 8000:8000 langvel
```

## Development Installation

For contributing to Langvel:

```bash
# Clone repository
git clone https://github.com/yourusername/langvel.git
cd langvel

# Install with dev dependencies
pip install -e ".[dev]"

# Install pre-commit hooks
pre-commit install

# Run tests
pytest
```

## Next Steps

Now that Langvel is installed:

1. **[Quick Start →](/getting-started/quick-start)** - Build your first agent
2. **[Configuration →](/getting-started/configuration)** - Configure your setup
3. **[Directory Structure →](/getting-started/directory-structure)** - Understand the layout

## Getting Help

If you encounter issues:

- 📚 Check [Troubleshooting](#troubleshooting) above
- 💬 Ask in [Discord](https://discord.gg/langvel)
- 🐛 [Report a bug](https://github.com/yourusername/langvel/issues)
- 📖 Read [FAQ](/faq)
