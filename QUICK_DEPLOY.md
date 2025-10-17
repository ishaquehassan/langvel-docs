# 🚀 Quick Deploy to GitHub Pages

## ✅ What's Done

- ✅ VitePress configured for GitHub Pages (base: `/langvel-docs/`)
- ✅ GitHub Actions workflow created (`.github/workflows/deploy.yml`)
- ✅ Git repository initialized
- ✅ Initial commit created
- ✅ All files ready to push

## 📋 Next Steps (5 minutes)

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: **`langvel-docs`** (must match exactly)
3. Visibility: **Public**
4. **Don't** check any initialization boxes
5. Click **Create repository**

### Step 2: Push to GitHub

Copy your GitHub username, then run:

```bash
# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/langvel-docs.git
git branch -M main
git push -u origin main
```

**Example:**
```bash
# If your username is 'johndoe'
git remote add origin https://github.com/johndoe/langvel-docs.git
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository: `https://github.com/YOUR_USERNAME/langvel-docs`
2. Click **Settings** (top menu)
3. Click **Pages** (left sidebar)
4. Under **Source**, select: **GitHub Actions**
5. (No need to click Save - it auto-saves)

### Step 4: Wait for Deployment

1. Click **Actions** tab in your repository
2. You'll see "Deploy VitePress site to Pages" running
3. Wait 2-3 minutes for it to complete
4. Once complete, your site is live! 🎉

### Step 5: Visit Your Site

Your documentation will be available at:
```
https://YOUR_USERNAME.github.io/langvel-docs/
```

**Example:**
```
https://johndoe.github.io/langvel-docs/
```

## 🔄 Future Updates

After initial deployment, updating is easy:

```bash
# Make your changes
# Edit any .md files in docs/

# Commit and push
git add .
git commit -m "docs: Update XYZ section"
git push

# Site auto-deploys in 2-3 minutes!
```

## 🎯 Quick Commands Reference

```bash
# Development
npm run docs:dev        # Start dev server (localhost:5173)

# Build
npm run docs:build      # Build for production

# Deploy
git add .
git commit -m "docs: Your commit message"
git push                # Auto-deploys!
```

## 🆘 Troubleshooting

### Problem: Workflow fails

**Solution:**
1. Check Actions tab for error logs
2. Verify repository name is exactly `langvel-docs`
3. Verify base path in `docs/.vitepress/config.mts` is `/langvel-docs/`

### Problem: Site shows 404

**Solution:**
1. Wait 5 minutes (first deploy can be slow)
2. Check workflow completed successfully in Actions tab
3. Verify Pages source is "GitHub Actions" in Settings → Pages
4. Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)

### Problem: CSS/Images not loading

**Solution:**
1. Check base path in config: `base: '/langvel-docs/'`
2. Redeploy: `git commit --allow-empty -m "Redeploy" && git push`

## 📝 Optional: Update GitHub Links

Before or after deploying, update these placeholders:

1. **docs/.vitepress/config.mts** (line 131, 145):
   ```ts
   // Change yourusername to your actual username
   socialLinks: [
     { icon: 'github', link: 'https://github.com/YOUR_USERNAME/langvel' }
   ]
   ```

2. Throughout documentation pages:
   - Replace `yourusername` with your GitHub username
   - Update any example URLs

## ✅ Deployment Checklist

- [ ] Created GitHub repository named `langvel-docs`
- [ ] Added remote: `git remote add origin https://github.com/YOUR_USERNAME/langvel-docs.git`
- [ ] Pushed code: `git push -u origin main`
- [ ] Enabled GitHub Pages (Settings → Pages → Source: GitHub Actions)
- [ ] Verified workflow runs successfully (Actions tab)
- [ ] Tested live site at `https://YOUR_USERNAME.github.io/langvel-docs/`
- [ ] (Optional) Updated GitHub username in config files

## 🎉 That's It!

Your beautiful Langvel documentation is now live on GitHub Pages!

**Your site:** `https://YOUR_USERNAME.github.io/langvel-docs/`

## 📚 Next Steps

1. **Share your docs** - Tweet, Discord, Reddit!
2. **Fill placeholder pages** - Add content to 50+ placeholder pages
3. **Add your logo** - Put `logo.svg` in `docs/public/`
4. **Set up custom domain** - See DEPLOY.md for instructions
5. **Add analytics** - Track your visitors

---

**Need detailed instructions?** See [DEPLOY.md](./DEPLOY.md)

**Questions?** Open an issue or reach out!
