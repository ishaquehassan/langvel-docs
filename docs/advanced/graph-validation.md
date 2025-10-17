# Graph Validation

Validate graph structure before execution to catch configuration errors early.

## Overview

Graph validation helps you:
- Detect unreachable nodes
- Find dead-end nodes (no path to END)
- Identify missing merges
- Catch dangling conditional branches
- Prevent runtime errors

## Basic Validation

```python
def build_graph(self):
    builder = (
        self.start()
        .then(self.step1)
        .then(self.step2)
        .end()
    )

    # Validate graph structure
    warnings = builder.validate()

    if warnings:
        for warning in warnings:
            logger.warning(f"Graph validation: {warning}")

    return builder
```

## Validation Checks

### 1. Unreachable Nodes

Detects nodes not connected from START:

```python
# This will generate a warning
builder = (
    self.start()
    .then(self.step1)
    .then(self.step2)
    .end()
)

# orphan_node is never added to the graph flow
# Warning: "Unreachable nodes detected: {'orphan_node'}"
```

### 2. Dead-End Nodes

Detects nodes with no path to END:

```python
# This will generate a warning
builder = (
    self.start()
    .then(self.step1)
    .branch({
        'path_a': self.process_a,
        'path_b': self.process_b
    })
    # Missing merge or end!
)

# Warning: "Nodes with no path to END: {'process_a', 'process_b'}"
```

### 3. Missing Merges

Detects parallel execution without merge:

```python
# This will generate a warning
builder = (
    self.start()
    .parallel(
        self.fetch_a,
        self.fetch_b,
        auto_merge=False  # No merge specified
    )
    # No .merge() or .end() call
)

# Warning: "Parallel execution detected without explicit merge or end()"
```

### 4. Dangling Branches

Detects conditional branches that don't connect:

```python
# This will generate a warning
builder = (
    self.start()
    .then(self.classify)
    .branch({
        'type_a': self.handle_a,
        'type_b': self.handle_b
    })
    # No merge point
    .then(self.finalize)  # Unreachable!
    .end()
)
```

## Validation Output

### Example Warnings

```python
warnings = builder.validate()

# Returns list of issues:
[
    "Unreachable nodes detected: {'orphan_node', 'unused_handler'}",
    "Nodes with no path to END: {'dead_end_processor'}",
    "Parallel execution detected without explicit merge or end()"
]
```

## Enforcement Strategies

### Development Mode Only

```python
import os

def build_graph(self):
    builder = (
        self.start()
        .then(self.process)
        .end()
    )

    # Only validate in development
    if os.getenv('ENV') != 'production':
        warnings = builder.validate()
        if warnings:
            raise ValueError(f"Invalid graph structure: {warnings}")

    return builder
```

### Always Validate with Logging

```python
def build_graph(self):
    builder = (
        self.start()
        .then(self.process)
        .end()
    )

    # Always validate, log warnings
    warnings = builder.validate()
    if warnings:
        for warning in warnings:
            logger.warning(f"Graph validation: {warning}")

        # In production, just log
        if os.getenv('ENV') != 'production':
            raise ValueError(f"Graph errors: {warnings}")

    return builder
```

### Unit Tests

```python
def test_graph_validation():
    agent = MyAgent()
    builder = agent.build_graph()

    warnings = builder.validate()

    # Assert no warnings in tests
    assert len(warnings) == 0, f"Graph validation errors: {warnings}"
```

## Common Issues and Fixes

### Issue 1: Unreachable Node After Branch

**Problem**:
```python
builder = (
    self.start()
    .then(self.classify)
    .branch({
        'a': self.handle_a,
        'b': self.handle_b
    })
    .then(self.finalize)  # Unreachable!
    .end()
)
```

**Fix**:
```python
builder = (
    self.start()
    .then(self.classify)
    .branch({
        'a': self.handle_a,
        'b': self.handle_b
    })
    .merge(self.finalize)  # Now reachable
    .end()
)
```

### Issue 2: Dead-End Parallel Nodes

**Problem**:
```python
builder = (
    self.start()
    .parallel(
        self.task_a,
        self.task_b,
        auto_merge=False
    )
    # No merge or end
)
```

**Fix**:
```python
builder = (
    self.start()
    .parallel(
        self.task_a,
        self.task_b,
        auto_merge=True  # Auto-merge to END
    )
)
```

### Issue 3: Orphaned Node

**Problem**:
```python
def build_graph(self):
    builder = self.start()
    builder.then(self.step1)
    # step2 is defined but never connected
    builder.then(self.step3)
    return builder.end()
```

**Fix**:
```python
def build_graph(self):
    return (
        self.start()
        .then(self.step1)
        .then(self.step2)  # Include all nodes
        .then(self.step3)
        .end()
    )
```

## Advanced Validation

### Custom Validation Rules

