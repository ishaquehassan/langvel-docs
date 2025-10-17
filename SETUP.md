# Langvel Documentation Setup Guide

🎉 **Congratulations!** Your Laravel-style documentation site is ready!

## 🚀 Running the Documentation

### Development Server

Start the development server with hot-reload:

```bash
npm run docs:dev
```

Visit: **http://localhost:5173/**

### Build for Production

Build static files for deployment:

```bash
npm run docs:build
```

Output directory: `docs/.vitepress/dist/`

### Preview Production Build

Preview the production build locally:

```bash
npm run docs:preview
```

## 📁 Documentation Structure

```
langvel-docs/
├── docs/
│   ├── .vitepress/
│   │   └── config.mts              # ✅ Navigation & theme config
│   │
│   ├── getting-started/
│   │   ├── introduction.md         # ✅ What is Langvel
│   │   ├── installation.md         # ✅ Complete install guide
│   │   ├── quick-start.md          # ✅ 5-minute tutorial
│   │   ├── configuration.md        # ✅ Full config reference
│   │   └── directory-structure.md  # ✅ Project layout
│   │
│   ├── architecture/
│   │   ├── agents.md               # ✅ Complete agent guide
│   │   ├── state-models.md         # 📝 Placeholder
│   │   ├── graph-building.md       # 📝 Placeholder
│   │   ├── lifecycle.md            # 📝 Placeholder
│   │   └── service-container.md    # 📝 Placeholder
│   │
│   ├── the-basics/
│   │   ├── routing.md              # 📝 Placeholder
│   │   ├── middleware.md           # 📝 Placeholder
│   │   ├── tools.md                # 📝 Placeholder
│   │   ├── llm-integration.md      # 📝 Placeholder
│   │   ├── cli-commands.md         # 📝 Placeholder
│   │   ├── error-handling.md       # 📝 Placeholder
│   │   └── logging.md              # 📝 Placeholder
│   │
│   ├── advanced/                   # 📝 All placeholders
│   ├── deployment/                 # 📝 All placeholders
│   ├── api-reference/              # 📝 All placeholders
│   ├── tutorials/                  # 📝 All placeholders
│   │
│   └── index.md                    # ✅ Homepage
│
├── package.json                    # ✅ NPM scripts configured
├── README.md                       # ✅ Contributing guide
├── SETUP.md                        # ✅ This file
└── .gitignore                      # ✅ Git ignore rules
```

## ✅ What's Complete

### Homepage
- ✨ Beautiful hero section with features
- 📊 Quick start code examples
- 💬 Testimonials section
- 🎯 "Why Langvel?" section

### Getting Started (Fully Written)
1. **Introduction** - What is Langvel, why use it, philosophy
2. **Installation** - Multiple install methods, troubleshooting
3. **Quick Start** - Complete 10-step tutorial with code
4. **Configuration** - Every config option explained
5. **Directory Structure** - Complete project layout guide

### Architecture
1. **Agents** - Complete guide with examples (✅)
2. State Models - Placeholder (📝)
3. Graph Building - Placeholder (📝)
4. Lifecycle - Placeholder (📝)
5. Service Container - Placeholder (📝)

### Navigation & Theme
- ✅ Full sidebar navigation configured
- ✅ Top navigation with version dropdown
- ✅ Search enabled (local search)
- ✅ Edit links to GitHub
- ✅ Social links (GitHub, Discord)
- ✅ Dark/light mode
- ✅ Mobile responsive

## 📝 Next Steps - Completing the Documentation

### Priority 1: The Basics (Most Used)

```bash
# Copy these from main Langvel README/docs
docs/the-basics/routing.md           # How to expose agents via HTTP
docs/the-basics/middleware.md        # Creating middleware
docs/the-basics/tools.md             # Tool decorators
docs/the-basics/llm-integration.md   # Using self.llm
docs/the-basics/cli-commands.md      # CLI reference
```

### Priority 2: Advanced Topics

