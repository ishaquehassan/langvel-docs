# MCP Manager API Reference

Integrate Model Context Protocol servers.

## Class: `MCPManager`

```python
from langvel.mcp.manager import MCPManager
```

### Configuration

```python
# config/langvel.py
MCP_SERVERS = {
    'slack': {
        'command': 'npx',
        'args': ['-y', '@modelcontextprotocol/server-slack'],
        'env': {'SLACK_BOT_TOKEN': os.getenv('SLACK_BOT_TOKEN')}
    }
}
```

### Methods

#### `call_tool()`

```python
mcp = MCPManager()
result = await mcp.call_tool(
    server='slack',
    tool_name='send_message',
    params={'channel': '#general', 'text': 'Hello'}
)
```

## See Also

- [MCP Servers Guide](/advanced/mcp-servers)
- [Tools API](/api-reference/tools)
