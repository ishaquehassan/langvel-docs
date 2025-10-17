# Memory Manager API Reference

Complete API documentation for Langvel's memory system components.

## MemoryManager

Unified interface for all memory types (semantic, episodic, working).

### Constructor

```python
MemoryManager(
    semantic: Optional[SemanticMemory] = None,
    episodic: Optional[EpisodicMemory] = None,
    working: Optional[WorkingMemory] = None,
    auto_detect_facts: bool = True
)
```

**Parameters:**
- `semantic` (SemanticMemory, optional): Semantic memory instance. If None, creates default.
- `episodic` (EpisodicMemory, optional): Episodic memory instance. If None, creates default.
- `working` (WorkingMemory, optional): Working memory instance. If None, creates default.
- `auto_detect_facts` (bool): Enable automatic fact extraction from content. Default: True.

**Example:**
```python
from langvel.memory import MemoryManager

# Use defaults
memory = MemoryManager()
await memory.initialize()

# Custom configuration
from langvel.memory import SemanticMemory, EpisodicMemory, WorkingMemory

semantic = SemanticMemory(backend='postgres')
episodic = EpisodicMemory(backend='redis', ttl=172800)
working = WorkingMemory(max_tokens=8000)

memory = MemoryManager(
    semantic=semantic,
    episodic=episodic,
    working=working,
    auto_detect_facts=True
)
```

### Methods

#### `async initialize() -> None`

Initialize all memory backends (connect to databases).

**Example:**
```python
await memory.initialize()
```

#### `async close() -> None`

Close all connections and cleanup resources.

**Example:**
```python
await memory.close()
```

#### `async remember(user_id: str, session_id: str, content: str, role: str = 'user', memory_type: str = 'auto', metadata: Optional[Dict] = None) -> None`

Store information in memory with automatic routing.

**Parameters:**
- `user_id` (str): User identifier for semantic memory
- `session_id` (str): Session identifier for episodic memory
- `content` (str): Content to remember
- `role` (str): Role of the speaker ('user', 'assistant'). Default: 'user'
- `memory_type` (str): Memory type ('auto', 'semantic', 'episodic', 'working'). Default: 'auto'
- `metadata` (dict, optional): Additional metadata

**Example:**
```python
# Automatic routing (detects facts)
await memory.remember(
    user_id='user123',
    session_id='session456',
    content='My name is Alice and I work at TechCorp',
    role='user',
    memory_type='auto'
)

# Explicit semantic storage
await memory.remember(
    user_id='user123',
    session_id='session456',
    content='Prefers dark mode',
    memory_type='semantic'
)
```

#### `async recall(user_id: str, session_id: str, query: Optional[str] = None, include_semantic: bool = True, include_episodic: bool = True, include_working: bool = True, max_results: int = 10) -> Dict[str, Any]`

Recall information from all memory types.

**Parameters:**
- `user_id` (str): User identifier
- `session_id` (str): Session identifier
- `query` (str, optional): Query for semantic search
- `include_semantic` (bool): Include semantic memories. Default: True
- `include_episodic` (bool): Include episodic memories. Default: True
- `include_working` (bool): Include working memory. Default: True
- `max_results` (int): Maximum results per memory type. Default: 10

**Returns:**
- Dictionary with keys: 'semantic', 'episodic', 'working'

**Example:**
```python
memories = await memory.recall(
    user_id='user123',
    session_id='session456',
    query='Tell me about my job',
    include_semantic=True,
    include_episodic=True,
    include_working=True,
    max_results=10
)

# Access different memory types
facts = memories['semantic']
conversation = memories['episodic']
context = memories['working']
```

#### `async build_context(user_id: str, session_id: str, query: Optional[str] = None, max_tokens: int = 2000, format_style: str = 'detailed') -> str`

Build comprehensive context string for LLM prompts.

**Parameters:**
- `user_id` (str): User identifier
- `session_id` (str): Session identifier
- `query` (str, optional): Query for semantic search
- `max_tokens` (int): Maximum tokens in context. Default: 2000
- `format_style` (str): Format style ('simple', 'detailed', 'json'). Default: 'detailed'

