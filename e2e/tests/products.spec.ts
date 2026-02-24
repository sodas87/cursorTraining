import { test, expect } from '@playwright/test';
import { ProductsPage } from '../pages/ProductsPage';

test.describe('Products Page', () => {
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    productsPage = new ProductsPage(page);
    await productsPage.goto();
  });

  test('should display all products', async () => {
    const cards = await productsPage.getProductCards();
    expect(cards.length).toBe(8);
  });

  test('should filter products by category', async () => {
    await productsPage.selectCategory('Apparel');
    const cards = await productsPage.getProductCards();
    expect(cards.length).toBe(2);
  });

  test('should search products by name', async () => {
    await productsPage.searchFor('mug');
    const cards = await productsPage.getProductCards();
    expect(cards.length).toBe(1);
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
