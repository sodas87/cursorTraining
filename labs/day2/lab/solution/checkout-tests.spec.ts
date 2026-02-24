import { test, expect, Page } from '@playwright/test';

/**
 * Checkout Flow Tests - Complete Solution
 *
 * This file contains the complete implementation of all checkout tests
 * with best practices and proper error handling.
 */

// Test data
const VALID_CUSTOMER = {
  name: 'Jane Smith',
  email: 'jane@example.com',
  address: '456 Oak Ave',
  city: 'Portland',
  zip: '97201'
};

// Helper Functions
async function addProductToCart(page: Page, searchTerm: string = 'laptop') {
  // Search for product
  await page.getByTestId('search-input').fill(searchTerm);
  await page.getByTestId('search-button').click();

  // Wait for search results
  await expect(page.getByTestId('product-grid')).toBeVisible();

  // Click first product
  const firstProduct = page.getByTestId('product-card').first();
  await firstProduct.click();

  // Wait for product details page
  await expect(page.getByTestId('product-detail')).toBeVisible();

  // Add to cart
  await page.getByTestId('add-to-cart-button').click();

  // Wait for cart badge to update
  await expect(page.getByTestId('cart-badge')).toBeVisible();
}

async function navigateToCheckout(page: Page) {
  // Click cart icon
  await page.getByTestId('cart-icon').click();

  // Wait for cart page
  await expect(page.getByTestId('cart-page')).toBeVisible();

  // Click checkout button
  await page.getByTestId('checkout-button').click();

  // Wait for checkout page
  await expect(page.getByTestId('checkout-form')).toBeVisible();
}

async function fillCheckoutForm(page: Page, customerData: typeof VALID_CUSTOMER) {
  await page.getByTestId('name-input').fill(customerData.name);
  await page.getByTestId('email-input').fill(customerData.email);
  await page.getByTestId('address-input').fill(customerData.address);
  await page.getByTestId('city-input').fill(customerData.city);
  await page.getByTestId('zip-input').fill(customerData.zip);
}

