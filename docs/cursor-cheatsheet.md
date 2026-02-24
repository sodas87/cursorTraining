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

## Best Practices

1. **Be specific** - "Add input validation for email field" > "make it better"
2. **Provide context** - Use @ references to give Cursor relevant files
3. **Iterate** - Start broad, then refine with follow-up prompts
4. **Review output** - Always read and understand generated code before accepting
5. **Use .cursorrules** - Set project conventions once, applied everywhere
