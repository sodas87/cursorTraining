# ShopCursor - Cursor IDE Training Workshop

A 2-day hands-on workshop for developers learning to use **Cursor IDE** for AI-assisted development. Build, refactor, test, and enhance a sample e-commerce application using Cursor's AI features, MCP integrations, and Playwright testing.

## What You'll Learn

- **Day 1**: AI prompt engineering, Cursor IDE features (Tab, Cmd+K, Chat, Composer, Agent Mode, Subagents), refactoring with AI
- **Day 2**: MCP architecture, custom Skills & Slash Commands, Playwright E2E testing, BugBot, AI governance & Project Rules

## The App: ShopCursor

A developer merch store built with:

| Layer | Tech |
|-------|------|
| **Backend** | Java 17, Spring Boot 3.2, H2 (in-memory DB) |
| **Frontend** | React 18, TypeScript, Vite |
| **E2E Tests** | Playwright |
| **AI Tooling** | Cursor IDE, MCP servers |

Products include fun developer items: "Git Commit Hoodie", "404 Not Found Mug", "Rubber Duck Debugger", and more.

## Quick Start

### Prerequisites
- Java 17+, Node.js 18+, Cursor IDE (see [SETUP.md](SETUP.md) for details)

### Run the App

**Terminal 1 - Backend:**
```bash
cd backend
./mvnw spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 to see the store.

### Run E2E Tests
```bash
cd e2e
npm install
npx playwright install chromium
npx playwright test
```

## Repository Structure

```
cursorTraining/
├── README.md                     # This file
├── SETUP.md                      # Prerequisites & installation guide
├── AGENDA.md                     # Printable 2-day schedule
├── .cursorrules                  # Legacy coding standards (deprecated)
├── .cursor/
│   ├── mcp.json                  # MCP server configurations
│   ├── rules/                    # Project Rules (.mdc) — auto-applied standards
│   ├── commands/                 # Custom slash commands (/review, /add-endpoint)
│   └── agents/                   # Subagent definitions (refactor-agent)
│
├── backend/                      # Java Spring Boot API
│   ├── pom.xml
│   └── src/main/java/com/shopcursor/
│       ├── controller/           # REST endpoints (Products, Cart, Checkout)
│       ├── service/              # Business logic (CartService has intentional code smells!)
│       ├── model/                # JPA entities
│       ├── repository/           # Data access
│       ├── exception/            # Global error handling
│       └── config/               # CORS, data seeder
│
├── frontend/                     # React TypeScript app
│   └── src/
│       ├── api/                  # Axios API client
│       ├── components/           # ProductList (has code smells!), CartView, CheckoutForm
│       ├── pages/                # Home, Cart, Checkout, OrderConfirmation
│       ├── context/              # CartContext (global cart state)
│       └── types/                # TypeScript interfaces
│
├── e2e/                          # Playwright E2E tests
│   ├── playwright.config.ts
│   ├── tests/                    # Product, Cart, Checkout (skeleton) tests
│   └── pages/                    # Page Object Models
│
├── labs/                         # Workshop exercises
│   ├── day1/
│   │   ├── session1-ai-fundamentals/    # Prompt engineering exercises
│   │   ├── session2-cursor-ide/         # Cursor features walkthrough
│   │   └── lab/                         # Refactor & Enhance (starter + solution)
│   └── day2/
│       ├── session3-mcp-architecture/   # MCP setup & demo server
│       ├── session4-playwright-mcp/     # AI-generated E2E tests
│       ├── session5-governance/         # Code review, security, anti-patterns
│       └── lab/                         # E2E Testing lab (starter + solution)
│
├── docs/                         # Reference materials
│   ├── cursor-cheatsheet.md      # Keyboard shortcuts & prompt patterns
│   ├── mcp-cheatsheet.md         # MCP architecture & configuration
│   └── troubleshooting.md        # Common issues & fixes
│
└── scripts/                      # Setup & verification
    ├── setup.sh                  # Install all dependencies
    └── verify-setup.sh           # Check prerequisites
```

## Workshop Flow

### Day 1: Foundations

1. **Session 1 - AI Fundamentals** (`labs/day1/session1-ai-fundamentals/`)
   - Prompt engineering: zero-shot, few-shot, chain-of-thought
   - Hands-on exercises with real coding scenarios

2. **Session 2 - Cursor IDE Deep Dive** (`labs/day1/session2-cursor-ide/`)
   - Tab completion, inline editing, chat, composer, @ references
   - Agent Mode, background agents, subagents, checkpoints
   - Practice with the ShopCursor codebase

3. **Lab - Refactor & Enhance** (`labs/day1/lab/`)
   - Refactor `CartService.java` (fix code smells with Cursor)
   - Refactor `ProductList.tsx` (extract hooks, improve state)
   - Add a Wishlist feature using Composer

### Day 2: Advanced Tooling

4. **Session 3 - MCP, Skills & Commands** (`labs/day2/session3-mcp-architecture/`)
   - Understand MCP protocol and ecosystem
   - Configure filesystem and GitHub MCP servers
   - Build a custom MCP server
   - Create custom slash commands and Skills

5. **Session 4 - Playwright + MCP** (`labs/day2/session4-playwright-mcp/`)
   - Use Playwright MCP for AI-driven test generation
   - Generate and debug E2E tests with Cursor

6. **Session 5 - AI Governance** (`labs/day2/session5-governance/`)
   - BugBot automated PR review and "Fix in Cursor" workflow
   - Review AI-generated code for quality and security
   - Identify anti-patterns in AI-assisted development
   - Project Rules best practices

7. **Lab - E2E Testing** (`labs/day2/lab/`)
   - Complete checkout test skeletons
   - Generate edge case tests with AI

## Intentional Code Smells

These files contain intentional issues for refactoring exercises:

- **`backend/.../service/CartService.java`** - God method, magic numbers, poor errors, duplication
- **`frontend/.../components/ProductList.tsx`** - Mixed concerns, no custom hooks, magic strings

Look for `// WORKSHOP: Code smell` comments.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products |
| GET | `/api/products?search=query` | Search products |
| GET | `/api/products?category=Cat` | Filter by category |
| GET | `/api/products/{id}` | Get product by ID |
| GET | `/api/cart/{sessionId}` | Get cart |
| POST | `/api/cart/{sessionId}/items` | Add item to cart |
| PUT | `/api/cart/{sessionId}/items/{productId}` | Update quantity |
| DELETE | `/api/cart/{sessionId}/items/{productId}` | Remove item |
| POST | `/api/checkout/{sessionId}` | Place order |
| GET | `/api/checkout/orders/{orderId}` | Get order details |

## Need Help?

- Check [docs/troubleshooting.md](docs/troubleshooting.md) for common issues
- Reference [docs/cursor-cheatsheet.md](docs/cursor-cheatsheet.md) for shortcuts
- Look in `labs/*/solution/` directories if you get stuck
