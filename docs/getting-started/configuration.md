# Configuration

Langvel is configured through `config/langvel.py` and environment variables. This guide covers all configuration options.

## Configuration File

The main configuration file is `config/langvel.py`:

```python
import os
from pathlib import Path

# Base directory
BASE_DIR = Path(__file__).parent.parent

# ============================================================================
# LLM Configuration
# ============================================================================

LLM_PROVIDER = os.getenv('LLM_PROVIDER', 'anthropic')  # 'anthropic' or 'openai'
LLM_MODEL = os.getenv('LLM_MODEL', 'claude-3-5-sonnet-20241022')
LLM_TEMPERATURE = float(os.getenv('LLM_TEMPERATURE', '0.7'))
LLM_MAX_TOKENS = int(os.getenv('LLM_MAX_TOKENS', '4096'))

# API Keys (loaded from environment)
ANTHROPIC_API_KEY = os.getenv('ANTHROPIC_API_KEY')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

# ============================================================================
# RAG Configuration
# ============================================================================

RAG_PROVIDER = os.getenv('RAG_PROVIDER', 'chroma')  # 'chroma', 'pinecone', 'weaviate'
RAG_EMBEDDING_MODEL = os.getenv('RAG_EMBEDDING_MODEL', 'openai/text-embedding-3-small')
RAG_COLLECTION_PREFIX = os.getenv('RAG_COLLECTION_PREFIX', 'langvel')

# Chroma settings
CHROMA_PERSIST_DIRECTORY = os.getenv('CHROMA_PERSIST_DIRECTORY', str(BASE_DIR / 'data' / 'chroma'))

# Pinecone settings
PINECONE_API_KEY = os.getenv('PINECONE_API_KEY')
PINECONE_ENVIRONMENT = os.getenv('PINECONE_ENVIRONMENT', 'us-east-1')

# ============================================================================
# MCP Configuration
# ============================================================================

MCP_SERVERS = {
    'slack': {
        'command': 'npx',
        'args': ['-y', '@modelcontextprotocol/server-slack'],
        'env': {
            'SLACK_BOT_TOKEN': os.getenv('SLACK_BOT_TOKEN')
        }
    },
    'github': {
        'command': 'npx',
        'args': ['-y', '@modelcontextprotocol/server-github'],
        'env': {
            'GITHUB_TOKEN': os.getenv('GITHUB_TOKEN')
        }
    }
}

# ============================================================================
# State & Checkpointing
# ============================================================================

STATE_CHECKPOINTER = os.getenv('STATE_CHECKPOINTER', 'memory')  # 'memory', 'postgres', 'redis'

# PostgreSQL settings
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://localhost/langvel')

# Redis settings
REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379')
REDIS_TTL = int(os.getenv('REDIS_TTL', '86400'))  # 24 hours

# ============================================================================
# Authentication & Security
# ============================================================================

# JWT settings
JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
JWT_ALGORITHM = os.getenv('JWT_ALGORITHM', 'HS256')
JWT_EXPIRATION_HOURS = int(os.getenv('JWT_EXPIRATION_HOURS', '24'))

# API Key settings
API_KEY_LENGTH = int(os.getenv('API_KEY_LENGTH', '32'))

# ============================================================================
# Observability & Logging
# ============================================================================

# LangSmith
LANGSMITH_API_KEY = os.getenv('LANGSMITH_API_KEY')
LANGSMITH_PROJECT = os.getenv('LANGSMITH_PROJECT', 'langvel')

# Langfuse
LANGFUSE_PUBLIC_KEY = os.getenv('LANGFUSE_PUBLIC_KEY')
LANGFUSE_SECRET_KEY = os.getenv('LANGFUSE_SECRET_KEY')
LANGFUSE_HOST = os.getenv('LANGFUSE_HOST', 'https://cloud.langfuse.com')

# Logging
LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
LOG_FORMAT = os.getenv('LOG_FORMAT', 'json')  # 'json' or 'text'
LOG_FILE = os.getenv('LOG_FILE', 'langvel.log')

# ============================================================================
# Server Configuration
# ============================================================================

SERVER_HOST = os.getenv('SERVER_HOST', '0.0.0.0')
SERVER_PORT = int(os.getenv('SERVER_PORT', '8000'))
SERVER_RELOAD = os.getenv('SERVER_RELOAD', 'false').lower() == 'true'
DEBUG = os.getenv('DEBUG', 'false').lower() == 'true'

# CORS
CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*').split(',')
CORS_ALLOW_CREDENTIALS = os.getenv('CORS_ALLOW_CREDENTIALS', 'true').lower() == 'true'

# ============================================================================
# Rate Limiting
# ============================================================================

RATE_LIMIT_ENABLED = os.getenv('RATE_LIMIT_ENABLED', 'true').lower() == 'true'
RATE_LIMIT_DEFAULT = int(os.getenv('RATE_LIMIT_DEFAULT', '100'))  # requests per minute
RATE_LIMIT_WINDOW = int(os.getenv('RATE_LIMIT_WINDOW', '60'))  # seconds
```

