#!/bin/bash

# Deploy to GitHub Pages script
# Usage: ./scripts/deploy-github-pages.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting GitHub Pages deployment...${NC}"

# Check if gh-pages is installed
if ! npm list gh-pages &> /dev/null; then
    echo -e "${RED}❌ gh-pages is not installed. Installing...${NC}"
    npm install --save-dev gh-pages
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json not found. Make sure you're in the project root directory.${NC}"
    exit 1
fi

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Not a git repository. Initialize git first.${NC}"
    exit 1
fi

# Check if remote origin exists
if ! git remote get-url origin &> /dev/null; then
    echo -e "${RED}❌ No remote origin found. Add a remote origin first.${NC}"
    exit 1
fi

# Copy GitHub Pages workflow
echo -e "${YELLOW}📋 Setting up GitHub Actions workflow...${NC}"
mkdir -p .github/workflows
cp deploy/github-pages/deploy.yml .github/workflows/

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm ci

# Run tests
echo -e "${YELLOW}🧪 Running tests...${NC}"
npm run test

# Build the project
echo -e "${YELLOW}🔨 Building project...${NC}"
npm run build

# Configure git if needed
if [ -z "$(git config user.name)" ]; then
    echo -e "${YELLOW}⚙️ Configuring git user...${NC}"
    read -p "Enter your name: " GIT_NAME
    read -p "Enter your email: " GIT_EMAIL
    git config user.name "$GIT_NAME"
    git config user.email "$GIT_EMAIL"
fi

# Deploy to gh-pages branch
echo -e "${GREEN}🌟 Deploying to GitHub Pages...${NC}"
npx gh-pages -d dist -m "Deploy to GitHub Pages"

# Commit and push workflow file
echo -e "${YELLOW}📤 Committing GitHub Actions workflow...${NC}"
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Pages deployment workflow" || echo "No changes to commit"
git push origin main || git push origin master

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"

# Get repository info
REPO_URL=$(git remote get-url origin)
REPO_NAME=$(basename "$REPO_URL" .git)
USERNAME=$(echo "$REPO_URL" | sed -n 's/.*github\.com[:/]\([^/]*\)\/.*/\1/p')

echo -e "${BLUE}🔗 Your site will be available at:${NC}"
echo -e "${GREEN}https://$USERNAME.github.io/$REPO_NAME${NC}"
echo -e "${YELLOW}Note: It may take a few minutes for the site to be available.${NC}"
echo -e "${BLUE}Check the Actions tab in your GitHub repository for deployment status.${NC}"