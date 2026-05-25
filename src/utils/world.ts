import { Browser, BrowserContext, Page, chromium, APIRequestContext, request } from '@playwright/test';
import { IWorldOptions, World, setWorldConstructor } from '@cucumber/cucumber';
import { ApiClient } from '../api/ApiClient';
import config from '../../config/environments';
import Logger from './logger';

export interface CustomWorldOptions extends IWorldOptions {
  parameters: Record<string, string>;
}

export class CustomWorld extends World {
  browser: Browser | undefined;
  context: BrowserContext | undefined;
  page!: Page;
  apiRequestContext!: APIRequestContext;
  apiClient!: ApiClient;
  scenarioData: Record<string, unknown> = {};

  constructor(options: CustomWorldOptions) {
    super(options);
  }

  async init(isUiScenario: boolean): Promise<void> {
    // API context — always needed
    this.apiRequestContext = await request.newContext({
      baseURL: config.apiBaseUrl,
      extraHTTPHeaders: { Accept: 'application/json' }
    });
    this.apiClient = new ApiClient(this.apiRequestContext);

    // Browser — only for @ui scenarios
    if (isUiScenario) {
      Logger.info('Launching Chromium for UI scenario');
      this.browser = await chromium.launch({ headless: config.headless });
      this.context = await this.browser.newContext({
        baseURL: config.baseUrl,
        viewport: { width: 1280, height: 800 }
      });
      this.page = await this.context.newPage();
    } else {
      Logger.info('API scenario — browser skipped');
    }
  }

  async teardown(): Promise<void> {
    if (this.page)               await this.page.close().catch(() => undefined);
    if (this.context)            await this.context.close().catch(() => undefined);
    if (this.browser)            await this.browser.close().catch(() => undefined);
    if (this.apiRequestContext)  await this.apiRequestContext.dispose().catch(() => undefined);
  }
}

setWorldConstructor(CustomWorld);
