# Observability

Langvel provides automatic tracing and observability for your AI agents through LangSmith and Langfuse integration. Track every execution, LLM call, tool usage, and performance metric in real-time.

## Why Observability Matters

AI agents are complex systems with multiple steps, LLM calls, and tool executions. Without observability:
- Hard to debug failures
- Impossible to optimize performance
- Difficult to track costs
- No visibility into agent behavior

With Langvel's built-in observability:
- See every step of agent execution
- Track token usage and costs
- Identify performance bottlenecks
- Debug with detailed traces
- Monitor production agents

## LangSmith Integration

LangSmith is the official observability platform from LangChain, providing powerful tracing and debugging capabilities.

**[📊 Sign up for LangSmith](https://smith.langchain.com)** - Free tier available!

### Quick Setup

1. **Get Your API Key**
   - Sign up at [smith.langchain.com](https://smith.langchain.com)
   - Go to Settings → API Keys
   - Create and copy your API key

2. **Configure Environment Variables**

Add to your `.env` file:

```bash
# LangSmith Configuration
LANGSMITH_API_KEY=lsv2_pt_xxxxx  # Your actual key
LANGCHAIN_TRACING_V2=true
LANGCHAIN_PROJECT=my-agent-project
LANGSMITH_ENDPOINT=https://api.smith.langchain.com
```

3. **That's It!**

All your agents now automatically send traces to LangSmith. No code changes needed!

### What You'll See in LangSmith

Every agent execution creates a trace showing:

#### 1. Overall Execution
- Total execution time
- Input and output data
- Success/failure status
- Error messages (if any)

#### 2. Detailed Spans
- Each node in your workflow
- Function calls and duration
- Input/output for each step
- State transitions

#### 3. LLM Calls
- Model used (e.g., `claude-3-5-sonnet-20241022`)
- Full prompts sent
- Complete responses
- Token usage (input/output)
- Estimated costs

#### 4. Tool Executions
- Tool name and type
- Input parameters
- Output results
- Success/failure status
- Execution time

#### 5. Workflow Visualization
- Visual graph of execution flow
- Which paths were taken
- Conditional branches
- Error locations

### Example Trace

```
CustomerSupportAgent (15.2s)
├─ classify_request (0.1s)
│  └─ Input: query="I'm having trouble..."
│  └─ Output: category="technical"
├─ analyze_sentiment (0.05s)
│  └─ sentiment=0.4
├─ search_knowledge (0.3s)
│  └─ RAG retrieval
├─ handle_technical (0.02s)
├─ generate_response (14.5s)
│  └─ LLM Call
│     ├─ Model: claude-3-5-sonnet-20241022
│     ├─ Prompt: "Customer Query..."
│     ├─ Response: "I understand you're having..."
│     ├─ Tokens: 245 input, 180 output
│     └─ Cost: $0.003
└─ notify_slack (0.1s)
```

### Organizing Traces

Use different projects for different environments:

```bash
# Production
LANGCHAIN_PROJECT=my-agent-production

# Development
LANGCHAIN_PROJECT=my-agent-development

# Testing
LANGCHAIN_PROJECT=my-agent-testing
```

### Custom Metadata

Add custom metadata to traces for better filtering:

```python
from langvel.observability.tracer import get_observability_manager

obs_manager = get_observability_manager()
obs_manager.start_trace(
    name="my_agent",
    input_data=input_data,
    metadata={
        "user_id": "user_123",
        "environment": "production",
        "version": "v1.2.3",
        "feature_flags": ["new_ui", "enhanced_search"]
    }
)
```

Then filter by these fields in the LangSmith dashboard!

## Langfuse Integration (Optional)

Langvel also supports Langfuse for observability:

```bash
# Add to .env
LANGFUSE_PUBLIC_KEY=pk-lf-xxxxx
LANGFUSE_SECRET_KEY=sk-lf-xxxxx
LANGFUSE_HOST=https://cloud.langfuse.com
```

Langfuse provides:
- Similar tracing capabilities
- Different UI/UX
- Additional analytics features
- Self-hosting options

Choose based on your preference - both work seamlessly with Langvel!

## Performance Optimization

Use traces to identify bottlenecks:

### Common Issues

**Slow LLM Calls**
- Consider using faster models for simple tasks
- Use streaming for better UX
- Cache frequent queries

**Slow Tool Execution**
- Add timeout limits
- Implement caching
- Use parallel execution where possible

**Memory Issues**
- Check state size in traces
- Reduce unnecessary data in state
- Use checkpointers for long-running agents

### Example: Finding Bottlenecks

```bash
# In LangSmith dashboard:
1. Sort traces by duration
2. Click slowest trace
3. Expand execution tree
4. Find the longest-running step
5. Optimize that step
```

## Monitoring Production Agents

### Key Metrics to Track

- **Success Rate**: % of successful executions
- **Average Duration**: Time per execution
- **Token Usage**: Total tokens consumed
- **Error Rate**: % of failed executions
- **Tool Usage**: Which tools are called most

### Setting Up Alerts

LangSmith allows you to set up alerts for:
- Failed executions
- Slow traces (> threshold)
- High token usage
- Specific error types

## Cost Tracking

Every LLM call in traces shows:
- Tokens used (input/output)
- Estimated cost
- Model used

Track spending by:
- Project (dev vs prod)
- User/customer
- Feature
- Time period

## Privacy and Security

**What Gets Logged:**
- Inputs and outputs
- LLM prompts and responses
- Tool parameters and results
- State data

**Best Practices:**
- Don't log sensitive data (passwords, API keys)
- Filter PII before logging
- Use separate projects for sensitive workloads
- Review LangSmith's security policies

**Filtering Sensitive Data:**

```python
# Redact sensitive data before agent execution
def redact_sensitive(data: dict) -> dict:
    sensitive_fields = ['password', 'api_key', 'ssn']
    return {
        k: '***REDACTED***' if k in sensitive_fields else v
        for k, v in data.items()
    }

# Use in your agent
input_data = redact_sensitive(user_input)
result = await agent.invoke(input_data)
```

## Troubleshooting

### Traces Not Appearing

**Check these:**
1. `LANGCHAIN_TRACING_V2=true` is set
2. `LANGSMITH_API_KEY` is valid
3. No firewall blocking `api.smith.langchain.com`
4. Wait 5-10 seconds for traces to appear

### Authentication Errors

```
Error: 403 Forbidden
```

**Fix:**
- Regenerate API key in LangSmith dashboard
- Update `.env` file
- Restart your application

### High Costs

**Reduce tracing costs:**
- Sample production traffic (trace 10% of requests)
- Use separate projects for dev (don't trace everything)
- Set retention policies
- Filter out health checks

## Best Practices

### 1. Use Descriptive Project Names

```bash
# Good
LANGCHAIN_PROJECT=customer-support-prod
LANGCHAIN_PROJECT=analytics-agent-dev

# Bad
LANGCHAIN_PROJECT=project1
LANGCHAIN_PROJECT=test
```

### 2. Add Context with Metadata

```python
metadata = {
    "user_id": user.id,
    "request_id": request_id,
    "feature": "chat",
    "version": "2.1.0"
}
```

### 3. Monitor Key Paths

Focus on:
- Critical user-facing agents
- High-cost LLM operations
- Error-prone workflows

### 4. Regular Reviews

- Weekly: Review failed traces
- Monthly: Analyze performance trends
- Quarterly: Optimize high-cost operations

## Example Setup Script

Here's a complete setup script for LangSmith:

```python
import os
from pathlib import Path
from dotenv import load_dotenv

def setup_observability():
    """Setup LangSmith observability"""
    env_path = Path('.env')

    # Check if already configured
    load_dotenv()
    if os.getenv('LANGSMITH_API_KEY'):
        print("✓ LangSmith already configured")
        return

    # Prompt for API key
    print("📊 LangSmith Setup")
    print("Get your API key: https://smith.langchain.com/settings")
    api_key = input("Enter your LangSmith API key: ").strip()

    if not api_key:
        print("⚠️  Setup cancelled")
        return

    # Save to .env
    from dotenv import set_key
    set_key(str(env_path), 'LANGSMITH_API_KEY', api_key)
    set_key(str(env_path), 'LANGCHAIN_TRACING_V2', 'true')
    set_key(str(env_path), 'LANGCHAIN_PROJECT', 'my-agents')

    print("✓ LangSmith configured!")
    print(f"View traces: https://smith.langchain.com")

if __name__ == "__main__":
    setup_observability()
```

## Resources

- **[LangSmith Documentation](https://docs.smith.langchain.com)** - Official LangSmith docs
- **[LangSmith Platform](https://smith.langchain.com)** - Dashboard and signup
- **[Langfuse Documentation](https://langfuse.com/docs)** - Alternative observability platform
- **[Complete Setup Guide](https://github.com/ishaquehassan/langvel/blob/main/LANGSMITH_SETUP.md)** - Detailed LangSmith setup

## Next Steps

1. ✅ Set up LangSmith API key
2. ✅ Configure environment variables
3. ✅ Run your first agent
4. 📊 View traces in dashboard
5. 🔍 Identify optimization opportunities
6. 🚀 Monitor production agents

With observability in place, you have full visibility into your AI agents. Happy debugging!