**Returns:**
- Formatted context string

**Example:**
```python
context = await memory.build_context(
    user_id='user123',
    session_id='session456',
    query='What do you know about me?',
    max_tokens=2000,
    format_style='detailed'
)

# Use in LLM prompt
response = await llm.invoke(f"{context}\n\nUser: {query}")
```

#### `async store_entity(user_id: str, entity_type: str, entity_name: str, properties: Optional[Dict] = None) -> None`

Store an entity in semantic memory.

**Parameters:**
- `user_id` (str): User identifier
- `entity_type` (str): Type of entity ('person', 'company', 'location', etc.)
- `entity_name` (str): Name of entity
- `properties` (dict, optional): Entity properties

**Example:**
```python
await memory.store_entity(
    user_id='user123',
    entity_type='company',
    entity_name='TechCorp',
    properties={
        'industry': 'technology',
        'size': 'large',
        'location': 'San Francisco'
    }
)
```

#### `async get_entity(user_id: str, entity_name: str) -> Optional[Dict]`

Get an entity from semantic memory.

**Parameters:**
- `user_id` (str): User identifier
- `entity_name` (str): Name of entity

**Returns:**
- Entity dictionary or None if not found

**Example:**
```python
entity = await memory.get_entity(
    user_id='user123',
    entity_name='TechCorp'
)

if entity:
    print(f"Industry: {entity['properties']['industry']}")
```

#### `async clear(user_id: str, session_id: str, clear_semantic: bool = False, clear_episodic: bool = False, clear_working: bool = False) -> None`

Clear specific memory types.

**Parameters:**
- `user_id` (str): User identifier
- `session_id` (str): Session identifier
- `clear_semantic` (bool): Clear semantic memory. Default: False
- `clear_episodic` (bool): Clear episodic memory. Default: False
- `clear_working` (bool): Clear working memory. Default: False

**Example:**
```python
# Clear only episodic memory for session
await memory.clear(
    user_id='user123',
    session_id='session456',
    clear_episodic=True
)

# Clear all memory
await memory.clear(
    user_id='user123',
    session_id='session456',
    clear_semantic=True,
    clear_episodic=True,
    clear_working=True
)
```

#### `async get_stats(user_id: str, session_id: str) -> Dict[str, Any]`

Get memory statistics.

**Parameters:**
- `user_id` (str): User identifier
- `session_id` (str): Session identifier

**Returns:**
- Dictionary with statistics for each memory type

**Example:**
```python
stats = await memory.get_stats(
    user_id='user123',
    session_id='session456'
)

print(f"Facts: {stats['semantic']['facts_count']}")
print(f"Turns: {stats['episodic']['turn_count']}")
print(f"Working items: {stats['working']['item_count']}")
```

---

## SemanticMemory

Long-term memory for facts, entities, and relationships.

### Constructor

```python
SemanticMemory(
    backend: str = 'postgres',
    connection_string: Optional[str] = None,
    vector_store: Optional[Any] = None
)
```

**Parameters:**
- `backend` (str): Backend type ('postgres', 'memory'). Default: 'postgres'
- `connection_string` (str, optional): Database connection string. Uses config if None.
- `vector_store` (optional): Vector store instance for semantic search

**Example:**
```python
from langvel.memory import SemanticMemory

# Use default config
semantic = SemanticMemory()

# Custom connection
semantic = SemanticMemory(
    backend='postgres',
    connection_string='postgresql://user:pass@localhost/db'
)

# In-memory for testing
semantic = SemanticMemory(backend='memory')
```

### Methods

#### `async initialize() -> None`

Initialize backend and create tables if needed.

**Example:**
```python
await semantic.initialize()
```

#### `async close() -> None`

Close database connections.

**Example:**
```python
await semantic.close()
```

#### `async store_fact(user_id: str, fact: str, metadata: Optional[Dict] = None) -> int`

Store a fact about a user.

