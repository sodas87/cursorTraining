# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ShopCursor is a sample e-commerce app (developer merch store) used for a 2-day Cursor IDE training workshop. It has a Java Spring Boot backend, React TypeScript frontend, and Playwright E2E tests.

## Common Commands

### Backend (Java Spring Boot)
```bash
cd backend && ./mvnw spring-boot:run          # Start backend on :8080
cd backend && ./mvnw test                      # Run all backend tests
cd backend && ./mvnw test -Dtest=ClassName     # Run a single test class
```

### Frontend (React/Vite)
```bash
cd frontend && npm install && npm run dev      # Start frontend on :5173
cd frontend && npm run build                   # Production build
```

### E2E Tests (Playwright)
```bash
cd e2e && npx playwright test                  # Run all E2E tests
cd e2e && npx playwright test tests/cart.spec.ts  # Run a single test file
cd e2e && npx playwright install chromium      # First-time browser setup
```

### Setup Verification
```bash
./scripts/verify-setup.sh
```

## Architecture

**Backend** (`backend/src/main/java/com/shopcursor/`): Standard Spring Boot layered architecture — controller → service → repository → model. Uses H2 in-memory DB with JPA. `DataSeeder` populates initial product data. `GlobalExceptionHandler` provides consistent error responses.

**Frontend** (`frontend/src/`): React 18 + TypeScript + Vite. Pages route through `App.tsx` with React Router. Global cart state lives in `CartContext`. All API calls go through `src/api/client.ts`. Plain CSS with BEM-like naming, co-located with components.

**E2E** (`e2e/`): Playwright tests using Page Object Models in `e2e/pages/`. Config expects backend on :8080 and frontend on :5173.

**API**: REST endpoints under `/api/` — resources: `products`, `cart/{sessionId}`, `checkout/{sessionId}`.

## Coding Standards

### Java Backend
- Java 17 features (records, text blocks, pattern matching)
- Constructor injection (not `@Autowired` on fields), dependencies marked `final`
- Return `ResponseEntity<T>` from controllers
- Services: thin business logic only, `@Transactional` for writes, never return null
- Test method naming: `shouldDoSomethingWhenCondition()`

### React Frontend
- Functional components with hooks, under 150 lines
- Interfaces over types for object shapes; strict mode, no `any`
- `async/await` over `.then()` chains
- Shared types in `src/types/index.ts`
- Use `data-testid` attributes for E2E test selectors
- CSS custom properties for shared values

## Cursor Customization (`.cursor/`)

The `.cursor/` directory contains all Cursor IDE customization primitives:

```
.cursor/
├── mcp.json              # MCP server configurations
├── hooks.json            # Agent lifecycle hooks (format, guard, audit)
├── hooks/                # Hook scripts (format-on-edit, block-dangerous)
├── commands/             # Slash commands (/review, /add-endpoint)
├── rules/                # Project rules — auto-applied coding standards (.mdc)
├── agents/               # Subagents (refactor-agent, verify-agent)
└── skills/               # Multi-step workflow skills (add-feature)
```

- **Rules** are always-on and declarative (auto-applied by glob or `alwaysApply`)
- **Commands** are on-demand prompt shortcuts (invoked with `/name`)
- **Skills** are multi-step procedural workflows with optional supporting files
- **Subagents** are specialized agents that run in parallel with their own context
- **Hooks** are scripts that run before/after agent actions for governance

## Workshop-Specific Notes

- Files with `// WORKSHOP: Code smell` comments contain **intentional** issues for refactoring exercises. Do NOT auto-fix these unless explicitly asked.
- Key files with intentional smells: `backend/.../service/CartService.java` and `frontend/src/components/ProductList.tsx`
- `labs/` directories have `starter/` and `solution/` subdirectories — avoid referencing solutions during exercises
