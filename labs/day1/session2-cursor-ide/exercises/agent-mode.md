# Agent Mode, Subagents & Background Agents - Hands-on Exercises

## Introduction

Cursor 2.0 introduced **Agent Mode** as the default way to work — an autonomous AI agent that plans, edits files, runs commands, and iterates until your task is done. This exercise covers Agent Mode, background agents, subagents, and checkpoints.

---

## Exercise 1: Agent Mode Basics

### Objective
Learn to use Cursor's Agent Mode for autonomous, multi-step coding tasks.

### What is Agent Mode?
Agent Mode is Cursor's autonomous coding mode. Unlike Chat (which answers questions) or Cmd+K (which edits inline), Agent Mode:
- **Plans** multi-step tasks before executing
- **Edits multiple files** across your project
- **Runs terminal commands** (build, test, lint)
- **Iterates** until the task is complete or tests pass
- **Creates checkpoints** before each edit for safe rollback

### Task
Use Agent Mode to add a `GET /api/products/featured` endpoint that returns the top 4 products by stock quantity.

### Instructions

1. **Open Agent Mode** — This is the default mode when you open the AI panel (`Cmd+L`)

2. **Write a clear task prompt:**
   ```
   Add a new endpoint GET /api/products/featured that returns the top 4 products
   sorted by stockQuantity descending.

   - Add the method to ProductService.java
   - Add the endpoint to ProductController.java
   - Follow existing code patterns in @ProductController.java
   ```

3. **Review the plan** — Agent will show you what it intends to do before executing

4. **Approve step by step** — Click "Continue" to let Agent proceed through each step

5. **Watch the execution** — Agent will:
   - Read existing files to understand patterns
   - Edit ProductService.java to add the query method
   - Edit ProductController.java to add the endpoint
   - Potentially run the build to verify

### Key Concepts

| Concept | Description |
|---------|-------------|
| **Plan phase** | Agent analyzes your request and shows intended steps |
| **Checkpoints** | Automatic snapshots before each file edit — you can rollback |
| **Auto-apply** | Agent applies changes automatically (configurable) |
| **Iteration** | Agent re-tries if build/tests fail |

### Tips
- Be specific about what you want — Agent works best with clear requirements
- Let Agent read existing code first (use @ references)
- Review each checkpoint before continuing
- If Agent goes off track, stop it and refine your prompt

---

## Exercise 2: Checkpoints & Safe Multi-File Editing

### Objective
Understand how checkpoints work and how to safely rollback changes.

### What are Checkpoints?
Every time Agent edits a file, it creates an automatic checkpoint — a snapshot of the file's state before the change. This lets you:
- Review changes incrementally
- Rollback any individual edit
- Experiment safely without fear of breaking things

### Task
Use Agent Mode to refactor CartService.java, then practice rolling back specific changes.

### Instructions

1. **Give Agent a large refactoring task:**
   ```
   Refactor @CartService.java to:
   1. Extract magic number 99 into a constant MAX_QUANTITY_PER_ITEM
   2. Replace RuntimeException with proper exception types
   3. Extract a findCartItemByProductId helper method
   4. Add descriptive error messages

   Do this step by step, one change at a time.
   ```

2. **Watch checkpoints appear** — Each edit creates a numbered checkpoint

3. **After all edits are applied**, review each change:
   - Click on each checkpoint to see the diff
   - Identify which changes you want to keep

4. **Practice rollback** — Revert one specific checkpoint while keeping others

### Tips
- Ask Agent to work "step by step" for granular checkpoints
- Use checkpoints as a safety net when experimenting
- Checkpoints are lost when you close the conversation — commit good changes

---

## Exercise 3: Background Agents & Parallel Execution

### Objective
Learn to run multiple agents in parallel for faster development.

### What are Background Agents?
Background agents run autonomously without blocking your main conversation. You can:
- Launch up to **8 parallel agents**
- Each agent works in an isolated **Git worktree** (no conflicts)
- Continue working while agents complete tasks in the background
- Review and merge results when ready

### Task
Launch two agents in parallel: one for backend, one for frontend.

### Instructions

1. **Start Agent 1** — Backend task:
   ```
   Add a GET /api/products/categories endpoint to ProductController.java
   that returns a list of distinct product categories.
   ```

