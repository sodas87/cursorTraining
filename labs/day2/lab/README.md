# Day 2 Lab: E2E Testing & Advanced Features

## Overview

In this afternoon lab, you'll apply the concepts from Day 2 to build a comprehensive end-to-end test suite for ShopCursor using Playwright and Cursor's AI capabilities.

**Duration**: 2-3 hours

**Objectives**:
- Use Playwright MCP with Cursor to generate and debug tests
- Write tests for complex user flows
- Handle edge cases and error scenarios
- Apply governance best practices
- (Bonus) Explore Figma-to-code workflow

## Prerequisites

- Completed Day 1 labs
- ShopCursor application running
- Playwright configured with MCP
- Cursor with MCP servers enabled

## Setup

### 1. Start the ShopCursor Application

```bash
# Terminal 1: Backend
cd shopcursor-backend
./mvnw spring-boot:run

# Terminal 2: Frontend
cd shopcursor-frontend
npm run dev
```

Verify:
- Backend: http://localhost:8080
- Frontend: http://localhost:5173

### 2. Verify Playwright Setup

```bash
npx playwright --version
```

Expected: `Version 1.40.0` or higher

### 3. Review the Starter Test File

Open `labs/day2/lab/starter/checkout-tests.spec.ts` - this is your starting point.

## Part 1: Complete Checkout Tests (60 minutes)

Your task is to complete the skeleton test file with all the TODOs filled in.

### Task 1.1: Validation Error Test

**File**: `labs/day2/lab/starter/checkout-tests.spec.ts`

**Test**: `should show validation errors for empty required fields`

**Requirements**:
- Navigate to checkout page
- Leave all fields empty
- Click submit button
- Verify error messages appear for:
  - Name field
  - Email field
  - Address field
  - City field
  - Zip code field

**Hints**:
- Use `data-testid` selectors
- Error messages have testid pattern: `{field}-error`
- Use `expect().toBeVisible()` for assertions

**Prompt for Cursor**:
```
Complete the test "should show validation errors for empty required fields" in checkout-tests.spec.ts.

The test should:
1. Navigate to http://localhost:5173/checkout
2. Click the submit button without filling any fields
3. Verify that error messages appear for all required fields (name, email, address, city, zip)
4. Use data-testid selectors with pattern "{field}-error"

Use best practices and include clear assertions.
```

### Task 1.2: Successful Checkout Test

**Test**: `should complete checkout successfully with valid data`

**Requirements**:
- Add a product to cart first
- Navigate to checkout
- Fill in valid data:
  - Name: "Jane Smith"
  - Email: "jane@example.com"
  - Address: "456 Oak Ave"
  - City: "Portland"
  - Zip: "97201"
- Submit order
- Verify success message appears
- Verify order confirmation details

**Prompt for Cursor**:
```
Complete the test "should complete checkout successfully with valid data".

Flow:
1. Navigate to home page
2. Search for "laptop"
3. Add first product to cart
4. Go to checkout page
5. Fill in the checkout form with valid data
6. Submit the order
7. Verify success message appears
8. Verify order confirmation shows correct details

Use Page Object Model pattern if appropriate.
```

### Task 1.3: Email Validation Test

**Test**: `should validate email format`

**Requirements**:
- Test invalid email formats:
  - "notanemail"
  - "missing@domain"
  - "@nodomain.com"
- Verify error message for each
- Test valid email format
- Verify error disappears

**Prompt for Cursor**:
```
Complete the test "should validate email format".

Test cases:
1. Enter invalid email "notanemail" - should show error
2. Enter invalid email "missing@domain" - should show error
3. Enter invalid email "@nodomain.com" - should show error
4. Enter valid email "valid@example.com" - error should disappear

Check for email validation error with testid "email-error".
```

### Task 1.4: Multiple Items Checkout

**Test**: `should handle checkout with multiple items`

**Requirements**:
- Add 3 different products to cart
- Navigate to checkout
- Verify cart summary shows all 3 items
- Verify total price is correct
- Complete checkout
- Verify success

**Prompt for Cursor**:
```
Complete the test "should handle checkout with multiple items".

Steps:
1. Add 3 different products to cart
2. Navigate to checkout
3. Verify cart summary shows 3 items
4. Calculate and verify total price
5. Fill in checkout form
6. Submit order
7. Verify success and order contains all 3 items
```

