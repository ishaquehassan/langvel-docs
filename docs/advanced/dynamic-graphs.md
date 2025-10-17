# Dynamic Graph Modification

Modify graph structure at runtime based on conditions and user input for adaptive workflows.

## Overview

Dynamic graphs allow you to:
- Add nodes at runtime based on conditions
- Remove unnecessary nodes dynamically
- Adapt workflows to user preferences
- A/B test different workflow variations
- Optimize performance based on runtime metrics

## Enabling Dynamic Mode

```python
def build_graph(self):
    builder = self.start().dynamic(True)  # Enable dynamic modifications

    builder.then(self.analyze_request)
    # Graph can now be modified at runtime

    return builder.end()
```

## Adding Nodes Dynamically

### Basic Node Addition

```python
async def analyze_request(self, state):
    """Add processing nodes based on complexity."""

    if state.complexity == 'high':
        # Dynamically add intensive processing node
        self.builder.add_node_dynamic(
            self.deep_analysis,
            connect_from='analyze_request',
            connect_to='finalize',
            name='deep_analysis_node'
        )
    else:
        # Add fast path
        self.builder.add_node_dynamic(
            self.quick_process,
            connect_from='analyze_request',
            connect_to='finalize'
        )

    return state
```

### Parameters

- `func`: Node function to add
- `connect_from`: Node to connect from (None = current node or START)
- `connect_to`: Node to connect to (None = END)
- `name`: Optional custom node name

## Removing Nodes Dynamically

```python
async def optimize_workflow(self, state):
    """Remove unnecessary nodes based on conditions."""

    if state.skip_validation:
        # Remove validation node
        self.builder.remove_node_dynamic('validation_step')

    if state.fast_mode:
        # Remove expensive processing nodes
        self.builder.remove_node_dynamic('analytics')
        self.builder.remove_node_dynamic('logging')

    return state
```

## Complete Examples

### Example 1: Adaptive Processing Pipeline

```python
from langvel.core.agent import Agent
from langvel.state.base import StateModel

class AdaptiveState(StateModel):
    data: dict
    complexity: str = "normal"
    user_tier: str = "free"
    processing_mode: str = "standard"

class AdaptivePipelineAgent(Agent):
    state_model = AdaptiveState

    def build_graph(self):
        builder = self.start().dynamic(True)  # Enable dynamic mode

        builder.then(self.analyze_input)
        builder.then(self.adapt_pipeline)
        builder.then(self.execute_pipeline)
        builder.then(self.finalize)

        return builder.end()

    async def analyze_input(self, state):
        """Analyze input to determine processing needs."""

        # Determine complexity
        data_size = len(state.data)
        if data_size > 10000:
            state.complexity = "high"
        elif data_size > 1000:
            state.complexity = "medium"
        else:
            state.complexity = "low"

        return state

    async def adapt_pipeline(self, state):
        """Dynamically modify pipeline based on analysis."""

        # Add processing nodes based on complexity
        if state.complexity == "high":
            self.builder.add_node_dynamic(
                self.parallel_processing,
                connect_from='adapt_pipeline',
                connect_to='execute_pipeline'
            )
        elif state.complexity == "medium":
            self.builder.add_node_dynamic(
                self.batch_processing,
                connect_from='adapt_pipeline',
                connect_to='execute_pipeline'
            )
        else:
            self.builder.add_node_dynamic(
                self.simple_processing,
                connect_from='adapt_pipeline',
                connect_to='execute_pipeline'
            )

        # Add premium features for paid users
        if state.user_tier == "premium":
            self.builder.add_node_dynamic(
                self.advanced_analytics,
                connect_from='execute_pipeline',
                connect_to='finalize'
            )

        return state

    async def simple_processing(self, state):
        # Simple processing logic
        return state

    async def batch_processing(self, state):
        # Batch processing logic
        return state

    async def parallel_processing(self, state):
        # Parallel processing logic
        return state

    async def advanced_analytics(self, state):
        # Premium analytics
        return state

    async def execute_pipeline(self, state):
        # Core execution
        return state

    async def finalize(self, state):
        # Finalization
        return state
```

