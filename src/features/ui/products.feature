@ui @regression
Feature: Products Page - Browse, Search and Filter
  As a shopper
  I want to browse, search, and filter products
  So that I can find the items I want to purchase

  Scenario: UI-008 Open products grid view and confirm data item visibility
    Given I navigate to the products page
    Then the products page heading should be visible
    And multiple product cards should be displayed on the grid

  Scenario: UI-009 Open specific product details page and confirm attributes
    Given I navigate to the products page
    When I click to view the details of the first product
    Then the product detail page should display the product name
    And the product detail page should display the product price
    And the product detail page should display availability status
    And the product detail page should display brand information

  Scenario: UI-010 Execute keyword product search yielding successful results
    Given I navigate to the products page
    When I search for products with keyword "top"
    Then the "Searched Products" heading should be visible
    And at least one product result should be displayed

  Scenario: UI-011 Execute keyword product search yielding empty-state results
    Given I navigate to the products page
    When I search for products with keyword "zzzznotaproduct999xyz"
    Then the "Searched Products" heading should be visible
    And no products should be found in the results

  Scenario: UI-012 Apply brand-specific navigational filters and verify item updates
    Given I navigate to the products page
    When I click on the brand filter "Polo"
    Then the brand products page heading should contain "Polo"
    And brand filtered product items should be visible
