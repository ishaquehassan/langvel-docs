# Quick Start

Build your first Langvel agent in 5 minutes! This guide will walk you through creating a simple but powerful customer support agent.

## Prerequisites

Make sure you've [installed Langvel](/getting-started/installation) and configured your API keys.

## Step 1: Create Your First Agent

Use the CLI to generate a new agent:

```bash
langvel make:agent CustomerSupport
```

This creates `app/agents/customer_support.py`:

```python
from langvel.core.agent import Agent
from langvel.state.base import StateModel

class CustomerSupportAgent(Agent):
    """
    CustomerSupport Agent
    """

    def build_graph(self):
        return self.start().then(self.handle).end()

    async def handle(self, state):
        # Your logic here
        return state
```

## Step 2: Define Your State Model

Create a state model to define the data your agent will work with:

```bash
langvel make:state CustomerSupportState
```

Edit `app/models/customer_support_state.py`:

```python
from langvel.state.base import StateModel
from typing import Optional

class CustomerSupportState(StateModel):
    """Customer support conversation state"""

    # Input
    query: str
    user_id: str

    # Processing
    category: Optional[str] = None
    retrieved_docs: Optional[list] = None

    # Output
    response: str = ""
    confidence: float = 0.0
```

## Step 3: Build Your Agent Logic

Update your agent to use the state model and LLM:

```python
from langvel.core.agent import Agent
from app.models.customer_support_state import CustomerSupportState

class CustomerSupportAgent(Agent):
    """Customer support agent with classification and response generation"""

    state_model = CustomerSupportState

    def build_graph(self):
        return (
            self.start()
            .then(self.classify_query)
            .then(self.generate_response)
            .end()
        )

    async def classify_query(self, state: CustomerSupportState):
        """Classify the customer query into a category"""

        prompt = f"""
        Classify this customer query into one of these categories:
        - billing
        - technical
        - general

        Query: {state.query}

        Respond with just the category name.
        """

        category = await self.llm.invoke(prompt)
        state.category = category.strip().lower()

        return state

    async def generate_response(self, state: CustomerSupportState):
        """Generate a helpful response"""

        system_prompt = f"""
        You are a helpful customer support agent.
        Category: {state.category}
        Provide a clear, friendly response.
        """

        response = await self.llm.invoke(
            prompt=state.query,
            system_prompt=system_prompt
        )

        state.response = response
        state.confidence = 0.9

        return state
```

## Step 4: Test Your Agent

Run your agent directly:

```bash
langvel agent test customer-support -i '{
  "query": "How do I reset my password?",
  "user_id": "user123"
}'
```

Or test it in Python:

```python
import asyncio
from app.agents.customer_support import CustomerSupportAgent

async def main():
    agent = CustomerSupportAgent()

    result = await agent.invoke({
        "query": "How do I reset my password?",
        "user_id": "user123"
    })

    print(f"Category: {result['category']}")
    print(f"Response: {result['response']}")

asyncio.run(main())
```

Expected output:

```
Category: technical
Response: To reset your password, click 'Forgot Password' on the login page...
```

## Step 5: Add Middleware

Add logging and rate limiting:

```python
class CustomerSupportAgent(Agent):
    state_model = CustomerSupportState
    middleware = ['logging', 'rate_limit']  # Add middleware

    # ... rest of your code
```

## Step 6: Create a Route

Make your agent accessible via HTTP:

```python
# routes/agent.py
from langvel.routing.router import router
from app.agents.customer_support import CustomerSupportAgent

@router.flow('/customer-support', middleware=['auth'])
class CustomerSupportFlow(CustomerSupportAgent):
    pass
```

## Step 7: Start the Server

Run the development server:

```bash
langvel agent serve --port 8000
```

Visit http://localhost:8000/docs to see the auto-generated API documentation!

## Step 8: Call Your Agent via HTTP

Test the HTTP endpoint:

```bash
curl -X POST http://localhost:8000/agents/customer-support \
  -H "Content-Type: application/json" \
  -d '{
    "input": {
      "query": "How do I reset my password?",
      "user_id": "user123"
    }
  }'
```

Response:

```json
{
  "output": {
    "query": "How do I reset my password?",
    "user_id": "user123",
    "category": "technical",
    "response": "To reset your password...",
    "confidence": 0.9
  }
}
```

## Step 9: Add Streaming

Enable streaming for real-time responses:

```python
async def generate_response(self, state: CustomerSupportState):
    """Generate streaming response"""

    system_prompt = f"You are a helpful support agent. Category: {state.category}"

    # Stream the response
    full_response = ""
    async for chunk in self.llm.stream(
        prompt=state.query,
        system_prompt=system_prompt
    ):
        full_response += chunk
        print(chunk, end="", flush=True)

    state.response = full_response
    return state
```

Test streaming via HTTP:

```bash
curl -X POST http://localhost:8000/agents/customer-support \
  -H "Content-Type: application/json" \
  -d '{
    "input": {...},
    "stream": true
  }'
```

## Step 10: Visualize Your Agent

Generate a visual representation of your agent's workflow:

```bash
langvel agent graph customer-support -o graph.png
```

