import { Before, After, AfterStep, BeforeAll, AfterAll, Status } from '@cucumber/cucumber';
import { CustomWorld } from '../utils/world';
import Logger from '../utils/logger';
import * as fs from 'fs';
import * as path from 'path';

BeforeAll(async function (): Promise<void> {
  Logger.info('╔════════════════════════════════════════╗');
  Logger.info('║   TEST SUITE STARTING                  ║');
  Logger.info('╚════════════════════════════════════════╝');
  const allureDir = path.resolve('allure-results');
  const logsDir = path.resolve('logs');
  [allureDir, logsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  Logger.info(`Logs directory: ${logsDir}`);
  Logger.info(`Traces directory: ${allureDir}`);
});

AfterAll(async function (): Promise<void> {
  Logger.info('╔════════════════════════════════════════╗');
  Logger.info('║   TEST SUITE COMPLETE                  ║');
  Logger.info('╚════════════════════════════════════════╝');
});

Before(async function (this: CustomWorld, scenario): Promise<void> {
  const scenarioName = scenario.pickle.name;
  Logger.info(`┌─────────────────────────────────────────┐`);
  Logger.info(`│ SCENARIO: ${scenarioName.padEnd(28)} │`);
  Logger.info(`└─────────────────────────────────────────┘`);

  this.scenarioData = {};
  const tags = scenario.pickle.tags.map((t: { name: string }) => t.name);
  const isUiScenario = tags.includes('@ui');
  Logger.debug(`Scenario tags: ${tags.join(', ')}`, { isUiScenario });

  await this.init(isUiScenario);
});

AfterStep(async function (this: CustomWorld, step): Promise<void> {
  const stepText = step.pickleStep.text;
  const stepStatus = step.result.status;

  if (stepStatus === Status.PASSED) {
    Logger.debug(`✓ PASSED: ${stepText}`);
  } else if (stepStatus === Status.FAILED) {
    Logger.warn(`✗ FAILED: ${stepText}`);
    if (this.page) {
      try {
        const shot = await this.page.screenshot({ fullPage: true });
        await this.attach(shot, 'image/png');
        Logger.debug(`Screenshot captured for failed step`);
      } catch (error) {
        Logger.debug(`Could not capture screenshot: ${error}`);
      }
    }
  } else if (stepStatus === Status.SKIPPED) {
    Logger.debug(`⊘ SKIPPED: ${stepText}`);
  } else if (stepStatus === Status.PENDING) {
    Logger.warn(`⊙ PENDING: ${stepText}`);
  }
});

After(async function (this: CustomWorld, scenario): Promise<void> {
  const scenarioName = scenario.pickle.name;
  const status = scenario.result?.status ?? Status.UNDEFINED;
  const statusSymbol = status === Status.PASSED ? '✓' : status === Status.FAILED ? '✗' : '⊘';

  Logger.info(`${statusSymbol} END [${status}]: ${scenarioName}`);

  // Always attempt to stop tracing
  if (this.context) {
    try {
      await this.stopTracing(true);
    } catch (error) {
      Logger.debug('Error stopping trace', error as Error);
    }
  }

  // Capture additional diagnostics on failure
  if (status === Status.FAILED && this.page) {
    try {
      const url = this.page.url();
      const title = await this.page.title();
      Logger.error(`Test failed - Page URL: ${url}, Title: ${title}`);
    } catch {
      Logger.debug('Could not capture page diagnostics');
    }
  }

  await this.teardown();
  Logger.info('');
});
