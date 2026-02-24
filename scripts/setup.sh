#!/bin/bash
# ShopCursor Workshop - Setup Script
# Installs dependencies for all project components

set -e

echo "========================================"
echo "  ShopCursor Workshop - Setup"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "Project directory: $PROJECT_DIR"
echo ""

# Backend - make mvnw executable
echo -e "${YELLOW}[1/4] Setting up backend...${NC}"
if [ -f "$PROJECT_DIR/backend/mvnw" ]; then
    chmod +x "$PROJECT_DIR/backend/mvnw"
    echo -e "${GREEN}  ✓ Maven wrapper is executable${NC}"
else
    echo -e "${RED}  ✗ Maven wrapper not found${NC}"
fi

# Frontend - install dependencies
echo -e "${YELLOW}[2/4] Installing frontend dependencies...${NC}"
cd "$PROJECT_DIR/frontend"
npm install --silent
echo -e "${GREEN}  ✓ Frontend dependencies installed${NC}"

# E2E - install dependencies and browsers
echo -e "${YELLOW}[3/4] Installing E2E test dependencies...${NC}"
cd "$PROJECT_DIR/e2e"
npm install --silent
npx playwright install chromium
echo -e "${GREEN}  ✓ E2E dependencies and browsers installed${NC}"

# Demo MCP server (if exists)
echo -e "${YELLOW}[4/4] Installing lab dependencies...${NC}"
if [ -f "$PROJECT_DIR/labs/day2/session3-mcp-architecture/exercises/demo-mcp-server/package.json" ]; then
    cd "$PROJECT_DIR/labs/day2/session3-mcp-architecture/exercises/demo-mcp-server"
    npm install --silent
    echo -e "${GREEN}  ✓ Demo MCP server dependencies installed${NC}"
else
    echo -e "${YELLOW}  - Demo MCP server not found (will be created in workshop)${NC}"
fi

echo ""
echo -e "${GREEN}========================================"
echo "  Setup complete!"
echo "========================================${NC}"
echo ""
echo "Next steps:"
echo "  1. Start backend:  cd backend && ./mvnw spring-boot:run"
echo "  2. Start frontend: cd frontend && npm run dev"
echo "  3. Open browser:   http://localhost:5173"
