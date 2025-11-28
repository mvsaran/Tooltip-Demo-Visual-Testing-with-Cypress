# 🎯 Tooltip Demo — Visual Testing with Cypress

![Banner](https://img.shields.io/badge/Cypress-Testing-green?style=for-the-badge&logo=cypress)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Node](https://img.shields.io/badge/Node.js-Required-red?style=for-the-badge)

---

## ✨ Overview

A small, focused demo showing how to test a jQuery UI tooltip both functionally and visually using Cypress. This repository demonstrates implementing visual testing from scratch: locating elements inside an iframe, asserting tooltip behavior, and adding image snapshot comparisons to catch visual regressions.

> **👤 Author:** Saran Kumar

---

## 🌟 Key Highlights

### ✅ Functional Tests
Verify the tooltip `title` attribute and hover behavior with precise DOM assertions.

### 🎨 Visual Tests  
Capture image snapshots of the tooltip when visible to detect visual regressions that plain assertions might miss.

### 🚀 Real-World Demo
The tests operate against the jQuery UI demo page (inside a `.demo-frame` iframe) for authentic testing scenarios.

---

## 🤔 Why Visual Testing?

Visual tests catch layout, styling, or rendering regressions that plain assertions (text/DOM) may miss. For UI components like tooltips:

- 🎯 A small CSS change can break the UX
- 📐 Positioning issues won't be caught by text assertions
- 🖼️ Visual regressions affect user experience directly
- 🛡️ Automated visual checks prevent style drift

---

## 🏗️ Implementation Overview

### 📦 Iframe Helper
The jQuery UI demos render the demo into an iframe. Tests need to query the iframe's document. We added a custom Cypress command `getIframeBody()` in `cypress/support/commands.js` that wraps the iframe body:

```javascript
cy.getIframeBody().find('#age')
```

### ✔️ Functional Assertions
The tests in `cypress/e2e/tooltip-demo.cy.js` assert:
- Presence of the `title` attribute
- Hovering shows the `.ui-tooltip-content` element
- Expected text content is displayed

### 📸 Visual Snapshots
We integrated `cypress-image-snapshot` and added `cy.matchImageSnapshot()` calls:
- Plugin registered in `cypress/support/e2e.js`
- Configuration in `cypress.config.js`
- Snapshots stored under `cypress/snapshots/`

---

## 📂 Key Files

| File | Purpose |
|------|---------|
| `cypress/e2e/tooltip-demo.cy.js` | Spec with functional and visual checks |
| `cypress/support/commands.js` | Custom `getIframeBody()` command |
| `cypress/support/e2e.js` | Registers support and image snapshot command |
| `cypress.config.js` | Plugins and baseUrl configuration |

---

## 🚀 Getting Started

### 📋 Prerequisites
- Node.js and npm installed on your machine
- Cypress 10+ (for best compatibility)

### 1️⃣ Install Dependencies

```bash
npm install
```

### 2️⃣ Run Visual Spec Headlessly

This will create baseline snapshots on first run:

```bash
npx cypress run --spec "cypress/e2e/tooltip-demo.cy.js"
```

Or use the npm script:

```bash
npm run test:e2e
```

### 3️⃣ Run in Interactive Mode

```bash
npx cypress open
```

---

## 📸 Snapshot Storage

Baseline and comparison images are placed under:

```
cypress/snapshots/<spec-name>/
```

### Example Files

After the first run, you may see:

```
cypress/snapshots/tooltip-demo.cy.js/
├── tooltip-visible.snap.png
└── tooltip-visible-combined.snap.png
```

---

## 🔄 Updating Snapshots

If a change is intentional and you want to accept the new look as the baseline:

### Step 1️⃣
Review the diff images in `cypress/snapshots/` and confirm the change.

### Step 2️⃣
Replace the baseline by copying the new `.snap.png` into the baseline folder.

### Step 3️⃣
Commit the updated snapshot files to the repository.

---

## 🔧 CI/CD Recommendations

✅ Run the visual spec during CI and fail the build when comparisons exceed the allowed threshold

✅ Use headless Electron or Chromium in CI

✅ Ensure environment has enough resolution and deterministic fonts

✅ Store baseline snapshots in the repo so PRs show diffs when visuals change

### Example GitHub Actions Workflow

```yaml
name: Visual Tests
on: [push, pull_request]
jobs:
  cypress:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v2
        if: failure()
        with:
          name: cypress-screenshots
          path: cypress/snapshots/
```

---

## 🐛 Troubleshooting & Tips

### Visual Tests Fail Due to Minor Differences
Tune `cypress-image-snapshot` options like `failureThreshold` and `failureThresholdType`:

```javascript
cy.matchImageSnapshot({
  failureThreshold: 0.01,
  failureThresholdType: 'percent'
})
```

### `cy.matchImageSnapshot` Missing
Ensure `cypress-image-snapshot` is installed and registered:

```bash
npm install cypress-image-snapshot --save-dev
```

Then register in `cypress/support/e2e.js`.

### Tests Can't Find Elements
Ensure the demo iframe loaded:

```javascript
cy.getIframeBody().its('0.contentDocument').should('exist')
```

---

## 💡 Next Steps & Ideas

- 🎨 Add visual tests for different tooltip placements and themes
- 🔗 Add GitHub Actions workflow to run visual tests and post diffs to PRs
- 📱 Parameterize snapshots for different viewports or browsers
- 🌍 Add multi-language tooltip testing
- 🎬 Create video regression testing

---

## 📄 License

This demo is **MIT-friendly**; adapt as needed for your projects.

```
MIT License - See LICENSE file for details
```

## 🎓 Learn More

- **Visual Testing Concepts:** [Understanding Visual Regression Testing](https://www.cypress.io)
- **Iframe Testing:** [Testing Elements in Iframes](https://docs.cypress.io/guides/references/best-practices)
- **Snapshot Testing:** [Best Practices for Image Snapshots](https://github.com/palmerhq/cypress-image-snapshot)

---

<div align="center">

**Made with ❤️ by Saran Kumar**

⭐ Star this repo if you found it helpful!

</div>