```bash
docs/advanced/rag-integration.md     # Vector stores & RAG
docs/advanced/mcp-servers.md         # MCP integration
docs/advanced/multi-agent.md         # Agent coordination
docs/advanced/authentication.md      # JWT & API keys
docs/advanced/observability.md       # LangSmith/Langfuse
```

### Priority 3: Architecture Deep Dives

```bash
docs/architecture/state-models.md    # Pydantic state models
docs/architecture/graph-building.md  # Complex workflows
docs/architecture/lifecycle.md       # Agent lifecycle
```

### Priority 4: Deployment

```bash
docs/deployment/production.md        # Production guide
docs/deployment/docker.md            # Containerization
docs/deployment/security.md          # Security best practices
```

### Priority 5: API Reference

```bash
docs/api-reference/agent.md          # Agent API
docs/api-reference/state-model.md    # StateModel API
docs/api-reference/router.md         # Router API
# etc...
```

### Priority 6: Tutorials

```bash
docs/tutorials/customer-support.md   # Full tutorial
docs/tutorials/code-review.md        # Full tutorial
docs/tutorials/multi-agent-research.md
docs/tutorials/rag-qa.md
```

## 🎨 Customization

### Update Theme Colors

Edit `docs/.vitepress/config.mts`:

```ts
themeConfig: {
  // Change primary color
  // Add custom CSS in docs/.vitepress/theme/custom.css
}
```

### Add Custom Components

Create `docs/.vitepress/theme/index.ts`:

```ts
import DefaultTheme from 'vitepress/theme'
import CustomComponent from './CustomComponent.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('CustomComponent', CustomComponent)
  }
}
```

### Update Logo

Add logo to `docs/public/logo.svg`

## 🚀 Deployment Options

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

### Netlify

```bash
# Build command
npm run docs:build

# Publish directory
docs/.vitepress/dist
```

### GitHub Pages

```yaml
# .github/workflows/deploy.yml
name: Deploy Docs

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run docs:build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: docs/.vitepress/dist
```

### CloudFlare Pages

1. Connect GitHub repo
2. Build command: `npm run docs:build`
3. Build output: `docs/.vitepress/dist`

## 📊 Analytics

Add Google Analytics or Plausible:

```ts
// docs/.vitepress/config.mts
export default defineConfig({
  head: [
    ['script', {
      src: 'https://plausible.io/js/script.js',
      'data-domain': 'langvel.dev'
    }]
  ]
})
```

## 🔍 SEO

The site is already SEO-optimized with:
- ✅ Meta descriptions
- ✅ Semantic HTML
- ✅ Sitemap (auto-generated)
- ✅ Social cards (configure in config.mts)

## 📱 Mobile Testing

Test on mobile devices:

```bash
npm run docs:dev -- --host
```

Then access from your phone using your computer's local IP.

## 🎯 Writing Tips

### Use Callouts

```md
::: tip
This is a helpful tip
:::

::: warning
Be careful with this
:::

::: danger
This is dangerous!
:::
```

### Code Groups

```md
::: code-group

```python [Anthropic]
LLM_PROVIDER = 'anthropic'
```

```python [OpenAI]
LLM_PROVIDER = 'openai'
```

:::
```

### Custom Containers

```md
::: details Click to expand
Hidden content here
:::
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run docs:dev -- --port 5174
```

### Build Errors

```bash
# Clear cache
rm -rf docs/.vitepress/cache
rm -rf docs/.vitepress/dist

# Reinstall
rm -rf node_modules
npm install
```

## 📚 Resources

- [VitePress Docs](https://vitepress.dev/)
- [Laravel Docs](https://laravel.com/docs) - Inspiration
- [Markdown Guide](https://www.markdownguide.org/)

## 🎉 You're All Set!

Your documentation is live at: **http://localhost:5173/**

Start writing content by editing the placeholder files, and the site will hot-reload automatically!

---

**Need help?** Open an issue or reach out in Discord!
