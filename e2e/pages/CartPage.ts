import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartView: Locator;
  readonly emptyCart: Locator;
  readonly checkoutBtn: Locator;
  readonly cartTotal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartView = page.getByTestId('cart-view');
    this.emptyCart = page.getByTestId('empty-cart');
    this.checkoutBtn = page.getByTestId('checkout-btn');
    this.cartTotal = page.getByTestId('cart-total');
  }

  async goto() {
    await this.page.goto('/cart');
  }

  async getCartItem(productId: number) {
    return this.page.getByTestId(`cart-item-${productId}`);
  }

  async getQuantity(productId: number) {
    return this.page.getByTestId(`quantity-${productId}`).textContent();
  }

  async increaseQuantity(productId: number) {
    await this.page.getByTestId(`increase-${productId}`).click();
  }

  async decreaseQuantity(productId: number) {
    await this.page.getByTestId(`decrease-${productId}`).click();
  }

  async removeItem(productId: number) {
    await this.page.getByTestId(`remove-${productId}`).click();
  }

  async proceedToCheckout() {
    await this.checkoutBtn.click();
  }
}
