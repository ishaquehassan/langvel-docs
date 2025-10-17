# Router API Reference

Define HTTP routes for agents.

## Class: `AgentRouter`

```python
from langvel.routing.router import router
```

### Basic Route

```python
@router.flow('/my-agent')
class MyAgentFlow(MyAgent):
    pass
```

### With Middleware

```python
@router.flow('/secure-agent', middleware=['auth', 'rate_limit'])
class SecureAgentFlow(MyAgent):
    pass
```

### Route Groups

```python
with router.group(prefix='/api/v1', middleware=['auth']):
    @router.flow('/users')
    class UsersFlow(UsersAgent):
        pass
    
    @router.flow('/posts')
    class PostsFlow(PostsAgent):
        pass
```

## HTTP Endpoints

Routes automatically expose:

```
POST /agents/{agent_name}
```

**Request**:
```json
{
  "input": {"query": "test"},
  "stream": false
}
```

**Response**:
```json
{
  "output": {"query": "test", "response": "..."}
}
```

## See Also

- [Routing Guide](/the-basics/routing)
- [Agent API](/api-reference/agent)