**Parameters:**
- `user_id` (str): User identifier
- `fact` (str): Fact to store
- `metadata` (dict, optional): Additional metadata (confidence, source, etc.)

**Returns:**
- Fact ID

**Example:**
```python
fact_id = await semantic.store_fact(
    user_id='user123',
    fact='Prefers dark mode in applications',
    metadata={
        'confidence': 0.95,
        'source': 'settings',
        'category': 'preferences'
    }
)
```

#### `async recall_facts(user_id: str, query: Optional[str] = None, limit: int = 10) -> List[Dict]`

Recall facts for a user.

**Parameters:**
- `user_id` (str): User identifier
- `query` (str, optional): Query for semantic search
- `limit` (int): Maximum number of facts. Default: 10

**Returns:**
- List of fact dictionaries

**Example:**
```python
facts = await semantic.recall_facts(
    user_id='user123',
    query='What does the user prefer?',
    limit=5
)

for fact in facts:
    print(f"Fact: {fact['fact']}")
    print(f"Confidence: {fact['metadata'].get('confidence', 0)}")
```

#### `async store_entity(user_id: str, entity_type: str, entity_name: str, properties: Optional[Dict] = None) -> int`

Store an entity with upsert (update if exists).

**Parameters:**
- `user_id` (str): User identifier
- `entity_type` (str): Type of entity
- `entity_name` (str): Name of entity
- `properties` (dict, optional): Entity properties

**Returns:**
- Entity ID

**Example:**
```python
entity_id = await semantic.store_entity(
    user_id='user123',
    entity_type='company',
    entity_name='TechCorp',
    properties={
        'industry': 'technology',
        'size': 'large'
    }
)
```

#### `async get_entity(user_id: str, entity_name: str) -> Optional[Dict]`

Get an entity by name.

**Parameters:**
- `user_id` (str): User identifier
- `entity_name` (str): Name of entity

**Returns:**
- Entity dictionary or None

**Example:**
```python
entity = await semantic.get_entity(
    user_id='user123',
    entity_name='TechCorp'
)
```

#### `async store_relationship(user_id: str, subject: str, relationship: str, object_entity: str, properties: Optional[Dict] = None) -> int`

Store a relationship between entities.

**Parameters:**
- `user_id` (str): User identifier
- `subject` (str): Subject entity name
- `relationship` (str): Relationship type ('works_at', 'lives_in', etc.)
- `object_entity` (str): Object entity name
- `properties` (dict, optional): Relationship properties

**Returns:**
- Relationship ID

**Example:**
```python
rel_id = await semantic.store_relationship(
    user_id='user123',
    subject='John Doe',
    relationship='works_at',
    object_entity='TechCorp',
    properties={
        'since': '2020',
        'role': 'engineer'
    }
)
```

#### `async get_relationships(user_id: str, subject: Optional[str] = None, relationship_type: Optional[str] = None) -> List[Dict]`

Get relationships for a subject.

**Parameters:**
- `user_id` (str): User identifier
- `subject` (str, optional): Subject entity name. If None, returns all.
- `relationship_type` (str, optional): Filter by relationship type

**Returns:**
- List of relationship dictionaries

**Example:**
```python
relationships = await semantic.get_relationships(
    user_id='user123',
    subject='John Doe'
)

for rel in relationships:
    print(f"{rel['subject']} {rel['relationship_type']} {rel['object_entity']}")
```

#### `async clear_user_memory(user_id: str) -> None`

Clear all semantic memory for a user.

**Parameters:**
- `user_id` (str): User identifier

**Example:**
```python
await semantic.clear_user_memory('user123')
```

---

## EpisodicMemory

Short-term conversation history with TTL.

### Constructor

```python
EpisodicMemory(
    backend: str = 'redis',
    connection_string: Optional[str] = None,
    ttl: int = 86400,
    max_turns: int = 100
)
```

