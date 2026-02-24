# Cursor IDE Features - Hands-on Exercises

## Introduction
This exercise will walk you through the core features of Cursor IDE using the ShopCursor e-commerce application. By the end, you'll be comfortable using Tab completion, inline editing, Chat panel, Composer, and @ references.

---

## Exercise 1: Tab Completion

### Objective
Learn to use Cursor's intelligent Tab completion to write code faster and with fewer errors.

### Setup
Open the file: `backend/src/main/java/com/shopcursor/controller/OrderController.java`

### Task
Add a new endpoint to retrieve orders by customer ID.

### Instructions

1. **Position your cursor** below the existing endpoints in OrderController.java

2. **Type the method signature** and pause:
   ```java
   @GetMapping("/customer/{customerId}")
   public ResponseEntity<List<Order>> getOrdersByCustomer
   ```

3. **Wait for suggestion** - Cursor will suggest the complete method signature

4. **Press Tab** to accept the suggestion

5. **Continue typing** the method body:
   ```java
   {
       List<Order> orders =
   ```

6. **Press Tab again** - Cursor should suggest calling the service method

7. **Complete the implementation** using Tab completion at each step

### Expected Outcome
You should end up with something like:
```java
@GetMapping("/customer/{customerId}")
public ResponseEntity<List<Order>> getOrdersByCustomerId(@PathVariable Long customerId) {
    List<Order> orders = orderService.findByCustomerId(customerId);
    return ResponseEntity.ok(orders);
}
```

### Tips
- Pause for 1-2 seconds to let Cursor generate suggestions
- Tab accepts the suggestion, Esc dismisses it
- Cursor learns from your codebase - the more context, the better suggestions
- Works best when you have clear, consistent patterns in your code

### Challenge
Now try using Tab completion to:
1. Add JavaDoc comments to the method
2. Add input validation
3. Handle the case when no orders are found

---

## Exercise 2: Inline Editing (Cmd+K / Ctrl+K)

### Objective
Use Cursor's inline editing feature to refactor code without leaving your current file.

### Setup
Open: `backend/src/main/java/com/shopcursor/service/OrderService.java`

### Task
Refactor the `createOrder` method to improve error handling and validation.

### Instructions

1. **Select the entire `createOrder` method** (click on line number and drag, or use Shift+Arrow keys)

2. **Press Cmd+K** (Mac) or **Ctrl+K** (Windows/Linux)
   - An inline prompt box will appear

3. **Type your refactoring instruction:**
   ```
   Refactor this method to:
   - Add validation for empty cart
   - Check product stock availability
   - Add proper exception handling
   - Include transaction management
   ```

4. **Press Enter** and watch Cursor refactor the code inline

5. **Review the changes** - Cursor will show a diff with the proposed changes

6. **Accept or reject**:
   - Click "Accept" or press Cmd+Enter to apply
   - Click "Reject" or press Esc to discard

### Expected Outcome
The refactored method should include:
- Validation checks at the start
- Try-catch blocks for error handling
- @Transactional annotation
- Clear error messages

### Tips
- Be specific in your instructions
- You can iterate - if you don't like the result, press Cmd+K again
- Use inline editing for focused refactoring of a single method or class
- Great for "quick fixes" without context switching

### Challenge
Use Cmd+K to:
1. Add logging statements to the method
2. Convert the method to use a builder pattern for Order creation
3. Add JavaDoc with examples

---

## Exercise 3: Chat Panel

### Objective
Learn to use Cursor's Chat panel for code exploration, explanation, and debugging.

### Setup
Open: `backend/src/main/java/com/shopcursor/service/CartService.java`

### Task
Use Chat to understand and identify code smells in CartService.

### Instructions

1. **Open Chat panel**:
   - Press Cmd+L (Mac) or Ctrl+L (Windows/Linux)
   - Or click the chat icon in the sidebar

2. **First Chat Query** - Code Explanation:
   ```
   Explain what CartService.java does and how it manages cart state.
   ```

