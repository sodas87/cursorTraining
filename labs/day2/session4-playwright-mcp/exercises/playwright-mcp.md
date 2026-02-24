# Playwright MCP with Cursor

## Overview

In this session, you'll learn how to use the Playwright MCP (Model Context Protocol) server with Cursor to generate, run, and debug end-to-end tests for the ShopCursor application.

**What You'll Learn:**
- How to configure Playwright MCP in Cursor
- Using AI to generate Playwright tests
- Debugging tests with Cursor's assistance
- Best practices for E2E test generation

## What is Playwright MCP?

Playwright MCP is an MCP server that gives Cursor the ability to:
- **Understand** your application's UI structure
- **Generate** Playwright test code
- **Run** tests and analyze results
- **Debug** failing tests by inspecting screenshots and traces

### Benefits

- **Faster test creation**: Describe what to test, AI writes the code
- **Better test quality**: AI suggests best practices and selectors
- **Easier debugging**: AI analyzes failures and suggests fixes
- **Learning tool**: See how experienced developers write E2E tests

## Exercise 1: Set Up Playwright MCP Server

### Step 1: Install Playwright MCP Server

```bash
npm install -g @playwright/mcp-server
```

### Step 2: Configure in Cursor

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "-y",
        "@playwright/mcp-server"
      ],
      "env": {
        "PLAYWRIGHT_PROJECT_PATH": "/Users/YOUR_USERNAME/Documents/Learn/cursorTraining"
      }
    }
  }
}
```

**Important**: Replace `YOUR_USERNAME` with your actual username.

### Step 3: Verify Playwright Configuration

Ensure `playwright.config.ts` exists in your project root:

```bash
ls playwright.config.ts
```

If not, initialize Playwright:

```bash
npm init playwright@latest
```

### Step 4: Restart Cursor

Close and reopen Cursor to load the new MCP server.

### Step 5: Test the Integration

Open Cursor chat and ask:
```
Can you show me the available Playwright test files?
```

Expected: Cursor should list your test files using the Playwright MCP.

## Exercise 2: Generate a Test for Product Search

Let's use Cursor to generate a complete test for the product search feature.

### Step 1: Start the ShopCursor Application

```bash
# Terminal 1: Start backend
cd shopcursor-backend
./mvnw spring-boot:run

# Terminal 2: Start frontend
cd shopcursor-frontend
npm run dev
```

Verify the app is running at http://localhost:5173

### Step 2: Use Cursor to Generate the Test

Open Cursor chat and provide this prompt:

```
Generate a Playwright test for the ShopCursor product search feature.

Requirements:
- Test file: e2e/tests/product-search.spec.ts
- Navigate to http://localhost:5173
- Test searching for "laptop"
- Verify search results appear
- Verify at least one product is displayed
- Click on the first product
- Verify product details page loads

Use best practices:
- Use data-testid selectors where possible
- Add proper assertions
- Include helpful test descriptions
```

### Step 3: Review the Generated Test

Cursor should generate something like:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Product Search', () => {
  test('should search for products and navigate to details', async ({ page }) => {
    // Navigate to the home page
    await page.goto('http://localhost:5173');

    // Find and interact with search input
    const searchInput = page.getByTestId('search-input');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('laptop');

    // Submit search
    await page.getByTestId('search-button').click();

    // Wait for results
    await expect(page.getByTestId('product-grid')).toBeVisible();

    // Verify at least one product
    const products = page.getByTestId('product-card');
    await expect(products.first()).toBeVisible();

    // Click first product
    await products.first().click();

    // Verify details page
    await expect(page.getByTestId('product-detail')).toBeVisible();
    await expect(page.getByTestId('product-title')).toBeVisible();
    await expect(page.getByTestId('product-price')).toBeVisible();
  });
});
```

### Step 4: Run the Test

```bash
npx playwright test e2e/tests/product-search.spec.ts
```

### Step 5: View Test Results

If the test fails, Cursor can help debug:

```
The product search test failed. Can you help me debug it? Here's the error:
[paste error message]
```

## Exercise 3: Generate Full Checkout Flow Test

Now let's generate a more complex test for the complete checkout flow.

### Prompt for Cursor

```
Generate a comprehensive Playwright test for the ShopCursor checkout flow.

Requirements:
- Test file: e2e/tests/full-checkout.spec.ts
- Steps to test:
  1. Navigate to home page
  2. Search for "laptop"
  3. Add first product to cart
  4. Verify cart badge updates
  5. Navigate to cart page
  6. Verify product in cart
  7. Proceed to checkout
  8. Fill in checkout form:
     - Name: "John Doe"
     - Email: "john@example.com"
     - Address: "123 Main St"
     - City: "Boston"
     - Zip: "02101"
  9. Submit order
  10. Verify success message

Best practices:
- Use Page Object Model pattern
- Add waiting strategies for dynamic content
- Include meaningful assertions at each step
- Handle potential race conditions
```

### Expected Output

Cursor should generate:
1. **Page Object** (`pages/CartPage.ts`, `pages/CheckoutPage.ts`)
2. **Test file** with step-by-step flow
3. **Proper assertions** at each stage

### Review Checklist

- [ ] Does the test use proper selectors?
- [ ] Are there enough assertions?
- [ ] Does it handle async operations correctly?
- [ ] Is the test maintainable?

## Exercise 4: Debug a Failing Test

Let's practice debugging with Cursor's help.

### Step 1: Create a Failing Test Scenario

Modify the checkout test to use an invalid email:

```typescript
await page.getByTestId('email-input').fill('invalid-email');
```