**Parameters:**
- `backend` (str): Backend type ('redis', 'memory'). Default: 'redis'
- `connection_string` (str, optional): Redis connection string. Uses config if None.
- `ttl` (int): Time-to-live in seconds. Default: 86400 (24 hours)
- `max_turns` (int): Maximum turns per session. Default: 100

**Example:**
```python
from langvel.memory import EpisodicMemory

# Use defaults
episodic = EpisodicMemory()

# Custom configuration
episodic = EpisodicMemory(
    backend='redis',
    connection_string='redis://localhost:6379',
    ttl=172800,  # 48 hours
    max_turns=200
)

# In-memory for testing
episodic = EpisodicMemory(backend='memory')
```

### Methods

#### `async initialize() -> None`

Initialize backend connection.

**Example:**
```python
await episodic.initialize()
```

#### `async close() -> None`

Close connections.

**Example:**
```python
await episodic.close()
```

#### `async add_turn(session_id: str, role: str, content: str, metadata: Optional[Dict] = None) -> int`

Add a conversation turn.

**Parameters:**
- `session_id` (str): Session identifier
- `role` (str): Role ('user', 'assistant', 'system')
- `content` (str): Turn content
- `metadata` (dict, optional): Additional metadata

**Returns:**
- Turn index

**Example:**
```python
await episodic.add_turn(
    session_id='session123',
    role='user',
    content='Hello, how are you?',
    metadata={'timestamp': '2025-10-17T10:00:00Z'}
)

await episodic.add_turn(
    session_id='session123',
    role='assistant',
    content='Hello! I am doing well, thank you for asking.'
)
```

#### `async get_recent(session_id: str, limit: int = 10) -> List[Dict]`

Get recent conversation turns.

**Parameters:**
- `session_id` (str): Session identifier
- `limit` (int): Maximum number of turns. Default: 10

**Returns:**
- List of turn dictionaries (most recent first)

**Example:**
```python
recent = await episodic.get_recent('session123', limit=10)

for turn in recent:
    print(f"{turn['role']}: {turn['content']}")
```

#### `async get_all(session_id: str) -> List[Dict]`

Get all conversation turns for a session.

**Parameters:**
- `session_id` (str): Session identifier

**Returns:**
- List of all turn dictionaries (chronological order)

**Example:**
```python
all_turns = await episodic.get_all('session123')
```

#### `async get_context_window(session_id: str, max_tokens: int = 2000) -> List[Dict]`

Get conversation turns that fit in token budget.

**Parameters:**
- `session_id` (str): Session identifier
- `max_tokens` (int): Maximum tokens in context. Default: 2000

**Returns:**
- List of turn dictionaries that fit in budget

**Example:**
```python
context = await episodic.get_context_window(
    session_id='session123',
    max_tokens=2000
)

# Use in LLM prompt
conversation = "\n".join([f"{t['role']}: {t['content']}" for t in context])
```

#### `async get_summary(session_id: str, llm: Any) -> str`

Generate conversation summary using LLM.

**Parameters:**
- `session_id` (str): Session identifier
- `llm`: LLM instance for summarization

**Returns:**
- Summary string

**Example:**
```python
summary = await episodic.get_summary(
    session_id='session123',
    llm=agent.llm
)

print(f"Conversation summary: {summary}")
```

#### `async clear_session(session_id: str) -> None`

Clear conversation history for a session.

**Parameters:**
- `session_id` (str): Session identifier

**Example:**
```python
await episodic.clear_session('session123')
```

#### `async list_sessions() -> List[str]`

List all active sessions.

**Returns:**
- List of session IDs

**Example:**
```python
sessions = await episodic.list_sessions()
print(f"Active sessions: {len(sessions)}")
```

---

## WorkingMemory

In-memory current context storage.

### Constructor

```python
WorkingMemory(
    max_tokens: int = 4000,
    auto_prune: bool = True
)
```

**Parameters:**
- `max_tokens` (int): Maximum tokens in working memory. Default: 4000
- `auto_prune` (bool): Enable automatic pruning. Default: True

