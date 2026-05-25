import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../utils/world';
import { ProductsApi } from '../../api/endpoints/ProductsApi';
import { ProductsListResponse, SearchProductResponse, ApiErrorResponse } from '../../api/types/product.types';

Given('the API client is initialized', async function (this: CustomWorld): Promise<void> {
  // apiClient is set up in world.init() — just verify it exists
  if (!this.apiClient) {
    throw new Error('API client was not initialized in world.init()');
  }
});

When('I send a GET request to {string}', async function (this: CustomWorld, endpoint: string): Promise<void> {
  const productsApi = new ProductsApi(this.apiClient);
  const { BrandsApi } = await import('../../api/endpoints/BrandsApi');
  const brandsApi = new BrandsApi(this.apiClient);

  if (endpoint === '/productsList') {
    this.scenarioData['response'] = await productsApi.getProductsList();
  } else if (endpoint === '/brandsList') {
    this.scenarioData['response'] = await brandsApi.getBrandsList();
  }
});

When('I send an invalid POST request to {string}', async function (this: CustomWorld, endpoint: string): Promise<void> {
  const productsApi = new ProductsApi(this.apiClient);
  if (endpoint === '/productsList') {
    this.scenarioData['response'] = await productsApi.postProductsList();
  }
});

When('I send an invalid PUT request to {string}', async function (this: CustomWorld, endpoint: string): Promise<void> {
  const { BrandsApi } = await import('../../api/endpoints/BrandsApi');
  const brandsApi = new BrandsApi(this.apiClient);
  if (endpoint === '/brandsList') {
    this.scenarioData['response'] = await brandsApi.putBrandsList();
  }
});

When('I send a POST request to {string} with search term {string}', async function (this: CustomWorld, _endpoint: string, term: string): Promise<void> {
  const productsApi = new ProductsApi(this.apiClient);
  const response = await productsApi.searchProduct(term);
  this.scenarioData['response'] = response;
});

When('I send a POST request to {string} without the search parameter', async function (this: CustomWorld, _endpoint: string): Promise<void> {
  const productsApi = new ProductsApi(this.apiClient);
  const response = await productsApi.searchProductWithoutParam();
  this.scenarioData['response'] = response;
});

Then('the response code should be {int}', async function (this: CustomWorld, expectedCode: number): Promise<void> {
  const response = this.scenarioData['response'] as { responseCode: number };
  expect(response.responseCode).toBe(expectedCode);
});

Then('the response should contain a {string} array', async function (this: CustomWorld, arrayKey: string): Promise<void> {
  const response = this.scenarioData['response'] as Record<string, unknown>;
  expect(Array.isArray(response[arrayKey])).toBe(true);
});

Then('each product in the array should have {string}, {string}, {string}, and {string} fields', async function (
  this: CustomWorld,
  f1: string, f2: string, f3: string, f4: string
): Promise<void> {
  const response = this.scenarioData['response'] as ProductsListResponse;
  expect(response.products.length).toBeGreaterThan(0);
  for (const product of response.products) {
    expect(product).toHaveProperty(f1);
    expect(product).toHaveProperty(f2);
    expect(product).toHaveProperty(f3);
    expect(product).toHaveProperty(f4);
  }
});

Then('the response message should be {string}', async function (this: CustomWorld, expectedMessage: string): Promise<void> {
  const response = this.scenarioData['response'] as ApiErrorResponse;
  expect(response.message).toBe(expectedMessage);
});

Then('the searched products array should not be empty', async function (this: CustomWorld): Promise<void> {
  const response = this.scenarioData['response'] as SearchProductResponse;
  expect(response.products.length).toBeGreaterThan(0);
});
