# Auth Manager API Reference

Handle authentication and authorization.

## Class: `AuthManager`

```python
from langvel.auth.manager import get_auth_manager

auth = get_auth_manager()
```

### JWT Tokens

#### `create_token()`

```python
token = auth.create_token(
    user_id="user123",
    permissions=["read", "write"]
)
```

#### `verify_token()`

```python
try:
    data = auth.verify_token(token)
    print(data.user_id, data.permissions)
except Exception as e:
    print("Invalid token")
```

### API Keys

#### `create_api_key()`

```python
api_key = auth.create_api_key(
    name="Production API",
    permissions=["api.*"]
)
```

#### `verify_api_key()`

```python
key_data = auth.verify_api_key(api_key)
```

### Decorators

```python
from langvel.auth.decorators import requires_auth, requires_permission, rate_limit

class MyAgent(Agent):
    @requires_auth
    async def secure_method(self, state):
        pass
    
    @requires_permission('admin')
    async def admin_method(self, state):
        pass
    
    @rate_limit(max_requests=10, window=60)
    async def limited_method(self, state):
        pass
```

## Configuration

```python
# config/langvel.py
JWT_SECRET_KEY = "your-secret-key"
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24
```

## See Also

- [Authentication Guide](/advanced/authentication)
- [Authorization Guide](/advanced/authorization)
