@api @regression
Feature: User Lifecycle API - Create, Update, Fetch, and Delete
  As a QA engineer
  I want to validate the complete user lifecycle via API
  So that I can ensure CRUD operations are consistent and correct

  @smoke
  Scenario: API-007 Complete User Lifecycle - Create, Update, Fetch, and Delete
    Given the API client is initialized
    And a new user payload is generated with dynamic data
    When I send a POST request to "/createAccount" with the user payload
    Then the create account response code should be 201
    And the create account message should be "User created!"
    When I send a PUT request to "/updateAccount" with updated user data
    Then the update account response code should be 200
    And the update account message should be "User updated!"
    When I send a GET request to "/getUserDetailByEmail" with the user's email
    Then the get user response code should be 200
    And the fetched user email should match the created user email
    When I send a DELETE request to "/deleteAccount" with the user credentials
    Then the delete account response code should be 200
    And the delete account message should be "Account deleted!"

  Scenario: API-008 POST /verifyLogin with invalid credentials returns error
    Given the API client is initialized
    When I send a POST request to "/verifyLogin" with invalid email "nouser@fake.xyz" and password "badpass"
    Then the verify login response code should be 404
    And the verify login message should be "User not found!"
