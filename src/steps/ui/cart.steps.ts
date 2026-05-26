import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../utils/world';
import { ProductsPage } from '../../pages/ProductsPage';
import { CartPage } from '../../pages/CartPage';

When('I hover over the first product and click "Add to cart"', async function (this: CustomWorld): Promise<void> {
  const productsPage = new ProductsPage(this.page);
  await productsPage.addFirstProductToCart();
});

When('I dismiss the "Continue Shopping" modal', async function (this: CustomWorld): Promise<void> {
  const productsPage = new ProductsPage(this.page);
  await productsPage.dismissContinueShoppingModal();
});

When('I navigate to the cart page', async function (this: CustomWorld): Promise<void> {
  const cartPage = new CartPage(this.page);
  await cartPage.goto();
});

Then('the cart should contain at least one item', async function (this: CustomWorld): Promise<void> {
  const cartPage = new CartPage(this.page);
  const count = await cartPage.cartItems.count();
  expect(count).toBeGreaterThan(0);
});

Then('the item quantity in the cart should reflect {string}', { timeout: 60000 }, async function (this: CustomWorld, expectedQuantity: string): Promise<void> {
  const cartPage = new CartPage(this.page);
  // Wait briefly for cart to update and DOM render
  await this.page.waitForTimeout(500);
  const quantityText = await cartPage.getQuantityOfFirstItem();
  expect(quantityText.trim()).toBe(expectedQuantity);
});
