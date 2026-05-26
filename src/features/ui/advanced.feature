@ui @regression 
Feature: Advanced UI Scenarios - Network Interception and Multi-Context Session Sharing

  @smoke 
  Scenario: UI-016 Network Interception and Asset Resiliency
    Given I am on the home page with network interception active for banner images
    Then all banner image requests should be intercepted and aborted
    And the remaining page layout should remain stable and visible
    And the header navigation should still be accessible

  
  Scenario: UI-017 Multi-Context UI Session Sharing via Cookie Injection
    Given a registered user is logged into Browser Context A
    When I extract the authenticated session cookies from Context A
    And I create a new isolated Browser Context B
    And I inject the extracted cookies into Browser Context B
    And I navigate directly to the home page in Context B
    Then Context B should show the "Logged in as" user banner without re-authenticating
