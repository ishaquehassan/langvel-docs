# StateModel API Reference

`StateModel` is the base class for defining agent state with Pydantic validation.

## Class: `StateModel`

```python
from langvel.state.base import StateModel
```

### Basic Usage

```python
from langvel.state.base import StateModel
from typing import Optional, List

class MyState(StateModel):
    # Required fields
    query: str
    user_id: str
    
    # Optional fields with defaults
    response: str = ""
    confidence: float = 0.0
    metadata: Optional[dict] = None
    
    # Lists and complex types
    messages: List[str] = []
    tags: List[str] = []
```

### Features

- **Type Safety**: Automatic Pydantic validation
- **Default Values**: Support for default field values
- **Complex Types**: Lists, dicts, nested models
- **Validation**: Custom validators and constraints

### Configuration

```python
class MyState(StateModel):
    query: str
    response: str = ""
    
    class Config:
        # Checkpointing configuration
        checkpointer = 'postgres'  # 'memory', 'postgres', 'redis'
        
        # Interrupts
        interrupts = ['before_save', 'after_classify']
        
        # Additional Pydantic config
        arbitrary_types_allowed = True
        validate_assignment = True
```

### Advanced Example

```python
from pydantic import Field, validator

class AdvancedState(StateModel):
    # Field with validation
    email: str = Field(..., regex=r'^[\w\.-]+@[\w\.-]+\.\w+$')
    age: int = Field(..., ge=0, le=150)
    score: float = Field(default=0.0, ge=0.0, le=1.0)
    
    # Custom validator
    @validator('email')
    def email_must_be_lowercase(cls, v):
        return v.lower()
```

## See Also

- [Agent API](/api-reference/agent) - Use state in agents
- [State Models Guide](/architecture/state-models) - Learn more
