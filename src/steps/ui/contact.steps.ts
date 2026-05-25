import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../utils/world';
import { ContactPage } from '../../pages/ContactPage';
import { DataGenerator } from '../../utils/dataGenerator';
import * as fs from 'fs';
import * as path from 'path';

Given('I navigate to the contact us page', async function (this: CustomWorld): Promise<void> {
  const contactPage = new ContactPage(this.page);
  await contactPage.goto();
});

When('I fill in the contact form with dynamically generated details and a test file', async function (this: CustomWorld): Promise<void> {
  const user = DataGenerator.generateUser();
  const contactPage = new ContactPage(this.page);

  // Create a temp test file to upload
  const tmpFile = path.resolve('tmp-test-upload.txt');
  fs.writeFileSync(tmpFile, `Test upload content - ${Date.now()}`);
  this.scenarioData['tmpFile'] = tmpFile;

  await contactPage.fillContactForm(
    user.name,
    user.email,
    `Test Subject ${Date.now()}`,
    `Automated test message from ${user.name}`,
    tmpFile
  );
});

When('I submit the contact form', async function (this: CustomWorld): Promise<void> {
  const contactPage = new ContactPage(this.page);
  await contactPage.submitForm();
});

Then('the {string} page heading should be visible', async function (this: CustomWorld, heading: string): Promise<void> {
  await expect(this.page.getByRole('heading', { name: heading })).toBeVisible();
});

Then('I should see the success message {string}', async function (this: CustomWorld, message: string): Promise<void> {
  const contactPage = new ContactPage(this.page);
  await expect(contactPage.successMessage).toBeVisible();
  // Cleanup tmp file
  const tmpFile = this.scenarioData['tmpFile'] as string | undefined;
  if (tmpFile && fs.existsSync(tmpFile)) {
    fs.unlinkSync(tmpFile);
  }
});
