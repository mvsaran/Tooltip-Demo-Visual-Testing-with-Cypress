# Tooltip Demo — Visual Testing with Cypress

A small, focused demo showing how to test a jQuery UI tooltip both functionally and visually using Cypress. This repository demonstrates implementing visual testing from scratch: locating elements inside an iframe, asserting tooltip behavior, and adding image snapshot comparisons to catch visual regressions.

**Highlights:**
- **Functional tests:** Verify the tooltip `title` attribute and hover behavior.
- **Visual tests:** Capture image snapshots of the tooltip when visible to detect visual regressions.
- **Real-world demo:** The tests operate against the jQuery UI demo page (inside a `.demo-frame` iframe).

**Why visual testing?**
Visual tests catch layout, styling, or rendering regressions that plain assertions (text/DOM) may miss. For UI components like tooltips, a small CSS or positioning change can break the UX even when text remains correct.

**Implemented from scratch — Overview**

- **Iframe helper:** The jQuery UI demos render the demo into an iframe. Tests need to query the iframe's document. We added a custom Cypress command `getIframeBody()` in `cypress/support/commands.js` that wraps the iframe body so you can call `cy.getIframeBody().find('#age')`.

- **Functional assertions:** The tests in `cypress/e2e/tooltip-demo.cy.js` assert the presence of the `title` attribute and that hovering shows the `.ui-tooltip-content` element with the expected text.

- **Visual snapshots:** We integrated `cypress-image-snapshot` and added `cy.matchImageSnapshot()` calls after the tooltip appears. The plugin is wired in `cypress/support/e2e.js` and `cypress.config.js` (plugin registration via `addMatchImageSnapshotPlugin`). Snapshots are stored under `cypress/snapshots/`.

**Files to look at**
- `cypress/e2e/tooltip-demo.cy.js`: The spec with functional and visual checks.
- `cypress/support/commands.js`: Custom `getIframeBody()` command.
- `cypress/support/e2e.js`: Registers support and the image snapshot command.
- `cypress.config.js`: Plugins and baseUrl configuration for the demo site.

Getting started
---------------

Prerequisites: Node.js and npm installed on your machine.

1. Install dependencies

```powershell
npm install
```

2. Run the visual spec headlessly (this will create baseline snapshots on first run):

```powershell
npx cypress run --spec "cypress/e2e/tooltip-demo.cy.js"
```

Or use the npm script added to `package.json`:

```powershell
npm run test:e2e
```

Where snapshots live
--------------------

Baseline and comparison images are placed under:

```
cypress/snapshots/<spec-name>/
```

Example files you may see after the first run:

- `cypress/snapshots/tooltip-demo.cy.js/tooltip-visible.snap.png`
- `cypress/snapshots/tooltip-demo.cy.js/tooltip-visible-combined.snap.png`

Updating snapshots
------------------

If a change is intentional and you want to accept the new look as the baseline:

1. Review the diff images in `cypress/snapshots` and confirm the change.
2. Replace the baseline by copying the new `.snap.png` into the baseline folder (or use tooling to accept changes). In many workflows, you commit the updated snapshot files to the repository.

CI recommendations
------------------

- Run the visual spec during CI and fail the build when comparisons exceed the allowed threshold.
- Use headless Electron or Chromium in CI; ensure environment has enough resolution and deterministic fonts.
- Store baseline snapshots in the repo so PRs show diffs when visuals change.

Troubleshooting & tips
----------------------

- If visual tests fail due to small, acceptable differences (anti-aliasing, OS fonts), tune `cypress-image-snapshot` options like `failureThreshold` and `failureThresholdType` in the plugin registration.
- If `cy.matchImageSnapshot` is missing, ensure `cypress-image-snapshot` is installed and registered in `cypress/support/e2e.js`. We used a compatibility-friendly registration to support multiple plugin versions.
- If tests can't find elements, ensure the demo iframe loaded: `cy.getIframeBody().its('0.contentDocument').should('exist')` can help diagnose timing.

Next steps (ideas)
------------------

- Add visual tests for different tooltip placements and themes.
- Add GitHub Actions workflow to run visual tests and post diffs to PRs.
- Parameterize snapshots for different viewports or browsers.

Contributing
------------

Contributions, suggestions, and bug reports are welcome. Open an issue or a PR describing what you'd like to add.

License
-------

This demo is MIT-friendly; adapt as needed for your projects.
