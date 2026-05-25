@api @regression
Feature: Products API - Validation and Contract Testing
  As a QA engineer
  I want to validate the products API endpoints
  So that I can ensure API contracts and method restrictions are honoured

  @smoke
  Scenario: API-001 GET /productsList returns a valid structured array
    Given the API client is initialized
    When I send a GET request to "/productsList"
    Then the response code should be 200
    And the response should contain a "products" array
    And each product in the array should have "id", "name", "price", and "brand" fields

  Scenario: API-002 POST /productsList is rejected with method not allowed
    Given the API client is initialized
    When I send an invalid POST request to "/productsList"
    Then the response code should be 405
    And the response message should be "This request method is not supported."

  Scenario: API-005 POST /searchProduct with valid parameter returns matching results
    Given the API client is initialized
    When I send a POST request to "/searchProduct" with search term "top"
    Then the response code should be 200
    And the response should contain a "products" array
    And the searched products array should not be empty

  Scenario: API-006 POST /searchProduct without required parameter returns validation error
    Given the API client is initialized
    When I send a POST request to "/searchProduct" without the search parameter
    Then the response code should be 400
    And the response message should be "Bad request, search_product parameter is missing in POST request."
