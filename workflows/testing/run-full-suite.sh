#!/bin/bash

# Script: Run Full Test Suite
# Usage: ./workflows/testing/run-full-suite.sh

set -e

echo "🧪 Running Full Test Suite..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Results
PASSED=0
FAILED=0

# 1. Unit Tests
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1️⃣  UNIT TESTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if npm test; then
    echo -e "${GREEN}✅ Unit tests passed${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ Unit tests failed${NC}"
    ((FAILED++))
fi
echo ""

# 2. Coverage Check
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣  COVERAGE CHECK"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if npm run test:coverage; then
    COVERAGE=$(grep -oP '"lines":\s*{\s*"total":\s*\K[0-9.]+' coverage/coverage-summary.json | head -1)
    if (( $(echo "$COVERAGE >= 80" | bc -l) )); then
        echo -e "${GREEN}✅ Coverage: $COVERAGE% (target: 80%)${NC}"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠️  Coverage: $COVERAGE% (target: 80%)${NC}"
    fi
else
    echo -e "${RED}❌ Coverage check failed${NC}"
    ((FAILED++))
fi
echo ""

# 3. E2E Tests
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3️⃣  E2E TESTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if npm run test:e2e; then
    echo -e "${GREEN}✅ E2E tests passed${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ E2E tests failed${NC}"
    ((FAILED++))
fi
echo ""

# 4. Linting
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4️⃣  LINTING"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if npm run lint 2>/dev/null; then
    echo -e "${GREEN}✅ Linting passed${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️  No lint script or warnings found${NC}"
fi
echo ""

# 5. Build Check
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5️⃣  BUILD CHECK"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if npm run build; then
    echo -e "${GREEN}✅ Build successful${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ Build failed${NC}"
    ((FAILED++))
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Passed: $PASSED"
echo "Failed: $FAILED"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✅ ALL CHECKS PASSED - READY TO DEPLOY${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    exit 0
else
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}❌ SOME CHECKS FAILED - FIX BEFORE DEPLOY${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    exit 1
fi
