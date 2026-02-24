import { test, expect } from '@playwright/test';

/**
 * Checkout Flow Tests - Starter Version
 *
 * Complete the TODOs in each test to create a comprehensive checkout test suite.
 * Use Cursor to help generate the test code following best practices.
 */

test.describe('Checkout Flow', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:5173');
  });

  /**
   * TODO: Complete this test
   *
   * Requirements:
   * - Navigate to checkout page
   * - Click submit without filling any fields
   * - Verify validation errors appear for all required fields:
   *   - name-error
   *   - email-error
   *   - address-error
   *   - city-error
   *   - zip-error
   *
   * Use data-testid selectors and proper assertions
   */
  test('should show validation errors for empty required fields', async ({ page }) => {
    // TODO: Navigate to checkout page
    // Hint: await page.goto('http://localhost:5173/checkout');

    // TODO: Find and click the submit button
    // Hint: use data-testid="submit-button"

    // TODO: Assert that validation errors are visible
    // Hint: await expect(page.getByTestId('name-error')).toBeVisible();

    // TODO: Verify error messages contain expected text
    // Example: await expect(page.getByTestId('name-error')).toContainText('required');
  });

  /**
   * TODO: Complete this test
   *
   * Requirements:
   * - Add a product to cart first
   * - Navigate to checkout
   * - Fill in valid data for all fields
   * - Submit the order
   * - Verify success message appears
   * - Verify order confirmation details
   *
   * Consider using a helper function or Page Object
   */
  test('should complete checkout successfully with valid data', async ({ page }) => {
    // TODO: Step 1 - Add product to cart
    // Hint: Search for a product, click on it, add to cart

    // TODO: Step 2 - Navigate to checkout
    // Hint: Click cart icon, then checkout button

    // TODO: Step 3 - Fill checkout form with valid data
    // Fields: name, email, address, city, zip
    // Example data:
    //   Name: "Jane Smith"
    //   Email: "jane@example.com"
    //   Address: "456 Oak Ave"
    //   City: "Portland"
    //   Zip: "97201"

    // TODO: Step 4 - Submit the order

    // TODO: Step 5 - Verify success message
    // Hint: await expect(page.getByTestId('order-success')).toBeVisible();

    // TODO: Step 6 - Verify order confirmation details
    // Check that customer name, email, and order total are displayed correctly
  });

  /**
   * TODO: Complete this test
   *
   * Requirements:
   * - Test multiple invalid email formats
   * - Verify error message appears for each
   * - Test valid email format
   * - Verify error disappears
   *
   * Test cases:
   * - "notanemail" - invalid
   * - "missing@domain" - invalid
   * - "@nodomain.com" - invalid
   * - "valid@example.com" - valid (error should disappear)
   */
  test('should validate email format', async ({ page }) => {
    // TODO: Navigate to checkout page

    // TODO: Test invalid email: "notanemail"
    // 1. Fill email input with invalid email
    // 2. Blur the input (click somewhere else)
    // 3. Assert error message is visible

    // TODO: Test invalid email: "missing@domain"
    // Repeat steps above

    // TODO: Test invalid email: "@nodomain.com"
    // Repeat steps above

    // TODO: Test valid email: "valid@example.com"
    // 1. Fill email input with valid email
    // 2. Blur the input
    // 3. Assert error message is NOT visible
    // Hint: await expect(page.getByTestId('email-error')).not.toBeVisible();
  });

  /**
   * TODO: Complete this test
   *
   * Requirements:
   * - Add 3 different products to cart
   * - Navigate to checkout
   * - Verify cart summary shows all 3 items
   * - Verify total price calculation is correct
   * - Complete checkout successfully
   *
   * This tests that the checkout process handles multiple items correctly
   */
  test('should handle checkout with multiple items', async ({ page }) => {
    // TODO: Add first product to cart
    // Hint: Create a helper function to avoid repeating code

    // TODO: Add second product to cart
    // Navigate back to products page, select different product, add to cart

    // TODO: Add third product to cart

    // TODO: Navigate to checkout page

    // TODO: Verify cart summary shows 3 items
    // Hint: const items = page.getByTestId('cart-item');
    //       await expect(items).toHaveCount(3);

    // TODO: Verify total price
    // You'll need to:
    // 1. Extract prices from cart items
    // 2. Calculate expected total
    // 3. Get displayed total
    // 4. Assert they match

    // TODO: Fill checkout form with valid data

    // TODO: Submit order

    // TODO: Verify success and that order includes all 3 items
  });

  /**
   * TODO: BONUS - Complete this test
   *
   * Requirements:
   * - Navigate directly to /checkout URL with empty cart
   * - Verify user is redirected to /cart page
   * - Verify "empty cart" message is displayed
   */
  test('should redirect to cart when checkout is attempted with empty cart', async ({ page }) => {
    // TODO: Navigate directly to checkout with empty cart
    // Hint: await page.goto('http://localhost:5173/checkout');

    // TODO: Wait for redirect to occur
    // Hint: await page.waitForURL('**/cart');

    // TODO: Verify empty cart message is visible
    // Hint: await expect(page.getByTestId('empty-cart-message')).toBeVisible();

    // TODO: Verify "Continue Shopping" button is visible
  });

  /**
   * TODO: BONUS - Complete this test
   *
   * Requirements:
   * - Fill out checkout form
   * - Submit form
   * - Verify form is cleared after successful submission
   *
   * This ensures the form resets for potential next order
   */
  test('should clear form after successful submission', async ({ page }) => {
    // TODO: Add product to cart

    // TODO: Navigate to checkout

    // TODO: Fill form with valid data
    // Store the values you enter for later verification

    // TODO: Submit order

    // TODO: Navigate back to checkout (or refresh)

    // TODO: Verify all form fields are empty
    // Hint: await expect(page.getByTestId('name-input')).toHaveValue('');
  });

});

/**
 * HELPER FUNCTIONS
 *
 * TODO: Create helper functions to reduce code duplication
 *
 * Suggestions:
 * - async function addProductToCart(page, productName)
 * - async function fillCheckoutForm(page, customerData)
 * - async function navigateToCheckout(page)
 */

// TODO: Implement helper function
// async function addProductToCart(page, productName) {
//   // Search for product
//   // Click on product
//   // Add to cart
// }

// TODO: Implement helper function
// async function fillCheckoutForm(page, customerData) {
//   // Fill all form fields with provided data
// }

// TODO: Implement helper function
// async function navigateToCheckout(page) {
//   // Click cart icon
//   // Click checkout button
// }
