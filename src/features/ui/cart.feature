@ui @regression
Feature: Shopping Cart - Add and Manage Items
  As a shopper
  I want to add and manage products in my cart
  So that I can control what I intend to purchase

  Scenario: UI-013 Add product items into the cart from the grid layout
    Given I navigate to the products page
    When I hover over the first product and click "Add to cart"
    And I dismiss the "Continue Shopping" modal
    And I navigate to the cart page
    Then the cart should contain at least one item

  Scenario: UI-014 Modify cart element quantifiers and verify calculation updates
    Given I navigate to the product detail page for product 1
    When I set the quantity to "2"
    And I click "Add to cart" on the product detail page
    And I navigate to the cart page
    Then the item quantity in the cart should reflect "2"
