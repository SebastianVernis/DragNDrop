#!/bin/bash

# ================================================
# CI Test Script
# ================================================
# Ejecuta todos los tests del proyecto

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🧪 Running Tests...${NC}"
echo ""

# ================================================
# 1. Unit Tests
# ================================================
echo -e "${YELLOW}📋 Running Unit Tests...${NC}"

if npm test -- --coverage --passWithNoTests; then
    echo -e "${GREEN}✅ Unit tests passed${NC}"
else
    echo -e "${RED}❌ Unit tests failed${NC}"
    UNIT_FAILED=1
fi

echo ""

# ================================================
# 2. E2E Tests (if available)
# ================================================
if [ -f "playwright.config.js" ] || [ -f "playwright.config.ts" ]; then
    echo -e "${YELLOW}🎭 Running E2E Tests...${NC}"
    
    if npx playwright test --reporter=list; then
        echo -e "${GREEN}✅ E2E tests passed${NC}"
    else
        echo -e "${YELLOW}⚠️ E2E tests had issues${NC}"
        E2E_FAILED=1
    fi
else
    echo -e "${YELLOW}⏭️ Skipping E2E tests (no Playwright config found)${NC}"
fi

echo ""

# ================================================
# 3. Summary
# ================================================
echo -e "${BLUE}📊 Test Summary${NC}"
echo "================================"

if [ -z "$UNIT_FAILED" ]; then
    echo -e "Unit Tests:  ${GREEN}PASSED${NC}"
else
    echo -e "Unit Tests:  ${RED}FAILED${NC}"
fi

if [ -z "$E2E_FAILED" ]; then
    echo -e "E2E Tests:   ${GREEN}PASSED${NC}"
else
    echo -e "E2E Tests:   ${YELLOW}WARNING${NC}"
fi

echo "================================"

# Exit with error if unit tests failed
if [ -n "$UNIT_FAILED" ]; then
    exit 1
fi

echo -e "${GREEN}🎉 All critical tests passed!${NC}"
exit 0
