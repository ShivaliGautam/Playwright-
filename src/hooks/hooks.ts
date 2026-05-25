import { Before, After, AfterStep, BeforeAll, AfterAll, Status } from '@cucumber/cucumber';
import { CustomWorld } from '../utils/world';
import Logger from '../utils/logger';
import * as fs from 'fs';
import * as path from 'path';

BeforeAll(async function (): Promise<void> {
  Logger.info('=== TEST SUITE STARTING ===');
  const allureDir = path.resolve('allure-results');
  if (!fs.existsSync(allureDir)) {
    fs.mkdirSync(allureDir, { recursive: true });
  }
});

AfterAll(async function (): Promise<void> {
  Logger.info('=== TEST SUITE COMPLETE ===');
});

Before(async function (this: CustomWorld, scenario): Promise<void> {
  Logger.info(`START: ${scenario.pickle.name}`);
  this.scenarioData = {};
  const tags = scenario.pickle.tags.map((t: { name: string }) => t.name);
  const isUiScenario = tags.includes('@ui');
  await this.init(isUiScenario);
});

AfterStep(async function (this: CustomWorld, step): Promise<void> {
  if (step.result.status === Status.FAILED) {
    Logger.warn(`Step FAILED: ${step.pickleStep.text}`);
    if (this.page) {
      try {
        const shot = await this.page.screenshot({ fullPage: true });
        await this.attach(shot, 'image/png');
      } catch { /* ignore */ }
    }
  }
});

After(async function (this: CustomWorld, scenario): Promise<void> {
  Logger.info(`END [${scenario.result?.status ?? 'UNKNOWN'}]: ${scenario.pickle.name}`);
  if (scenario.result?.status === Status.FAILED && this.context) {
    try {
      await this.context.tracing.stop({ path: `allure-results/trace-${Date.now()}.zip` });
    } catch { /* tracing not started */ }
  }
  await this.teardown();
});
