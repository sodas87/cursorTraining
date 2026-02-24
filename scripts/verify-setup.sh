#!/bin/bash
# ShopCursor Workshop - Verify Setup
# Checks that all prerequisites are installed correctly

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASS=0
FAIL=0

check() {
    local name="$1"
    local command="$2"
    local min_version="$3"

    if eval "$command" &>/dev/null; then
        local version=$(eval "$command" 2>&1 | head -1)
        echo -e "  ${GREEN}✓${NC} $name: $version"
        ((PASS++))
    else
        echo -e "  ${RED}✗${NC} $name: NOT FOUND"
        ((FAIL++))
    fi
}

echo "========================================"
echo "  ShopCursor Workshop - Verify Setup"
echo "========================================"
echo ""

echo "Checking required tools..."
check "Java" "java -version"
check "Node.js" "node --version"
check "npm" "npm --version"
check "Git" "git --version"

echo ""
echo "Checking optional tools..."
check "GitHub CLI" "gh --version"

echo ""
echo "Checking project structure..."

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Check key files exist
for f in "backend/pom.xml" "frontend/package.json" "e2e/package.json" ".cursorrules"; do
    if [ -f "$PROJECT_DIR/$f" ]; then
        echo -e "  ${GREEN}✓${NC} $f exists"
        ((PASS++))
    else
        echo -e "  ${RED}✗${NC} $f missing"
        ((FAIL++))
    fi
done

# Check node_modules
echo ""
echo "Checking dependencies..."
if [ -d "$PROJECT_DIR/frontend/node_modules" ]; then
    echo -e "  ${GREEN}✓${NC} Frontend dependencies installed"
    ((PASS++))
else
    echo -e "  ${YELLOW}!${NC} Frontend dependencies not installed (run: cd frontend && npm install)"
    ((FAIL++))
fi

if [ -d "$PROJECT_DIR/e2e/node_modules" ]; then
    echo -e "  ${GREEN}✓${NC} E2E dependencies installed"
    ((PASS++))
else
    echo -e "  ${YELLOW}!${NC} E2E dependencies not installed (run: cd e2e && npm install)"
    ((FAIL++))
fi

# Check Maven wrapper
if [ -x "$PROJECT_DIR/backend/mvnw" ]; then
    echo -e "  ${GREEN}✓${NC} Maven wrapper is executable"
    ((PASS++))
else
    echo -e "  ${YELLOW}!${NC} Maven wrapper not executable (run: chmod +x backend/mvnw)"
    ((FAIL++))
fi

echo ""
echo "========================================"
if [ $FAIL -eq 0 ]; then
    echo -e "  ${GREEN}All checks passed! ($PASS/$PASS)${NC}"
    echo -e "  ${GREEN}You're ready for the workshop!${NC}"
else
    echo -e "  ${YELLOW}$PASS passed, $FAIL issues found${NC}"
    echo -e "  ${YELLOW}Please fix the issues above before the workshop.${NC}"
fi
echo "========================================"
