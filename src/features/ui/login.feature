@ui @regression
Feature: Authentication - Registration, Login, and Logout
  As a user
  I want to register, login, and logout securely
  So that I can manage my account safely

  Scenario: UI-003 Navigate cleanly to the Sign-up / Login functional layout
    Given I am on the home page
    When I click the "Signup / Login" navigation link
    Then I should see the login page with both login and signup sections

  Scenario: UI-004 Register an entirely new user with dynamic data
    Given I am on the login page
    When I fill in the signup form with dynamically generated user details
    And I complete the registration account information form
    Then I should see the "Account Created!" confirmation
    And I click continue and see the logged-in user banner

  @smoke
  Scenario: UI-005 Log in with valid credentials and verify the user profile banner
    Given a registered user exists in the system
    And I am on the login page
    When I log in with the registered user credentials
    Then I should see the "Logged in as" banner with the user's name

  Scenario: UI-006 Validate login rejection and error message for invalid inputs
    Given I am on the login page
    When I log in with email "invalid_user_999@fake.com" and password "wrongpassword"
    Then I should see the login error message "Your email or password is incorrect!"

  
  Scenario: UI-007 Execute a secure session logout and check state redirection
    Given a registered user is logged in
    When I click the logout navigation link
    Then I should be redirected to the login page
    And the "Signup / Login" link should be visible in the header
