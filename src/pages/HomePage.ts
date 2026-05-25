import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  // Header nav locators
  readonly navHome: Locator;
  readonly navProducts: Locator;
  readonly navCart: Locator;
  readonly navSignupLogin: Locator;
  readonly navTestCases: Locator;
  readonly navApiTesting: Locator;
  readonly navContactUs: Locator;
  readonly navLogout: Locator;
  readonly navDeleteAccount: Locator;
  readonly navLoggedInAs: Locator;

  // Hero / banner
  readonly heroCarousel: Locator;
  readonly featuresSection: Locator;
  readonly recommendedSection: Locator;
  readonly footer: Locator;
  readonly subscriptionHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.navHome = page.getByRole('link', { name: ' Home' });
    this.navProducts = page.getByRole('link', { name: ' Products' });
    this.navCart = page.getByRole('link', { name: ' Cart' });
    this.navSignupLogin = page.getByRole('link', { name: ' Signup / Login' });
    this.navTestCases = page.getByRole('link', { name: ' Test Cases' });
    this.navApiTesting = page.getByRole('link', { name: ' API Testing' });
    this.navContactUs = page.getByRole('link', { name: ' Contact us' });
    this.navLogout = page.getByRole('link', { name: ' Logout' });
    this.navDeleteAccount = page.getByRole('link', { name: ' Delete Account' });
    this.navLoggedInAs = page.locator('a').filter({ hasText: 'Logged in as' });

    this.heroCarousel = page.locator('#slider');
    this.featuresSection = page.locator('.features_items');
    this.recommendedSection = page.locator('.recommended_items');
    this.footer = page.locator('#footer');
    this.subscriptionHeading = page.getByRole('heading', { name: 'Subscription' });
  }

  async goto(): Promise<void> {
    await this.navigate('/');
  }

  async assertHomePageLoaded(): Promise<void> {
    // Check just the hero carousel to confirm page load
    await this.assertVisible(this.heroCarousel);
  }

  async assertHeaderNavigationVisible(): Promise<void> {
    await this.assertVisible(this.navHome);
    await this.assertVisible(this.navProducts);
    await this.assertVisible(this.navCart);
    await this.assertVisible(this.navSignupLogin);
    await this.assertVisible(this.navContactUs);
  }

  async assertLoggedInAs(username: string): Promise<void> {
    await expect(this.navLoggedInAs).toContainText(username, { timeout: this.timeout });
  }

  async assertLoggedOut(): Promise<void> {
    await this.assertVisible(this.navSignupLogin);
    await expect(this.navLogout).not.toBeVisible({ timeout: this.timeout });
  }

  async clickSignupLogin(): Promise<void> {
    await this.navSignupLogin.click();
  }

  async clickProducts(): Promise<void> {
    await this.navProducts.click();
  }

  async clickCart(): Promise<void> {
    await this.navCart.click();
  }

  async clickContactUs(): Promise<void> {
    await this.navContactUs.click();
  }

  async clickLogout(): Promise<void> {
    await this.navLogout.click();
  }

  async assertSubscriptionSectionVisible(): Promise<void> {
    await this.scrollToBottom();
    await expect(this.subscriptionHeading).toBeVisible();
  }

  async assertRecommendedItemsVisible(): Promise<void> {
    await this.scrollToBottom();
    await expect(this.recommendedSection).toBeVisible();
  }
}