3. **Second Chat Query** - Code Smell Detection:
   ```
   Analyze CartService.java for code smells and anti-patterns. List specific issues with line numbers.
   ```

4. **Third Chat Query** - Specific Investigation:
   ```
   Why is the addToCart method problematic? What happens if the same product is added twice?
   ```

5. **Fourth Chat Query** - Get Suggestions:
   ```
   Suggest specific refactorings for CartService.java with code examples.
   ```

### Expected Issues Cursor Should Identify
- Magic numbers (e.g., hardcoded quantity limits)
- Poor error handling (returning null vs throwing exceptions)
- Code duplication in cart item finding logic
- Missing validation
- Inconsistent naming conventions

### Tips
- Chat maintains context - you can ask follow-up questions
- Reference specific methods or lines for focused answers
- Use Chat for learning and exploration, inline edit for changes
- Chat can see your entire codebase for context

### Challenge
Ask Chat to:
1. Compare CartService.java with best practices for service layer design
2. Suggest unit tests for the problematic methods
3. Explain the performance implications of the current implementation

---

## Exercise 4: Composer - Multi-file Editing

### Objective
Use Composer to generate a complete feature across multiple files (backend + frontend).

### Setup
Make sure you have both `backend/` and `frontend/` folders open in your workspace.

### Task
Generate a "Product Reviews" feature that spans multiple files.

### Instructions

1. **Open Composer**:
   - Press Cmd+Shift+I (Mac) or Ctrl+Shift+I (Windows/Linux)
   - Or click "Composer" in the sidebar

2. **Write a comprehensive prompt:**
   ```
   Create a product review feature for ShopCursor:

   Backend (Java/Spring Boot):
   - Review entity with fields: id, productId, userId, rating (1-5), comment, createdAt
   - ReviewRepository extending JpaRepository
   - ReviewService with methods: addReview, getReviewsByProduct, getAverageRating
   - ReviewController with REST endpoints

   Frontend (React):
   - ReviewList component to display reviews for a product
   - ReviewForm component to submit new reviews
   - Star rating UI component
   - API service functions to call backend

   Follow existing code patterns in ShopCursor. Use proper validation and error handling.
   ```

3. **Press Enter** - Composer will analyze your codebase and plan the implementation

4. **Review the plan** - Composer shows which files it will create/modify

5. **Accept the plan** - Composer will generate all files

6. **Review each file** - Check the generated code in each file

7. **Make adjustments** - If needed, ask Composer to refine specific parts:
   ```
   Add input validation to ReviewService and improve the error messages
   ```

### Expected Outcome
Composer should generate:
- `backend/src/main/java/com/shopcursor/model/Review.java`
- `backend/src/main/java/com/shopcursor/repository/ReviewRepository.java`
- `backend/src/main/java/com/shopcursor/service/ReviewService.java`
- `backend/src/main/java/com/shopcursor/controller/ReviewController.java`
- `frontend/src/components/ReviewList.jsx`
- `frontend/src/components/ReviewForm.jsx`
- `frontend/src/components/StarRating.jsx`
- `frontend/src/services/reviewService.js`

### Tips
- Composer is best for multi-file features
- Be detailed in your requirements
- Specify both backend and frontend components
- Ask Composer to follow existing patterns
- Review generated code carefully - it's a starting point

### Challenge
Use Composer to:
1. Add pagination to the reviews feature
2. Add a "helpful" voting system for reviews
3. Implement review moderation (admin approval)

---

## Exercise 5: @ References - Context Management

### Objective
Master the use of @ references to provide precise context to Cursor.

### Setup
Open Chat panel (Cmd+L or Ctrl+L)

### Task
Learn to use different @ reference types to control what Cursor sees.

### Instructions

#### Part A: @file Reference

1. **In Chat, type:**
   ```
   @CartService.java explain how items are added to the cart
   ```

2. **Notice**: Cursor focuses specifically on CartService.java

#### Part B: @folder Reference