### Validation

Run your tests:

```bash
npx playwright test labs/day2/lab/starter/checkout-tests.spec.ts
```

Expected: All tests pass ✅

Compare with solution:
```bash
npx playwright test labs/day2/lab/solution/checkout-tests.spec.ts
```

## Part 2: Edge Case Tests (45 minutes)

Generate new tests for edge cases and error scenarios.

### Task 2.1: Empty Cart Checkout

**Objective**: Verify user cannot checkout with empty cart

**Prompt for Cursor**:
```
Generate a Playwright test that verifies empty cart checkout handling.

Test: "should redirect to cart when attempting to checkout with empty cart"

Steps:
1. Navigate directly to /checkout with empty cart
2. User should be redirected to /cart
3. Should show message "Your cart is empty"
4. Should show "Continue Shopping" button

Save to: e2e/tests/edge-cases/empty-cart.spec.ts
```

### Task 2.2: Out of Stock Product

**Objective**: Test behavior when product goes out of stock

**Prompt for Cursor**:
```
Generate a Playwright test for out-of-stock product handling.

Test: "should show out-of-stock message and disable add to cart"

Steps:
1. Mock API to return product with stock = 0
2. Navigate to product details page
3. Verify "Out of Stock" message appears
4. Verify "Add to Cart" button is disabled
5. Verify user cannot add to cart

Include API mocking using Playwright's route interception.

Save to: e2e/tests/edge-cases/out-of-stock.spec.ts
```

### Task 2.3: Network Error Handling

**Objective**: Test graceful handling of network errors

**Prompt for Cursor**:
```
Generate tests for network error scenarios.

Tests:
1. "should show error message when API fails during checkout"
   - Simulate API failure
   - Verify error message appears
   - Verify user can retry

2. "should handle timeout gracefully"
   - Simulate slow API response
   - Verify loading indicator
   - Verify timeout error message

Use Playwright's route.abort() and route.fulfill() for mocking.

Save to: e2e/tests/edge-cases/network-errors.spec.ts
```

### Task 2.4: Concurrent Cart Updates

**Objective**: Test cart synchronization across tabs

**Prompt for Cursor**:
```
Generate a test for concurrent cart updates.

Test: "should sync cart across multiple tabs"

Steps:
1. Open application in first browser context
2. Add product to cart
3. Open same application in second browser context
4. Verify cart shows same items in both contexts
5. Remove item in first context
6. Verify removed in second context

Use Playwright's multiple contexts feature.

Save to: e2e/tests/edge-cases/cart-sync.spec.ts
```

### Validation

Run edge case tests:

```bash
npx playwright test e2e/tests/edge-cases/
```

Expected: All tests pass or appropriately fail if feature not implemented.

## Part 3: Test Refactoring (30 minutes)

Refactor your tests to use Page Object Model.

### Task 3.1: Create Page Objects

**Prompt for Cursor**:
```
Refactor the checkout tests to use Page Object Model.

Create page objects:
1. pages/HomePage.ts - search, navigation
2. pages/ProductPage.ts - product details, add to cart
3. pages/CartPage.ts - cart operations, proceed to checkout
4. pages/CheckoutPage.ts - checkout form, submit

Each page object should:
- Encapsulate selectors
- Provide methods for user actions
- Include assertions
- Use TypeScript with proper types

Then refactor checkout-tests.spec.ts to use these page objects.
```

### Task 3.2: Create Test Utilities

**Prompt for Cursor**:
```
Create reusable test utilities for common operations.

File: e2e/utils/test-helpers.ts

Utilities needed:
1. addProductToCart(page, productName) - Search and add product
2. fillCheckoutForm(page, data) - Fill all checkout fields
3. waitForApiResponse(page, endpoint) - Wait for specific API call
4. mockProduct(page, productData) - Mock product API
5. clearCart(page) - Reset cart for test isolation

Use TypeScript and include JSDoc comments.
```

### Validation

After refactoring:

```bash
npx playwright test
```

Expected: All tests still pass ✅

## Part 4: Bonus - Figma-to-Code Exercise (45 minutes)

**Note**: This is a conceptual exercise. We don't have actual Figma files, but you'll prepare the workflow.

### Task 4.1: Design Test Specification