## Environment Variables

Create a `.env` file in your project root:

```bash
# ============================================================================
# LLM Configuration
# ============================================================================

# Choose provider: 'anthropic' or 'openai'
LLM_PROVIDER=anthropic

# Anthropic settings
ANTHROPIC_API_KEY=sk-ant-your-key-here
# LLM_MODEL=claude-3-5-sonnet-20241022

# OpenAI settings (if using OpenAI)
# OPENAI_API_KEY=sk-your-key-here
# LLM_MODEL=gpt-4-turbo

# LLM parameters
# LLM_TEMPERATURE=0.7
# LLM_MAX_TOKENS=4096

# ============================================================================
# RAG Configuration (Optional)
# ============================================================================

# RAG_PROVIDER=chroma
# RAG_EMBEDDING_MODEL=openai/text-embedding-3-small
# CHROMA_PERSIST_DIRECTORY=./data/chroma

# For Pinecone
# PINECONE_API_KEY=your-key
# PINECONE_ENVIRONMENT=us-east-1

# ============================================================================
# MCP Servers (Optional)
# ============================================================================

# SLACK_BOT_TOKEN=xoxb-your-token
# GITHUB_TOKEN=ghp_your-token

# ============================================================================
# Database & Checkpointing (Optional)
# ============================================================================

# STATE_CHECKPOINTER=memory  # 'memory', 'postgres', 'redis'

# For PostgreSQL
# DATABASE_URL=postgresql://user:password@localhost/langvel

# For Redis
# REDIS_URL=redis://localhost:6379
# REDIS_TTL=86400

# ============================================================================
# Authentication (Required for production)
# ============================================================================

# JWT_SECRET_KEY=your-secret-key-change-me
# JWT_ALGORITHM=HS256
# JWT_EXPIRATION_HOURS=24

# ============================================================================
# Observability (Optional)
# ============================================================================

# LangSmith
# LANGSMITH_API_KEY=lsv2_your-key
# LANGSMITH_PROJECT=langvel

# Langfuse
# LANGFUSE_PUBLIC_KEY=pk-your-key
# LANGFUSE_SECRET_KEY=sk-your-key
# LANGFUSE_HOST=https://cloud.langfuse.com

# ============================================================================
# Logging
# ============================================================================

# LOG_LEVEL=INFO
# LOG_FORMAT=json  # 'json' or 'text'
# LOG_FILE=langvel.log

# ============================================================================
# Server
# ============================================================================

# SERVER_HOST=0.0.0.0
# SERVER_PORT=8000
# SERVER_RELOAD=false
# DEBUG=false

# CORS
# CORS_ORIGINS=*
# CORS_ALLOW_CREDENTIALS=true

# ============================================================================
# Rate Limiting
# ============================================================================

# RATE_LIMIT_ENABLED=true
# RATE_LIMIT_DEFAULT=100
# RATE_LIMIT_WINDOW=60
```

