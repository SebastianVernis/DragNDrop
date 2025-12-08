#!/bin/bash

# DragNDrop NPM Package Verification Script
# This script verifies that the NPM package is properly set up

echo "🔍 DragNDrop NPM Package Verification"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0

# Test function
test_command() {
    local description=$1
    local command=$2
    
    echo -n "Testing: $description... "
    
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASSED${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAILED${NC}"
        ((FAILED++))
        return 1
    fi
}

# Test file existence
test_file() {
    local description=$1
    local file=$2
    
    echo -n "Checking: $description... "
    
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓ EXISTS${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ MISSING${NC}"
        ((FAILED++))
        return 1
    fi
}

# Test directory existence
test_directory() {
    local description=$1
    local dir=$2
    
    echo -n "Checking: $description... "
    
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✓ EXISTS${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ MISSING${NC}"
        ((FAILED++))
        return 1
    fi
}

echo "📁 File Structure Tests"
echo "----------------------"
test_file "CLI entry point" "bin/dragndrop.js"
test_file "Server module" "lib/server.js"
test_file "Parser module" "lib/parser.js"
test_file "Writer module" "lib/writer.js"
test_file "Watcher module" "lib/watcher.js"
test_file "Framework detector" "lib/framework-detector.js"
test_file "Config module" "lib/config.js"
test_file "Validator module" "lib/validator.js"
test_file "Package.json" "package.json"
test_file "NPM README" "NPM_PACKAGE_README.md"
test_file "Integration Guide" "docs/NPM_INTEGRATION_GUIDE.md"
test_file "Resolution Document" "GITHUB_ISSUE_18_RESOLUTION.md"
test_directory "Examples directory" "examples"
test_directory "Lib directory" "lib"
test_directory "Bin directory" "bin"

echo ""
echo "🔧 CLI Commands Tests"
echo "---------------------"
test_command "CLI help" "node bin/dragndrop.js --help"
test_command "CLI version" "node bin/dragndrop.js --version"
test_command "CLI info" "node bin/dragndrop.js info"
test_command "CLI validate" "node bin/dragndrop.js validate"

echo ""
echo "📦 Package.json Tests"
echo "--------------------"
test_command "Package has bin entry" "grep -q '\"bin\"' package.json"
test_command "Package has correct name" "grep -q '\"dragndrop-editor\"' package.json"
test_command "Package has version 4.0.0" "grep -q '\"version\": \"4.0.0\"' package.json"
test_command "Package has dependencies" "grep -q '\"express\"' package.json"
test_command "Package has chalk" "grep -q '\"chalk\"' package.json"
test_command "Package has commander" "grep -q '\"commander\"' package.json"
test_command "Package has chokidar" "grep -q '\"chokidar\"' package.json"

echo ""
echo "📚 Documentation Tests"
echo "---------------------"
test_command "NPM README has installation" "grep -q 'npm install' NPM_PACKAGE_README.md"
test_command "NPM README has quick start" "grep -q 'Quick Start' NPM_PACKAGE_README.md"
test_command "Integration guide exists" "grep -q 'Integration Guide' docs/NPM_INTEGRATION_GUIDE.md"
test_command "React example exists" "test -f examples/react-vite/README.md"
test_command "Vue example exists" "test -f examples/vue-vite/README.md"

echo ""
echo "🔍 Module Tests"
echo "--------------"
test_command "Server module syntax" "node -c lib/server.js"
test_command "Parser module syntax" "node -c lib/parser.js"
test_command "Writer module syntax" "node -c lib/writer.js"
test_command "Watcher module syntax" "node -c lib/watcher.js"
test_command "Framework detector syntax" "node -c lib/framework-detector.js"
test_command "Config module syntax" "node -c lib/config.js"
test_command "Validator module syntax" "node -c lib/validator.js"

echo ""
echo "🎯 Configuration Tests"
echo "---------------------"
if [ -f "dragndrop.config.js" ]; then
    test_command "Config file syntax" "node -c dragndrop.config.js"
    test_command "Config has source" "grep -q 'source' dragndrop.config.js"
    test_command "Config has port" "grep -q 'port' dragndrop.config.js"
    test_command "Config has framework" "grep -q 'framework' dragndrop.config.js"
else
    echo -e "${YELLOW}⚠ Config file not created yet (run 'dragndrop init')${NC}"
fi

echo ""
echo "📊 Results"
echo "=========="
echo -e "Tests Passed: ${GREEN}$PASSED${NC}"
echo -e "Tests Failed: ${RED}$FAILED${NC}"
echo -e "Total Tests: $((PASSED + FAILED))"

if [ $FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ All tests passed! NPM package is ready.${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Review the documentation"
    echo "  2. Test in a real project"
    echo "  3. Publish to npm: npm publish"
    exit 0
else
    echo ""
    echo -e "${RED}❌ Some tests failed. Please review the errors above.${NC}"
    exit 1
fi