**Example:**
```python
from langvel.memory import WorkingMemory

# Use defaults
working = WorkingMemory()

# Custom configuration
working = WorkingMemory(
    max_tokens=8000,
    auto_prune=True
)
```

### Methods

#### `add(key: str, value: Any, priority: int = 0) -> None`

Add item to working memory.

**Parameters:**
- `key` (str): Item key
- `value`: Item value (any type)
- `priority` (int): Priority for retention (higher = kept longer). Default: 0

**Example:**
```python
working.add('user_intent', 'book_flight', priority=10)
working.add('destination', 'New York', priority=5)
working.add('date', '2025-11-01', priority=3)
```

#### `get(key: str, default: Any = None) -> Any`

Get item from working memory.

**Parameters:**
- `key` (str): Item key
- `default`: Default value if key not found

**Returns:**
- Item value or default

**Example:**
```python
intent = working.get('user_intent')
unknown = working.get('unknown_key', default='not found')
```

#### `has(key: str) -> bool`

Check if key exists in working memory.

**Parameters:**
- `key` (str): Item key

**Returns:**
- True if key exists, False otherwise

**Example:**
```python
if working.has('user_intent'):
    intent = working.get('user_intent')
```

#### `update(key: str, value: Any) -> None`

Update existing item value.

**Parameters:**
- `key` (str): Item key
- `value`: New value

**Example:**
```python
working.update('destination', 'San Francisco')
```

#### `remove(key: str) -> None`

Remove item from working memory.

**Parameters:**
- `key` (str): Item key

**Example:**
```python
working.remove('date')
```

#### `to_context_string(format_style: str = 'simple') -> str`

Convert working memory to context string for LLM.

**Parameters:**
- `format_style` (str): Format style ('simple', 'detailed', 'json'). Default: 'simple'

**Returns:**
- Formatted context string

**Example:**
```python
# Simple format
context = working.to_context_string('simple')
# Output: "user_intent: book_flight\ndestination: New York"

# Detailed format
context = working.to_context_string('detailed')
# Output: "## Current Context ##\n- user_intent: book_flight (priority: 10)\n..."

# JSON format
context = working.to_context_string('json')
# Output: '{"user_intent": "book_flight", "destination": "New York"}'
```

#### `get_stats() -> Dict[str, Any]`

Get working memory statistics.

**Returns:**
- Statistics dictionary

**Example:**
```python
stats = working.get_stats()
print(f"Items: {stats['item_count']}")
print(f"Tokens: {stats['estimated_tokens']}")
print(f"Usage: {stats['usage_percent']}%")
```

#### `clear() -> None`

Clear all items from working memory.

**Example:**
```python
working.clear()
```

#### `snapshot() -> Dict[str, Any]`

Create a snapshot of current working memory.

**Returns:**
- Snapshot dictionary

**Example:**
```python
snapshot = working.snapshot()

# Restore later
working.restore(snapshot)
```

#### `restore(snapshot: Dict[str, Any]) -> None`

Restore working memory from snapshot.

**Parameters:**
- `snapshot` (dict): Snapshot to restore

**Example:**
```python
snapshot = working.snapshot()

# Do some work...
working.add('temp', 'value')

# Restore to previous state
working.restore(snapshot)
```

#### `merge(other: 'WorkingMemory', strategy: str = 'keep_existing') -> None`

Merge another working memory into this one.

**Parameters:**
- `other` (WorkingMemory): Other working memory instance
- `strategy` (str): Merge strategy ('keep_existing', 'overwrite', 'higher_priority'). Default: 'keep_existing'

**Example:**
```python
other_memory = WorkingMemory()
other_memory.add('new_key', 'value')

working.merge(other_memory, strategy='keep_existing')
```

#### `set_max_tokens(max_tokens: int) -> None`

Update maximum token limit.

**Parameters:**
- `max_tokens` (int): New maximum token limit

**Example:**
```python
working.set_max_tokens(8000)
```

---

## Type Definitions

### Turn Dictionary

