import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../utils/world';
import { HomePage } from '../../pages/HomePage';
import { LoginPage } from '../../pages/LoginPage';
import { RegisterPage } from '../../pages/RegisterPage';
import { DataGenerator, GeneratedUser } from '../../utils/dataGenerator';

Given('I am on the login page', async function (this: CustomWorld): Promise<void> {
  const loginPage = new LoginPage(this.page);
  await loginPage.goto();
  await loginPage.assertPageLoaded();
});

Given('a registered user exists in the system', async function (this: CustomWorld): Promise<void> {
  const user = DataGenerator.generateUser();
  this.scenarioData['user'] = user;

  // Register via UI to ensure user exists
  const loginPage = new LoginPage(this.page);
  await loginPage.goto();
  await loginPage.startSignup(user.name, user.email);

  const registerPage = new RegisterPage(this.page);
  await registerPage.assertPageLoaded();
  await registerPage.fillAccountDetails(user);
  await registerPage.submitRegistration();
  await registerPage.assertAccountCreated();
  await registerPage.clickContinue();

  // Wait for navigation to complete after clicking continue
  await this.page.waitForURL('/index.php', { timeout: 30000 });

  // Logout so the test can log back in
  const homePage = new HomePage(this.page);
  await homePage.clickLogout();
  
  // Wait for logout to complete
  await expect(this.page.getByRole('link', { name: /Signup.*Login/i })).toBeVisible({ timeout: 30000 });
});

Given('a registered user is logged in', async function (this: CustomWorld): Promise<void> {
  const user = DataGenerator.generateUser();
  this.scenarioData['user'] = user;

  const loginPage = new LoginPage(this.page);
  await loginPage.goto();
  await loginPage.startSignup(user.name, user.email);

  const registerPage = new RegisterPage(this.page);
  await registerPage.assertPageLoaded();
  await registerPage.fillAccountDetails(user);
  await registerPage.submitRegistration();
  await registerPage.assertAccountCreated();
  await registerPage.clickContinue();

  // Wait for navigation to complete after clicking continue
  await this.page.waitForURL('/index.php', { timeout: 30000 });
  
  // Verify user is logged in
  const homePage = new HomePage(this.page);
  await expect(homePage.navLoggedInAs).toContainText(user.name, { timeout: 30000 });
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
