import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../utils/world';
import { UserApi } from '../../api/endpoints/UserApi';
import { DataGenerator, GeneratedUser } from '../../utils/dataGenerator';
import {
  UserLifecycleResponse,
  UserDetailResponse,
  UserCreatePayload
} from '../../api/types/user.types';

Given('a new user payload is generated with dynamic data', async function (this: CustomWorld): Promise<void> {
  const user = DataGenerator.generateUser();
  this.scenarioData['user'] = user;
  this.scenarioData['userPayload'] = DataGenerator.toUserCreatePayload(user);
});

When('I send a POST request to {string} with the user payload', async function (this: CustomWorld, _endpoint: string): Promise<void> {
  const userApi = new UserApi(this.apiClient);
  const payload = this.scenarioData['userPayload'] as UserCreatePayload;
  const response = await userApi.createAccount(payload);
  this.scenarioData['createResponse'] = response;
});

When('I send a PUT request to {string} with updated user data', async function (this: CustomWorld, _endpoint: string): Promise<void> {
  const userApi = new UserApi(this.apiClient);
  const user = this.scenarioData['user'] as GeneratedUser;
  const updatedUser: GeneratedUser = { ...user, company: `Updated Corp ${Date.now()}` };
  const updatePayload = DataGenerator.toUserCreatePayload(updatedUser);
  const response = await userApi.updateAccount(updatePayload);
  this.scenarioData['updateResponse'] = response;
});

When('I send a GET request to {string} with the user\'s email', async function (this: CustomWorld, _endpoint: string): Promise<void> {
  const userApi = new UserApi(this.apiClient);
  const user = this.scenarioData['user'] as GeneratedUser;
  const response = await userApi.getUserDetailByEmail(user.email);
  this.scenarioData['getUserResponse'] = response;
});

When('I send a DELETE request to {string} with the user credentials', async function (this: CustomWorld, _endpoint: string): Promise<void> {
  const userApi = new UserApi(this.apiClient);
  const user = this.scenarioData['user'] as GeneratedUser;
  const response = await userApi.deleteAccount({ email: user.email, password: user.password });
  this.scenarioData['deleteResponse'] = response;
});

When('I send a POST request to {string} with invalid email {string} and password {string}', async function (
  this: CustomWorld,
  _endpoint: string,
  email: string,
  password: string
): Promise<void> {
  const userApi = new UserApi(this.apiClient);
  const response = await userApi.verifyLogin({ email, password });
  this.scenarioData['verifyLoginResponse'] = response;
});

Then('the create account response code should be {int}', async function (this: CustomWorld, code: number): Promise<void> {
  const response = this.scenarioData['createResponse'] as UserLifecycleResponse;
  expect(response.responseCode).toBe(code);
});

Then('the create account message should be {string}', async function (this: CustomWorld, message: string): Promise<void> {
  const response = this.scenarioData['createResponse'] as UserLifecycleResponse;
  expect(response.message).toBe(message);
});

Then('the update account response code should be {int}', async function (this: CustomWorld, code: number): Promise<void> {
  const response = this.scenarioData['updateResponse'] as UserLifecycleResponse;
  expect(response.responseCode).toBe(code);
});

Then('the update account message should be {string}', async function (this: CustomWorld, message: string): Promise<void> {
  const response = this.scenarioData['updateResponse'] as UserLifecycleResponse;
  expect(response.message).toBe(message);
});

Then('the get user response code should be {int}', async function (this: CustomWorld, code: number): Promise<void> {
  const response = this.scenarioData['getUserResponse'] as UserDetailResponse;
  expect(response.responseCode).toBe(code);
});

Then('the fetched user email should match the created user email', async function (this: CustomWorld): Promise<void> {
  const response = this.scenarioData['getUserResponse'] as UserDetailResponse;
  const user = this.scenarioData['user'] as GeneratedUser;
  expect(response.user.email).toBe(user.email);
});

Then('the delete account response code should be {int}', async function (this: CustomWorld, code: number): Promise<void> {
  const response = this.scenarioData['deleteResponse'] as UserLifecycleResponse;
  expect(response.responseCode).toBe(code);
});

Then('the delete account message should be {string}', async function (this: CustomWorld, message: string): Promise<void> {
  const response = this.scenarioData['deleteResponse'] as UserLifecycleResponse;
  expect(response.message).toBe(message);
});

Then('the verify login response code should be {int}', async function (this: CustomWorld, code: number): Promise<void> {
  const response = this.scenarioData['verifyLoginResponse'] as UserLifecycleResponse;
  expect(response.responseCode).toBe(code);
});

Then('the verify login message should be {string}', async function (this: CustomWorld, message: string): Promise<void> {
  const response = this.scenarioData['verifyLoginResponse'] as UserLifecycleResponse;
  expect(response.message).toBe(message);
});