```python
{
    'role': str,           # 'user', 'assistant', 'system'
    'content': str,        # Turn content
    'metadata': dict,      # Additional metadata
    'timestamp': str       # ISO 8601 timestamp
}
```

### Fact Dictionary

```python
{
    'id': int,            # Fact ID
    'user_id': str,       # User identifier
    'fact': str,          # Fact content
    'metadata': dict,     # Additional metadata (confidence, source, etc.)
    'created_at': str,    # ISO 8601 timestamp
    'updated_at': str     # ISO 8601 timestamp
}
```

### Entity Dictionary

```python
{
    'id': int,            # Entity ID
    'user_id': str,       # User identifier
    'entity_type': str,   # Entity type
    'entity_name': str,   # Entity name
    'properties': dict,   # Entity properties
    'created_at': str,    # ISO 8601 timestamp
    'updated_at': str     # ISO 8601 timestamp
}
```

### Relationship Dictionary

```python
{
    'id': int,                 # Relationship ID
    'user_id': str,            # User identifier
    'subject_entity': str,     # Subject entity name
    'relationship_type': str,  # Relationship type
    'object_entity': str,      # Object entity name
    'properties': dict,        # Relationship properties
    'created_at': str          # ISO 8601 timestamp
}
```

---

## Usage Examples

### Complete Agent with Memory

```python
from langvel.core.agent import Agent
from langvel.state.base import StateModel

class MemoryAwareAgent(Agent):
    enable_memory = True

    def build_graph(self):
        return (
            self.start()
            .then(self.recall_context)
            .then(self.process_request)
            .then(self.store_interaction)
            .end()
        )

    async def recall_context(self, state):
        # Build comprehensive context
        context = await self.memory_manager.build_context(
            user_id=state.user_id,
            session_id=state.session_id,
            query=state.query,
            max_tokens=2000
        )

        # Add to working memory
        self.memory_manager.working.add('current_query', state.query, priority=10)

        state.context = context
        return state

    async def process_request(self, state):
        # Use context in LLM prompt
        prompt = f"{state.context}\n\nUser: {state.query}"
        response = await self.llm.invoke(prompt)

        state.response = response
        return state

    async def store_interaction(self, state):
        # Store conversation turn
        await self.memory_manager.remember(
            user_id=state.user_id,
            session_id=state.session_id,
            content=state.query,
            role='user',
            memory_type='auto'  # Auto-detects facts
        )

        await self.memory_manager.remember(
            user_id=state.user_id,
            session_id=state.session_id,
            content=state.response,
            role='assistant'
        )

        return state
```

### Manual Memory Operations

```python
from langvel.memory import MemoryManager

async def manual_memory_example():
    memory = MemoryManager()
    await memory.initialize()

    # Store user facts
    await memory.store_entity(
        user_id='user123',
        entity_type='person',
        entity_name='Alice',
        properties={'role': 'data scientist', 'location': 'SF'}
    )

    # Store relationship
    await memory.semantic.store_relationship(
        user_id='user123',
        subject='Alice',
        relationship='works_at',
        object_entity='TechCorp'
    )

    # Store conversation
    await memory.episodic.add_turn(
        session_id='session456',
        role='user',
        content='What projects am I working on?'
    )

    # Build context
    context = await memory.build_context(
        user_id='user123',
        session_id='session456',
        query='Tell me about my work'
    )

    print(context)

    await memory.close()
```

---

## Error Handling

All async methods may raise:

- `ConnectionError`: Failed to connect to backend
- `ValueError`: Invalid parameters
- `RuntimeError`: Backend not initialized (call `initialize()` first)

**Example:**
```python
try:
    await memory.initialize()
    await memory.remember(user_id='user123', session_id='sess456', content='test')
except ConnectionError as e:
    print(f"Database connection failed: {e}")
except RuntimeError as e:
    print(f"Memory not initialized: {e}")
finally:
    await memory.close()
```

---

## See Also

- [Memory Systems Guide](/advanced/memory-systems)
- [Agent API Reference](/api-reference/agent)
- [Configuration](/getting-started/configuration)
