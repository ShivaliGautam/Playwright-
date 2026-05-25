import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../utils/world';
import { HomePage } from '../../pages/HomePage';

Given('I am on the home page', async function (this: CustomWorld): Promise<void> {
  const homePage = new HomePage(this.page);
  await homePage.goto();
  await homePage.assertHomePageLoaded();
});

Then('the hero carousel should be visible', async function (this: CustomWorld): Promise<void> {
  const homePage = new HomePage(this.page);
  await homePage.waitForVisible(homePage.heroCarousel);
});

Then('the featured products section should be visible', async function (this: CustomWorld): Promise<void> {
  const homePage = new HomePage(this.page);
  await homePage.waitForVisible(homePage.featuresSection);
});

Then('the footer section should be visible', async function (this: CustomWorld): Promise<void> {
  const homePage = new HomePage(this.page);
  await homePage.waitForVisible(homePage.footer);
});

Then('the subscription section should be visible in the footer', async function (this: CustomWorld): Promise<void> {
  const homePage = new HomePage(this.page);
  await homePage.assertSubscriptionSectionVisible();
});

Then('the header should contain a {string} navigation link', async function (this: CustomWorld, linkName: string): Promise<void> {
  // Special case: "Signup Login" matches the "Signup / Login" nav link
  const searchName = linkName === 'Signup Login' ? /Signup.*Login/i : new RegExp(linkName, 'i');
  const link = this.page.getByRole('link', { name: searchName });
  await expect(link).toBeVisible();
});
