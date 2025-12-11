#!/bin/bash

# ================================================
# CI Build Script
# ================================================
# Compila el proyecto para producción

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🏗️ Building Project...${NC}"
echo ""

# ================================================
# 1. Clean previous build
# ================================================
echo -e "${YELLOW}🧹 Cleaning previous build...${NC}"

if [ -d "dist" ]; then
    rm -rf dist
    echo -e "${GREEN}✅ Cleaned dist/ directory${NC}"
else
    echo -e "${YELLOW}⏭️ No previous build to clean${NC}"
fi

echo ""

# ================================================
# 2. Install dependencies
# ================================================
echo -e "${YELLOW}📦 Checking dependencies...${NC}"

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm ci
fi

echo -e "${GREEN}✅ Dependencies ready${NC}"
echo ""

# ================================================
# 3. Build
# ================================================
echo -e "${YELLOW}🔨 Building...${NC}"

START_TIME=$(date +%s)

if npm run build; then
    END_TIME=$(date +%s)
    BUILD_TIME=$((END_TIME - START_TIME))
    echo -e "${GREEN}✅ Build completed in ${BUILD_TIME}s${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo ""

# ================================================
# 4. Verify build output
# ================================================
echo -e "${YELLOW}🔍 Verifying build output...${NC}"

if [ -d "dist" ]; then
    FILE_COUNT=$(find dist -type f | wc -l)
    TOTAL_SIZE=$(du -sh dist | cut -f1)
    
    echo -e "${GREEN}✅ Build verified${NC}"
    echo "   Files: $FILE_COUNT"
    echo "   Size: $TOTAL_SIZE"
    
    # List main files
    echo ""
    echo "Main files:"
    ls -lh dist/*.html dist/*.js dist/*.css 2>/dev/null || echo "   (checking subdirectories...)"
    ls -lh dist/assets/* 2>/dev/null | head -5 || true
else
    echo -e "${RED}❌ dist/ directory not found${NC}"
    exit 1
fi

echo ""

# ================================================
# 5. Summary
# ================================================
echo -e "${BLUE}📊 Build Summary${NC}"
echo "================================"
echo -e "Status:     ${GREEN}SUCCESS${NC}"
echo "Output:     dist/"
echo "Files:      $FILE_COUNT"
echo "Size:       $TOTAL_SIZE"
echo "Time:       ${BUILD_TIME}s"
echo "================================"

echo -e "${GREEN}🎉 Build ready for deployment!${NC}"
exit 0
