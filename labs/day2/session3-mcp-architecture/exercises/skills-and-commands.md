# Custom Skills & Slash Commands - Hands-on Exercises

## Introduction

Cursor supports **custom slash commands** — reusable AI prompts stored as Markdown files in your project. They standardize workflows, enforce team conventions, and automate repetitive tasks. Think of them as "macros for AI."

---

## How Slash Commands Work

```
.cursor/
├── commands/         # Custom slash commands
│   ├── review.md     # /review — AI code review
│   ├── add-endpoint.md  # /add-endpoint — Scaffold REST endpoint
│   └── test-this.md  # /test-this — Generate tests
```

- Commands are `.md` files inside `.cursor/commands/`
- They appear when you type `/` in the Agent input
- The file content becomes the AI's instruction
- They can reference project files and use @ mentions

---

## Exercise 1: Explore Existing Slash Commands

### Objective
Understand how slash commands are defined and used.

### Instructions

1. **Open** `.cursor/commands/review.md` and read the command definition

2. **Open** `.cursor/commands/add-endpoint.md` and read its structure

3. **Try the `/review` command** in Agent:
   - Open `backend/src/main/java/com/shopcursor/service/CartService.java`
   - In Agent, type: `/review`
   - Watch how it performs a structured code review

4. **Notice the pattern**: Each command file contains:
   - A clear role/persona for the AI
   - Specific instructions for what to do
   - Output format expectations
   - Context references to relevant files

---

## Exercise 2: Create a `/test-this` Slash Command

### Objective
Build a custom slash command that generates tests for selected code.

### Task
Create a `/test-this` command that writes tests following ShopCursor conventions.

### Instructions

1. **Create the file** `.cursor/commands/test-this.md`:

   ```markdown
   # Generate Tests

   Write comprehensive tests for the selected code or specified file.

   ## Instructions
   - For Java backend code: Write JUnit 5 tests with @SpringBootTest
   - For React frontend code: Write Playwright E2E tests using Page Object Model
   - For each method/component, include:
     - Happy path test
     - Error/edge case test
     - Boundary condition test
   - Follow existing test patterns in the project
   - Use descriptive test names

   ## Backend Test Patterns
   Reference: @backend/src/test/java/com/shopcursor/controller/ProductControllerTest.java

   ## E2E Test Patterns
   Reference: @e2e/tests/products.spec.ts
   Reference: @e2e/pages/ProductsPage.ts
   ```

2. **Test it** — Open `CheckoutService.java` and type `/test-this` in Agent

3. **Verify** — The generated tests should follow the project's conventions

---

## Exercise 3: Create a `/add-feature` Slash Command

### Objective
Build a more complex command that scaffolds a full-stack feature.

### Task
Create a command that generates backend model + repo + service + controller + frontend component.

### Instructions

1. **Create** `.cursor/commands/add-feature.md`:

   ```markdown
   # Scaffold Full-Stack Feature

   Generate a complete feature across backend and frontend.

   ## What I Need From You
   Provide the feature name and entity fields. Example:
   "Add a Wishlist feature with fields: userId, productId, addedAt"

   ## Backend (Java Spring Boot)
   Create in order:
   1. Model entity in `backend/src/main/java/com/shopcursor/model/`
   2. JPA Repository in `backend/src/main/java/com/shopcursor/repository/`
   3. Service with CRUD operations in `backend/src/main/java/com/shopcursor/service/`
   4. REST Controller in `backend/src/main/java/com/shopcursor/controller/`

   Follow patterns in:
   - @backend/src/main/java/com/shopcursor/model/Product.java
   - @backend/src/main/java/com/shopcursor/controller/ProductController.java

   ## Frontend (React TypeScript)
   Create:
   1. TypeScript interface in `frontend/src/types/index.ts`
   2. API functions in `frontend/src/api/client.ts`
   3. React component in `frontend/src/components/`

   Follow patterns in:
   - @frontend/src/types/index.ts
   - @frontend/src/api/client.ts
   - @frontend/src/components/ProductList.tsx
   ```

2. **Test it:**
   ```
   /add-feature Add a ProductReview feature with fields:
   productId (Long), reviewerName (String), rating (int 1-5),
   comment (String), createdAt (LocalDateTime)
   ```

3. **Review** the generated code — it should follow ShopCursor patterns

---

## Exercise 4: Team Workflow Commands

### Objective
Create commands that enforce team standards.

### Ideas for Team Commands

| Command | Purpose |
|---------|---------|
| `/review` | Structured code review with checklist |
| `/pr-description` | Generate PR title and description from staged changes |
| `/document` | Add JSDoc/JavaDoc to selected code |
| `/optimize` | Analyze and optimize selected code for performance |
| `/security-check` | Run security audit on selected code |
| `/explain` | Explain code for onboarding new team members |

### Task
Create ONE of the above commands (your choice) and test it on ShopCursor code.

### Tips for Writing Good Commands
1. **Be specific** — Include exact file paths, patterns to follow
2. **Use @ references** — Point to example files in your project
3. **Define output format** — Tell the AI exactly what you want back
4. **Include constraints** — "Don't modify existing tests", "Keep under 100 lines"
5. **Version control them** — Commands in `.cursor/commands/` are committed with your code

---

## Exercise 5: Skills with SKILL.md

### Objective
Understand how SKILL.md files define broader AI capabilities.

### What is a SKILL.md?
While slash commands are individual actions, a SKILL.md defines a broader capability with:
- Custom instructions and persona
- Multiple related operations
- Domain-specific knowledge

### Example
Create `.cursor/skills/SKILL.md`:

```markdown
# ShopCursor Development Skill

## Persona
You are a senior developer on the ShopCursor e-commerce team.

## Project Knowledge
- Backend: Java 17, Spring Boot 3.2, H2 database
- Frontend: React 18, TypeScript, Vite, plain CSS
- Testing: JUnit 5 (backend), Playwright (E2E)
- Database resets on restart (H2 in-memory)

## Conventions
- Use constructor injection (not @Autowired)
- Return ResponseEntity from controllers
- Use functional React components with hooks
- Co-locate CSS with components
- Use data-testid attributes for E2E test selectors

## When Adding Features
1. Always start with the model/entity
2. Create repository interface
3. Implement service with business logic
4. Add REST controller
5. Create TypeScript types
6. Build React components
7. Add E2E tests
```

---

## Key Takeaways

| Concept | Location | Scope |
|---------|----------|-------|
| **Slash Commands** | `.cursor/commands/*.md` | Individual actions |
| **Skills** | `.cursor/skills/SKILL.md` | Broader capabilities |
| **Subagents** | `.cursor/agents/*.md` | Specialized AI agents |
| **Project Rules** | `.cursor/rules/*.mdc` | Coding standards |

### The `.cursor/` Ecosystem

```
.cursor/
├── mcp.json          # MCP server configurations
├── commands/         # Slash commands (/review, /test-this)
├── rules/            # Project rules (auto-applied coding standards)
├── agents/           # Subagent definitions
└── skills/           # Skill definitions
```

All of these are version-controlled and shared with your team.
