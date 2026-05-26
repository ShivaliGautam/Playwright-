import { Browser, BrowserContext, Page, chromium, APIRequestContext, request } from '@playwright/test';
import { IWorldOptions, World, setWorldConstructor } from '@cucumber/cucumber';
import { ApiClient } from '../api/ApiClient';
import config from '../../config/environments';
import Logger from './logger';
import * as fs from 'fs';
import * as path from 'path';

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
  traceId: string = '';
  traceFilePath: string = '';

  constructor(options: CustomWorldOptions) {
    super(options);
  }

  async init(isUiScenario: boolean): Promise<void> {
    // Generate trace ID for this scenario
    this.traceId = `trace-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    Logger.setTraceId(this.traceId);
    Logger.debug('Trace initialized', { traceId: this.traceId });

    // API context — always needed
    this.apiRequestContext = await request.newContext({
      baseURL: config.apiBaseUrl,
      extraHTTPHeaders: { Accept: 'application/json' }
    });
    this.apiClient = new ApiClient(this.apiRequestContext);
    Logger.debug('API client initialized');

    // Browser — only for @ui scenarios
    if (isUiScenario) {
      Logger.info('Launching Chromium for UI scenario');
      this.browser = await chromium.launch({ headless: config.headless });
      this.context = await this.browser.newContext({
        baseURL: config.baseUrl,
        viewport: { width: 1280, height: 800 },
        recordVideo: { dir: Logger.getLogDir() },
        locale: 'en-US',
        timezoneId: 'America/New_York'
      });

      // Enable tracing
      this.traceFilePath = path.join(Logger.getTraceDir(), `${this.traceId}.zip`);
      await this.context.tracing.start({
        screenshots: true,
        snapshots: true,
        sources: true
      });
      Logger.debug('Tracing started', { tracePath: this.traceFilePath });

      this.page = await this.context.newPage();
      // Set Playwright timeout globally on the page
      this.page.setDefaultTimeout(config.defaultTimeout);
      this.page.setDefaultNavigationTimeout(config.defaultTimeout);
      Logger.debug('Page created');
    } else {
      Logger.info('API scenario — browser skipped');
    }
  }

  async stopTracing(includeAllScenarios: boolean = false): Promise<void> {
    if (this.context && this.traceFilePath) {
      try {
        await this.context.tracing.stop({ path: this.traceFilePath });
        Logger.info('Trace recorded successfully', { tracePath: this.traceFilePath });
      } catch (error) {
        Logger.error('Failed to stop tracing', error as Error);
      }
    }
  }

  async teardown(): Promise<void> {
    try {
      // Stop tracing before closing context
      await this.stopTracing();
    } catch (error) {
      Logger.debug('Tracing already stopped or not started');
    }

    if (this.page) {
      await this.page.close().catch(() => undefined);
      Logger.debug('Page closed');
    }
    if (this.context) {
      await this.context.close().catch(() => undefined);
      Logger.debug('Browser context closed');
    }
    if (this.browser) {
      await this.browser.close().catch(() => undefined);
      Logger.debug('Browser closed');
    }
    if (this.apiRequestContext) {
      await this.apiRequestContext.dispose().catch(() => undefined);
      Logger.debug('API request context disposed');
    }

    Logger.setTraceId('');
  }
}

setWorldConstructor(CustomWorld);
