@ui @regression
Feature: Home Page Validation
  As a visitor
  I want to verify the home page layout and navigation
  So that I can confirm the site is accessible and correctly structured

  @smoke
  Scenario: UI-001 Verify home page elements and responsive layout sections
    Given I am on the home page
    Then the hero carousel should be visible
    # And the featured products section should be visible
    # And the footer section should be visible
    # And the subscription section should be visible in the footer

  # Scenario: UI-002 Validate main global header navigation accessibility
  #   Given I am on the home page
  #   Then the header should contain a "Home" navigation link
  #   And the header should contain a "Products" navigation link
  #   And the header should contain a "Cart" navigation link
  #   And the header should contain a "Signup Login" navigation link
  #   And the header should contain a "Contact us" navigation link
