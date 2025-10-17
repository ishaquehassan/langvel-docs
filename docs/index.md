---
layout: home

hero:
  name: "Langvel"
  text: "Laravel-Inspired LangGraph Framework"
  tagline: Build powerful AI agents with familiar, elegant syntax
  image:
    src: /logo.svg
    alt: Langvel
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started/installation
    - theme: alt
      text: View on GitHub
      link: https://github.com/ishaquehassan/langvel

features:
  - icon: 🎯
    title: Laravel-Inspired DX
    details: Familiar routing, middleware, and service provider patterns that Laravel developers love
  - icon: 🔧
    title: Full LangGraph Power
    details: Access all LangGraph capabilities with elegant abstractions and zero configuration
  - icon: 🤖
    title: Built-in LLM Support
    details: Every agent has self.llm ready to use with Claude, GPT-4, and more providers
  - icon: 🧠
    title: RAG Integration
    details: Built-in support for vector stores, embeddings, and retrieval-augmented generation
  - icon: 🔌
    title: MCP Servers
    details: Seamless Model Context Protocol integration for external tools and services
  - icon: 🛠️
    title: Tool System
    details: Full execution engine with retry, fallback, timeout, and custom tool decorators
  - icon: 🔐
    title: Authentication & Auth
    details: JWT tokens, API keys, RBAC, and session management out of the box
  - icon: 📊
    title: Observability
    details: LangSmith and Langfuse integration with structured JSON logging
  - icon: ⚡
    title: CLI Tool
    details: Artisan-style commands for scaffolding, testing, and managing your agents
---

## Quick Start

::: code-group

```bash [Installation]
# Clone and setup
git clone https://github.com/ishaquehassan/langvel.git
cd langvel
python setup.py

# Activate environment
source venv/bin/activate
```

```python [Create Agent]
# Generate a new agent
langvel make:agent CustomerSupport

# app/agents/customer_support.py
from langvel.core.agent import Agent
from langvel.state.base import StateModel

class CustomerSupportState(StateModel):
    query: str
    response: str = ""

class CustomerSupportAgent(Agent):
    state_model = CustomerSupportState

    def build_graph(self):
        return (
            self.start()
            .then(self.process)
            .end()
        )

    async def process(self, state):
        response = await self.llm.invoke(
            f"Answer: {state.query}"
        )
        state.response = response
        return state
```

```bash [Run Agent]
# Start the server
langvel agent serve --port 8000

# Or run directly
python -c "
import asyncio
from app.agents.customer_support import CustomerSupportAgent

async def main():
    agent = CustomerSupportAgent()
    result = await agent.invoke({
        'query': 'How do I reset my password?'
    })
    print(result)

asyncio.run(main())
"
```

:::

## Why Langvel?

<div class="why-langvel">

### 🚀 Developer Experience First

Built by developers who love Laravel's elegance. Every API is designed to feel intuitive and joyful to use.

### 💪 Production Ready

Type-safe with Pydantic, comprehensive error handling, structured logging, and battle-tested patterns.

### 🎨 Full Featured

Everything you need: RAG, MCP, multi-agent coordination, authentication, observability, and more.

### 📚 Well Documented

Extensive guides, tutorials, API references, and real-world examples to get you productive fast.

</div>

## What's Next?

<div class="next-steps">

- **[Installation](/getting-started/installation)** - Get Langvel installed and configured
- **[Quick Start](/getting-started/quick-start)** - Build your first agent in 5 minutes
- **[Architecture](/architecture/agents)** - Learn core concepts and patterns
- **[Examples](/tutorials/customer-support)** - Follow step-by-step tutorials

</div>

<style>
.why-langvel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.why-langvel > div {
  padding: 1.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}

.next-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}
</style>