2. **While Agent 1 is running**, start a new Agent conversation for the frontend:
   ```
   Add a "Sort by Price" dropdown to ProductList.tsx that sorts products
   by price ascending or descending. Follow existing filter patterns.
   ```

3. **Monitor both agents** — Each runs independently

4. **Review and accept** results from each agent

### How Git Worktree Isolation Works

```
Main branch (your work)
  ├── Agent 1 worktree → backend changes
  └── Agent 2 worktree → frontend changes
```

Each agent works on its own copy. No merge conflicts while working.

### Tips
- Use parallel agents for independent tasks (backend + frontend, feature + tests)
- Don't run parallel agents on the same files
- Review each agent's output before merging

---

## Exercise 4: Subagents

### Objective
Define reusable subagents for specialized tasks.

### What are Subagents?
Subagents are custom agent definitions stored as Markdown files. They can be:
- **Project-level**: `.cursor/agents/` (shared with team)
- **User-level**: `~/.cursor/agents/` (personal)

Each subagent has its own prompt, tool access, and optionally a different model.

### Task
Create a subagent for code refactoring and use it.

### Instructions

1. **Examine the sample subagent** in `.cursor/agents/refactor-agent.md`

2. **Create a new subagent** at `.cursor/agents/test-writer.md`:
   ```markdown
   # Test Writer Agent

   ## Role
   You are a test-writing specialist for the ShopCursor project.

   ## Instructions
   - Write JUnit 5 tests for backend Java code
   - Write Playwright tests for frontend features
   - Follow existing test patterns in the project
   - Always include positive, negative, and edge case tests
   - Use descriptive test names with @DisplayName

   ## Context
   - Backend: Java 17, Spring Boot 3.2, H2 database
   - Frontend: React 18, TypeScript
   - E2E: Playwright with Page Object Model
   ```

3. **Use the subagent** in a conversation:
   ```
   @test-writer Write tests for the featured products endpoint
   we added in Exercise 1.
   ```

### Subagent Patterns

| Pattern | Description | Example |
|---------|-------------|---------|
| **Chaining** | Pipeline: research → implement → verify | Research API → Write code → Write tests |
| **Fan-out** | Parallel specialized tasks | Backend agent + Frontend agent + Test agent |
| **Specialist** | Domain expert for specific tasks | Security reviewer, Performance optimizer |

### Tips
- Keep subagent prompts focused on one area of expertise
- Include project context so the subagent understands your stack
- Use chaining for sequential workflows, fan-out for parallel work
- Subagents inherit the parent's context but have their own conversation

---

## Practice Challenge: Full Feature with Agent Mode

### Scenario
Build a complete "Order History" feature using Agent Mode and subagents.

### Your Task

1. **Use Agent Mode** to plan and implement:
   ```
   Add an Order History page to ShopCursor:

   Backend:
   - Add GET /api/orders/history/{email} endpoint
   - Return all orders for a customer email, newest first

   Frontend:
   - Add an OrderHistory page at /orders route
   - Add a form to enter email and view past orders
   - Display order list with date, items, total, and status
   - Add navigation link in Header

   Follow existing patterns in the codebase.
   ```

2. **Use checkpoints** to review each change before accepting

3. **If available**, use the test-writer subagent to generate tests

### Success Criteria
- Agent plans the implementation before coding
- Multiple files are edited correctly
- Checkpoints are created for each edit
- The feature works end-to-end
- You feel comfortable letting Agent drive while you review

---

## Key Takeaways

| Feature | When to Use | Best For |
|---------|-------------|----------|
| **Agent Mode** | Multi-step tasks | Features spanning multiple files |
| **Checkpoints** | Any Agent edit | Safe experimentation, incremental review |
| **Background Agents** | Independent parallel tasks | Backend + frontend simultaneously |
| **Subagents** | Recurring specialized tasks | Testing, reviewing, refactoring |

### Agent Mode vs Other Modes

| Mode | Autonomy | Scope | Use Case |
|------|----------|-------|----------|
| **Tab** | Lowest | Single line | Quick completions |
| **Cmd+K** | Low | Single file | Focused inline edits |
| **Chat** | Medium | Q&A / exploration | Learning, debugging |
| **Agent** | Highest | Multi-file, multi-step | Full features, refactoring |
