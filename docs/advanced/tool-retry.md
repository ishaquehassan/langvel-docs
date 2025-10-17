# Tool Retry & Fallback

Automatically retry failed tool executions with exponential backoff and fallback support.

## Overview

Langvel's tool system provides built-in retry and fallback capabilities for all tool types:
- Automatic exponential backoff
- Configurable retry attempts
- Timeout support
- Fallback functions
- Error tracking and statistics

## Basic Tool with Retry

```python
from langvel.tools.decorators import tool

@tool(
    description="Fetch data from external API",
    retry=5,  # Retry up to 5 times
    timeout=10.0,  # 10-second timeout
    fallback=lambda self, *args, error=None, **kwargs: {"cached": True}
)
async def fetch_api_data(self, query: str) -> dict:
    """Automatically retries on failure with exponential backoff."""
    async with aiohttp.ClientSession() as session:
        async with session.get(f"https://api.example.com?q={query}") as resp:
            return await resp.json()
```

## Using Tools with Retry

### In Agent Nodes

```python
class MyAgent(Agent):
    @tool(retry=3)
    async def risky_operation(self, state):
        # Tool definition
        return result

    async def process(self, state):
        # Execute tool with automatic retry
        result = await self.execute_tool('risky_operation', state)
        state.result = result
        return state
```

## Retry Behavior

### Exponential Backoff

Retry delays increase exponentially:

1. **Attempt 1** - Immediate execution
2. **Attempt 2** - Wait 1 second (2^0)
3. **Attempt 3** - Wait 2 seconds (2^1)
4. **Attempt 4** - Wait 4 seconds (2^2)
5. **Attempt 5** - Wait 8 seconds (2^3)
6. **Fallback** - Execute fallback if all retries fail

### Example Timeline

```
Time 0s:  First attempt → fails
Time 1s:  Retry 1 (after 1s delay) → fails
Time 3s:  Retry 2 (after 2s delay) → fails
Time 7s:  Retry 3 (after 4s delay) → fails
Time 15s: Retry 4 (after 8s delay) → fails
Time 15s: Execute fallback
```

## Fallback Functions

### Simple Fallback

```python
@tool(
    retry=3,
    fallback=lambda self, *args, **kwargs: {"default": "value"}
)
async def api_call(self, query: str):
    return await external_api(query)
```

### Advanced Fallback

```python
async def intelligent_fallback(self, query, error=None, **kwargs):
    """
    Fallback receives:
    - All original arguments
    - error: The exception that caused failure
    - **kwargs: Additional context
    """
    logger.error(f"API call failed: {error}")

    # Try cache
    cached = await get_from_cache(query)
    if cached:
        return cached

    # Return default
    return {"status": "unavailable", "query": query}

@tool(retry=5, fallback=intelligent_fallback)
async def fetch_data(self, query: str):
    return await api.get(query)
```

## All Tool Types Support Retry

### RAG Tools

```python
@rag_tool(
    collection='knowledge_base',
    k=5,
    retry=3,  # Retry vector search
    timeout=5.0
)
async def search_documents(self, state):
    # RAG retrieval with automatic retry
    return state
```

### MCP Tools

```python
@mcp_tool(
    server='slack',
    tool_name='send_message',
    retry=3,  # Retry MCP calls
    timeout=10.0
)
async def notify_slack(self, message: str):
    # MCP server call with retry
    pass
```

### HTTP Tools

```python
@http_tool(
    method='POST',
    url='https://api.example.com/data',
    retry=5,  # Retry HTTP requests
    timeout=30.0,
    fallback=lambda *a, **k: None
)
async def post_data(self, data: dict):
    # HTTP call with retry
    pass
```

### LLM Tools

```python
@llm_tool(
    system_prompt="You are a helpful assistant",
    retry=3,  # Retry LLM calls
    timeout=60.0
)
async def ask_llm(self, prompt: str) -> str:
    # LLM call with retry
    pass
```

## Timeout Handling

### Basic Timeout

```python
@tool(timeout=5.0)  # 5-second timeout
async def slow_operation(self):
    await asyncio.sleep(10)  # Will timeout and retry
    return "result"
```

### Combined Timeout and Retry

```python
@tool(
    retry=3,
    timeout=10.0  # Each attempt times out after 10s
)
async def fetch_with_timeout(self, url: str):
    # Total possible time: 3 attempts × 10s = 30s
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as resp:
            return await resp.json()
```

## Error Handling

### Catching Tool Errors

```python
from langvel.tools.registry import ToolExecutionError

async def process(self, state):
    try:
        result = await self.execute_tool('my_tool', state)
        state.result = result
    except ToolExecutionError as e:
        # All retries failed
        logger.error(f"Tool execution failed: {e}")
        state.set_error(str(e))

    return state
```

### Retry on Specific Errors

```python
@tool(retry=5)
async def selective_retry(self, data):
    try:
        return await api_call(data)
    except ConnectionError:
        # Retry on connection errors
        raise
    except ValueError as e:
        # Don't retry on validation errors
        logger.error(f"Invalid data: {e}")
        return {"error": "invalid_data"}
```

## Tool Execution Statistics

Track tool performance:

```python
# Get statistics for a specific tool
stats = agent.tool_registry.get_stats('my_tool')

print(stats)
# {
#     'total_calls': 100,
#     'successful_calls': 95,
#     'failed_calls': 5,
#     'total_duration': 45.2,
#     'avg_duration': 0.452
# }

# Get all tool statistics
all_stats = agent.tool_registry.get_stats()

# Reset statistics
agent.tool_registry.reset_stats('my_tool')
agent.tool_registry.reset_stats()  # Reset all
```

