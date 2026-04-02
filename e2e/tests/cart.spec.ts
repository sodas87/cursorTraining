import { test, expect } from '@playwright/test';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';

test.describe('Cart Page', () => {
  test('should show empty cart message when cart is empty', async ({ page }) => {
    const cartPage = new CartPage(page);
    await cartPage.goto();
    await expect(cartPage.emptyCart).toBeVisible();
  });

  test('should display added products in cart', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto();
    await productsPage.addToCart(1);
    await productsPage.goToCart();

    const cartPage = new CartPage(page);
    await expect(cartPage.cartView).toBeVisible();
    const cartItem = await cartPage.getCartItem(1);
    await expect(cartItem).toBeVisible();
  });

  test('should update quantity in cart', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto();
    await productsPage.addToCart(2);
    await productsPage.goToCart();

    const cartPage = new CartPage(page);
    await cartPage.increaseQuantity(2);
    await expect(page.getByTestId('quantity-2')).toHaveText('2');
  });

  test('should add hoodie, update quantity to 2, and verify total', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto();
    await productsPage.addToCart(1);
    await productsPage.goToCart();

    const cartPage = new CartPage(page);
    const cartItem = await cartPage.getCartItem(1);
    await expect(cartItem).toBeVisible();

    await expect(page.getByTestId('quantity-1')).toHaveText('1');
    await expect(cartPage.cartTotal).toContainText('$59.99');

    await cartPage.increaseQuantity(1);

    await expect(page.getByTestId('quantity-1')).toHaveText('2');
    await expect(cartPage.cartTotal).toContainText('$119.98');
  });

  test('should remove item from cart', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto();
    await productsPage.addToCart(3);
    await productsPage.goToCart();

    const cartPage = new CartPage(page);
    await cartPage.removeItem(3);
    await expect(cartPage.emptyCart).toBeVisible();
  });
});
