@api @regression
Feature: Brands API - Validation and Method Restriction
  As a QA engineer
  I want to validate the brands API endpoint
  So that I can confirm brand data and method protection

  Scenario: API-003 GET /brandsList returns populated brand items
    Given the API client is initialized
    When I send a GET request to "/brandsList"
    Then the response code should be 200
    And the response should contain a "brands" array
    And each brand in the array should have "id" and "brand" fields

  Scenario: API-004 PUT /brandsList is rejected with method not allowed
    Given the API client is initialized
    When I send an invalid PUT request to "/brandsList"
    Then the response code should be 405
    And the brands response message should be "This request method is not supported."
