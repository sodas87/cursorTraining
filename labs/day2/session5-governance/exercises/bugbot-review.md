# BugBot & AI-Powered Code Review - Hands-on Exercises

## Introduction

**BugBot** is Cursor's automated AI code reviewer that runs on every pull request. It catches logic bugs, edge cases, and security issues — and is especially effective at reviewing AI-generated code. This exercise covers configuring BugBot, understanding its output, and building team review workflows.

---

## What is BugBot?

- Runs **automatically on new PRs** in GitHub
- Focuses on **production-relevant defects** (not style/formatting)
- Catches: logic bugs, edge cases, security issues, race conditions
- Posts comments directly on the relevant code lines
- Includes a **"Fix in Cursor"** button to jump to the fix

### What BugBot Looks For

| Category | Examples |
|----------|---------|
| **Logic bugs** | Off-by-one errors, wrong conditions, missing null checks |
| **Edge cases** | Empty arrays, zero values, concurrent access |
| **Security** | SQL injection, XSS, insecure deserialization |
| **Error handling** | Swallowed exceptions, missing error paths |
| **AI-specific** | Hallucinated APIs, incorrect patterns, copy-paste errors |

### What BugBot Does NOT Flag
- Code style issues (use linters for that)
- Formatting (use Prettier/Checkstyle)
- Low-severity suggestions
- Personal preferences

---

## Exercise 1: Understanding BugBot Output

### Objective
Learn to read and act on BugBot review comments.

### Scenario
Below is a simulated BugBot review of a PR adding a discount feature. Analyze each comment.

### Sample PR Diff — `DiscountService.java`
```java
@Service
public class DiscountService {

    @Autowired
    private ProductRepository productRepository;

    public BigDecimal applyDiscount(Long productId, int discountPercent) {
        Product product = productRepository.findById(productId).get(); // BugBot: ⚠️

        BigDecimal discount = product.getPrice()
            .multiply(BigDecimal.valueOf(discountPercent / 100));      // BugBot: 🐛

        BigDecimal finalPrice = product.getPrice().subtract(discount);

        if (finalPrice.compareTo(BigDecimal.ZERO) < 0) {
            return BigDecimal.ZERO;
        }

        return finalPrice;
    }

    public void applyBulkDiscount(List<Long> productIds, int discountPercent) {
        for (Long id : productIds) {
            applyDiscount(id, discountPercent);                        // BugBot: ⚠️
        }
    }
}
```

### Task
Identify the bugs BugBot would flag:

1. **Line 8**: `.findById(productId).get()` — What's the bug?
2. **Line 11**: `discountPercent / 100` — What's the bug?
3. **Line 23**: `applyBulkDiscount` — What's the issue?

<details>
<summary>Answers</summary>

1. **NoSuchElementException**: `.get()` without `.orElseThrow()` will crash if product not found
2. **Integer division**: `discountPercent / 100` is integer division — `50 / 100 = 0`, not `0.5`. Should be `discountPercent / 100.0` or `BigDecimal.valueOf(discountPercent).divide(BigDecimal.valueOf(100))`
3. **Silent no-op**: `applyDiscount` returns the new price but `applyBulkDiscount` discards it — the products are never actually updated. Also no `@Transactional` for batch operation.

</details>

---

## Exercise 2: Configure BugBot Rules

### Objective
Customize BugBot's behavior for your project.

### How to Configure BugBot
BugBot reads rules from `.cursor/rules/` files in your repository. You can teach it your team's specific requirements.

### Task
Create a BugBot-aware rule file at `.cursor/rules/code-review.mdc`:

```markdown
---
description: Code review standards for ShopCursor
globs: ["**/*.java", "**/*.tsx"]
---

# Code Review Standards

## Security Requirements
- All user input must be validated before processing
- Never use .get() on Optional — always use .orElseThrow()
- Never concatenate strings in SQL queries
- Sanitize all output rendered in React components

## Error Handling Requirements
- Services must throw specific exception types (not RuntimeException)
- Controllers must return proper HTTP status codes
- Frontend must show user-friendly error messages

## Performance Requirements
- Database queries in loops are not allowed (N+1 problem)
- Large collections must use pagination
- Expensive computations should be cached

## Testing Requirements
- All new endpoints must have at least one integration test
- All new components must have E2E test coverage
- Edge cases must be tested (empty, null, boundary values)
```

### Verify
These rules will be automatically picked up by both BugBot (on PRs) and Agent mode (while coding).

---

## Exercise 3: "Fix in Cursor" Workflow

### Objective
Practice the full BugBot → Fix in Cursor → Push workflow.

### Simulated Workflow

1. **BugBot flags an issue** on a PR comment:
   > 🐛 **Integer division bug**: `discountPercent / 100` performs integer division. For `discountPercent=50`, this evaluates to `0` instead of `0.5`. Use `BigDecimal.valueOf(discountPercent).divide(BigDecimal.valueOf(100))` instead.
   >
   > [Fix in Cursor →]

2. **You click "Fix in Cursor"** — Cursor opens with the fix pre-loaded

3. **Review the suggested fix** — Agent shows the diff

4. **Accept and push** — The fix is applied and pushed to the PR

### Hands-on Practice
Since we can't run BugBot on this repo without a PR, simulate the workflow:

1. **Open** `CartService.java`
2. **Pretend BugBot flagged** the magic number `99`:
   > ⚠️ Magic number `99` used in multiple places. Extract to a named constant for maintainability.
3. **Use Agent Mode** to fix it:
   ```
   BugBot flagged magic number 99 in CartService.java.
   Extract it to a constant MAX_QUANTITY_PER_ITEM and replace all occurrences.
   ```
4. **Review the checkpoint and accept**

---

## Exercise 4: Building a Review Checklist

### Objective
Create a team review workflow combining BugBot + human review.

### Task
Design a PR review process for ShopCursor:

```markdown
## ShopCursor PR Review Process

### Automated (BugBot)
- [ ] No security vulnerabilities flagged
- [ ] No logic bugs detected
- [ ] No unhandled edge cases

### Human Review
- [ ] Feature matches requirements
- [ ] Code follows ShopCursor patterns
- [ ] Error messages are user-friendly
- [ ] New code has test coverage
- [ ] No unnecessary complexity added

### Before Merge
- [ ] All BugBot comments resolved
- [ ] At least 1 human approval
- [ ] CI pipeline passes
- [ ] No TODO/FIXME left unaddressed
```

### Discussion Questions
1. When should you trust BugBot's suggestions vs override them?
2. How do you handle BugBot false positives?
3. What should humans review that BugBot can't?
4. How does reviewing AI-generated code differ from human-written code?

---

## Key Takeaways

| Tool | What It Does | When It Runs |
|------|-------------|--------------|
| **BugBot** | Automated AI code review | On every PR |
| **Agent Mode** | Fix flagged issues | When developer clicks "Fix in Cursor" |
| **Project Rules** | Define team standards | Always (applied to both BugBot and Agent) |
| **Slash Commands** | Manual review triggers | When developer runs `/review` |

### Best Practices
1. **Let BugBot catch the obvious** — Focus human review on architecture and design
2. **Customize rules for your team** — Generic rules miss domain-specific issues
3. **Review AI-generated code extra carefully** — BugBot is especially good at this
4. **Iterate on rules** — Update `.cursor/rules/` based on recurring issues
5. **Don't suppress warnings** — Fix the root cause instead