3. **Type:**
   ```
   @backend/service/ what services exist and what is their purpose?
   ```

4. **Notice**: Cursor scans all service files

#### Part C: @symbol Reference

5. **Type:**
   ```
   @addToCart optimize this method for better performance
   ```

6. **Notice**: Cursor focuses on the specific method

#### Part D: @code Reference

7. **Select some code** in any file

8. **In Chat, type:**
   ```
   @code refactor this to use streams and lambda expressions
   ```

9. **Notice**: Cursor works with your selected code

#### Part E: @web Reference

10. **Type:**
    ```
    @web what are the latest Spring Boot best practices for service layer design in 2026?
    ```

11. **Notice**: Cursor searches the web for current information

#### Part F: Multiple References

12. **Combine references:**
    ```
    Compare @CartService.java with @OrderService.java - which one follows better practices and why?
    ```

### Reference Types Summary

| Reference | Usage | Example |
|-----------|-------|---------|
| `@file` | Reference a specific file | `@CartService.java` |
| `@folder` | Reference all files in a folder | `@backend/controller/` |
| `@symbol` | Reference a specific function/class/method | `@addToCart` |
| `@code` | Reference selected code | Select code, then `@code` |
| `@web` | Search the web | `@web latest React hooks patterns` |
| `@docs` | Reference documentation | `@docs Spring Boot validation` |
| `@git` | Reference git history | `@git recent changes to CartService` |

### Tips
- Use @ references to keep Cursor focused and reduce noise
- Combine multiple @ references for comparison tasks
- @web is great for staying current with latest practices
- @symbol is perfect when you know the exact method name
- Don't overuse @ references - sometimes full codebase context is useful

### Challenge
Accomplish these tasks using appropriate @ references:

1. **Compare implementations:**
   ```
   Compare @frontend/components/ProductCard.jsx with @backend/model/Product.java - are the field names consistent?
   ```

2. **Cross-stack question:**
   ```
   How does data flow from @ProductController.java through @ProductService.java to @frontend/services/productService.js?
   ```

3. **Research + implementation:**
   ```
   @web what are the best practices for JWT authentication in Spring Boot 2026? Then review @backend/security/ and suggest improvements.
   ```

---

## Practice Challenge: Combine All Features

### Scenario
You need to add a "Flash Sale" feature to ShopCursor where products can have temporary discounts.

### Your Task
Use ALL the features you've learned:

1. **Use Chat with @ references** to explore existing pricing logic:
   - `@Product.java @ProductService.java how is pricing currently handled?`

2. **Use Composer** to generate the flash sale feature:
   - FlashSale entity, repository, service, controller
   - Frontend components to display flash sale badge and countdown timer
   - Admin UI to create flash sales

3. **Use Tab completion** to add helper methods

4. **Use Cmd+K inline editing** to refactor generated code

5. **Use Chat** to verify your implementation:
   - Ask about edge cases
   - Request test scenarios
   - Check for security issues

### Success Criteria
- Flash sale feature works end-to-end
- Code follows ShopCursor patterns
- Proper validation and error handling
- Frontend displays flash sale information
- You used all five Cursor features effectively

---

## Key Takeaways

| Feature | When to Use | Best For |
|---------|-------------|----------|
| **Tab Completion** | While typing | Quick code writing, boilerplate |
| **Inline Edit (Cmd+K)** | Refactoring single methods/classes | Focused refactoring, quick fixes |
| **Chat Panel** | Questions and exploration | Learning, debugging, code review |
| **Composer** | Multi-file features | Full features, cross-cutting changes |
| **@ References** | Need specific context | Focused questions, comparisons |

### Golden Rules
1. Start with Chat to explore and understand
2. Use Composer for multi-file changes
3. Use inline edit for single-file refactoring
4. Let Tab completion speed up your typing
5. Use @ references to keep AI focused

---

## Next Steps

In the afternoon lab, you'll apply these features to refactor and enhance the ShopCursor application. You'll be expected to use a combination of these techniques to complete the tasks efficiently.
