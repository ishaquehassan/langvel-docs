# Memory Systems

Langvel provides a comprehensive memory system that allows agents to remember information across sessions and conversations.

## Overview

The memory system consists of three complementary types:

1. **Semantic Memory** - Long-term facts, entities, and relationships
2. **Episodic Memory** - Conversation history and session data
3. **Working Memory** - Current task context and temporary state

All three work together through a **unified Memory Manager** that automatically routes information to the appropriate storage.

## Quick Start

Enable memory in your agent:

```python
from langvel.core.agent import Agent
from langvel.state.base import StateModel

class MyAgent(Agent):
    enable_memory = True  # Enable memory systems

    def build_graph(self):
        return (
            self.start()
            .then(self.process_with_memory)
            .end()
        )

    async def process_with_memory(self, state):
        # Recall memories
        context = await self.memory_manager.build_context(
            user_id=state.user_id,
            session_id=state.session_id,
            query=state.query
        )

        # Use in LLM prompt
        response = await self.llm.invoke(
            f"{context}\n\nUser: {state.query}"
        )

        # Store interaction
        await self.memory_manager.remember(
            user_id=state.user_id,
            session_id=state.session_id,
            content=state.query,
            role='user'
        )

        return state
```

## Semantic Memory

### Purpose

Stores long-term information that persists across all sessions:
- User facts and preferences
- Learned knowledge
- Entities and relationships
- Domain-specific information

### Backend

PostgreSQL with automatic table creation and indexing.

### Usage

```python
# Store facts
await memory_manager.semantic.store_fact(
    user_id='user123',
    fact='Prefers dark mode in applications',
    metadata={'confidence': 0.95, 'source': 'settings'}
)

# Store entities
await memory_manager.semantic.store_entity(
    user_id='user123',
    entity_type='company',
    entity_name='TechCorp',
    properties={'industry': 'technology', 'size': 'large'}
)

# Store relationships
await memory_manager.semantic.store_relationship(
    user_id='user123',
    subject='John Doe',
    relationship='works_at',
    object_entity='TechCorp',
    properties={'since': '2020', 'role': 'engineer'}
)

# Recall facts
facts = await memory_manager.semantic.recall_facts(
    user_id='user123',
    query='What does the user prefer?',
    limit=5
)

# Get entity
entity = await memory_manager.semantic.get_entity(
    user_id='user123',
    entity_name='TechCorp'
)

# Get relationships
relationships = await memory_manager.semantic.get_relationships(
    user_id='user123',
    subject='John Doe'
)
```

### Database Schema

```sql
-- Automatically created tables
CREATE TABLE semantic_facts (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    fact TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE semantic_entities (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_name TEXT NOT NULL,
    properties JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, entity_type, entity_name)
);

CREATE TABLE semantic_relationships (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    subject_entity TEXT NOT NULL,
    relationship_type TEXT NOT NULL,
    object_entity TEXT NOT NULL,
    properties JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);
```

## Episodic Memory

### Purpose

Stores conversation history and session-specific data:
- Recent conversation turns
- Session context
- Temporary information with TTL

### Backend

Redis with automatic TTL (24 hours default) and cleanup.

### Usage

```python
# Add conversation turn
await memory_manager.episodic.add_turn(
    session_id='session123',
    role='user',
    content='Hello, how are you?',
    metadata={'timestamp': '2025-10-17T10:00:00Z'}
)

# Get recent turns
recent = await memory_manager.episodic.get_recent(
    session_id='session123',
    limit=10
)

# Get all turns
all_turns = await memory_manager.episodic.get_all('session123')

# Get context window (token-aware)
context = await memory_manager.episodic.get_context_window(
    session_id='session123',
    max_tokens=2000
)

# Generate summary
summary = await memory_manager.episodic.get_summary(
    session_id='session123',
    llm=agent.llm
)

# Clear session
await memory_manager.episodic.clear_session('session123')

# List sessions
sessions = await memory_manager.episodic.list_sessions()
```

## Working Memory

### Purpose

Temporary storage for the current task:
- Current task variables
- Intermediate calculations
- Session state

### Backend

In-memory with LRU eviction and priority support.

### Usage

```python
# Add items
memory_manager.working.add('user_intent', 'book_flight', priority=10)
memory_manager.working.add('destination', 'New York', priority=5)
memory_manager.working.add('date', '2025-11-01', priority=3)

# Get items
intent = memory_manager.working.get('user_intent')

# Check existence
has_date = memory_manager.working.has('date')

# Update items
memory_manager.working.update('destination', 'San Francisco')

# Remove items
memory_manager.working.remove('date')

# Convert to context string
context = memory_manager.working.to_context_string(
    format_style='simple'  # or 'detailed' or 'json'
)

# Get statistics
stats = memory_manager.working.get_stats()
# {'item_count': 3, 'estimated_tokens': 50, 'usage_percent': 1.25}

# Clear all
memory_manager.working.clear()
```