test.describe('Checkout Flow', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('should show validation errors for empty required fields', async ({ page }) => {
    // Navigate to checkout page
    await page.goto('http://localhost:5173/checkout');

    // Wait for form to be visible
    await expect(page.getByTestId('checkout-form')).toBeVisible();

    // Click submit without filling fields
    await page.getByTestId('submit-button').click();

    // Verify all validation errors are visible
    await expect(page.getByTestId('name-error')).toBeVisible();
    await expect(page.getByTestId('email-error')).toBeVisible();
    await expect(page.getByTestId('address-error')).toBeVisible();
    await expect(page.getByTestId('city-error')).toBeVisible();
    await expect(page.getByTestId('zip-error')).toBeVisible();

    // Verify error messages contain expected text
    await expect(page.getByTestId('name-error')).toContainText(/required|must/i);
    await expect(page.getByTestId('email-error')).toContainText(/required|must/i);
    await expect(page.getByTestId('address-error')).toContainText(/required|must/i);
    await expect(page.getByTestId('city-error')).toContainText(/required|must/i);
    await expect(page.getByTestId('zip-error')).toContainText(/required|must/i);
  });

  test('should complete checkout successfully with valid data', async ({ page }) => {
    // Step 1: Add product to cart
    await addProductToCart(page, 'laptop');

    // Step 2: Navigate to checkout
    await navigateToCheckout(page);

    // Step 3: Fill checkout form with valid data
    await fillCheckoutForm(page, VALID_CUSTOMER);

    // Step 4: Submit the order
    await page.getByTestId('submit-button').click();

    // Step 5: Verify success message
    await expect(page.getByTestId('order-success')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('order-success')).toContainText(/success|confirmed/i);

    // Step 6: Verify order confirmation details
    await expect(page.getByTestId('confirmation-name')).toContainText(VALID_CUSTOMER.name);
    await expect(page.getByTestId('confirmation-email')).toContainText(VALID_CUSTOMER.email);

    // Verify order total is displayed
    await expect(page.getByTestId('order-total')).toBeVisible();

    // Verify order number is generated
    await expect(page.getByTestId('order-number')).toBeVisible();
    const orderNumber = await page.getByTestId('order-number').textContent();
    expect(orderNumber).toBeTruthy();
    expect(orderNumber?.length).toBeGreaterThan(0);
  });

  test('should validate email format', async ({ page }) => {
    // Navigate to checkout page
    await page.goto('http://localhost:5173/checkout');
    await expect(page.getByTestId('checkout-form')).toBeVisible();

    const emailInput = page.getByTestId('email-input');
    const emailError = page.getByTestId('email-error');
    const submitButton = page.getByTestId('submit-button');

    // Test invalid email: "notanemail"
    await emailInput.fill('notanemail');
    await submitButton.click();
    await expect(emailError).toBeVisible();
    await expect(emailError).toContainText(/valid|format|@/i);

    // Test invalid email: "missing@domain"
    await emailInput.clear();
    await emailInput.fill('missing@domain');
    await submitButton.click();
    await expect(emailError).toBeVisible();

    // Test invalid email: "@nodomain.com"
    await emailInput.clear();
    await emailInput.fill('@nodomain.com');
    await submitButton.click();
    await expect(emailError).toBeVisible();

    // Test valid email: error should disappear
    await emailInput.clear();
    await emailInput.fill('valid@example.com');
    await emailInput.blur(); // Trigger validation

    // Error should not be visible or should be hidden
    await expect(emailError).not.toBeVisible();
  });

  test('should handle checkout with multiple items', async ({ page }) => {
    // Add first product
    await addProductToCart(page, 'laptop');

    // Navigate back to home to add more products
    await page.goto('http://localhost:5173');

    // Add second product
    await addProductToCart(page, 'mouse');

    // Navigate back to home
    await page.goto('http://localhost:5173');

    // Add third product
    await addProductToCart(page, 'keyboard');

    // Navigate to checkout
    await navigateToCheckout(page);

    // Verify cart summary shows 3 items
    const cartItems = page.getByTestId('cart-item');
    await expect(cartItems).toHaveCount(3);

    // Verify total price calculation
    // Get all item prices
    const itemPrices = await page.getByTestId('item-price').allTextContents();
    const expectedTotal = itemPrices.reduce((sum, priceText) => {
      const price = parseFloat(priceText.replace(/[$,]/g, ''));
      return sum + price;
    }, 0);

    // Get displayed total
    const displayedTotalText = await page.getByTestId('cart-total').textContent();
    const displayedTotal = parseFloat(displayedTotalText?.replace(/[$,]/g, '') || '0');

    // Assert totals match (allowing for small floating point differences)
    expect(Math.abs(displayedTotal - expectedTotal)).toBeLessThan(0.01);

    // Fill checkout form
    await fillCheckoutForm(page, VALID_CUSTOMER);

    // Submit order
    await page.getByTestId('submit-button').click();

    // Verify success
    await expect(page.getByTestId('order-success')).toBeVisible({ timeout: 10000 });

    // Verify order includes all 3 items
    const orderItems = page.getByTestId('order-item');
    await expect(orderItems).toHaveCount(3);
  });

  test('should redirect to cart when checkout is attempted with empty cart', async ({ page }) => {
    // Navigate directly to checkout with empty cart
    await page.goto('http://localhost:5173/checkout');

    // Wait for redirect to occur
    await page.waitForURL('**/cart', { timeout: 5000 });

    // Verify we're on the cart page
    expect(page.url()).toContain('/cart');

    // Verify empty cart message is visible
    await expect(page.getByTestId('empty-cart-message')).toBeVisible();
    await expect(page.getByTestId('empty-cart-message')).toContainText(/empty|no items/i);

    // Verify "Continue Shopping" button is visible
    await expect(page.getByTestId('continue-shopping-button')).toBeVisible();
  });

  test('should clear form after successful submission', async ({ page }) => {
    // Add product to cart
    await addProductToCart(page, 'laptop');

    // Navigate to checkout
    await navigateToCheckout(page);

    // Fill form with valid data
    await fillCheckoutForm(page, VALID_CUSTOMER);

    // Submit order
    await page.getByTestId('submit-button').click();

    // Wait for success
    await expect(page.getByTestId('order-success')).toBeVisible({ timeout: 10000 });

    // Navigate back to home and then to checkout
    await page.goto('http://localhost:5173');
    await page.goto('http://localhost:5173/checkout');

    // Verify all form fields are empty (should redirect to cart if no items)
    // Or if cart persists, verify form is cleared
    await expect(page.getByTestId('name-input')).toHaveValue('');
    await expect(page.getByTestId('email-input')).toHaveValue('');
    await expect(page.getByTestId('address-input')).toHaveValue('');
    await expect(page.getByTestId('city-input')).toHaveValue('');
    await expect(page.getByTestId('zip-input')).toHaveValue('');
  });

  test('should validate zip code format', async ({ page }) => {
    await page.goto('http://localhost:5173/checkout');
    await expect(page.getByTestId('checkout-form')).toBeVisible();

    const zipInput = page.getByTestId('zip-input');
    const zipError = page.getByTestId('zip-error');
    const submitButton = page.getByTestId('submit-button');

    // Test invalid zip: too short
    await zipInput.fill('123');
    await submitButton.click();
    await expect(zipError).toBeVisible();

    // Test invalid zip: letters
    await zipInput.clear();
    await zipInput.fill('abcde');
    await submitButton.click();
    await expect(zipError).toBeVisible();

    // Test valid zip: 5 digits
    await zipInput.clear();
    await zipInput.fill('12345');
    await zipInput.blur();
    await expect(zipError).not.toBeVisible();

    // Test valid zip: 5+4 format
    await zipInput.clear();
    await zipInput.fill('12345-6789');
    await zipInput.blur();
    await expect(zipError).not.toBeVisible();
  });

  test('should show loading state during order submission', async ({ page }) => {
    // Add product to cart
    await addProductToCart(page, 'laptop');

    // Navigate to checkout
    await navigateToCheckout(page);

    // Fill form
    await fillCheckoutForm(page, VALID_CUSTOMER);

    // Submit order
    await page.getByTestId('submit-button').click();

    // Verify loading indicator appears
    await expect(page.getByTestId('loading-spinner')).toBeVisible();

    // Verify submit button is disabled during submission
    await expect(page.getByTestId('submit-button')).toBeDisabled();

    // Wait for success (loading should disappear)
    await expect(page.getByTestId('order-success')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('loading-spinner')).not.toBeVisible();
  });

  test('should persist form data on validation error', async ({ page }) => {
    await page.goto('http://localhost:5173/checkout');

    // Fill form with invalid email
    await page.getByTestId('name-input').fill(VALID_CUSTOMER.name);
    await page.getByTestId('email-input').fill('invalid-email');
    await page.getByTestId('address-input').fill(VALID_CUSTOMER.address);
    await page.getByTestId('city-input').fill(VALID_CUSTOMER.city);
    await page.getByTestId('zip-input').fill(VALID_CUSTOMER.zip);

    // Submit form
    await page.getByTestId('submit-button').click();

    // Verify email error is shown
    await expect(page.getByTestId('email-error')).toBeVisible();

    // Verify other fields still contain data
    await expect(page.getByTestId('name-input')).toHaveValue(VALID_CUSTOMER.name);
    await expect(page.getByTestId('address-input')).toHaveValue(VALID_CUSTOMER.address);
    await expect(page.getByTestId('city-input')).toHaveValue(VALID_CUSTOMER.city);
    await expect(page.getByTestId('zip-input')).toHaveValue(VALID_CUSTOMER.zip);
  });

});
