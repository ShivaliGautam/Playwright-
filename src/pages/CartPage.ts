import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly cartTable: Locator;
  readonly emptyCartMessage: Locator;
  readonly proceedToCheckoutButton: Locator;
  readonly cartProductNames: Locator;
  readonly cartQuantityInputs: Locator;
  readonly cartItemPrices: Locator;
  readonly cartTotalPrices: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('.cart_info tbody tr');
    this.cartTable = page.locator('#cart_info_table');
    this.emptyCartMessage = page.getByText('Cart is empty!');
    this.proceedToCheckoutButton = page.getByText('Proceed To Checkout');
    this.cartProductNames = page.locator('.cart_description h4 a');
    this.cartQuantityInputs = page.locator('.cart_quantity button');
    this.cartItemPrices = page.locator('.cart_price p');
    this.cartTotalPrices = page.locator('.cart_total p');
  }

  async goto(): Promise<void> {
    await this.navigate('/view_cart');
  }

  async assertCartHasItems(): Promise<void> {
    await expect(this.cartItems.first()).toBeVisible();
  }

  async assertCartIsEmpty(): Promise<void> {
    await expect(this.emptyCartMessage).toBeVisible();
  }

  async getCartItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async assertItemInCart(productName: string): Promise<void> {
    await expect(
      this.page.locator('.cart_description h4 a', { hasText: productName })
    ).toBeVisible();
  }

  async getQuantityOfFirstItem(): Promise<string> {
    // Wait for cart to have at least one item
    await expect(this.cartItems.first()).toBeVisible();
    
    // Get the first cart row and extract the quantity value
    // The quantity is usually in the .cart_quantity td cell
    const firstRow = this.cartItems.first();
    const quantityCell = firstRow.locator('td.cart_quantity');
    
    // Get all text from the quantity cell (might contain button text)
    const allText = await quantityCell.allTextContents();
    if (allText.length > 0) {
      const text = allText[0];
      // Extract just the number (format might be: - 2 +)
      const match = text.match(/\d+/);
      if (match) return match[0];
    }
    
    // Alternative: look for input field
    const input = quantityCell.locator('input');
    if (await input.count() > 0) {
      const value = await input.first().inputValue();
      if (value) return value.trim();
    }
    
    return '1'; // Default fallback
  }
}