### Advanced Features

```python
# Priority-based retention
memory_manager.working.add('critical_data', value, priority=100)

# Snapshot and restore
snapshot = memory_manager.working.snapshot()
# ... do work ...
memory_manager.working.restore(snapshot)

# Merge memories
memory_manager.working.merge(
    other_memory,
    strategy='higher_priority'  # or 'keep_existing' or 'overwrite'
)

# Set token limit
memory_manager.working.set_max_tokens(8000)
```

## Memory Manager

The unified interface that ties everything together.

### Automatic Memory Routing

```python
# Automatically routes to appropriate memory
await memory_manager.remember(
    user_id='user123',
    session_id='session456',
    content='My name is Alice and I work at TechCorp',
    role='user',
    memory_type='auto'  # Auto-detects facts!
)
```

### Context Building

```python
# Build comprehensive context for LLM
context = await memory_manager.build_context(
    user_id='user123',
    session_id='session456',
    query='Tell me about my job',
    max_tokens=2000,
    format_style='detailed'
)
```

Output:
```
## What I Know About You ##
- Works at TechCorp as a software engineer
- Name is Alice
- Prefers Python programming

## Recent Conversation ##
User: Hello
Assistant: Hi Alice! How can I help you today?
User: Tell me about my job

## Current Context ##
user_intent: job_inquiry
conversation_topic: employment
```

### Manual Memory Operations

```python
# Store entity explicitly
await memory_manager.store_entity(
    user_id='user123',
    entity_type='project',
    entity_name='Website Redesign',
    properties={'status': 'in_progress', 'deadline': '2025-12-01'}
)

# Get entity
project = await memory_manager.get_entity(
    user_id='user123',
    entity_name='Website Redesign'
)

# Recall memories
memories = await memory_manager.recall(
    user_id='user123',
    session_id='session456',
    query='project status',
    include_semantic=True,
    include_episodic=True,
    include_working=True
)

# Clear memory
await memory_manager.clear(
    user_id='user123',
    session_id='session456',
    clear_semantic=True,
    clear_episodic=True,
    clear_working=True
)

# Get statistics
stats = await memory_manager.get_stats(
    user_id='user123',
    session_id='session456'
)
```

## Automatic Fact Extraction

The memory manager automatically extracts entities and facts from natural language:

**Supported Patterns:**
- Names: "My name is Alice"
- Companies: "I work at TechCorp"
- Locations: "I live in San Francisco"
- Roles: "I work as a software engineer"
- Preferences: "I like Python programming"
- Email/Phone: "My email is alice@example.com"

**Example:**
```python
await memory_manager.remember(
    user_id='user123',
    session_id='session456',
    content='My name is Alice, I work at TechCorp as a data scientist, and I live in San Francisco',
    role='user',
    memory_type='auto'
)
```

**Extracted:**
- Entity: Person (Alice)
- Entity: Company (TechCorp)
- Entity: Location (San Francisco)
- Relationship: Alice works_at TechCorp
- Fact: "Works at TechCorp as a data scientist"

## Configuration

### Environment Variables

```bash
# Memory backends
MEMORY_SEMANTIC_BACKEND=postgres  # or 'memory' for testing
MEMORY_EPISODIC_BACKEND=redis     # or 'memory' for testing

# Episodic settings
MEMORY_EPISODIC_TTL=86400  # 24 hours in seconds

# Working memory settings
MEMORY_WORKING_MAX_TOKENS=4000

# Automatic fact detection
MEMORY_AUTO_DETECT_FACTS=true
```

### Python Configuration

```python
# config/langvel.py
class Config:
    MEMORY_SEMANTIC_BACKEND = 'postgres'
    MEMORY_EPISODIC_BACKEND = 'redis'
    MEMORY_EPISODIC_TTL = 86400
    MEMORY_WORKING_MAX_TOKENS = 4000
    MEMORY_AUTO_DETECT_FACTS = True
```

### Custom Memory Setup

```python
from langvel.memory import MemoryManager, SemanticMemory, EpisodicMemory

# Custom configuration
semantic = SemanticMemory(
    backend='postgres',
    connection_string='postgresql://localhost/mydb'
)

episodic = EpisodicMemory(
    backend='redis',
    ttl=172800,  # 48 hours
    max_turns=200
)

memory = MemoryManager(
    semantic=semantic,
    episodic=episodic,
    auto_detect_facts=True
)
```

## CLI Commands

### Clear Memory

```bash
# Clear all memory for a user
langvel memory clear user123 --all

# Clear only semantic memory
langvel memory clear user123 --semantic

# Clear episodic memory for a session
langvel memory clear user123 --session session456 --episodic

# Clear working memory
langvel memory clear user123 --working
```