### Example 2: User-Customizable Workflow

```python
class CustomizableState(StateModel):
    user_preferences: dict
    enabled_features: list = []

class CustomWorkflowAgent(Agent):
    state_model = CustomizableState

    def build_graph(self):
        builder = self.start().dynamic(True)

        builder.then(self.load_preferences)
        builder.then(self.build_custom_workflow)
        builder.then(self.execute)

        return builder.end()

    async def load_preferences(self, state):
        """Load user's workflow preferences."""
        # Load from database
        state.enabled_features = await db.get_user_features(state.user_id)
        return state

    async def build_custom_workflow(self, state):
        """Build workflow based on user preferences."""

        # Add nodes for enabled features
        if 'email_notifications' in state.enabled_features:
            self.builder.add_node_dynamic(
                self.send_email,
                connect_from='execute',
                connect_to='end'
            )

        if 'sms_notifications' in state.enabled_features:
            self.builder.add_node_dynamic(
                self.send_sms,
                connect_from='execute',
                connect_to='end'
            )

        if 'analytics' in state.enabled_features:
            self.builder.add_node_dynamic(
                self.track_analytics,
                connect_from='execute',
                connect_to='end'
            )

        if 'export' in state.enabled_features:
            self.builder.add_node_dynamic(
                self.export_data,
                connect_from='execute',
                connect_to='end'
            )

        return state
```

### Example 3: A/B Testing Workflows

```python
import random

class ABTestState(StateModel):
    experiment_variant: str = None
    conversion: bool = False

class ABTestAgent(Agent):
    state_model = ABTestState

    def build_graph(self):
        builder = self.start().dynamic(True)

        builder.then(self.assign_variant)
        builder.then(self.build_variant_workflow)
        builder.then(self.track_conversion)

        return builder.end()

    async def assign_variant(self, state):
        """Randomly assign A/B test variant."""
        state.experiment_variant = random.choice(['A', 'B'])
        return state

    async def build_variant_workflow(self, state):
        """Build different workflow for each variant."""

        if state.experiment_variant == 'A':
            # Original workflow
            self.builder.add_node_dynamic(
                self.original_checkout,
                connect_from='build_variant_workflow',
                connect_to='track_conversion'
            )
        else:
            # New experimental workflow
            self.builder.add_node_dynamic(
                self.new_checkout,
                connect_from='build_variant_workflow',
                connect_to='track_conversion'
            )

        return state

    async def original_checkout(self, state):
        # Original checkout process
        return state

    async def new_checkout(self, state):
        # Experimental checkout process
        return state

    async def track_conversion(self, state):
        # Track conversion metrics
        await analytics.track({
            'variant': state.experiment_variant,
            'converted': state.conversion
        })
        return state
```

## Use Cases

### 1. Performance Optimization

```python
async def optimize_based_on_metrics(self, state):
    """Skip expensive nodes if performance is critical."""

    if state.latency_budget_ms < 100:
        # Remove slow operations
        self.builder.remove_node_dynamic('detailed_logging')
        self.builder.remove_node_dynamic('analytics_tracking')
        self.builder.remove_node_dynamic('cache_warming')

    return state
```

### 2. Feature Flags

```python
async def apply_feature_flags(self, state):
    """Add nodes based on feature flags."""

    flags = await get_feature_flags(state.user_id)

    if flags.get('new_recommendation_engine'):
        self.builder.add_node_dynamic(
            self.new_recommendations,
            connect_from='current',
            connect_to='next'
        )
    else:
        self.builder.add_node_dynamic(
            self.legacy_recommendations,
            connect_from='current',
            connect_to='next'
        )

    return state
```

### 3. Conditional Workflows

