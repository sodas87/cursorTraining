# Prompt Engineering Fundamentals

## Introduction
Effective prompt engineering is crucial for getting the best results from AI-assisted coding tools. In this exercise, you'll learn different prompting techniques that will help you work more efficiently with Cursor IDE.

---

## Exercise 1: Zero-shot vs Few-shot Prompts

### Objective
Understand the difference between zero-shot and few-shot prompting and when to use each approach.

### Task
You need to create a utility function that formats currency values for display in the ShopCursor application.

#### Part A: Zero-shot Prompt
Write a prompt that asks the AI to generate the function without providing examples.

**Example Zero-shot Prompt:**
```
Create a JavaScript utility function that formats a number as USD currency with proper comma separators and two decimal places.
```

**Expected Outcome:**
- Basic function implementation
- May miss edge cases
- Might not match your specific requirements

#### Part B: Few-shot Prompt
Now provide examples to guide the AI toward your desired implementation.

**Example Few-shot Prompt:**
```
Create a JavaScript utility function that formats a number as USD currency. Here are examples of the desired output:

Input: 1234.5 → Output: "$1,234.50"
Input: 0.99 → Output: "$0.99"
Input: 1000000 → Output: "$1,000,000.00"
Input: -50 → Output: "-$50.00"

The function should handle negative numbers and always show two decimal places.
```

**Expected Outcome:**
- More precise implementation
- Handles edge cases you specified
- Matches your formatting requirements exactly

### Tips
- Use zero-shot for straightforward tasks where conventions are well-established
- Use few-shot when you need specific formatting, style, or behavior
- Provide diverse examples that cover edge cases

---

## Exercise 2: Chain-of-thought Prompting

### Objective
Learn how to use chain-of-thought prompting to debug complex issues systematically.

### Task
The following code snippet has a bug that causes incorrect cart total calculations:

```java
public double calculateTotal(List<CartItem> items) {
    double total = 0;
    for (CartItem item : items) {
        total += item.getPrice() * item.getQuantity();
    }
    return total * 0.1; // Apply discount
}
```

#### Basic Prompt (Not Recommended)
```
Fix this cart total calculation function.
```

#### Chain-of-thought Prompt (Recommended)
```
I have a bug in my cart total calculation. Let's debug it step by step:

1. First, examine what this function is supposed to do
2. Walk through the calculation with a sample cart: 2 items at $10 each
3. Identify where the logic breaks down
4. Explain what the bug is
5. Suggest a fix with explanation

Here's the code:
[paste code]
```

### Expected Outcome
The AI will walk through the debugging process:
1. **Analysis**: Function calculates sum of (price × quantity)
2. **Sample calculation**: 2 items × $10 = $20
3. **Issue identified**: Multiplying total by 0.1 gives 10% of total, not a 10% discount
4. **Explanation**: Should subtract 10% (multiply by 0.9) or return the total without discount
5. **Fix**: Either remove the discount line or change to `total * 0.9` for 10% off

### Tips
- Break down complex problems into steps
- Ask the AI to explain its reasoning
- Use phrases like "step by step", "first... then...", "explain why"
- This approach helps catch mistakes and builds understanding

---

## Exercise 3: Role-based Prompting

### Objective
Use role-based prompting to get expert-level code reviews and architecture advice.

### Task
Get a comprehensive code review for this ProductService class.

```java
@Service
public class ProductService {
    @Autowired
    private ProductRepository repo;

    public List<Product> getAll() {
        return repo.findAll();
    }

    public Product getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public Product save(Product p) {
        return repo.save(p);
    }
}
```

#### Basic Prompt (Less Effective)
```
Review this code.
```

#### Role-based Prompt (More Effective)
```
Act as a senior Java/Spring Boot developer with 10+ years of experience in enterprise applications. Review this ProductService class and provide feedback on:

1. Error handling and exception management
2. Code quality and best practices
3. Potential bugs or edge cases
4. Performance considerations
5. Testability and maintainability

Be specific and provide code examples for improvements.

[paste code]
```

### Expected Outcome
The AI will provide a thorough review covering:
- **Error Handling**: `getById()` returning null is problematic; should throw exception
- **Naming**: Parameter `p` is not descriptive
- **Null Safety**: No validation for null inputs
- **Transaction Management**: `save()` might need `@Transactional`
- **Return Types**: Consider using `Optional<Product>` for `getById()`
- **Separation of Concerns**: Consider DTOs vs entities

### Common Roles to Use
- **Senior Developer**: For code reviews and best practices
- **Security Expert**: For security vulnerability analysis
- **Performance Engineer**: For optimization suggestions
- **QA Engineer**: For test coverage and edge cases
- **Technical Writer**: For documentation improvements

### Tips
- Be specific about the expertise level and domain
- List specific aspects you want reviewed
- Ask for code examples, not just descriptions
- Combine with chain-of-thought for deeper analysis

---

## Practice Challenge

Combine all three techniques to accomplish this task:

**Scenario**: You need to implement a product search feature with filters.

**Your Prompt Should:**
1. Use **few-shot** examples showing desired search behavior
2. Request **chain-of-thought** explanation of the implementation approach
3. Ask the AI to act as a **senior full-stack developer**

Try writing this prompt yourself before looking at the solution below.

<details>
<summary>Example Solution</summary>

```
Act as a senior full-stack developer specializing in e-commerce applications.

I need to implement a product search feature with category and price filters. Let me show you the expected behavior with examples:

Example 1:
- Search: "laptop"
- Category: "Electronics"
- Price range: $500-$1500
- Result: All laptops in Electronics category between $500-$1500

Example 2:
- Search: "" (empty)
- Category: "All"
- Price range: any
- Result: All products

Example 3:
- Search: "wireless"
- Category: "All"
- Price range: max $100
- Result: All products with "wireless" in name/description under $100

Please walk me through step-by-step:
1. What's the best approach for this feature (frontend vs backend filtering)?
2. How should the API endpoint be structured?
3. What's the optimal data structure for filters?
4. Provide implementation for both React frontend and Spring Boot backend

Focus on performance, scalability, and user experience.
```

</details>

---

## Key Takeaways

1. **Zero-shot**: Quick and simple, good for standard tasks
2. **Few-shot**: Precise control through examples, better for specific requirements
3. **Chain-of-thought**: Best for debugging, learning, and complex problem-solving
4. **Role-based**: Get expert-level insights and comprehensive reviews

**Pro Tip**: Combine these techniques! A role-based, chain-of-thought, few-shot prompt is incredibly powerful for complex tasks.

---

## Next Steps

Practice these techniques in the next session where you'll use them with Cursor IDE's features like Chat, Composer, and inline editing.
