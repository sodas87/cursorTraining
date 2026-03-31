# Custom Skills, Commands & Subagents — Hands-on Exercises

## Introduction

Cursor provides several primitives for customizing and extending agent behavior. This session covers:

| Primitive | Location | Purpose |
|-----------|----------|---------|
| **Commands** | `.cursor/commands/*.md` | Reusable prompt shortcuts (triggered with `/`) |
| **Skills** | `.cursor/skills/<name>/SKILL.md` | Multi-step procedural workflows with supporting files |
| **Subagents** | `.cursor/agents/*.md` | Specialized AI agents that run in parallel |
| **Rules** | `.cursor/rules/*.mdc` | Always-on coding standards (declarative) |
| **Hooks** | `.cursor/hooks.json` | Scripts that run before/after agent actions |
| **Plugins** | Marketplace | Bundles of skills + subagents + MCP + hooks + rules |

### Commands vs Skills vs Rules

| Aspect | Commands | Skills | Rules |
|--------|----------|--------|-------|
| **When** | On-demand (`/name`) | On-demand (`/name` or `@name`) | Automatic |
| **Scope** | Single action | Multi-step workflow | Coding standards |
| **Format** | Plain markdown | `SKILL.md` + optional scripts/files | `.mdc` with frontmatter |
| **Length** | Short prompts | Longer, procedural | Concise (< 500 lines) |
| **Best for** | "Do this one thing" | "Here's how to do X step-by-step" | "Always follow these conventions" |

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

## Exercise 3: Create a Skill

### Objective
Understand how skills differ from commands and build one.

### What is a Skill?
A skill is a **folder** inside `.cursor/skills/` containing a `SKILL.md` file and optionally supporting scripts, templates, or reference files. Skills are for multi-step procedural workflows that are too complex for a single slash command.

### Skill Format

```
.cursor/skills/
└── my-skill/
    ├── SKILL.md           # Required — instructions with YAML frontmatter
    ├── helper-script.sh   # Optional — scripts the agent can run
    └── template.java      # Optional — reference files
```

**SKILL.md format:**
```markdown
---
description: What this skill does (agent reads this to decide when to apply)
name: my-skill
---

# Skill Title

## When to Use
Describe the situations where this skill applies...

## Step-by-Step Instructions
1. First step...
2. Second step...

## Conventions
- Convention 1...
- Convention 2...
```

### Task: Explore the Existing Skill

1. **Open** `.cursor/skills/add-feature/SKILL.md` and read the skill definition

2. **Notice the differences from commands:**
   - YAML frontmatter with `description` and `name`
   - "When to Use" section for the agent's context
   - Multi-step procedural instructions
   - Lives in a folder (can have supporting files)

3. **Invoke the skill** in Agent:
   ```
   /add-feature Add a ProductReview feature with fields:
   productId (Long), reviewerName (String), rating (int 1-5),
   comment (String), createdAt (LocalDateTime)
   ```

4. **Review** the generated code — it should follow ShopCursor patterns across both backend and frontend

### Task: Create Your Own Skill

Create `.cursor/skills/debug-issue/SKILL.md`:

```markdown
---
description: Systematically debugs an issue by reproducing it, identifying the root cause, and implementing a fix with tests
name: debug-issue
---

# Debug Issue

## When to Use
When a bug is reported and you need to systematically investigate and fix it.

## Step-by-Step Instructions

1. **Reproduce** — Understand the reported behavior and identify how to trigger it
2. **Locate** — Find the relevant code using error messages, stack traces, or described behavior
3. **Root cause** — Identify why the bug occurs (don't just patch symptoms)
4. **Fix** — Implement the minimal change that addresses the root cause
5. **Test** — Write a test that fails before the fix and passes after
6. **Verify** — Run existing tests to ensure nothing else broke

## Conventions
- Fix the root cause, not the symptom
- Keep fixes minimal — don't refactor unrelated code
- Always add a regression test
- For backend: run `cd backend && ./mvnw test`
- For frontend: run `cd frontend && npm run build`
- For E2E: run `cd e2e && npx playwright test`
```