This creates a diagram showing your agent's nodes and edges!

## What You've Learned

In just 10 steps, you've:

- ✅ Created an agent with the CLI
- ✅ Defined a typed state model
- ✅ Built a multi-step workflow
- ✅ Used the built-in LLM (`self.llm`)
- ✅ Added middleware for logging and rate limiting
- ✅ Exposed your agent via HTTP
- ✅ Enabled streaming responses
- ✅ Visualized your agent's graph

## Next Steps

Now that you've built your first agent, explore more advanced features:

### Add RAG (Retrieval)

```python
from langvel.tools.decorators import rag_tool

class CustomerSupportAgent(Agent):
    # ...

    @rag_tool(collection='knowledge_base', k=5)
    async def search_knowledge(self, state: CustomerSupportState):
        # Retrieved docs automatically added to state
        return state

    def build_graph(self):
        return (
            self.start()
            .then(self.classify_query)
            .then(self.search_knowledge)  # Add RAG step
            .then(self.generate_response)
            .end()
        )
```

### Add Authentication

```python
from langvel.auth.decorators import requires_auth, requires_permission

class CustomerSupportAgent(Agent):
    # ...

    @requires_auth
    @requires_permission('support.respond')
    async def generate_response(self, state: CustomerSupportState):
        # Only authenticated users with permission can access
        return state
```

### Add Conditional Logic

```python
def build_graph(self):
    return (
        self.start()
        .then(self.classify_query)
        .branch(
            self.should_search_kb,
            {
                True: self.search_knowledge,
                False: self.use_default
            }
        )
        .then(self.generate_response)
        .end()
    )

def should_search_kb(self, state: CustomerSupportState) -> bool:
    # Search KB for technical and billing queries
    return state.category in ['technical', 'billing']
```

### Connect External Tools (MCP)

```python
from langvel.tools.decorators import mcp_tool

class CustomerSupportAgent(Agent):
    # ...

    @mcp_tool(server='slack', tool_name='send_message')
    async def notify_team(self, state: CustomerSupportState):
        # Automatically calls Slack MCP server
        return state
```

## Full Example

Here's a complete, production-ready agent:

```python
from langvel.core.agent import Agent
from langvel.state.base import StateModel
from langvel.tools.decorators import rag_tool, mcp_tool
from langvel.auth.decorators import requires_auth, rate_limit
from typing import Optional

class CustomerSupportState(StateModel):
    query: str
    user_id: str
    category: Optional[str] = None
    retrieved_docs: Optional[list] = None
    response: str = ""
    confidence: float = 0.0
    escalated: bool = False

class CustomerSupportAgent(Agent):
    """Production-ready customer support agent"""

    state_model = CustomerSupportState
    middleware = ['logging', 'auth', 'rate_limit']

    def build_graph(self):
        return (
            self.start()
            .then(self.classify_query)
            .branch(
                self.should_search,
                {True: self.search_knowledge, False: self.skip_search}
            )
            .then(self.generate_response)
            .branch(
                self.should_escalate,
                {True: self.escalate_to_human, False: self.end_conversation}
            )
            .end()
        )

    @rate_limit(max_requests=10, window=60)
    async def classify_query(self, state: CustomerSupportState):
        prompt = f"Classify: {state.query} (billing/technical/general)"
        state.category = (await self.llm.invoke(prompt)).strip().lower()
        return state

    @rag_tool(collection='support_docs', k=5)
    async def search_knowledge(self, state: CustomerSupportState):
        # Documents automatically retrieved
        return state

    @requires_auth
    async def generate_response(self, state: CustomerSupportState):
        context = state.retrieved_docs or []
        prompt = f"Query: {state.query}\nContext: {context}"
        state.response = await self.llm.invoke(
            prompt=prompt,
            system_prompt=f"Category: {state.category}"
        )
        state.confidence = 0.85
        return state

    @mcp_tool(server='slack', tool_name='send_message')
    async def escalate_to_human(self, state: CustomerSupportState):
        state.escalated = True
        return state

    async def skip_search(self, state: CustomerSupportState):
        return state

    async def end_conversation(self, state: CustomerSupportState):
        return state

    def should_search(self, state: CustomerSupportState) -> bool:
        return state.category in ['technical', 'billing']

    def should_escalate(self, state: CustomerSupportState) -> bool:
        return state.confidence < 0.7
```

## Learn More

- **[Configuration →](/getting-started/configuration)** - Configure LLM, RAG, MCP
- **[Agents →](/architecture/agents)** - Deep dive into agent architecture
- **[Routing →](/the-basics/routing)** - Learn about routing and HTTP APIs
- **[Middleware →](/the-basics/middleware)** - Add cross-cutting concerns
- **[Tools →](/the-basics/tools)** - Create custom tools
- **[RAG →](/advanced/rag-integration)** - Add retrieval-augmented generation
- **[Multi-Agent →](/advanced/multi-agent)** - Coordinate multiple agents

## Need Help?

- 💬 [Join Discord](https://discord.gg/langvel)
- 📚 [Read Documentation](/getting-started/installation)
- 💡 [View Examples](https://github.com/yourusername/langvel/tree/main/app/agents)