```python
async def build_conditional_flow(self, state):
    """Build different workflows based on data type."""

    if state.data_type == 'image':
        self.builder.add_node_dynamic(self.process_image)
        self.builder.add_node_dynamic(self.extract_features)
        self.builder.add_node_dynamic(self.classify_image)

    elif state.data_type == 'text':
        self.builder.add_node_dynamic(self.tokenize)
        self.builder.add_node_dynamic(self.analyze_sentiment)
        self.builder.add_node_dynamic(self.extract_entities)

    elif state.data_type == 'video':
        self.builder.add_node_dynamic(self.extract_frames)
        self.builder.add_node_dynamic(self.process_audio)
        self.builder.add_node_dynamic(self.generate_transcript)

    return state
```

## Best Practices

### 1. Validate After Modification

```python
async def modify_and_validate(self, state):
    # Add nodes dynamically
    self.builder.add_node_dynamic(self.custom_step)

    # Validate graph structure
    warnings = self.builder.validate()
    if warnings:
        logger.warning(f"Graph issues: {warnings}")

    return state
```

### 2. Document Dynamic Behavior

```python
async def build_workflow(self, state):
    """
    Build workflow dynamically based on state.

    Dynamic nodes added:
    - If complexity='high': adds 'parallel_processor'
    - If user_tier='premium': adds 'advanced_analytics'
    - If fast_mode=True: removes 'detailed_logging'

    All dynamic modifications happen in this method.
    """
    # ... dynamic logic
```

### 3. Limit Modification Scope

```python
def build_graph(self):
    # Only allow modifications in specific nodes
    builder = self.start().dynamic(True)

    # Modifications only in this node
    builder.then(self.configure_pipeline)

    # Disable dynamic mode after
    builder.dynamic(False)

    builder.then(self.execute)
    return builder.end()
```

### 4. Test Dynamic Variations

```python
async def test_all_variations():
    """Test all possible dynamic variations."""

    variations = [
        {'complexity': 'low', 'tier': 'free'},
        {'complexity': 'high', 'tier': 'free'},
        {'complexity': 'low', 'tier': 'premium'},
        {'complexity': 'high', 'tier': 'premium'},
    ]

    for variant in variations:
        agent = AdaptiveAgent()
        result = await agent.invoke(variant)
        assert result['success']
```

## Limitations

### 1. Cannot Modify Running Workflows

Dynamic modifications only affect new executions:

```python
# Modifications made during execution only affect THIS execution
# Already-compiled graphs are not modified
```

### 2. Requires Dynamic Mode

```python
# Won't work - dynamic mode not enabled
builder = self.start()  # .dynamic(True) missing
builder.add_node_dynamic(...)  # RuntimeError!

# Correct
builder = self.start().dynamic(True)
builder.add_node_dynamic(...)  # Works
```

### 3. State Must Be Managed Carefully

```python
# Be careful with state mutations during dynamic building
async def build_dynamic(self, state):
    # This state is during graph building
    # Not the execution state

    # OK - read state to make decisions
    if state.complexity == 'high':
        self.builder.add_node_dynamic(...)

    # Careful - state mutations here may not persist
    state.built_nodes = [...]  # May be lost

    return state
```

## Troubleshooting

### RuntimeError: Dynamic mode not enabled

**Problem**: Trying to modify graph without enabling dynamic mode

**Solution**:
```python
builder = self.start().dynamic(True)  # Enable dynamic mode
```

### Nodes Not Executing

**Problem**: Dynamically added nodes don't execute

**Solution**: Ensure correct connections:
```python
# Check connections
self.builder.add_node_dynamic(
    self.my_node,
    connect_from='previous_node',  # Must exist!
    connect_to='next_node'  # Must exist!
)
```

### Graph Validation Errors

**Problem**: Dynamic modifications create invalid graph

**Solution**: Validate after modifications:
```python
self.builder.add_node_dynamic(...)
warnings = self.builder.validate()
if warnings:
    # Fix issues
    ...
```

## Related Topics

- [Graph Validation](/advanced/graph-validation) - Validate dynamic graphs
- [Loops](/advanced/loops) - Combine with dynamic nodes
- [Testing](/advanced/testing) - Test dynamic behavior
