import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../utils/world';
import { BrandsListResponse, ApiErrorResponse } from '../../api/types/brand.types';

Then('each brand in the array should have {string} and {string} fields', async function (
  this: CustomWorld,
  f1: string,
  f2: string
): Promise<void> {
  const response = this.scenarioData['response'] as BrandsListResponse;
  expect(response.brands.length).toBeGreaterThan(0);
  for (const brand of response.brands) {
    expect(brand).toHaveProperty(f1);
    expect(brand).toHaveProperty(f2);
  }
});

Then('the brands response message should be {string}', async function (this: CustomWorld, expectedMessage: string): Promise<void> {
  const response = this.scenarioData['response'] as ApiErrorResponse;
  expect(response.message).toBe(expectedMessage);
});