### Memory Statistics

```bash
# Get memory stats
langvel memory stats user123

# Get stats for specific session
langvel memory stats user123 --session session456
```

### List Memory Items

```bash
# List facts
langvel memory list user123 --type facts --limit 20

# List active sessions
langvel memory list user123 --type sessions
```

## Best Practices

### 1. Always Initialize

```python
class MyAgent(Agent):
    enable_memory = True

    async def process(self, state):
        # Memory manager is automatically initialized
        # when enable_memory = True
        await self.memory_manager.initialize()
```

### 2. Use Appropriate Memory Types

- **Semantic**: Permanent facts ("user prefers dark mode")
- **Episodic**: Conversation history ("what we discussed")
- **Working**: Current task ("variables for this request")

### 3. Set User and Session IDs

```python
# Always provide user_id for semantic memory
# Always provide session_id for episodic memory
context = await memory_manager.build_context(
    user_id=state.user_id,      # Required
    session_id=state.session_id  # Required
)
```

### 4. Manage Token Budgets

```python
# Control context size for LLM
context = await memory_manager.build_context(
    user_id=user_id,
    session_id=session_id,
    max_tokens=2000  # Fits in most LLM contexts
)
```

### 5. Clear Old Data

```python
# Periodically clear old sessions
sessions = await memory_manager.episodic.list_sessions()
for session_id in old_sessions:
    await memory_manager.episodic.clear_session(session_id)
```

## Testing

### With In-Memory Backend

```python
from langvel.memory import MemoryManager, SemanticMemory, EpisodicMemory

# Use memory backends (no database required)
semantic = SemanticMemory(backend='memory')
episodic = EpisodicMemory(backend='memory')

memory = MemoryManager(semantic=semantic, episodic=episodic)
await memory.initialize()

# Test without PostgreSQL/Redis
```

### With Real Databases

```python
import asyncio
from langvel.memory import MemoryManager

async def test_memory():
    memory = MemoryManager()
    await memory.initialize()

    # Store test data
    await memory.remember(
        user_id='test_user',
        session_id='test_session',
        content='Test message'
    )

    # Recall
    memories = await memory.recall(
        user_id='test_user',
        session_id='test_session'
    )

    assert len(memories['episodic']) > 0

    await memory.close()

asyncio.run(test_memory())
```

## Performance Considerations

### Semantic Memory (PostgreSQL)
- **Connection Pooling**: Max 10 connections
- **Indexes**: user_id, entity_type indexed
- **Query Optimization**: Use limit parameter

### Episodic Memory (Redis)
- **TTL**: Automatic cleanup after 24h
- **Max Turns**: Limited to 100 per session
- **Async Operations**: Non-blocking throughout

### Working Memory (In-Memory)
- **Auto-Pruning**: LRU eviction
- **Priority-Based**: Important items kept longer
- **Token Estimation**: ~1 token per 4 characters

## Troubleshooting

### PostgreSQL Connection Failed
```bash
# Check if PostgreSQL is running
pg_isready

# Verify connection string
echo $DATABASE_URL
```

### Redis Connection Failed
```bash
# Check if Redis is running
redis-cli ping

# Verify connection string
echo $REDIS_URL
```

### Memory Not Persisting
- Verify `enable_memory = True` in agent
- Check `await memory.initialize()` is called
- Ensure database connections are valid

### Out of Memory
- Reduce `MEMORY_WORKING_MAX_TOKENS`
- Implement memory compression
- Use cleanup commands regularly

## Complete Example

See the full example in `/app/agents/memory_agent.py`:

```python
from langvel.core.agent import Agent
from langvel.state.base import StateModel

class MemoryAgent(Agent):
    enable_memory = True

    def build_graph(self):
        return (
            self.start()
            .then(self.recall_memories)
            .then(self.generate_response)
            .then(self.store_interaction)
            .end()
        )

    async def recall_memories(self, state):
        context = await self.memory_manager.build_context(
            user_id=state.user_id,
            session_id=state.session_id,
            query=state.query
        )
        state.context = context
        return state

    async def generate_response(self, state):
        response = await self.llm.invoke(
            f"{state.context}\n\nUser: {state.query}"
        )
        state.response = response
        return state

    async def store_interaction(self, state):
        await self.memory_manager.remember(
            user_id=state.user_id,
            session_id=state.session_id,
            content=state.query,
            role='user'
        )
        return state
```

## Next Steps

- Learn about [Multi-Agent Systems](/advanced/multi-agent) with shared memory
- Check [Memory Manager API Reference](/api-reference/memory-manager) for complete documentation
- Explore [RAG Integration](/advanced/rag-integration) for knowledge-enhanced agents
