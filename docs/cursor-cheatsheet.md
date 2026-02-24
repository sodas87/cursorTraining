# Cursor IDE Cheat Sheet

## Keyboard Shortcuts

| Action | macOS | Windows/Linux |
|--------|-------|---------------|
| **Inline Edit** | `Cmd+K` | `Ctrl+K` |
| **Open Chat** | `Cmd+L` | `Ctrl+L` |
| **Open Composer** | `Cmd+I` | `Ctrl+I` |
| **Accept Suggestion** | `Tab` | `Tab` |
| **Reject Suggestion** | `Esc` | `Esc` |
| **Next Suggestion** | `Alt+]` | `Alt+]` |
| **Previous Suggestion** | `Alt+[` | `Alt+[` |
| **Toggle AI Panel** | `Cmd+Shift+L` | `Ctrl+Shift+L` |

## Chat @ References

| Reference | Purpose | Example |
|-----------|---------|---------|
| `@file` | Include a specific file | `@CartService.java explain this code` |
| `@folder` | Include all files in a folder | `@src/components what components exist?` |
| `@symbol` | Reference a function/class | `@addToCart refactor this method` |
| `@web` | Search the web for context | `@web Spring Boot 3.2 new features` |
| `@docs` | Reference documentation | `@docs Playwright assertions` |
| `@codebase` | Search entire codebase | `@codebase where is cart state managed?` |
| `@git` | Reference git history | `@git what changed in last commit?` |

## Prompt Patterns

### Refactoring
```
Refactor this function to:
1. Extract magic numbers into named constants
2. Replace the for loop with stream operations
3. Add proper error handling with descriptive messages
```

### Code Generation
```
Create a new REST endpoint that:
- Method: GET /api/products/featured
- Returns the top 4 products by stock quantity
- Follow the existing controller patterns in @ProductController.java
```

### Bug Fixing
```
This test is failing with: [paste error]
The test code is: [select code]
Help me understand why and fix it.
```

### Code Review
```
Review this code for:
- Security vulnerabilities
- Performance issues
- Code smell / design improvements
Keep the feedback concise and actionable.
```

## Agent Mode

Agent Mode is the default autonomous mode in Cursor 2.0+.

| Concept | Description |
|---------|-------------|
| **Plan → Execute** | Agent plans multi-step tasks, then executes with your approval |
| **Checkpoints** | Automatic snapshots before each edit — rollback any change |
| **Background Agents** | Run up to 8 agents in parallel (Git worktree isolation) |
| **Auto-iterate** | Agent re-tries if build/tests fail |

### Agent Mode Workflow
1. Describe your task in the AI panel
2. Agent reads codebase and plans steps
3. Review and approve the plan
4. Agent edits files, runs commands, iterates
5. Review checkpoints and accept/rollback

## Slash Commands

Custom commands stored in `.cursor/commands/` — type `/` to see them.

| Command | File | Purpose |
|---------|------|---------|
| `/review` | `.cursor/commands/review.md` | Structured code review |
| `/add-endpoint` | `.cursor/commands/add-endpoint.md` | Scaffold REST endpoint |

### Creating a Slash Command
1. Create `.cursor/commands/my-command.md`
2. Write the AI instruction as Markdown
3. Type `/my-command` in Agent to run it

## Project Rules (.cursor/rules/)

Rules auto-attach to files based on glob patterns. Replaces legacy `.cursorrules`.

| File | Glob | Purpose |
|------|------|---------|
| `java-backend.mdc` | `backend/**/*.java` | Java/Spring Boot standards |
| `react-frontend.mdc` | `frontend/**/*.tsx` | React/TypeScript standards |
| `workshop.mdc` | `**` | Workshop context |

### MDC Format
```markdown
---
description: When this rule applies
globs: ["backend/**/*.java"]
---
# Your rules here
```

## Subagents (.cursor/agents/)

Reusable AI agent definitions with specialized prompts.

```
.cursor/agents/refactor-agent.md   # Refactoring specialist
.cursor/agents/test-writer.md      # Test generation specialist
```

Reference in chat: `@refactor-agent refactor CartService.java`

## BugBot (AI Code Review)

Automated PR reviewer that catches bugs, security issues, and edge cases.

| Feature | Description |
|---------|-------------|
| **Auto-runs on PRs** | Reviews every pull request automatically |
| **Catches real bugs** | Logic errors, security issues, edge cases |
| **Fix in Cursor** | Click to jump straight to the fix |
| **Custom rules** | Teach it your team's standards via `.cursor/rules/` |

## Context Management Tips

1. **Keep conversations short** — Start fresh after completing a feature
2. **Use targeted @ references** — `@file` > `@codebase` for files >600 lines
3. **Agent reads 250 lines at a time** — Use @ to point to specific sections
4. **Don't overload context** — 2-3 specific files > entire codebase scan

## Best Practices

1. **Be specific** - "Add input validation for email field" > "make it better"
2. **Provide context** - Use @ references to give Cursor relevant files
3. **Iterate** - Start broad, then refine with follow-up prompts
4. **Review output** - Always read and understand generated code before accepting
5. **Use Project Rules** - Set conventions in `.cursor/rules/` for auto-enforcement
6. **Use Agent for multi-file tasks** - Let it plan and execute autonomously
7. **Create slash commands** - Standardize team workflows with reusable commands
8. **Review checkpoints** - Don't blindly accept — review each Agent edit
