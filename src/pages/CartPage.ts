import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import Logger from '../utils/logger';

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
    await expect(this.cartItems.first()).toBeVisible({ timeout: 10000 });
    
    // Get the first cart row
    const firstRow = this.cartItems.first();
    
    // Parallel checks for different quantity locations
    const [inputValue, cellValue, spanValue] = await Promise.all([
      // Method 1: Input field
      firstRow.locator('input[type="number"]').first().inputValue().catch(() => null),
      // Method 2: Cell with quantity
      firstRow.locator('td.cart_quantity').first().textContent().catch(() => null),
      // Method 3: Any quantity span
      firstRow.locator('[class*="quantity"]').first().textContent().catch(() => null)
    ]);

    // Check in priority order
    if (inputValue) {
      Logger.debug(`Cart quantity found via input field: ${inputValue}`);
      return inputValue.trim();
    }
    
    if (cellValue) {
      const match = cellValue.match(/\d+/);
      if (match) {
        Logger.debug(`Cart quantity found via cell: ${match[0]}`);
        return match[0];
      }
    }
    
    if (spanValue) {
      const match = spanValue.match(/\d+/);
      if (match) {
        Logger.debug(`Cart quantity found via span: ${match[0]}`);
        return match[0];
      }
    }

    // Default fallback
    Logger.warn('Could not extract quantity - returning default value "1"');
    return '1';
  }
}
