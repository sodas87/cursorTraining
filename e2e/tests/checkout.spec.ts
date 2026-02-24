import { test, expect } from '@playwright/test';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

// WORKSHOP: This is a skeleton test file for Day 2, Session 4
// Participants will use Cursor + Playwright MCP to complete these tests

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Add a product to cart first
    const productsPage = new ProductsPage(page);
    await productsPage.goto();
    await productsPage.addToCart(1);
    await productsPage.goToCart();

    const cartPage = new CartPage(page);
    await cartPage.proceedToCheckout();
  });

  test('should display checkout form', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    await expect(checkoutPage.checkoutForm).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.placeOrder();

    // TODO: Workshop exercise - Add assertions for validation error messages
    // Hint: Check for .field-error elements
    await expect(page.locator('.field-error')).toHaveCount(3);
  });

  test('should complete checkout successfully', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.fillForm(
      'Test Developer',
      'test@example.com',
      '123 Code Street'
    );
    await checkoutPage.placeOrder();

    // Should redirect to order confirmation
    await expect(page.getByTestId('order-confirmation')).toBeVisible();
    await expect(page.getByTestId('order-total')).toContainText('59.99');
  });

  // TODO: Workshop exercise - Add more test cases:
  // - test('should validate email format')
  // - test('should show order summary on checkout page')
  // - test('should handle multiple items in checkout')
});
