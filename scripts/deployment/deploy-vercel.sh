#!/bin/bash

# Deploy to Vercel script
# Usage: ./scripts/deploy-vercel.sh [production|preview]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default to preview deployment
DEPLOYMENT_TYPE=${1:-preview}

echo -e "${BLUE}🚀 Starting Vercel deployment...${NC}"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI is not installed. Installing...${NC}"
    npm install -g vercel
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json not found. Make sure you're in the project root directory.${NC}"
    exit 1
fi

# Copy Vercel configuration
echo -e "${YELLOW}📋 Copying Vercel configuration...${NC}"
cp deploy/vercel/vercel.json ./vercel.json

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm ci

# Run tests
echo -e "${YELLOW}🧪 Running tests...${NC}"
npm run test

# Build the project
echo -e "${YELLOW}🔨 Building project...${NC}"
npm run build

# Deploy based on type
if [ "$DEPLOYMENT_TYPE" = "production" ]; then
    echo -e "${GREEN}🌟 Deploying to production...${NC}"
    vercel --prod --confirm
else
    echo -e "${BLUE}🔍 Deploying preview...${NC}"
    vercel --confirm
fi

# Clean up
echo -e "${YELLOW}🧹 Cleaning up...${NC}"
rm -f vercel.json

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"

# Get deployment URL (if available)
if command -v vercel &> /dev/null; then
    echo -e "${BLUE}🔗 Getting deployment URL...${NC}"
    DEPLOYMENT_URL=$(vercel ls | grep dragndrop-html-editor | head -1 | awk '{print $2}')
    if [ ! -z "$DEPLOYMENT_URL" ]; then
        echo -e "${GREEN}🌐 Deployment URL: https://$DEPLOYMENT_URL${NC}"
    fi
fi