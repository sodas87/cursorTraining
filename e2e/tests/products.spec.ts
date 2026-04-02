import { test, expect } from '@playwright/test';
import { ProductsPage } from '../pages/ProductsPage';

test.describe('Products Page', () => {
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    productsPage = new ProductsPage(page);
    await productsPage.goto();
  });

  test('should display all products', async () => {
    await expect(productsPage.productGrid.locator('.product-card')).toHaveCount(8);
  });

  test('should filter products by category', async () => {
    await productsPage.selectCategory('Apparel');
    await expect(productsPage.productGrid.locator('.product-card')).toHaveCount(2);
  });

  test('should search products by name', async () => {
    await productsPage.searchFor('mug');
    await expect(productsPage.productGrid.locator('.product-card')).toHaveCount(1);
  });

  test('should show "All" category by default', async ({ page }) => {
    const allBtn = page.getByTestId('category-all');
    await expect(allBtn).toHaveClass(/active/);
  });

  test('should add product to cart and update badge', async () => {
    await productsPage.addToCart(1);
    await expect(productsPage.cartBadge).toHaveText('1');
  });
});
