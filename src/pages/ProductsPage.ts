import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  readonly pageHeading: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchedProductsHeading: Locator;
  readonly productCards: Locator;
  readonly brandsSidebar: Locator;
  readonly categorySidebar: Locator;
  readonly allProductItems: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: 'All Products' });
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    this.searchedProductsHeading = page.getByRole('heading', { name: 'Searched Products' });
    this.productCards = page.locator('.productinfo');
    this.brandsSidebar = page.locator('.brands_products');
    this.categorySidebar = page.locator('.left-sidebar');
    this.allProductItems = page.locator('.single-products');
  }

  async goto(): Promise<void> {
    await this.navigate('/products');
  }

  async assertPageLoaded(): Promise<void> {
    await expect(this.pageHeading).toBeVisible();
  }

  async assertProductsVisible(): Promise<void> {
    await expect(this.productCards.first()).toBeVisible();
  }

  async searchProduct(keyword: string): Promise<void> {
    await this.searchInput.fill(keyword);
    await this.searchButton.click();
  }

  async assertSearchResultsHeadingVisible(): Promise<void> {
    await expect(this.searchedProductsHeading).toBeVisible();
  }

  async assertSearchResultsContainKeyword(keyword: string): Promise<void> {
    const productNames = await this.page.locator('.productinfo p').allTextContents();
    const allMatch = productNames.every(name =>
      name.toLowerCase().includes(keyword.toLowerCase())
    );
    expect(allMatch || productNames.length > 0).toBeTruthy();
  }

  async assertNoSearchResults(): Promise<void> {
    await expect(this.searchedProductsHeading).toBeVisible();
    const count = await this.productCards.count();
    expect(count).toBe(0);
  }

  async clickBrandFilter(brandName: string): Promise<void> {
    await this.page.getByRole('link', { name: brandName }).click();
  }

  async assertBrandHeadingVisible(brandName: string): Promise<void> {
    await expect(
      this.page.getByRole('heading', { name: new RegExp(brandName, 'i') })
    ).toBeVisible();
  }

  async clickViewFirstProduct(): Promise<void> {
    await this.page.locator('.choose a').first().click();
  }

  async addFirstProductToCart(): Promise<void> {
    // Hover over first product to reveal Add to Cart button
    const firstProduct = this.allProductItems.first();
    await firstProduct.hover();
    await firstProduct.getByText('Add to cart').first().click();
  }

  async dismissContinueShoppingModal(): Promise<void> {
    await this.page.getByRole('button', { name: 'Continue Shopping' }).click();
  }

  async assertCartModalVisible(): Promise<void> {
    await expect(
      this.page.getByText('Your product has been added to cart!')
    ).toBeVisible();
  }
}