```python
def build_graph(self):
    builder = (
        self.start()
        .then(self.process)
        .end()
    )

    # Built-in validation
    warnings = builder.validate()

    # Custom validation
    custom_warnings = self.custom_validate(builder)

    all_warnings = warnings + custom_warnings

    if all_warnings:
        raise ValueError(f"Validation failed: {all_warnings}")

    return builder

def custom_validate(self, builder):
    warnings = []

    # Check for specific patterns
    node_names = [name for name, _ in builder.nodes]

    # Ensure certain nodes exist
    if 'validate_input' not in node_names:
        warnings.append("Missing required 'validate_input' node")

    # Check node naming conventions
    for name in node_names:
        if not name.islower():
            warnings.append(f"Node name '{name}' should be lowercase")

    return warnings
```

### Validation in CI/CD

```python
# tests/test_graph_validation.py
import pytest
from app.agents import *

def test_all_agents_valid():
    """Ensure all agent graphs are valid."""

    agents = [
        CustomerSupportAgent,
        OrderProcessingAgent,
        DataPipelineAgent,
        # ... all agents
    ]

    for agent_class in agents:
        agent = agent_class()
        builder = agent.build_graph()

        warnings = builder.validate()

        assert len(warnings) == 0, (
            f"{agent_class.__name__} has invalid graph: {warnings}"
        )
```

## Best Practices

### 1. Validate Early

Run validation during development:

```python
# In your agent module
if __name__ == "__main__":
    agent = MyAgent()
    builder = agent.build_graph()

    warnings = builder.validate()

    if warnings:
        print("⚠️  Graph validation warnings:")
        for warning in warnings:
            print(f"  - {warning}")
    else:
        print("✅ Graph structure is valid")
```

### 2. Document Known Warnings

If you have intentional warnings:

```python
def build_graph(self):
    builder = (...)

    warnings = builder.validate()

    # Filter known/acceptable warnings
    critical_warnings = [
        w for w in warnings
        if 'orphan_test_node' not in w  # Known test node
    ]

    if critical_warnings:
        raise ValueError(f"Critical graph errors: {critical_warnings}")

    return builder
```

### 3. Validate Subgraphs

```python
class MySubgraph:
    @staticmethod
    def build():
        builder = (
            GraphBuilder(MyState)
            .then(MySubgraph.step1)
            .then(MySubgraph.step2)
            .end()
        )

        # Validate subgraphs too
        warnings = builder.validate()
        if warnings:
            logger.warning(f"Subgraph warnings: {warnings}")

        return builder
```

## Validation API

### `builder.validate()` Method

```python
def validate(self) -> List[str]:
    """
    Validate graph structure.

    Returns:
        List of warning messages (empty if valid)

    Checks performed:
    - Unreachable nodes (BFS from START)
    - Dead-end nodes (BFS backward from END)
    - Missing merges after parallel
    - Dangling conditional branches
    """
```

### Return Format

```python
warnings: List[str] = [
    "Unreachable nodes detected: {set of node names}",
    "Nodes with no path to END: {set of node names}",
    "Parallel execution detected without explicit merge or end()"
]
```

## Complete Example

```python
from langvel.core.agent import Agent
from langvel.state.base import StateModel
import logging
import os

logger = logging.getLogger(__name__)

class ValidatedAgent(Agent):
    state_model = MyState

    def build_graph(self):
        builder = (
            self.start()
            .then(self.validate_input)
            .then(self.process)

            # Parallel processing
            .parallel(
                self.save_to_db,
                self.send_notification,
                auto_merge=True
            )
        )

        # Always validate
        warnings = builder.validate()

        if warnings:
            # Log all warnings
            for warning in warnings:
                logger.warning(f"Graph validation: {warning}")

            # Fail in non-production
            if os.getenv('ENV') != 'production':
                raise ValueError(
                    f"Graph validation failed:\n" +
                    "\n".join(f"  - {w}" for w in warnings)
                )

        return builder

# Test validation
if __name__ == "__main__":
    agent = ValidatedAgent()
    builder = agent.build_graph()

    print("✅ Graph structure validated successfully")
```

## Troubleshooting

### False Positives

**Problem**: Validation reports issues for intentional patterns

**Solution**: Document and filter known warnings

```python
KNOWN_WARNINGS = {
    "test_node",  # Node used only in tests
    "debug_handler"  # Debug-only node
}

warnings = builder.validate()
critical = [
    w for w in warnings
    if not any(known in w for known in KNOWN_WARNINGS)
]
```

### Complex Graphs

**Problem**: Large graphs are hard to validate

**Solution**: Use subgraphs and validate separately

```python
# Validate each subgraph
auth_warnings = AuthFlow.build().validate()
processing_warnings = ProcessingFlow.build().validate()

# Then validate main graph
main_warnings = main_builder.validate()
```

## Related Topics

- [Loops](/advanced/loops) - Validate loop structures
- [Subgraphs](/advanced/subgraphs) - Validate modular components
- [Testing](/advanced/testing) - Integration testing strategies
