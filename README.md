# Langvel Documentation

Official documentation for [Langvel](https://github.com/yourusername/langvel) - A Laravel-inspired framework for building LangGraph agents.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run docs:dev

# Build for production
npm run docs:build

# Preview production build
npm run docs:preview
```

## 📁 Structure

```
docs/
├── .vitepress/
│   └── config.mts          # VitePress configuration
├── getting-started/         # Installation, Quick Start, Configuration
├── architecture/            # Agents, State Models, Graph Building
├── the-basics/             # Routing, Middleware, Tools, CLI
├── advanced/               # RAG, MCP, Multi-Agent, Auth
├── deployment/             # Production, Docker, Security
├── api-reference/          # API documentation
├── tutorials/              # Step-by-step guides
└── index.md               # Homepage
```

## 📝 Contributing

### Adding a New Page

1. Create a new `.md` file in the appropriate directory
2. Add front matter if needed:
   ```md
   ---
   title: Page Title
   description: Page description
   ---
   ```
3. Write your content using Markdown
4. Add the page to navigation in `.vitepress/config.mts`

### Code Examples

Use code blocks with syntax highlighting:

````md
```python
from langvel.core.agent import Agent

class MyAgent(Agent):
    pass
```
````

### Callouts

Use built-in callouts:

```md
::: tip
This is a tip
:::

::: warning
This is a warning
:::

::: danger
This is dangerous
:::
```

### Code Groups

Show multiple examples side by side:

````md
::: code-group

```python [Example 1]
# Code here
```

```python [Example 2]
# Code here
```

:::
````

## 🎨 Styling

The docs use VitePress's default theme with custom configuration. To customize:

- Edit `.vitepress/config.mts` for theme configuration
- Add custom CSS in `.vitepress/theme/custom.css`
- Override components in `.vitepress/theme/`

## 🔗 Links

- [Langvel GitHub](https://github.com/yourusername/langvel)
- [VitePress Documentation](https://vitepress.dev/)
- [Discord Community](https://discord.gg/langvel)

## 📄 License

MIT License - see LICENSE file for details.
