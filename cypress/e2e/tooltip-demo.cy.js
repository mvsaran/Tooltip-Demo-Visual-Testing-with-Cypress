/// <reference types="cypress" />

describe('jQuery UI Tooltip – Real Tooltip Demo', () => {

  // Helper for the expected tooltip text (taken from the actual page)
  // Source: https://jqueryui.com/tooltip/
  const expectedTooltip =
    'We ask for your age only for statistical purposes.'; // :contentReference[oaicite:1]{index=1}

  beforeEach(() => {
    // Visit the Tooltip demo page
    cy.visit('/tooltip/');
  });

  it('verifies tooltip text using title attribute (static check)', () => {
    // The input has id=age and title=expectedTooltip
    cy.getIframeBody().find('#age')
      .should('exist')
      .and('have.attr', 'title', expectedTooltip);
  });

  it('verifies tooltip text appears on hover (UI behavior check)', () => {
    // 1) Hover on the age field
    cy.getIframeBody().find('#age')
      .should('be.visible')
      .trigger('mouseover');

    // 2) Assert that the tooltip container appears with correct text
    // jQuery UI tooltip renders a .ui-tooltip element with .ui-tooltip-content inside. :contentReference[oaicite:2]{index=2}
    cy.getIframeBody().find('.ui-tooltip-content')
      .should('be.visible')
      .and('contain.text', expectedTooltip);

    // Visual check: capture the tooltip element as an image snapshot
    // capture a visual snapshot of the viewport (tooltip visible)
    cy.matchImageSnapshot('tooltip-visible');
  });

  it('combines attribute + UI verification for a robust example', () => {
    cy.getIframeBody().find('#age')
      .as('ageInput') // use alias for readability
      .should('have.attr', 'title', expectedTooltip)
      .trigger('mouseover');

    // Sometimes it’s nice to chain with a then() to show Cypress’s resolution model
    cy.getIframeBody().find('.ui-tooltip-content')
      .should('be.visible')
      .then(($tooltip) => {
        const tooltipText = $tooltip.text().trim();
        cy.log(`Tooltip text shown in UI: "${tooltipText}"`);
        expect(tooltipText).to.eq(expectedTooltip);
      });

    // Also add a visual snapshot inside the combined test
    // capture another snapshot for the combined test
    cy.matchImageSnapshot('tooltip-visible-combined');
  });

});