## LLM Configuration

### Anthropic (Claude)

```python
# config/langvel.py
LLM_PROVIDER = 'anthropic'
LLM_MODEL = 'claude-3-5-sonnet-20241022'

# Available models:
# - claude-3-5-sonnet-20241022 (recommended)
# - claude-3-opus-20240229
# - claude-3-haiku-20240307
```

```bash
# .env
ANTHROPIC_API_KEY=sk-ant-your-key
```

### OpenAI (GPT)

```python
# config/langvel.py
LLM_PROVIDER = 'openai'
LLM_MODEL = 'gpt-4-turbo'

# Available models:
# - gpt-4-turbo
# - gpt-4
# - gpt-3.5-turbo
```

```bash
# .env
OPENAI_API_KEY=sk-your-key
```

### LLM Parameters

```python
# Temperature (0.0 - 1.0)
LLM_TEMPERATURE = 0.7  # Higher = more creative, Lower = more deterministic

# Max tokens
LLM_MAX_TOKENS = 4096  # Maximum response length
```

## RAG Configuration

### Chroma (Local)

```python
# config/langvel.py
RAG_PROVIDER = 'chroma'
RAG_EMBEDDING_MODEL = 'openai/text-embedding-3-small'
CHROMA_PERSIST_DIRECTORY = './data/chroma'
```

```bash
# Install
pip install chromadb
```

### Pinecone (Cloud)

```python
# config/langvel.py
RAG_PROVIDER = 'pinecone'
PINECONE_API_KEY = os.getenv('PINECONE_API_KEY')
PINECONE_ENVIRONMENT = 'us-east-1'
```

```bash
# .env
PINECONE_API_KEY=your-key
```

### Weaviate

```python
# config/langvel.py
RAG_PROVIDER = 'weaviate'
WEAVIATE_URL = os.getenv('WEAVIATE_URL', 'http://localhost:8080')
```

## MCP Servers

Configure external tools via Model Context Protocol:

```python
# config/langvel.py
MCP_SERVERS = {
    'slack': {
        'command': 'npx',
        'args': ['-y', '@modelcontextprotocol/server-slack'],
        'env': {'SLACK_BOT_TOKEN': os.getenv('SLACK_BOT_TOKEN')}
    },
    'github': {
        'command': 'npx',
        'args': ['-y', '@modelcontextprotocol/server-github'],
        'env': {'GITHUB_TOKEN': os.getenv('GITHUB_TOKEN')}
    },
    'filesystem': {
        'command': 'npx',
        'args': ['-y', '@modelcontextprotocol/server-filesystem', '/allowed/path']
    }
}
```

[Learn more about MCP →](/advanced/mcp-servers)

## Checkpointers

### Memory (Development)

```python
STATE_CHECKPOINTER = 'memory'
```

Best for: Development, testing

### PostgreSQL (Production)

```python
STATE_CHECKPOINTER = 'postgres'
DATABASE_URL = 'postgresql://user:pass@localhost/langvel'
```

```bash
# Install
pip install asyncpg psycopg2-binary

# Setup database
langvel db:migrate
```

### Redis (Production)

```python
STATE_CHECKPOINTER = 'redis'
REDIS_URL = 'redis://localhost:6379'
REDIS_TTL = 86400  # 24 hours
```

```bash
# Install
pip install redis[asyncio]
```

[Learn more about Checkpointers →](/advanced/checkpointers)

## Authentication

### JWT Configuration

```python
# config/langvel.py
JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'change-me-in-production')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 24
```

**Important**: Always change `JWT_SECRET_KEY` in production!

