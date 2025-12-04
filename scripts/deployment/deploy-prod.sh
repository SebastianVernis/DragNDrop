#!/bin/bash

# ================================================
# Deploy to Cloudflare Pages (Production)
# ================================================
# Build y deploy automatizado con gestión de secretos

set -e  # Exit on error

PROJECT_NAME="dragndrop-editor"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Deploy DragNDrop Editor to Cloudflare Pages${NC}"
echo ""

# ================================================
# 1. Pre-flight checks
# ================================================
echo -e "${YELLOW}🔍 Pre-flight checks...${NC}"

if ! command -v wrangler &> /dev/null; then
    echo -e "${RED}❌ wrangler CLI no encontrado${NC}"
    echo "Instala con: npm install -g wrangler"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm no encontrado${NC}"
    exit 1
fi

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json no encontrado${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Pre-flight checks passed${NC}"
echo ""

# ================================================
# 2. Install dependencies
# ================================================
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm ci --silent
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# ================================================
# 3. Build
# ================================================
echo -e "${YELLOW}🔨 Building project...${NC}"

# Limpiar dist anterior
rm -rf dist/

# Build con Vite
npm run build

if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Build failed - dist/ no encontrado${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed${NC}"
echo ""

# ================================================
# 4. Deploy
# ================================================
echo -e "${YELLOW}☁️  Deploying to Cloudflare Pages...${NC}"

wrangler pages deploy dist/ \
    --project-name="$PROJECT_NAME" \
    --commit-dirty=true \
    --branch=master

DEPLOY_STATUS=$?

echo ""

if [ $DEPLOY_STATUS -eq 0 ]; then
    echo -e "${GREEN}🎉 Deploy successful!${NC}"
    echo ""
    echo -e "${BLUE}🌐 URLs:${NC}"
    echo "  Production: https://dragndrop-editor.pages.dev"
    echo "  Project: https://dash.cloudflare.com/pages"
    echo ""
    echo -e "${YELLOW}📝 Next steps:${NC}"
    echo "  1. Verifica el deploy en la URL de producción"
    echo "  2. Si hay nuevos secrets, ejecuta: ./scripts/deploy-secrets.sh"
    echo "  3. Revisa logs en Cloudflare Dashboard"
    exit 0
else
    echo -e "${RED}❌ Deploy failed${NC}"
    exit 1
fi
