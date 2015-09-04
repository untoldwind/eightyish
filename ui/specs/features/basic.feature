Feature: Basic functionality
  Scenario: Machine reset
    Given Navigate to machine view
    When Reset button is clicked
    Then Register A is 0
    And Register PC is 0x0
    And Register SP is 0x400

  Scenario: Toggle video
    Given Navigate to machine view
    Then Video should be toggled off
    When Video is toggled
    Then Video should be toggled on