Create a document describing how to use Cursor for Figma-to-code workflow.

**File**: `labs/day2/lab/figma-to-code-workflow.md`

Include:
1. **Process Overview**: Steps from design to code
2. **Using Figma MCP**: How to connect Figma to Cursor
3. **Generating Components**: Prompt templates
4. **Testing Generated Components**: How to verify
5. **Iteration**: Refining generated code

### Task 4.2: Mock Figma Design Test

**Scenario**: You receive a Figma design for a new "Product Quick View" modal.

**Design Description**:
- Modal overlay with product image
- Product name and price
- Quick "Add to Cart" button
- Close button (X)
- Responsive design

**Your Task**: Write prompts for Cursor to generate this component.

**File**: `labs/day2/lab/figma-prompts.md`

Include:
1. Component generation prompt
2. Styling prompt
3. Interaction logic prompt
4. Test generation prompt

**Example Prompt**:
```
Generate a React component for a Product Quick View modal.

Design specs:
- Modal overlay with backdrop (rgba(0,0,0,0.5))
- Centered modal box (600px max width)
- Product image (400x400px)
- Product name (h2, 24px, bold)
- Price (display prominently, green color)
- "Add to Cart" button (primary style)
- Close button (top-right corner)
- Smooth animations (fade in/out)
- Responsive: stack vertically on mobile

Use TypeScript, React hooks, and Tailwind CSS.
Include accessibility (ARIA labels, keyboard support).
```

### Task 4.3: Generate and Test Component

Use your prompts with Cursor to:
1. Generate the component
2. Generate stories (Storybook)
3. Generate unit tests
4. Generate E2E test

**Validation**:
```bash
npm run test -- ProductQuickView
npx playwright test product-quick-view
```

## Submission Checklist

Before completing the lab, ensure:

- [ ] All tests in `checkout-tests.spec.ts` pass
- [ ] Edge case tests created and documented
- [ ] Page objects implemented
- [ ] Test utilities created
- [ ] Code follows `.cursorrules` standards
- [ ] All tests have meaningful descriptions
- [ ] No hardcoded values (use config/constants)
- [ ] Error handling in place
- [ ] Tests are independent (no shared state)
- [ ] README updated with new tests

## Running Full Test Suite

```bash
# Run all tests
npx playwright test

# Run with UI
npx playwright test --ui

# Run specific suite
npx playwright test checkout-tests

# Run with debugging
npx playwright test --debug

# Generate report
npx playwright show-report
```

## Debugging Tips

### Test Failing?

1. **Run in headed mode**:
   ```bash
   npx playwright test --headed
   ```

2. **Use Playwright Inspector**:
   ```bash
   npx playwright test --debug
   ```

3. **Check screenshots**:
   ```bash
   open playwright-report/
   ```

4. **Ask Cursor for help**:
   ```
   My test is failing with this error: [error]
   Here's the test code: [code]
   Can you help me debug it?
   ```

### Selector Not Found?

1. Inspect the element in browser
2. Ask Cursor:
   ```
   What's the best selector for this element?
   HTML: [paste HTML]
   ```

### Flaky Test?

1. Add explicit waits
2. Wait for network idle
3. Ask Cursor:
   ```
   My test is flaky. How can I make it more stable?
   Test: [paste test]
   ```

## Stretch Goals

If you complete early, try these challenges:

### 1. Visual Regression Testing
Add visual comparison tests using Playwright's screenshot comparison.

### 2. Performance Testing
Add tests that verify page load times and API response times.

### 3. Accessibility Testing
Integrate axe-core for automated accessibility testing.

### 4. Mobile Testing
Add mobile viewport tests for responsive design.

### 5. CI/CD Integration
Create GitHub Actions workflow to run tests on every PR.

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Page Object Model](https://playwright.dev/docs/pom)
- [Test Fixtures](https://playwright.dev/docs/test-fixtures)
- [Cursor Documentation](https://docs.cursor.com)

## Getting Help

- Check the solution files: `labs/day2/lab/solution/`
- Ask the instructor
- Use Cursor chat for debugging
- Collaborate with teammates

## Next Steps

After completing this lab:
1. Review the solution code
2. Compare your implementation
3. Identify areas for improvement
4. Practice prompt engineering
5. Share learnings with the team

Good luck! 🚀