Test it by describing a bug: `/debug-issue The cart total doesn't update when quantity changes`

---

## Exercise 4: Create & Configure Subagents

### Objective
Understand how subagents work and create a custom one.

### What Are Subagents?
Subagents are **independent agents** that handle parts of a parent agent's task. They:
- Run in parallel with their own context
- Can be configured with custom prompts, models, and permissions
- Are delegated to automatically based on their `description` or explicitly via `/name`

### Subagent Format

```markdown
---
name: agent-name
description: When to delegate to this agent (be specific!)
model: inherit          # inherit | fast | specific model ID
readonly: false         # true = can't write files
is_background: false    # true = runs in background via git worktree
---

# Agent prompt instructions here...
```

**Frontmatter fields:**

| Field | Default | Purpose |
|-------|---------|---------|
| `name` | filename | Identifier (lowercase, hyphens) |
| `description` | — | **Critical** — main agent reads this to decide when to auto-delegate |
| `model` | `inherit` | `inherit`, `fast`, or specific model ID (e.g., `claude-4-sonnet`) |
| `readonly` | `false` | Restricts file write permissions |
| `is_background` | `false` | Runs in background without blocking the main agent |

### Built-in Subagents

Cursor provides three built-in subagents (no configuration needed):

| Subagent | Purpose |
|----------|---------|
| **Explore** | Searches and analyzes codebases (uses faster model) |
| **Bash** | Isolates verbose terminal output from main context |
| **Browser** | Filters noisy DOM snapshots via MCP tools |

### Task: Explore Existing Subagents

1. **Open** `.cursor/agents/refactor-agent.md` — notice the YAML frontmatter
2. **Open** `.cursor/agents/verify-agent.md` — notice `readonly: true` and `is_background: true`
3. **Try delegation** in Agent:
   - Ask: "Refactor the CartService to extract magic numbers into constants"
   - The agent should auto-delegate to the refactor-agent based on its description

### Task: Create a Documentation Subagent

Create `.cursor/agents/docs-agent.md`:

```markdown
---
name: docs-agent
description: Generates or updates documentation including JavaDoc, JSDoc, README sections, and API endpoint documentation. Delegates here when documentation needs to be written or updated.
model: fast
readonly: false
is_background: false
---

# Documentation Agent

## Role
You are a technical writer for the ShopCursor project.

## Instructions
When asked to document code:

1. **Read the code** — Understand what it does before writing docs
2. **Match the style** — Follow existing documentation patterns in the project
3. **Be concise** — Document the "why", not the "what"
4. **Include examples** — Show usage for non-obvious APIs

## Formats
- Java: JavaDoc (`/** */`) with @param, @return, @throws
- TypeScript: JSDoc (`/** */`) with @param, @returns
- REST APIs: Include method, path, request/response examples
- Components: Document props and usage

## What NOT to Do
- Don't document obvious getters/setters
- Don't add redundant comments like `// get the product`
- Don't document internal implementation details in public APIs
```

### Key Tips for Subagents

- **Descriptions are critical** — Vague descriptions = bad delegation. Be specific about when to use this agent.
- **Start small** — Begin with 2–3 subagents; add more only when you have clear, distinct use cases.
- **Parallel = independent** — Only run subagents in parallel when they touch different files. If two agents need the same file, run them sequentially.
- **Background agents** use git worktrees — they get their own copy of the codebase and merge changes back.

---

## Exercise 5: Migrate Commands to Skills

### Objective
Understand when to migrate a command to a skill and how to do it.

### When to Migrate
- Your command has grown beyond a single prompt
- You need supporting scripts or templates
- The workflow has multiple distinct steps
- You want the agent to auto-discover it based on context

### Interactive Migration
Type `/migrate-to-skills` in Agent chat — Cursor will guide you through converting existing commands.

### Manual Migration

Convert the `/add-endpoint` command to a skill:

1. **Create the skill directory:**
   ```bash
   mkdir -p .cursor/skills/add-endpoint
   ```

2. **Create `.cursor/skills/add-endpoint/SKILL.md`:**
   ```markdown
   ---
   description: Scaffolds a complete REST endpoint with service method, controller mapping, and optional repository query. Includes curl test commands.
   name: add-endpoint
   ---

   # Scaffold REST Endpoint

   ## When to Use
   When adding a new API endpoint to the ShopCursor backend.

   ## Steps
   1. Add repository query method (if needed)
   2. Add service method with business logic
   3. Add controller endpoint returning ResponseEntity
   4. Suggest curl command for testing
   5. Suggest test case

   ## Conventions
   - Return ResponseEntity<T> from controllers
   - Use constructor injection
   - Add error handling with ResourceNotFoundException
   - Follow patterns in ProductController.java and ProductService.java
   ```

3. **Test both** — The original `/add-endpoint` command and the new `/add-endpoint` skill should both work.

---

## Exercise 6: Team Workflow Commands

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

## Exercise 7: Rules Refresher

### Objective
Understand the four rule application modes and create a new rule.

### Rule Application Modes

| Mode | Frontmatter | When Applied |
|------|-------------|--------------|
| **Always Apply** | `alwaysApply: true` | Every chat session |
| **Apply Intelligently** | `alwaysApply: false` + `description` | Agent decides based on relevance |
| **Glob-based** | `globs: ["pattern"]` | When matching files are in context |
| **Manual** | Neither | Only when you `@`-mention the rule |

### Existing Rules in ShopCursor

| Rule | Mode | Applies To |
|------|------|-----------|
| `workshop.mdc` | Always Apply | All conversations |
| `java-backend.mdc` | Glob-based | `backend/**/*.java` |
| `react-frontend.mdc` | Glob-based | `frontend/**/*.tsx`, `.ts`, `.css` |

### Task: Create a Testing Rule

Create `.cursor/rules/testing.mdc` using `/create-rule` in Agent or manually:

```markdown
---
description: Testing standards for backend and E2E tests
globs: ["**/*Test.java", "**/*test*.java", "e2e/**/*.spec.ts"]
---

