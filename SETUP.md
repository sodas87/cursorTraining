# ShopCursor Workshop - Setup Guide

## Prerequisites

Before the workshop, please ensure you have the following installed:

### Required Software

| Software | Version | Download |
|----------|---------|----------|
| **Cursor IDE** | Latest | [cursor.sh](https://cursor.sh) |
| **Java JDK** | 17+ | [adoptium.net](https://adoptium.net) |
| **Node.js** | 18+ | [nodejs.org](https://nodejs.org) |
| **Git** | 2.30+ | [git-scm.com](https://git-scm.com) |

### Optional (for MCP exercises)

| Software | Purpose |
|----------|---------|
| **GitHub CLI** (`gh`) | GitHub MCP server |
| **Docker** | Alternative setup method |

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repo-url> shopcursor-workshop
cd shopcursor-workshop
```

### 2. Verify Java Installation

```bash
java -version
# Should show: openjdk version "17.x.x" or higher
```

### 3. Test the Backend

```bash
cd backend
./mvnw spring-boot:run
```

Open http://localhost:8080/api/products in your browser. You should see JSON with 8 products.

Press `Ctrl+C` to stop.

### 4. Install & Test the Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. You should see the ShopCursor store.

Press `Ctrl+C` to stop.

### 5. Install Playwright (for Day 2)

```bash
cd e2e
npm install
npx playwright install chromium
```

### 6. Configure Cursor IDE

1. Open the `shopcursor-workshop` folder in Cursor
2. Cursor should auto-detect the `.cursorrules` file
3. For MCP exercises (Day 2), update `.cursor/mcp.json` with your GitHub token

### 7. Run the Verification Script

```bash
./scripts/verify-setup.sh
```

All checks should pass with green checkmarks.

## Troubleshooting

### Java not found
- Make sure `JAVA_HOME` is set correctly
- On macOS: `export JAVA_HOME=$(/usr/libexec/java_home -v 17)`

### Port already in use
- Backend (8080): `lsof -i :8080` to find the process, then `kill <PID>`
- Frontend (5173): `lsof -i :5173` to find the process, then `kill <PID>`

### Maven wrapper not executable
```bash
chmod +x backend/mvnw
```

### Node modules issues
```bash
rm -rf node_modules package-lock.json
npm install
```

## Quick Start (Both Servers)

Terminal 1:
```bash
cd backend && ./mvnw spring-boot:run
```

Terminal 2:
```bash
cd frontend && npm install && npm run dev
```

Then open http://localhost:5173 in your browser.
