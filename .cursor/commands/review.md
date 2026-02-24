# Code Review

Perform a thorough code review of the selected code or current file.

## Review Checklist

Analyze the code for:

### Correctness
- Logic errors, off-by-one mistakes, wrong conditions
- Null/undefined handling
- Edge cases (empty collections, zero values, boundary conditions)

### Security
- Input validation and sanitization
- SQL injection, XSS, or injection vulnerabilities
- Sensitive data exposure
- Proper authentication/authorization checks

### Performance
- N+1 query problems
- Unnecessary loops or re-renders
- Missing pagination for large datasets
- Expensive operations that should be cached

### Code Quality
- Single responsibility principle
- Magic numbers or strings (should be constants)
- Code duplication
- Error handling (specific exceptions, not generic catch-all)
- Naming clarity

## Output Format

For each issue found:
1. **Severity**: 🐛 Bug / ⚠️ Warning / 💡 Suggestion
2. **Location**: File and line number
3. **Issue**: Clear description of the problem
4. **Fix**: Concrete suggestion for how to fix it

End with a summary: total issues by severity and an overall assessment.
