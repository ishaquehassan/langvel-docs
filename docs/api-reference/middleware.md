# Middleware API Reference

Add cross-cutting concerns to agents.

## Class: `Middleware`

```python
from langvel.middleware.base import Middleware
```

### Basic Structure

```python
class MyMiddleware(Middleware):
    async def before(self, state):
        # Run before agent execution
        print("Before:", state)
        return state
    
    async def after(self, state):
        # Run after agent execution
        print("After:", state)
        return state
```

### Using Middleware

```python
class MyAgent(Agent):
    middleware = ['logging', 'auth', 'rate_limit', 'my_custom']
```

### Built-in Middleware

- **logging**: Structured logging
- **auth**: Authentication check
- **rate_limit**: Rate limiting

## See Also

- [Middleware Guide](/the-basics/middleware)
- [Agent API](/api-reference/agent)
