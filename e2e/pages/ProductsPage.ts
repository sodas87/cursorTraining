import { Page, Locator } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly productGrid: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByTestId('search-input');
    this.productGrid = page.getByTestId('product-grid');
    this.cartLink = page.locator('.cart-link');
    this.cartBadge = page.locator('.cart-badge');
  }

  async goto() {
    await this.page.goto('/');
  }

  async searchFor(query: string) {
    await this.searchInput.fill(query);
  }

  async selectCategory(category: string) {
    await this.page.getByTestId(`category-${category.toLowerCase()}`).click();
  }

  async addToCart(productId: number) {
    await this.page.getByTestId(`add-to-cart-${productId}`).click();
  }

  async getProductCards() {
    return this.productGrid.locator('.product-card').all();
  }

  async goToCart() {
    await this.cartLink.click();
  }
}
