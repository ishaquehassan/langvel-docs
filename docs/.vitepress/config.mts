import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Langvel",
  description: "A Laravel-inspired framework for building LangGraph agents",
  base: '/langvel-docs/', // GitHub Pages base path

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: {
      light: '/assets/logo-for-light.png',
      dark: '/assets/logo-for-dark.png'
    },

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/getting-started/installation' },
      { text: 'Guide', link: '/architecture/agents' },
      { text: 'API Reference', link: '/api-reference/agent' },
      {
        text: 'v0.1.0',
        items: [
          { text: 'Changelog', link: 'https://github.com/ishaquehassan/langvel/blob/main/CHANGELOG.md' },
          { text: 'Contributing', link: 'https://github.com/ishaquehassan/langvel/blob/main/CONTRIBUTING.md' }
        ]
      }
    ],

    sidebar: {
      '/getting-started/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/getting-started/introduction' },
            { text: 'Installation', link: '/getting-started/installation' },
            { text: 'Quick Start', link: '/getting-started/quick-start' },
            { text: 'Configuration', link: '/getting-started/configuration' },
            { text: 'Directory Structure', link: '/getting-started/directory-structure' }
          ]
        }
      ],

      '/architecture/': [
        {
          text: 'Architecture Concepts',
          items: [
            { text: 'Agents', link: '/architecture/agents' },
            { text: 'State Models', link: '/architecture/state-models' },
            { text: 'Graph Building', link: '/architecture/graph-building' },
            { text: 'Fluent API', link: '/architecture/fluent-api' },
            { text: 'Lifecycle', link: '/architecture/lifecycle' },
            { text: 'Service Container', link: '/architecture/service-container' }
          ]
        }
      ],

      '/the-basics/': [
        {
          text: 'The Basics',
          items: [
            { text: 'Routing', link: '/the-basics/routing' },
            { text: 'Middleware', link: '/the-basics/middleware' },
            { text: 'Tools', link: '/the-basics/tools' },
            { text: 'LLM Integration', link: '/the-basics/llm-integration' },
            { text: 'CLI Commands', link: '/the-basics/cli-commands' },
            { text: 'Error Handling', link: '/the-basics/error-handling' },
            { text: 'Logging', link: '/the-basics/logging' }
          ]
        }
      ],

      '/advanced/': [
        {
          text: 'Advanced Workflow Patterns',
          items: [
            { text: 'Loop Patterns', link: '/advanced/loops' },
            { text: 'Subgraph Composition', link: '/advanced/subgraphs' },
            { text: 'Human-in-the-Loop', link: '/advanced/human-in-loop' },
            { text: 'Dynamic Graphs', link: '/advanced/dynamic-graphs' },
            { text: 'Tool Retry & Fallback', link: '/advanced/tool-retry' },
            { text: 'Graph Validation', link: '/advanced/graph-validation' }
          ]
        },
        {
          text: 'Advanced Topics',
          items: [
            { text: 'RAG Integration', link: '/advanced/rag-integration' },
            { text: 'MCP Servers', link: '/advanced/mcp-servers' },
            { text: 'Multi-Agent Systems', link: '/advanced/multi-agent' },
            { text: 'Authentication', link: '/advanced/authentication' },
            { text: 'Authorization', link: '/advanced/authorization' },
            { text: 'Checkpointers', link: '/advanced/checkpointers' },
            { text: 'Streaming', link: '/advanced/streaming' },
            { text: 'Observability', link: '/advanced/observability' },
            { text: 'Rate Limiting', link: '/advanced/rate-limiting' },
            { text: 'Testing', link: '/advanced/testing' }
          ]
        }
      ],

      '/deployment/': [
        {
          text: 'Deployment',
          items: [
            { text: 'Production Setup', link: '/deployment/production' },
            { text: 'Docker', link: '/deployment/docker' },
            { text: 'Environment Variables', link: '/deployment/environment' },
            { text: 'Performance', link: '/deployment/performance' },
            { text: 'Security', link: '/deployment/security' },
            { text: 'Monitoring', link: '/deployment/monitoring' }
          ]
        }
      ],

      '/api-reference/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Agent', link: '/api-reference/agent' },
            { text: 'StateModel', link: '/api-reference/state-model' },
            { text: 'Router', link: '/api-reference/router' },
            { text: 'Middleware', link: '/api-reference/middleware' },
            { text: 'Tools', link: '/api-reference/tools' },
            { text: 'LLM Manager', link: '/api-reference/llm-manager' },
            { text: 'RAG Manager', link: '/api-reference/rag-manager' },
            { text: 'MCP Manager', link: '/api-reference/mcp-manager' },
            { text: 'Auth Manager', link: '/api-reference/auth-manager' }
          ]
        }
      ],

      '/tutorials/': [
        {
          text: 'Tutorials',
          items: [
            { text: 'Building a Customer Support Agent', link: '/tutorials/customer-support' },
            { text: 'Creating a Code Review Agent', link: '/tutorials/code-review' },
            { text: 'Multi-Agent Research System', link: '/tutorials/multi-agent-research' },
            { text: 'RAG-Powered Q&A', link: '/tutorials/rag-qa' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ishaquehassan/langvel' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present Langvel Contributors'
    },

    search: {
      provider: 'local'
    },

    editLink: {
      pattern: 'https://github.com/ishaquehassan/langvel-docs/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    }
  },

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    lineNumbers: true
  }
})
