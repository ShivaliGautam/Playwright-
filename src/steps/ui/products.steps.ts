import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../utils/world';
import { ProductsPage } from '../../pages/ProductsPage';
import { ProductDetailPage } from '../../pages/ProductDetailPage';

Given('I navigate to the products page', async function (this: CustomWorld): Promise<void> {
  const productsPage = new ProductsPage(this.page);
  await productsPage.goto();
  await productsPage.assertPageLoaded();
});

Given('I navigate to the product detail page for product {int}', async function (this: CustomWorld, productId: number): Promise<void> {
  await this.page.goto(`/product_details/${productId}`);
  const detailPage = new ProductDetailPage(this.page);
  await detailPage.assertProductDetailsVisible();
});

When('I click to view the details of the first product', async function (this: CustomWorld): Promise<void> {
  const productsPage = new ProductsPage(this.page);
  await productsPage.clickViewFirstProduct();
});

When('I search for products with keyword {string}', async function (this: CustomWorld, keyword: string): Promise<void> {
  const productsPage = new ProductsPage(this.page);
  await productsPage.searchProduct(keyword);
});

When('I click on the brand filter {string}', async function (this: CustomWorld, brand: string): Promise<void> {
  const productsPage = new ProductsPage(this.page);
  await productsPage.clickBrandFilter(brand);
});

When('I set the quantity to {string}', async function (this: CustomWorld, quantity: string): Promise<void> {
  const detailPage = new ProductDetailPage(this.page);
  await detailPage.quantityInput.clear();
  await detailPage.quantityInput.fill(quantity);
  this.scenarioData['quantity'] = quantity;
});

When('I click "Add to cart" on the product detail page', async function (this: CustomWorld): Promise<void> {
  const detailPage = new ProductDetailPage(this.page);
  await detailPage.addToCartButton.click();
  // Dismiss modal if visible
  const continueBtn = this.page.getByRole('button', { name: 'Continue Shopping' });
  const isVisible = await continueBtn.isVisible().catch(() => false);
  if (isVisible) await continueBtn.click();
});

Then('the products page heading should be visible', async function (this: CustomWorld): Promise<void> {
  const productsPage = new ProductsPage(this.page);
  await expect(productsPage.pageHeading).toBeVisible();
});

Then('multiple product cards should be displayed on the grid', async function (this: CustomWorld): Promise<void> {
  const productsPage = new ProductsPage(this.page);
  const count = await productsPage.productCards.count();
  expect(count).toBeGreaterThan(0);
});

Then('the product detail page should display the product name', async function (this: CustomWorld): Promise<void> {
  const detailPage = new ProductDetailPage(this.page);
  await expect(detailPage.productName).toBeVisible();
});

Then('the product detail page should display the product price', async function (this: CustomWorld): Promise<void> {
  const detailPage = new ProductDetailPage(this.page);
  await expect(detailPage.productPrice).toBeVisible();
});

Then('the product detail page should display availability status', async function (this: CustomWorld): Promise<void> {
  const detailPage = new ProductDetailPage(this.page);
  await expect(detailPage.productAvailability).toBeVisible();
});

Then('the product detail page should display brand information', async function (this: CustomWorld): Promise<void> {
  const detailPage = new ProductDetailPage(this.page);
  await expect(detailPage.productBrand).toBeVisible();
});

Then('the {string} heading should be visible', async function (this: CustomWorld, heading: string): Promise<void> {
  await expect(this.page.getByRole('heading', { name: heading })).toBeVisible();
});

Then('at least one product result should be displayed', async function (this: CustomWorld): Promise<void> {
  const productsPage = new ProductsPage(this.page);
  const count = await productsPage.productCards.count();
  expect(count).toBeGreaterThan(0);
});

Then('no products should be found in the results', async function (this: CustomWorld): Promise<void> {
  const productsPage = new ProductsPage(this.page);
  const count = await productsPage.productCards.count();
  expect(count).toBe(0);
});

Then('the brand products page heading should contain {string}', async function (this: CustomWorld, brand: string): Promise<void> {
  await expect(
    this.page.getByRole('heading', { name: new RegExp(brand, 'i') })
  ).toBeVisible();
});

Then('brand filtered product items should be visible', async function (this: CustomWorld): Promise<void> {
  const count = await this.page.locator('.single-products').count();
  expect(count).toBeGreaterThan(0);
});
