# LLM Manager API Reference

Manage LLM interactions with multiple providers.

## Class: `LLMManager`

```python
from langvel.llm.manager import LLMManager
```

### Initialization

```python
llm = LLMManager(
    provider='anthropic',  # or 'openai'
    model='claude-3-5-sonnet-20241022',
    temperature=0.7,
    max_tokens=4096
)
```

### Methods

#### `invoke()`

```python
response = await llm.invoke(
    prompt="What is Python?",
    system_prompt="You are a helpful teacher"
)
```

#### `stream()`

```python
async for chunk in llm.stream("Tell me a story"):
    print(chunk, end="")
```

#### `chat()`

```python
messages = [
    {"role": "user", "content": "Hi"},
    {"role": "assistant", "content": "Hello!"},
    {"role": "user", "content": "How are you?"}
]
response = await llm.chat(messages)
```

#### `with_structured_output()`

```python
from pydantic import BaseModel

class Analysis(BaseModel):
    sentiment: str
    confidence: float

structured_llm = llm.with_structured_output(Analysis)
result = await structured_llm.ainvoke("Analyze: Great product!")
print(result.sentiment, result.confidence)
```

## Usage in Agents

```python
class MyAgent(Agent):
    async def process(self, state):
        # self.llm is automatically available
        response = await self.llm.invoke(state.query)
        state.response = response
        return state
```

## Supported Providers

- **Anthropic**: Claude 3.5 Sonnet, Opus, Haiku
- **OpenAI**: GPT-4, GPT-4 Turbo, GPT-3.5

## See Also

- [LLM Integration Guide](/the-basics/llm-integration)
- [Configuration](/getting-started/configuration)
