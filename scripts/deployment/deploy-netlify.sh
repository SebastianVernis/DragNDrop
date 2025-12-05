#!/bin/bash

# Deploy to Netlify script
# Usage: ./scripts/deploy-netlify.sh [production|preview]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default to preview deployment
DEPLOYMENT_TYPE=${1:-preview}

echo -e "${BLUE}🚀 Starting Netlify deployment...${NC}"

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo -e "${RED}❌ Netlify CLI is not installed. Installing...${NC}"
    npm install -g netlify-cli
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json not found. Make sure you're in the project root directory.${NC}"
    exit 1
fi

# Copy Netlify configuration
echo -e "${YELLOW}📋 Copying Netlify configuration...${NC}"
cp deploy/netlify/netlify.toml ./netlify.toml

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm ci

# Run tests
echo -e "${YELLOW}🧪 Running tests...${NC}"
npm run test

# Build the project
echo -e "${YELLOW}🔨 Building project...${NC}"
npm run build

# Check if site is already linked
if [ ! -f ".netlify/state.json" ]; then
    echo -e "${YELLOW}🔗 Site not linked. Please run 'netlify link' first or create a new site.${NC}"
    read -p "Do you want to create a new site? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        netlify sites:create --name dragndrop-html-editor
        netlify link
    else
        echo -e "${RED}❌ Deployment cancelled.${NC}"
        exit 1
    fi
fi

# Deploy based on type
if [ "$DEPLOYMENT_TYPE" = "production" ]; then
    echo -e "${GREEN}🌟 Deploying to production...${NC}"
    netlify deploy --prod --dir=dist
else
    echo -e "${BLUE}🔍 Deploying preview...${NC}"
    netlify deploy --dir=dist
fi

# Clean up
echo -e "${YELLOW}🧹 Cleaning up...${NC}"
rm -f netlify.toml

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"

# Get deployment URL
echo -e "${BLUE}🔗 Getting deployment URL...${NC}"
netlify status