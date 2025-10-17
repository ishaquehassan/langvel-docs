# Loop Patterns

Execute nodes repeatedly with conditions, perfect for batch processing, retry logic, and iterative workflows.

## Overview

Langvel provides three elegant methods for implementing loops in your agent workflows:

- `.loop()` - While pattern (loop while condition is True)
- `.until()` - Do-while pattern (loop until condition is True)
- `.while_()` - Alternative while syntax

All loop methods support:
- Automatic iteration tracking
- Safety limits with `max_iterations`
- Condition-based exit
- State mutation during iterations

## `.loop()` - While Pattern

Execute a function repeatedly while a condition is True.

### Basic Usage

```python
def build_graph(self):
    return (
        self.start()
        .then(self.initialize_tasks)

        # Loop while tasks remain
        .loop(
            self.process_next_task,
            condition=lambda state: len(state.remaining_tasks) > 0,
            max_iterations=100  # Safety limit
        )

        .then(self.finalize)
        .end()
    )
```

### Parameters

- `func`: Function to execute in each iteration
- `condition`: Lambda/function that returns True to continue, False to exit
- `max_iterations` (optional): Maximum number of iterations (safety limit)
- `name` (optional): Custom name for the loop node

### Example: Batch Processing

```python
class BatchProcessingAgent(Agent):
    state_model = BatchState

    def build_graph(self):
        return (
            self.start()
            .then(self.load_batch_data)
            .loop(
                self.process_batch,
                condition=lambda s: len(s.pending_items) > 0,
                max_iterations=1000
            )
            .then(self.save_results)
            .end()
        )

    async def load_batch_data(self, state):
        # Load 1000 items to process
        state.pending_items = load_items()
        state.processed_items = []
        return state

    async def process_batch(self, state):
        # Process one item per iteration
        if state.pending_items:
            item = state.pending_items.pop(0)
            result = process_item(item)
            state.processed_items.append(result)
        return state
```

## `.until()` - Do-While Pattern

Execute function repeatedly until a condition becomes True (opposite of loop).

### Basic Usage

```python
def build_graph(self):
    return (
        self.start()

        # Retry until successful or max attempts
        .until(
            self.attempt_connection,
            condition=lambda state: state.connected or state.retry_count >= 5
        )

        .then(self.handle_result)
        .end()
    )
```

### Example: API Retry Logic

```python
class RetryAgent(Agent):
    state_model = RetryState

    def build_graph(self):
        return (
            self.start()
            .until(
                self.attempt_api_call,
                condition=lambda s: s.success or s.attempts >= 5
            )
            .then(self.process_response)
            .end()
        )

    async def attempt_api_call(self, state):
        state.attempts += 1

        try:
            response = await call_external_api()
            state.data = response
            state.success = True
        except Exception as e:
            state.last_error = str(e)
            state.success = False
            # Will retry automatically

        return state
```

## `.while_()` - Alternative While Syntax

Alias for `.loop()` with clearer while semantics (condition first).

### Basic Usage

```python
.while_(
    condition=lambda state: state.retry_count < 3,
    func=self.attempt_operation
)
```

### Example: Connection Pool Management

```python
class ConnectionPoolAgent(Agent):
    def build_graph(self):
        return (
            self.start()
            .while_(
                condition=lambda s: not s.pool_ready,
                func=self.check_connections
            )
            .then(self.execute_query)
            .end()
        )
```

## How Loops Work

### Iteration Tracking

Langvel automatically tracks iterations for you:

```python
.loop(
    self.process,
    condition=lambda state: state.continue_processing,
    max_iterations=100
)
```

Internal iteration counter stored as `_{node_name}_iterations` on state.

### Loop Exit Conditions

Loops exit when:
1. Condition function returns False
2. `max_iterations` reached (if specified)
3. Exception is raised (unless caught)

### State Mutations in Loops

```python
async def process_batch(self, state):
    # Modify state in each iteration
    item = state.queue.pop(0)
    result = await process_item(item)

    state.processed.append(result)
    state.iteration_count += 1

    # Control loop continuation
    if state.error_count > 10:
        state.queue = []  # Force exit by emptying queue

    return state
```

## Complete Examples

### Example 1: Database Migration