## Complete Examples

### Example 1: Resilient API Integration

```python
class APIIntegrationAgent(Agent):
    state_model = APIState

    @tool(
        description="Fetch user data with retry",
        retry=5,
        timeout=10.0,
        fallback=lambda self, user_id, error=None, **kw: {
            "id": user_id,
            "name": "Unknown",
            "status": "cached"
        }
    )
    async def fetch_user(self, user_id: str) -> dict:
        """Fetch user data from external API."""
        async with aiohttp.ClientSession() as session:
            url = f"https://api.example.com/users/{user_id}"
            async with session.get(url) as resp:
                if resp.status != 200:
                    raise Exception(f"API error: {resp.status}")
                return await resp.json()

    def build_graph(self):
        return (
            self.start()
            .then(self.process_users)
            .end()
        )

    async def process_users(self, state):
        """Process multiple users with retry."""
        results = []

        for user_id in state.user_ids:
            try:
                # Automatic retry with fallback
                user = await self.execute_tool('fetch_user', user_id)
                results.append(user)
            except ToolExecutionError:
                # Even fallback failed
                logger.error(f"Could not fetch user {user_id}")

        state.results = results
        return state
```

### Example 2: Database Operations with Retry

```python
class DatabaseAgent(Agent):
    @tool(
        retry=3,
        timeout=5.0,
        fallback=lambda self, *args, **kwargs: None
    )
    async def save_to_db(self, data: dict):
        """Save data with automatic retry."""
        async with db.transaction() as tx:
            await tx.execute(
                "INSERT INTO records VALUES (%s, %s)",
                (data['id'], data['value'])
            )
            await tx.commit()

        return {"status": "saved", "id": data['id']}

    @tool(retry=5)
    async def query_db(self, query: str):
        """Query database with retry."""
        async with db.connection() as conn:
            return await conn.fetch(query)

    async def process(self, state):
        # Save with retry
        result = await self.execute_tool('save_to_db', state.data)

        if result:
            # Query with retry
            records = await self.execute_tool(
                'query_db',
                'SELECT * FROM records'
            )
            state.records = records

        return state
```

### Example 3: Multi-Service Integration

```python
class MultiServiceAgent(Agent):
    # Primary API
    @tool(retry=3, timeout=5.0, fallback=lambda *a, **k: None)
    async def fetch_from_primary(self, query: str):
        return await primary_api.get(query)

    # Backup API
    @tool(retry=2, timeout=10.0)
    async def fetch_from_backup(self, query: str):
        return await backup_api.get(query)

    async def fetch_data(self, state):
        """Try primary, fallback to backup."""

        # Try primary with automatic retry
        try:
            data = await self.execute_tool('fetch_from_primary', state.query)
            if data:
                state.data = data
                state.source = 'primary'
                return state
        except ToolExecutionError:
            logger.warning("Primary API failed")

        # Fallback to backup
        try:
            data = await self.execute_tool('fetch_from_backup', state.query)
            state.data = data
            state.source = 'backup'
        except ToolExecutionError:
            state.set_error("All APIs failed")

        return state
```

## Best Practices

### 1. Set Appropriate Retry Counts

```python
# External API - more retries
@tool(retry=5)
async def external_api():
    pass

# Database - fewer retries
@tool(retry=2)
async def database_query():
    pass

# Critical operations - many retries
@tool(retry=10)
async def critical_payment():
    pass
```

### 2. Use Timeouts

```python
# Long-running operations need timeouts
@tool(retry=3, timeout=30.0)
async def heavy_computation():
    pass

# Quick operations - short timeouts
@tool(retry=5, timeout=1.0)
async def cache_lookup():
    pass
```

### 3. Meaningful Fallbacks

```python
# Good - provide useful default
@tool(
    retry=3,
    fallback=lambda self, query, **kw: load_from_cache(query)
)
async def fetch_data(self, query):
    pass

# Bad - generic fallback
@tool(retry=3, fallback=lambda *a, **k: None)
async def fetch_data(self, query):
    pass
```

### 4. Monitor Tool Statistics

```python
# Periodically check tool health
async def monitor_tools(agent):
    stats = agent.tool_registry.get_stats()

    for tool_name, metrics in stats.items():
        failure_rate = metrics['failed_calls'] / metrics['total_calls']

        if failure_rate > 0.1:  # >10% failure rate
            alert(f"High failure rate for {tool_name}: {failure_rate:.1%}")

        if metrics['avg_duration'] > 5.0:  # >5s average
            alert(f"Slow tool {tool_name}: {metrics['avg_duration']:.2f}s avg")
```

## Troubleshooting

### Retries Not Working

**Problem**: Tool doesn't retry on failure

**Solution**: Ensure you're using `execute_tool()`:

```python
# Wrong - decorator ignored
result = await self.my_tool(data)

# Correct - executes with retry
result = await self.execute_tool('my_tool', data)
```

### Too Many Retries

**Problem**: Tool retries too much, slowing down workflow

**Solution**: Reduce retry count or timeout:

```python
# Before
@tool(retry=10, timeout=30.0)

# After
@tool(retry=3, timeout=5.0)
```

### Fallback Not Executing

**Problem**: Fallback function never called

**Solution**: Check fallback signature:

```python
# Correct signature
fallback=lambda self, *args, error=None, **kwargs: default_value

# Must accept error parameter
```

## Related Topics

- [Tools](/the-basics/tools) - Basic tool usage
- [Loops](/advanced/loops) - Combine with retry loops
- [Testing](/advanced/testing) - Test retry behavior