### Step 2: Run the Test

```bash
npx playwright test e2e/tests/full-checkout.spec.ts --headed
```

The test should fail at email validation.

### Step 3: Use Cursor to Debug

Open Cursor chat:

```
My checkout test is failing with this error:
[paste error]

Here's the test code:
[paste relevant code]

The test fails when trying to submit the form with an invalid email.
Can you help me:
1. Understand why it's failing
2. Fix the test to verify email validation works
3. Add a separate test for invalid email handling
```

### Expected Cursor Response

Cursor should:
1. **Identify the issue**: Email validation is working (good!)
2. **Suggest fix**: Update test to expect validation error
3. **Generate new test**: Separate test for validation scenarios

### Step 4: Implement the Fix

Apply Cursor's suggestions:

```typescript
test('should show error for invalid email', async ({ page }) => {
  await page.goto('http://localhost:5173/checkout');

  await page.getByTestId('email-input').fill('invalid-email');
  await page.getByTestId('submit-button').click();

  // Should show validation error
  await expect(page.getByTestId('email-error')).toBeVisible();
  await expect(page.getByTestId('email-error')).toContainText('valid email');
});
```

### Step 5: Verify the Fix

```bash
npx playwright test e2e/tests/full-checkout.spec.ts
```

All tests should now pass!

## Advanced: Debugging with Trace Viewer

### Generate Trace on Failure

Update `playwright.config.ts`:

```typescript
export default defineConfig({
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
});
```

### Run Test and Analyze Trace

```bash
npx playwright test --trace on
npx playwright show-report
```

### Use Cursor to Analyze

```
I have a failing test. Here's the trace file: [path]
Can you analyze it and suggest what might be wrong?
```

## Best Practices for AI-Generated Tests

### 1. Be Specific in Prompts
❌ "Write a test for checkout"
✅ "Write a test that verifies checkout validation for empty required fields"

### 2. Request Best Practices
Include in your prompts:
- "Use data-testid selectors"
- "Add proper waiting strategies"
- "Follow Page Object Model"
- "Include descriptive assertions"

### 3. Review Before Running
Always review generated code for:
- Hard-coded values that should be configurable
- Missing error handling
- Overly brittle selectors
- Missing assertions

### 4. Iterate with AI
If the test doesn't work:
```
The test failed because [reason]. Can you update it to handle [scenario]?
```

### 5. Build a Test Library
Ask Cursor to:
- Create reusable helper functions
- Build page objects
- Generate test data utilities

## Common Patterns for E2E Test Prompts

### Pattern 1: Happy Path Test
```
Generate a test for [feature] that verifies the successful path:
- [Step 1]
- [Step 2]
- [Expected outcome]
```

### Pattern 2: Validation Test
```
Generate tests for [form] validation:
- Test each required field
- Test invalid formats
- Test boundary conditions
- Verify error messages
```

### Pattern 3: Error Handling
```
Generate a test that verifies error handling when [scenario]:
- Mock API to return error
- Verify error message displayed
- Verify UI stays functional
```

### Pattern 4: Navigation Flow
```
Generate a test that verifies navigation from [page A] to [page C]:
- Start at [page A]
- Click [element] to go to [page B]
- Verify [page B] state
- Click [element] to go to [page C]
- Verify final state
```

## Troubleshooting

### MCP Server Not Responding
1. Check `.cursor/mcp.json` configuration
2. Verify Playwright is installed: `npx playwright --version`
3. Restart Cursor
4. Check MCP logs in Cursor's output panel

### Tests Generated But Won't Run
1. Verify Playwright config exists
2. Check test file naming: `*.spec.ts`
3. Ensure test IDs exist in the application
4. Run `npx playwright test --list` to verify

### Selectors Not Working
Ask Cursor:
```
The selector [selector] isn't working. Here's the HTML:
[paste HTML]

Can you suggest a better selector?
```

### Tests Flaky
```
My test is flaky and fails intermittently. Here's the test:
[paste code]

Can you help me add proper waiting and make it more stable?
```

## Challenge: Generate a Complex Test Suite

Use Cursor to generate a complete test suite for a feature:

**Feature**: Shopping Cart Management

**Required Tests**:
1. Add single item to cart
2. Add multiple items to cart
3. Remove item from cart
4. Update item quantity
5. Clear entire cart
6. Verify cart persistence across page refresh
7. Verify cart total calculation

**Prompt Template**:
```
Generate a complete Playwright test suite for the ShopCursor shopping cart.

Create the following test files:
- e2e/tests/cart/add-to-cart.spec.ts
- e2e/tests/cart/remove-from-cart.spec.ts
- e2e/tests/cart/update-quantity.spec.ts
- e2e/tests/cart/cart-calculations.spec.ts

For each test:
- Use Page Object Model
- Include setup/teardown hooks
- Add detailed assertions
- Handle loading states
- Include comments explaining logic

Also create page objects:
- pages/HomePage.ts
- pages/ProductPage.ts
- pages/CartPage.ts
```

## Key Takeaways

1. **MCP bridges AI and tools**: Playwright MCP gives Cursor deep integration with your test framework
2. **Prompt engineering matters**: Specific, detailed prompts generate better tests
3. **AI accelerates, humans verify**: Always review and understand generated code
4. **Iterate with AI**: Use Cursor to debug and improve tests
5. **Build patterns**: Create reusable components and helpers
6. **Tests are documentation**: Well-generated tests document expected behavior

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [MCP Specification](https://modelcontextprotocol.io)
- [Cursor Documentation](https://docs.cursor.com)
