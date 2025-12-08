# Deployment Guide - DragNDrop Editor

## 🚀 Quick Start

This guide will help you deploy your projects using the built-in deployment features.

## Vercel Deployment

### Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **API Token**: Get your token from [vercel.com/account/tokens](https://vercel.com/account/tokens)

### Step-by-Step Deployment

#### 1. Connect to Vercel

Click the **🚀 Deploy** button in the toolbar.

In the modal:
1. Click **"Conectar"** button
2. Enter your Vercel token
3. (Optional) Enter Team ID if deploying to a team
4. Click **"Conectar a Vercel"**

#### 2. Configure Project

Once connected:
1. Enter a project name (lowercase, numbers, hyphens only)
2. (Optional) Add a description
3. Click **"Desplegar"**

#### 3. Monitor Deployment

The system will:
- Upload your files
- Create the deployment
- Monitor build progress
- Show real-time status updates

#### 4. Access Your Site

When complete, you'll see:
- ✅ Success message
- Your deployment URL
- Link to open the site

### Using the API

```javascript
// Connect
window.vercelDeployer.connect('your-vercel-token');

// Deploy
const result = await window.vercelDeployer.deploy('my-project', {
  html: document.getElementById('canvas').innerHTML,
  css: '/* your styles */',
  js: '/* your scripts */'
});

console.log('Deployed to:', result.url);
```

## GitHub Integration

### Prerequisites

1. **GitHub Account**: Sign up at [github.com](https://github.com)
2. **Personal Access Token**: Generate at [github.com/settings/tokens](https://github.com/settings/tokens)
   - Required scopes: `repo`, `workflow`

### Connecting to GitHub

```javascript
// Connect
await window.gitIntegration.connect('your-github-token');

// Create repository
const repo = await window.gitIntegration.createRepository('my-project', {
  description: 'Created with DragNDrop Editor',
  private: false
});

// Commit files
window.repoManager.setRepository(repo.owner.login, repo.name);
await window.repoManager.commitAndPush([
  { path: 'index.html', content: '<h1>Hello World</h1>' },
  { path: 'styles.css', content: 'body { margin: 0; }' }
], 'Initial commit');
```

## Deployment History

### Viewing History

Click the **📊 Historial** button to see:
- All past deployments
- Deployment status
- URLs and timestamps
- Duration and file counts

### Using the API

```javascript
// Get recent deployments
const history = window.vercelDeployer.getDeploymentHistory(10);

// Get statistics
const stats = window.vercelDeployer.getStatistics();
console.log('Total deployments:', stats.total);
console.log('Success rate:', stats.successRate + '%');

// Get specific deployment
const deployment = window.vercelDeployer.deploymentHistory.getDeployment('dep_123');
```

## Best Practices

### Before Deploying

1. **Test Locally**: Preview your project in different screen sizes
2. **Validate HTML**: Ensure no syntax errors
3. **Optimize Assets**: Compress images and minify code
4. **Check Links**: Verify all links work correctly

### Project Naming

- Use lowercase letters
- Use hyphens for spaces
- Keep it short and descriptive
- Avoid special characters

Examples:
- ✅ `my-portfolio`
- ✅ `landing-page-2024`
- ❌ `My Portfolio!`
- ❌ `landing_page`

### File Size Limits

- **Single file**: Max 10 MB
- **Total project**: Max 50 MB
- **Recommended**: Keep under 5 MB per file

### Security

- **Never commit tokens**: Don't include API tokens in your code
- **Use environment variables**: Store sensitive data securely
- **Rotate tokens**: Change tokens periodically
- **Limit permissions**: Use minimum required scopes

## Troubleshooting

### Deployment Fails

**Problem**: "Deployment failed" error

**Solutions**:
1. Check your token is valid
2. Verify project name is valid
3. Check file sizes
4. Ensure you have internet connection
5. Try again after a few minutes

### Token Invalid

**Problem**: "Invalid token" or "Unauthorized"

**Solutions**:
1. Generate a new token
2. Check token hasn't expired
3. Verify token has correct permissions
4. Disconnect and reconnect

### Files Too Large

**Problem**: "File too large" error

**Solutions**:
1. Compress images
2. Minify CSS and JavaScript
3. Remove unused code
4. Split into multiple deployments

### Rate Limit Exceeded

**Problem**: "Rate limit exceeded"

**Solutions**:
1. Wait for rate limit to reset
2. Use a different token
3. Reduce deployment frequency

## Advanced Usage

### Custom Deployment Options

```javascript
const result = await window.vercelDeployer.deploy('my-project', projectData, {
  target: 'production', // or 'preview'
  teamId: 'team_123'    // optional
});
```

### Monitoring Deployments

```javascript
// Listen to deployment events
window.addEventListener('deploy:progress', (e) => {
  console.log('Progress:', e.detail.message);
});

window.addEventListener('deploy:complete', (e) => {
  console.log('Deployed to:', e.detail.url);
});

window.addEventListener('deploy:error', (e) => {
  console.error('Error:', e.detail.error);
});
```

### Managing History

```javascript
// Export history
const json = window.vercelDeployer.deploymentHistory.exportHistory();
localStorage.setItem('backup', json);

// Import history
const backup = localStorage.getItem('backup');
window.vercelDeployer.deploymentHistory.importHistory(backup);

// Clear history
window.vercelDeployer.deploymentHistory.clearHistory();
```

## API Reference

### VercelDeployer

```javascript
// Connection
vercelDeployer.connect(token, teamId?)
vercelDeployer.disconnect()
vercelDeployer.isConnected()

// Deployment
vercelDeployer.deploy(projectName, projectData, options?)
vercelDeployer.getDeployment(deploymentId)
vercelDeployer.deleteDeployment(deploymentId)

// History
vercelDeployer.getDeploymentHistory(limit?)
vercelDeployer.getStatistics()
```

### GitIntegration

```javascript
// Connection
gitIntegration.connect(token)
gitIntegration.disconnect()
gitIntegration.isConnected()

// Repositories
gitIntegration.createRepository(name, options?)
gitIntegration.getRepositories(options?)
gitIntegration.getRepository(owner, repo)
gitIntegration.deleteRepository(owner, repo)

// Branches
gitIntegration.getBranches(owner, repo)
gitIntegration.getDefaultBranch(owner, repo)
```

### RepoManager

```javascript
// Setup
repoManager.setRepository(owner, repo)
repoManager.getCurrentRepository()

// Operations
repoManager.commitAndPush(files, message, branch?)
repoManager.initializeRepository(name, files, options?)
repoManager.getFiles(branch?)
repoManager.getFileContent(path, branch?)
repoManager.updateFile(path, content, message, branch?)
repoManager.deleteFile(path, message, branch?)
```

## Support

### Getting Help

1. Check this documentation
2. Review error messages
3. Check browser console
4. Verify API tokens
5. Test with simple project

### Common Issues

See [Troubleshooting](#troubleshooting) section above.

### Reporting Bugs

If you encounter a bug:
1. Note the error message
2. Check browser console
3. Try to reproduce
4. Report with details

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [GitHub API Docs](https://docs.github.com/en/rest)
- [Workflow 4 Implementation](./WORKFLOW_4_IMPLEMENTATION.md)
- [Main README](../README.md)

---

**Happy Deploying! 🚀**
