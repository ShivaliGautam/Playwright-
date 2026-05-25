@ui @regression
Feature: Contact Us Form
  As a visitor
  I want to submit the contact us form with an attachment
  So that I can reach out to the support team

  Scenario: UI-015 Complete the contact-us form with file attachment upload
    Given I navigate to the contact us page
    Then the "Contact Us" page heading should be visible
    And the "Get In Touch" page heading should be visible
    When I fill in the contact form with dynamically generated details and a test file
    And I submit the contact form
    Then I should see the success message "Success! Your details have been submitted successfully."