```bash
# Generate a secure key
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

[Learn more about Authentication →](/advanced/authentication)

## Observability

### LangSmith

```bash
# .env
LANGSMITH_API_KEY=lsv2_your-key
LANGSMITH_PROJECT=langvel
```

### Langfuse

```bash
# .env
LANGFUSE_PUBLIC_KEY=pk-your-key
LANGFUSE_SECRET_KEY=sk-your-key
LANGFUSE_HOST=https://cloud.langfuse.com
```

[Learn more about Observability →](/advanced/observability)

## Logging

### JSON Format (Production)

```python
LOG_LEVEL = 'INFO'
LOG_FORMAT = 'json'
LOG_FILE = 'langvel.log'
```

Output:
```json
{"timestamp":"2025-10-17T12:00:00Z","level":"INFO","message":"Agent started"}
```

### Text Format (Development)

```python
LOG_LEVEL = 'DEBUG'
LOG_FORMAT = 'text'
```

Output:
```
2025-10-17 12:00:00 - INFO - Agent started
```

[Learn more about Logging →](/the-basics/logging)

## Server Configuration

```python
# config/langvel.py
SERVER_HOST = '0.0.0.0'
SERVER_PORT = 8000
SERVER_RELOAD = True  # Auto-reload on file changes (dev only)
DEBUG = True          # Show detailed errors (dev only)

# CORS
CORS_ORIGINS = ['http://localhost:3000', 'https://myapp.com']
CORS_ALLOW_CREDENTIALS = True
```

## Rate Limiting

```python
RATE_LIMIT_ENABLED = True
RATE_LIMIT_DEFAULT = 100  # requests per window
RATE_LIMIT_WINDOW = 60    # seconds
```

[Learn more about Rate Limiting →](/advanced/rate-limiting)

## Environment-Specific Configuration

### Development

```python
# config/environments/development.py
DEBUG = True
LOG_LEVEL = 'DEBUG'
STATE_CHECKPOINTER = 'memory'
SERVER_RELOAD = True
```

### Production

```python
# config/environments/production.py
DEBUG = False
LOG_LEVEL = 'INFO'
STATE_CHECKPOINTER = 'postgres'
SERVER_RELOAD = False

# Security
JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')  # Required!
CORS_ORIGINS = ['https://myapp.com']
```

### Testing

```python
# config/environments/testing.py
DEBUG = True
LOG_LEVEL = 'DEBUG'
STATE_CHECKPOINTER = 'memory'
LLM_PROVIDER = 'mock'  # Use mock LLM for tests
```

## Accessing Configuration

### In Agents

```python
from config.langvel import LLM_MODEL, DATABASE_URL

class MyAgent(Agent):
    async def handle(self, state):
        print(f"Using model: {LLM_MODEL}")
        return state
```

### Programmatically

```python
from langvel.config import get_config

config = get_config()
print(config.LLM_PROVIDER)
print(config.DATABASE_URL)
```

## Best Practices

### 1. Use Environment Variables

```python
# ✅ Good
LLM_MODEL = os.getenv('LLM_MODEL', 'claude-3-5-sonnet-20241022')

# ❌ Bad
LLM_MODEL = 'claude-3-5-sonnet-20241022'
```

### 2. Never Commit Secrets

```bash
# Add to .gitignore
.env
.env.local
.env.production
```

### 3. Validate Required Settings

```python
# config/langvel.py
if not ANTHROPIC_API_KEY and not OPENAI_API_KEY:
    raise ValueError("Either ANTHROPIC_API_KEY or OPENAI_API_KEY must be set")
```

### 4. Use Type Conversion

```python
# Convert environment variables to correct types
LLM_TEMPERATURE = float(os.getenv('LLM_TEMPERATURE', '0.7'))
SERVER_PORT = int(os.getenv('SERVER_PORT', '8000'))
DEBUG = os.getenv('DEBUG', 'false').lower() == 'true'
```

## Next Steps

- **[Directory Structure →](/getting-started/directory-structure)** - Understand the project layout
- **[Agents →](/architecture/agents)** - Start building agents
- **[Deployment →](/deployment/production)** - Deploy to production

## Need Help?

- 💬 [Join Discord](https://discord.gg/langvel)
- 📚 [Read Documentation](/getting-started/installation)