# Testing Rules

## Backend (JUnit 5)
- Use @SpringBootTest + @AutoConfigureMockMvc for integration tests
- Test method naming: shouldDoSomethingWhenCondition()
- Test happy path, error cases, and edge cases
- Use @Transactional for tests that modify data

## E2E (Playwright)
- Use Page Object Model pattern (pages in e2e/pages/)
- Use data-testid selectors (not CSS classes or text)
- Add explicit waits for dynamic content
- Test user flows, not implementation details
```

---

## Key Takeaways

### The `.cursor/` Ecosystem

```
.cursor/
├── mcp.json              # MCP server configurations
├── hooks.json            # Agent lifecycle hooks (format, guard, audit)
├── hooks/                # Hook scripts
├── commands/             # Slash commands (/review, /test-this)
├── rules/                # Project rules (auto-applied coding standards)
├── agents/               # Subagent definitions (refactor, verify, docs)
├── skills/               # Multi-step workflow skills
│   └── add-feature/
│       └── SKILL.md
└── plugins/              # (Managed by Cursor Marketplace)
```

All of these (except plugins) are version-controlled and shared with your team.

### Plugins & The Marketplace

Plugins bundle skills + subagents + MCP servers + hooks + rules into a single installable unit.

- **Install**: Via the Cursor Marketplace or `/add-plugin` command
- **Available plugins**: Amplitude, AWS, Figma, Linear, Stripe, Datadog, GitLab, PlanetScale, and more
- **Create your own**: Use the "Create Plugin" plugin from the marketplace
- **Team distribution**: Private marketplaces for internal plugin sharing

### Decision Guide

| I want to... | Use |
|--------------|-----|
| Enforce coding standards automatically | **Rule** (`.cursor/rules/*.mdc`) |
| Run a quick AI-driven action | **Command** (`.cursor/commands/*.md`) |
| Define a multi-step workflow | **Skill** (`.cursor/skills/<name>/SKILL.md`) |
| Delegate specialized work in parallel | **Subagent** (`.cursor/agents/*.md`) |
| Run scripts before/after agent actions | **Hook** (`.cursor/hooks.json`) |
| Bundle everything for distribution | **Plugin** (Marketplace) |
