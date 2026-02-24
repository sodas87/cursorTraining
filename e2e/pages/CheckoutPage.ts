import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly addressInput: Locator;
  readonly placeOrderBtn: Locator;
  readonly checkoutForm: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.getByTestId('input-name');
    this.emailInput = page.getByTestId('input-email');
    this.addressInput = page.getByTestId('input-address');
    this.placeOrderBtn = page.getByTestId('place-order-btn');
    this.checkoutForm = page.getByTestId('checkout-form');
  }

  async goto() {
    await this.page.goto('/checkout');
  }

  async fillForm(name: string, email: string, address: string) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.addressInput.fill(address);
  }

  async placeOrder() {
    await this.placeOrderBtn.click();
  }
}
