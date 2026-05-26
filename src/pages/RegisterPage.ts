import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { GeneratedUser } from '../utils/dataGenerator';

export class RegisterPage extends BasePage {
  readonly pageHeading: Locator;
  readonly titleMrRadio: Locator;
  readonly titleMrsRadio: Locator;
  readonly passwordInput: Locator;
  readonly birthDaySelect: Locator;
  readonly birthMonthSelect: Locator;
  readonly birthYearSelect: Locator;
  readonly newsletterCheckbox: Locator;
  readonly offersCheckbox: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly companyInput: Locator;
  readonly address1Input: Locator;
  readonly address2Input: Locator;
  readonly countrySelect: Locator;
  readonly stateInput: Locator;
  readonly cityInput: Locator;
  readonly zipcodeInput: Locator;
  readonly mobileNumberInput: Locator;
  readonly createAccountButton: Locator;

  // Success
  readonly accountCreatedHeading: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: 'Enter Account Information' });
    this.titleMrRadio = page.locator('#id_gender1');
    this.titleMrsRadio = page.locator('#id_gender2');
    this.passwordInput = page.locator('[data-qa="password"]');
    this.birthDaySelect = page.locator('[data-qa="days"]');
    this.birthMonthSelect = page.locator('[data-qa="months"]');
    this.birthYearSelect = page.locator('[data-qa="years"]');
    this.newsletterCheckbox = page.locator('#newsletter');
    this.offersCheckbox = page.locator('#optin');
    this.firstNameInput = page.locator('[data-qa="first_name"]');
    this.lastNameInput = page.locator('[data-qa="last_name"]');
    this.companyInput = page.locator('[data-qa="company"]');
    this.address1Input = page.locator('[data-qa="address"]');
    this.address2Input = page.locator('[data-qa="address2"]');
    this.countrySelect = page.locator('[data-qa="country"]');
    this.stateInput = page.locator('[data-qa="state"]');
    this.cityInput = page.locator('[data-qa="city"]');
    this.zipcodeInput = page.locator('[data-qa="zipcode"]');
    this.mobileNumberInput = page.locator('[data-qa="mobile_number"]');
    this.createAccountButton = page.locator('[data-qa="create-account"]');
    this.accountCreatedHeading = page.getByRole('heading', { name: 'Account Created!' });
    this.continueButton = page.locator('[data-qa="continue-button"]');
  }

  async assertPageLoaded(): Promise<void> {
    // Wait for page heading with retry logic
    await expect(this.pageHeading).toBeVisible({ timeout: 15000 });
  }

  async fillAccountDetails(user: GeneratedUser): Promise<void> {
    // Use sequential fills to avoid race conditions on form validation
    if (user.title === 'Mr') {
      await this.titleMrRadio.check();
    } else {
      await this.titleMrsRadio.check();
    }
    
    await this.passwordInput.fill(user.password);
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.companyInput.fill(user.company);
    await this.address1Input.fill(user.address1);
    await this.address2Input.fill(user.address2);
    await this.cityInput.fill(user.city);
    await this.zipcodeInput.fill(user.zipcode);
    await this.mobileNumberInput.fill(user.mobileNumber);
    
    // Handle dropdowns
    await this.birthDaySelect.selectOption(user.birthDate);
    await this.birthMonthSelect.selectOption(user.birthMonth);
    await this.birthYearSelect.selectOption(user.birthYear);
    await this.countrySelect.selectOption(user.country);
    await this.stateInput.fill(user.state);
    
    // Checkboxes
    await this.newsletterCheckbox.check();
    await this.offersCheckbox.check();
  }

  async submitRegistration(): Promise<void> {
    await this.createAccountButton.click();
  }

  async assertAccountCreated(): Promise<void> {
    await expect(this.accountCreatedHeading).toBeVisible();
  }

  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }
}
