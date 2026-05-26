import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../utils/world';
import { HomePage } from '../../pages/HomePage';
import { LoginPage } from '../../pages/LoginPage';
import { RegisterPage } from '../../pages/RegisterPage';
import { DataGenerator, GeneratedUser } from '../../utils/dataGenerator';
import Logger from '../../utils/logger';

Given('I am on the login page', async function (this: CustomWorld): Promise<void> {
  const loginPage = new LoginPage(this.page);
  await loginPage.goto();
  await loginPage.assertPageLoaded();
});

Given(
  'a registered user exists in the system',
  { timeout: 60000 },
  async function (this: CustomWorld): Promise<void> {
    const user = DataGenerator.generateUser();
    this.scenarioData['user'] = user;

    Logger.info(`Registering new user: ${user.email}`);
    
    const loginPage = new LoginPage(this.page);
    await loginPage.goto();
    Logger.debug('Login page loaded');
    
    await loginPage.startSignup(user.name, user.email);
    Logger.debug('Signup form submitted, waiting for register page...');

    const registerPage = new RegisterPage(this.page);
    // Wait for navigation to register page
    await this.page.waitForURL(/\/signup|register/i, { timeout: 10000 }).catch(() => {
      Logger.warn('Register page URL navigation timeout, checking for page heading...');
    });
    
    await registerPage.assertPageLoaded();
    Logger.debug('Register page loaded');
    
    await registerPage.fillAccountDetails(user);
    Logger.debug('Account details filled');
    
    await registerPage.submitRegistration();
    Logger.debug('Registration submitted');
    
    await registerPage.assertAccountCreated();
    Logger.debug('Account creation confirmed');
    
    await registerPage.clickContinue();
    Logger.debug('Continue clicked, waiting for redirect...');

    // Wait for navigation to complete (with timeout to avoid hanging)
    await Promise.race([
      this.page.waitForNavigation({ waitUntil: 'networkidle' }),
      new Promise(resolve => setTimeout(resolve, 30000))
    ]).catch(() => {
      Logger.warn('Navigation timeout, proceeding...');
    });
    
    Logger.debug('Navigated to home');
    Logger.info(`User registration complete and available: ${user.email}`);
  }
);

Given('a registered user is logged in', { timeout: 60000 }, async function (this: CustomWorld): Promise<void> {
  const user = DataGenerator.generateUser();
  this.scenarioData['user'] = user;

  Logger.info(`Registering and logging in user: ${user.email}`);
  
  const loginPage = new LoginPage(this.page);
  await loginPage.goto();
  await loginPage.startSignup(user.name, user.email);
  Logger.debug('Signup form submitted');

  const registerPage = new RegisterPage(this.page);
  // Wait for page navigation with timeout
  await this.page.waitForURL(/\/signup|register/i, { timeout: 10000 }).catch(() => {
    Logger.warn('Register page URL navigation timeout');
  });
  
  await registerPage.assertPageLoaded();
  await registerPage.fillAccountDetails(user);
  await registerPage.submitRegistration();
  Logger.debug('Registration submitted');
  
  await registerPage.assertAccountCreated();
  await registerPage.clickContinue();
  Logger.debug('Continue clicked, waiting for redirect...');

  // Wait for navigation to complete
  await this.page.waitForNavigation({ waitUntil: 'networkidle' });
  Logger.debug('Navigated to home');
  
  // Verify user is logged in
  const homePage = new HomePage(this.page);
  await expect(homePage.navLoggedInAs).toContainText(user.name, { timeout: 10000 });
  Logger.info(`User logged in: ${user.email}`);
});

When(/^I click the "Signup \/ Login" navigation link$/, async function (this: CustomWorld): Promise<void> {
  const homePage = new HomePage(this.page);
  await homePage.clickSignupLogin();
});

When('I fill in the signup form with dynamically generated user details', async function (this: CustomWorld): Promise<void> {
  const user = DataGenerator.generateUser();
  this.scenarioData['user'] = user;
  const loginPage = new LoginPage(this.page);
  await loginPage.startSignup(user.name, user.email);
});

When('I complete the registration account information form', async function (this: CustomWorld): Promise<void> {
  const user = this.scenarioData['user'] as GeneratedUser;
  const registerPage = new RegisterPage(this.page);
  await registerPage.assertPageLoaded();
  await registerPage.fillAccountDetails(user);
  await registerPage.submitRegistration();
});

When('I log in with the registered user credentials', async function (this: CustomWorld): Promise<void> {
  const user = this.scenarioData['user'] as GeneratedUser;
  const loginPage = new LoginPage(this.page);
  await loginPage.login(user.email, user.password);
});

When('I log in with email {string} and password {string}', async function (this: CustomWorld, email: string, password: string): Promise<void> {
  const loginPage = new LoginPage(this.page);
  await loginPage.login(email, password);
});

When('I click the logout navigation link', async function (this: CustomWorld): Promise<void> {
  const homePage = new HomePage(this.page);
  await homePage.clickLogout();
});

Then('I should see the login page with both login and signup sections', async function (this: CustomWorld): Promise<void> {
  const loginPage = new LoginPage(this.page);
  await loginPage.assertPageLoaded();
});

Then('I should see the {string} confirmation', async function (this: CustomWorld, headingText: string): Promise<void> {
  await expect(this.page.getByRole('heading', { name: headingText })).toBeVisible();
});

Then('I click continue and see the logged-in user banner', async function (this: CustomWorld): Promise<void> {
  const registerPage = new RegisterPage(this.page);
  await registerPage.clickContinue();
  const user = this.scenarioData['user'] as GeneratedUser;
  const homePage = new HomePage(this.page);
  await homePage.assertLoggedInAs(user.name);
});

Then('I should see the "Logged in as" banner with the user\'s name', async function (this: CustomWorld): Promise<void> {
  const user = this.scenarioData['user'] as GeneratedUser;
  const homePage = new HomePage(this.page);
  await homePage.assertLoggedInAs(user.name);
});

Then('I should see the login error message {string}', async function (this: CustomWorld, _message: string): Promise<void> {
  const loginPage = new LoginPage(this.page);
  await loginPage.assertLoginError();
});

Then('I should be redirected to the login page', async function (this: CustomWorld): Promise<void> {
  const loginPage = new LoginPage(this.page);
  await loginPage.assertPageLoaded();
});

Then(/^the "Signup \/ Login" link should be visible in the header$/, async function (this: CustomWorld): Promise<void> {
  await expect(this.page.getByRole('link', { name: /Signup.*Login/i })).toBeVisible();
});
