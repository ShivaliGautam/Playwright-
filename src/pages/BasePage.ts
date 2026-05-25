import { Page, Locator, expect } from '@playwright/test';
import config from '../../config/environments';
import Logger from '../utils/logger';

export abstract class BasePage {
  protected readonly page: Page;
  protected readonly baseUrl: string;
  protected readonly timeout: number;

  constructor(page: Page) {
    this.page = page;
    this.baseUrl = config.baseUrl;
    this.timeout = config.defaultTimeout;
  }

  async navigate(path: string = '/'): Promise<void> {
    const url = `${this.baseUrl}${path}`;
    Logger.info(`Navigating to: ${url}`);
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  async waitForVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible({ timeout: this.timeout });
  }

  async assertVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible({ timeout: this.timeout });
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }
}