```python
class MigrationAgent(Agent):
    state_model = MigrationState

    def build_graph(self):
        return (
            self.start()
            .then(self.prepare_migration)
            .loop(
                self.migrate_batch,
                condition=lambda s: s.records_remaining > 0,
                max_iterations=10000
            )
            .then(self.verify_migration)
            .end()
        )

    async def prepare_migration(self, state):
        state.records_remaining = await db.count_records()
        state.batch_size = 100
        state.migrated = 0
        return state

    async def migrate_batch(self, state):
        records = await db.fetch_batch(state.batch_size)

        for record in records:
            await new_db.insert(transform(record))
            state.migrated += 1

        state.records_remaining -= len(records)
        return state
```

### Example 2: Polling Service

```python
class PollingAgent(Agent):
    state_model = PollingState

    def build_graph(self):
        return (
            self.start()
            .then(self.initialize_polling)
            .until(
                self.check_status,
                condition=lambda s: s.job_complete or s.timeout
            )
            .then(self.process_result)
            .end()
        )

    async def initialize_polling(self, state):
        state.job_id = start_job()
        state.poll_count = 0
        state.max_polls = 60
        state.job_complete = False
        return state

    async def check_status(self, state):
        state.poll_count += 1

        status = await api.get_job_status(state.job_id)
        state.job_complete = (status == 'completed')
        state.timeout = (state.poll_count >= state.max_polls)

        if not state.job_complete and not state.timeout:
            await asyncio.sleep(5)  # Wait 5 seconds between polls

        return state
```

### Example 3: Self-Healing Workflow

```python
class SelfHealingAgent(Agent):
    state_model = HealingState

    def build_graph(self):
        return (
            self.start()
            .until(
                self.attempt_with_healing,
                condition=lambda s: s.success or s.healing_attempts >= 3
            )
            .then(self.finalize)
            .end()
        )

    async def attempt_with_healing(self, state):
        state.healing_attempts += 1

        try:
            result = await execute_operation()
            state.result = result
            state.success = True
        except Exception as e:
            state.last_error = str(e)

            # Self-healing logic
            await self.diagnose_and_fix(e)

            state.success = False
            # Will retry automatically

        return state

    async def diagnose_and_fix(self, error):
        if "connection" in str(error).lower():
            await reset_connections()
        elif "memory" in str(error).lower():
            await clear_cache()
        # ... more healing strategies
```

## Best Practices

### 1. Always Set max_iterations

Prevent infinite loops with safety limits:

```python
# Good
.loop(self.process, condition=..., max_iterations=1000)

# Risky - could run forever
.loop(self.process, condition=...)
```

### 2. Clear Exit Conditions

Make loop exit logic obvious:

```python
# Good - clear exit condition
.loop(
    self.process,
    condition=lambda s: s.items_remaining > 0 and s.errors < 10
)

# Bad - complex nested logic
.loop(
    self.process,
    condition=lambda s: complex_function(s)
)
```

### 3. Error Handling in Loops

```python
async def process_with_error_handling(self, state):
    try:
        # Main processing logic
        result = await risky_operation()
        state.results.append(result)
    except Exception as e:
        state.error_count += 1

        # Break loop on too many errors
        if state.error_count > MAX_ERRORS:
            state.force_exit = True
            # Empty the queue or set condition to False

    return state
```

### 4. State Monitoring

Track progress in loop iterations:

```python
async def monitored_process(self, state):
    # Track metrics
    state.iteration_start = time.time()

    # Process
    result = await process_item()

    # Update metrics
    state.total_time += time.time() - state.iteration_start
    state.avg_time = state.total_time / state.iterations

    # Adaptive behavior based on metrics
    if state.avg_time > 5.0:
        state.batch_size = max(1, state.batch_size // 2)

    return state
```

## Troubleshooting

### Loop Not Exiting

**Problem**: Loop continues forever

**Solution**: Check condition logic and max_iterations

```python
# Debug loop condition
.loop(
    self.process,
    condition=lambda s: (
        print(f"Items remaining: {len(s.items)}") or
        len(s.items) > 0
    ),
    max_iterations=100
)
```

### Performance Issues

**Problem**: Loop is slow

**Solution**: Optimize batch sizes or add parallelism

```python
# Instead of processing one item per iteration
async def process_one(self, state):
    item = state.items.pop(0)
    state.results.append(process(item))
    return state

# Process batches
async def process_batch(self, state):
    batch = state.items[:100]
    state.items = state.items[100:]

    results = await asyncio.gather(*[process(item) for item in batch])
    state.results.extend(results)

    return state
```

## Related Topics

- [Tool Retry](/advanced/tool-retry) - Automatic retry for tools
- [Human-in-the-Loop](/advanced/human-in-loop) - Add approval steps
- [Graph Validation](/advanced/graph-validation) - Validate loop structure
