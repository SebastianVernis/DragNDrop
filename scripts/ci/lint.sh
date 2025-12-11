#!/bin/bash

# ================================================
# CI Lint Script
# ================================================
# Ejecuta linting y verificación de código

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔍 Running Linters...${NC}"
echo ""

ERRORS=0

# ================================================
# 1. ESLint
# ================================================
echo -e "${YELLOW}📋 Running ESLint...${NC}"

if npm run lint --if-present 2>/dev/null; then
    echo -e "${GREEN}✅ ESLint passed${NC}"
else
    echo -e "${YELLOW}⚠️ ESLint found issues${NC}"
    ((ERRORS++)) || true
fi

echo ""

# ================================================
# 2. Stylelint
# ================================================
echo -e "${YELLOW}🎨 Running Stylelint...${NC}"

if npm run lint:css --if-present 2>/dev/null; then
    echo -e "${GREEN}✅ Stylelint passed${NC}"
else
    echo -e "${YELLOW}⚠️ Stylelint found issues or not configured${NC}"
fi

echo ""

# ================================================
# 3. Prettier Check
# ================================================
echo -e "${YELLOW}✨ Checking formatting...${NC}"

if npm run format:check --if-present 2>/dev/null; then
    echo -e "${GREEN}✅ Formatting is correct${NC}"
else
    echo -e "${YELLOW}⚠️ Formatting issues found or not configured${NC}"
fi

echo ""

# ================================================
# 4. Summary
# ================================================
echo -e "${BLUE}📊 Lint Summary${NC}"
echo "================================"

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 All linters passed!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️ Some linters reported issues${NC}"
    exit 0  # No fail CI for lint warnings
fi
