import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ContactPage extends BasePage {
  readonly pageHeading: Locator;
  readonly getInTouchHeading: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly subjectInput: Locator;
  readonly messageInput: Locator;
  readonly fileUploadInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly homeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: 'Contact Us' });
    this.getInTouchHeading = page.getByRole('heading', { name: 'Get In Touch' });
    this.nameInput = page.locator('[data-qa="name"]');
    this.emailInput = page.locator('[data-qa="email"]');
    this.subjectInput = page.locator('[data-qa="subject"]');
    this.messageInput = page.locator('[data-qa="message"]');
    this.fileUploadInput = page.locator('input[name="upload_file"]');
    this.submitButton = page.locator('[data-qa="submit-button"]');
    this.successMessage = page.locator('.status.alert.alert-success');
    this.homeButton = page.getByRole('link', { name: ' Home' });
  }

  async goto(): Promise<void> {
    await this.navigate('/contact_us');
  }

  async assertPageLoaded(): Promise<void> {
    await expect(this.pageHeading).toBeVisible();
    await expect(this.getInTouchHeading).toBeVisible();
  }

  async fillContactForm(
    name: string,
    email: string,
    subject: string,
    message: string,
    filePath?: string
  ): Promise<void> {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.subjectInput.fill(subject);
    await this.messageInput.fill(message);
    if (filePath) {
      await this.fileUploadInput.setInputFiles(filePath);
    }
  }

  async submitForm(): Promise<void> {
    this.page.once('dialog', dialog => dialog.accept());
    await this.submitButton.click();
  }

  async assertSuccessMessage(): Promise<void> {
    await expect(this.successMessage).toBeVisible();
  }
}
