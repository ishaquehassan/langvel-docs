# 🚀 Deploy to GitHub Pages

This guide will help you deploy the Langvel documentation to GitHub Pages.

## 📋 Prerequisites

- GitHub account
- Git installed locally
- GitHub repository created (name: `langvel-docs`)

## 🔧 Setup Steps

### Step 1: Create GitHub Repository

Go to GitHub and create a new repository:
- **Name**: `langvel-docs`
- **Visibility**: Public (required for GitHub Pages on free plan)
- **Don't** initialize with README, .gitignore, or license (we already have these)

### Step 2: Initialize Git and Push

```bash
# Navigate to project directory
cd /Users/ishaqhassan/Desktop/OpenSource/langvel-docs

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Complete Langvel documentation site"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/langvel-docs.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (in left sidebar)
3. Under **Source**, select:
   - Source: **GitHub Actions**
4. Click **Save**

That's it! The deployment will start automatically.

## 🎯 What Happens Next

1. **GitHub Actions runs** - The workflow in `.github/workflows/deploy.yml` will:
   - Install dependencies
   - Build the VitePress site
   - Deploy to GitHub Pages

2. **Site goes live** - After 2-3 minutes, your site will be available at:
   ```
   https://YOUR_USERNAME.github.io/langvel-docs/
   ```

3. **Auto-updates** - Every time you push to `main` branch, the site auto-deploys!

## 🔍 Monitor Deployment

### Check Workflow Status

1. Go to your repository on GitHub
2. Click **Actions** tab
3. You'll see the "Deploy VitePress site to Pages" workflow running
4. Click on it to see detailed logs

### Troubleshooting

If deployment fails:

1. **Check workflow logs** in the Actions tab
2. **Verify Pages settings** (Settings → Pages → Source = GitHub Actions)
3. **Check base path** in `docs/.vitepress/config.mts`:
   ```ts
   base: '/langvel-docs/'  // Must match repo name
   ```

## 📝 Making Updates

After initial deployment, updating is simple:

```bash
# Make your changes to markdown files
# ...

# Commit and push
git add .
git commit -m "docs: Update XYZ section"
git push

# Site will auto-deploy in 2-3 minutes!
```

## 🌐 Custom Domain (Optional)

Want to use a custom domain like `docs.langvel.dev`?

### Steps:

1. **Add CNAME file**:
   ```bash
   echo "docs.langvel.dev" > docs/public/CNAME
   ```

2. **Configure DNS** (at your domain provider):
   ```
   Type: CNAME
   Name: docs
   Value: YOUR_USERNAME.github.io
   ```

3. **Enable in GitHub**:
   - Go to Settings → Pages
   - Enter your custom domain
   - Click Save
   - Wait for DNS check to complete
   - Enable "Enforce HTTPS"

4. **Update VitePress config**:
   ```ts
   // docs/.vitepress/config.mts
   export default defineConfig({
     base: '/',  // Remove base path for custom domain
     // ...
   })
   ```

## 🔒 Repository Settings

### Recommended Settings

**Security**:
- ✅ Enable "Include administrators" for branch protection
- ✅ Require pull request reviews for main branch (optional)
- ✅ Enable "Automatically delete head branches"

**Pages**:
- ✅ Source: GitHub Actions
- ✅ Custom domain: (optional)
- ✅ Enforce HTTPS: ✅ Enabled

## 📊 Deployment Workflow Details

The workflow (`.github/workflows/deploy.yml`) does:

1. **Triggers on**:
   - Push to `main` branch
   - Manual dispatch (Actions tab → Run workflow)

2. **Build step**:
   - Checks out code
   - Sets up Node.js 20
   - Installs dependencies with `npm ci`
   - Builds site with `npm run docs:build`
   - Uploads build artifact

3. **Deploy step**:
   - Deploys artifact to GitHub Pages
   - Returns deployment URL

## 🎨 Customization Before Deploy

### Update Links

Replace `yourusername` in these files:

1. **docs/.vitepress/config.mts**:
   ```ts
   socialLinks: [
     { icon: 'github', link: 'https://github.com/YOUR_USERNAME/langvel' },
   ],
   editLink: {
     pattern: 'https://github.com/YOUR_USERNAME/langvel-docs/edit/main/docs/:path',
   }
   ```

2. **All documentation pages**:
   - Update GitHub links
   - Update Discord links
   - Update any example URLs

### Add Analytics (Optional)

Add to `docs/.vitepress/config.mts`:

```ts
export default defineConfig({
  // ...
  head: [
    [
      'script',
      { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX' }
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-XXXXXXXXXX');`
    ]
  ]
})
```

## ✅ Checklist

Before pushing to GitHub:

- [ ] Created GitHub repository named `langvel-docs`
- [ ] Updated `yourusername` in config files
- [ ] Tested build locally (`npm run docs:build`)
- [ ] Reviewed all content
- [ ] Added logo to `docs/public/logo.svg` (optional)
- [ ] Initialized git and added remote
- [ ] Pushed to GitHub
- [ ] Enabled GitHub Pages in repository settings
- [ ] Verified deployment in Actions tab
- [ ] Tested live site

## 🎉 Success!

Once deployed, share your documentation:

```
https://YOUR_USERNAME.github.io/langvel-docs/
```

## 📚 Resources

- [VitePress Deployment Guide](https://vitepress.dev/guide/deploy#github-pages)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## 🆘 Need Help?

- Check workflow logs in Actions tab
- Review VitePress [deployment docs](https://vitepress.dev/guide/deploy)
- Open an issue in the repository

---

**Built with VitePress** • **Deployed on GitHub Pages** 🚀
