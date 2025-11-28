# 🎯 Tooltip Demo — Visual Testing with Cypress

![Badge](https://img.shields.io/badge/Cypress-Testing-green?style=for-the-badge&logo=cypress)
![Badge](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Badge](https://img.shields.io/badge/Node.js-Required-red?style=for-the-badge)
![Badge](https://img.shields.io/badge/jQuery%20UI-Tooltip-orange?style=for-the-badge)

> **👤 Author:** Saran Kumar

---

## ✨ Overview

A small, focused demo showing how to test a jQuery UI tooltip both functionally and visually using Cypress. This repository demonstrates implementing visual testing from scratch: locating elements inside an iframe, asserting tooltip behavior, and adding image snapshot comparisons to catch visual regressions.

---

## 🌟 Key Highlights

### ✅ Functional Tests
Verify the tooltip `title` attribute and hover behavior with precise DOM assertions.

### 🎨 Visual Tests
Capture image snapshots of the tooltip when visible to detect visual regressions.

### 🚀 Real-World Demo
The tests operate against the jQuery UI demo page (inside a `.demo-frame` iframe).

---

## 🤔 Why Visual Testing?

Visual tests catch layout, styling, or rendering regressions that plain assertions (text/DOM) may miss. For UI components like tooltips, a small CSS or positioning change can break the UX even when text remains correct.

- 🎯 Catches CSS changes that break UX
- 📐 Detects positioning and layout regressions
- 🖼️ Ensures visual consistency across versions
- 🛡️ Prevents style drift in production

---

## 🔧 How It Works — Detailed Walkthrough

This project combines functional Cypress E2E checks with visual snapshot comparisons. Below are the key parts and how they interact.

### 📍 Visit the Demo Page

`cypress.config.js` sets `baseUrl` to `https://jqueryui.com` so tests use `cy.visit('/tooltip/')` to open `https://jqueryui.com/tooltip/`.

```javascript
// cypress.config.js
module.exports = {
  baseUrl: 'https://jqueryui.com',
  // ... other config
};
```

---

### 🖼️ Iframe Helper (`getIframeBody`)

**File:** `cypress/support/commands.js`

**Purpose:** jQuery UI demos render the example inside an `<iframe class="demo-frame">`. Cypress commands run in the primary test frame, so to query elements inside the iframe we grab the iframe's `contentDocument.body` and wrap it with Cypress.

**Implementation Pattern:**

```javascript
// returns a wrapped body element from the demo iframe
Cypress.Commands.add('getIframeBody', () => {
  return cy
    .get('.demo-frame')
    .its('0.contentDocument.body')
    .should('not.be.empty')
    .then(cy.wrap);
});
```

**Usage in Tests:**

```javascript
cy.getIframeBody().find('#age').should('exist')
```

**Why This Matters:**
- ✅ Isolates iframe content queries
- ✅ Reusable across multiple tests
- ✅ Handles timing issues automatically
- ✅ Makes test code more readable

---

### 🧪 Test Flow (Spec File)

**File:** `cypress/e2e/tooltip-demo.cy.js`

**beforeEach Hook:**
```javascript
beforeEach(() => {
  cy.visit('/tooltip/') // Loads the demo page
})
```

**Functional Checks:**

1️⃣ Assert `#age` input `title` attribute equals expected tooltip text
```javascript
cy.getIframeBody()
  .find('#age')
  .should('have.attr', 'title', 'Please enter your age')
```

2️⃣ Trigger hover and verify tooltip appears
```javascript
cy.getIframeBody()
  .find('#age')
  .trigger('mouseover')
  .get('.ui-tooltip-content')
  .should('be.visible')
  .and('contain', 'Please enter your age')
```

**Visual Checks:**

After the tooltip is visible, call `cy.matchImageSnapshot('name')` to capture the current viewport and compare against the stored baseline image.

```javascript
cy.matchImageSnapshot('tooltip-visible')
```

---

### 🎨 Visual Plugin Registration

**Support:** `cypress/support/e2e.js` registers the snapshot command. We use a compatibility-friendly `require` pattern to work across plugin versions.

```javascript
// cypress/support/e2e.js
const addContext = require('mochawesome/addContext');

try {
  require('cypress-image-snapshot/commands');
} catch (e) {
  console.warn('cypress-image-snapshot plugin not loaded');
}
```

**Plugin (Node):** `cypress.config.js` calls `addMatchImageSnapshotPlugin(on, config)` in `setupNodeEvents` so the plugin can perform snapshot I/O and comparisons on the Node side.

```javascript
// cypress.config.js
const { addMatchImageSnapshotPlugin } = require('cypress-image-snapshot/plugin');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      addMatchImageSnapshotPlugin(on, config);
      return config;
    },
  },
});
```

---

## 📂 Key Files to Inspect

| File | Purpose | Key Content |
|------|---------|-------------|
| `cypress/e2e/tooltip-demo.cy.js` | Main test spec | Functional and visual checks |
| `cypress/support/commands.js` | Custom commands | `getIframeBody()` helper |
| `cypress/support/e2e.js` | Support setup | Plugin registration |
| `cypress.config.js` | Configuration | baseUrl and plugins |

---

## 🚀 Getting Started

### 📋 Prerequisites

- ✅ Node.js 14+ and npm installed
- ✅ Cypress 10+ (recommended)
- ✅ Internet connection (for jQuery UI demo site)

### 1️⃣ Install Dependencies

```bash
npm install
```

This installs:
- `cypress` — E2E testing framework
- `cypress-image-snapshot` — Visual regression testing
- `@cypress/schematic` — Optional scaffolding tools

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

Then select your spec and watch tests run in the Cypress UI.

### 4️⃣ Verify Test Passes

After first run, you should see:
- ✅ All tests passing
- 📸 Baseline snapshots created in `cypress/snapshots/`

---

## 📸 Where Snapshots Live

Baseline and comparison images are placed under:

```
cypress/snapshots/<spec-name>/
```

### Directory Structure

```
cypress/
├── snapshots/
│   └── tooltip-demo.cy.js/
│       ├── tooltip-visible.snap.png
│       └── tooltip-visible-combined.snap.png
├── e2e/
│   └── tooltip-demo.cy.js
├── support/
│   ├── commands.js
│   └── e2e.js
└── videos/ (after first run)
    └── tooltip-demo.cy.js.mp4
```

### Snapshot File Naming

- **`.snap.png`** — Baseline image (source of truth)
- **`-combined.snap.png`** — Combined diff view (expected vs actual)
- **`-diff.png`** — Pixel-level differences highlighted

---

## 🔄 Updating Snapshots

If a change is intentional and you want to accept the new look as the baseline:

### Step 1️⃣ Review Changes
Review the diff images in `cypress/snapshots/` and confirm the change is intentional.

### Step 2️⃣ Replace Baseline
Copy the new `.snap.png` into the baseline folder:

```bash
# On macOS/Linux
cp cypress/snapshots/tooltip-demo.cy.js/tooltip-visible-combined.snap.png \
   cypress/snapshots/tooltip-demo.cy.js/tooltip-visible.snap.png

# Or use the Cypress UI to accept changes
```

### Step 3️⃣ Commit Changes
In many workflows, you commit the updated snapshot files to the repository:

```bash
git add cypress/snapshots/
git commit -m "Update tooltip visual baseline"
git push
```

---

## 🔧 CI/CD Recommendations

### ✅ Best Practices for CI

- ✔️ Run the visual spec during CI and fail the build when comparisons exceed the allowed threshold
- ✔️ Use headless Electron or Chromium in CI
- ✔️ Ensure environment has enough resolution and deterministic fonts
- ✔️ Store baseline snapshots in the repo so PRs show diffs when visuals change
- ✔️ Archive failed test screenshots for debugging

### Example GitHub Actions Workflow

```yaml
name: Visual Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  cypress:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [14.x, 16.x, 18.x]

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run visual tests
        run: npm run test:e2e

      - name: Upload screenshots on failure
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: cypress-screenshots
          path: cypress/snapshots/
          retention-days: 7

      - name: Upload videos
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: cypress-videos
          path: cypress/videos/
          retention-days: 7
```

---

## 🐛 Troubleshooting & Tips

### ⚠️ Visual Tests Fail Due to Minor Differences

Tune `cypress-image-snapshot` options like `failureThreshold` and `failureThresholdType`:

```javascript
// In your test
cy.matchImageSnapshot('tooltip-visible', {
  failureThreshold: 0.01,
  failureThresholdType: 'percent',
  customDiffConfig: {
    threshold: 0.1
  }
})
```

### ❌ `cy.matchImageSnapshot` Missing

Ensure `cypress-image-snapshot` is installed and registered:

```bash
npm install cypress-image-snapshot --save-dev
```

Then register in `cypress/support/e2e.js`:

```javascript
require('cypress-image-snapshot/commands');
```

### 🔍 Tests Can't Find Elements

Ensure the demo iframe loaded:

```javascript
cy.getIframeBody()
  .its('0.contentDocument')
  .should('exist')
```

### 📝 Anti-Aliasing Issues

Different OS rendering can cause slight pixel differences. Use:

```javascript
cy.matchImageSnapshot({
  failureThreshold: 0.05,
  failureThresholdType: 'percent'
})
```

### 🖥️ Inconsistent Results Across Machines

Ensure:
- ✅ Same screen resolution
- ✅ Same browser version
- ✅ Same OS fonts installed
- ✅ No scaling enabled

---

## 💡 Next Steps & Ideas

- 🎨 Add visual tests for different tooltip placements and themes
- 🔗 Add GitHub Actions workflow to run visual tests and post diffs to PRs
- 📱 Parameterize snapshots for different viewports or browsers
- 🌍 Add multi-language tooltip testing
- 🎬 Create video regression testing
- ♿ Add accessibility checks alongside visual tests
- 🌙 Test dark mode vs light mode variants

---

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome!

### 💬 How to Contribute

1. 🔀 **Fork** the repository
2. 🌱 **Create** a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. ✍️ **Make** your changes
4. 📝 **Commit** with descriptive messages
   ```bash
   git commit -m 'Add amazing feature'
   ```
5. 📤 **Push** to the branch
   ```bash
   git push origin feature/amazing-feature
   ```
6. 📋 **Open** a Pull Request

### 📋 Contribution Guidelines

- Follow existing code style
- Add tests for new features
- Update README if needed
- Keep commits atomic and well-documented

---

## 📄 License

This demo is **MIT-friendly**; adapt as needed for your projects.

```
MIT License - See LICENSE file for details
```

---

## 📚 Additional Resources

### Official Documentation
- 📖 [Cypress Documentation](https://docs.cypress.io)
- 🎬 [jQuery UI Tooltip Docs](https://jqueryui.com/tooltip/)
- 📸 [cypress-image-snapshot](https://github.com/palmerhq/cypress-image-snapshot)

### Learning Resources
- 🎓 [Visual Testing Concepts](https://docs.cypress.io/guides/tooling/visual-testing)
- 🖼️ [Iframe Testing Best Practices](https://docs.cypress.io/guides/references/best-practices)
- 📷 [Snapshot Testing Guide](https://github.com/palmerhq/cypress-image-snapshot)

### Related Tools
- 🔍 [Percy.io](https://percy.io) — Cloud-based visual testing
- 🖥️ [BackstopJS](https://garris.github.io/BackstopJS/) — Headless browser testing
- 📊 [Chromatic](https://www.chromatic.com/) — UI testing and review

---

## 🎯 Quick Reference Commands

```bash
# Install dependencies
npm install

# Run all tests headlessly
npm run test:e2e

# Run specific test
npx cypress run --spec "cypress/e2e/tooltip-demo.cy.js"

# Open Cypress UI
npx cypress open

# Update snapshots
npm run cypress:update

# Run with specific browser
npx cypress run --browser chrome

# Run in record mode (Cypress Cloud)
npx cypress run --record --key <your-key>
```

---

<div align="center">

**Made with ❤️ by Saran Kumar**

_Testing tooltips, one snapshot at a time._

⭐ **Star this repo** | 🐛 **Report Issue** | 🤝 **Contribute**

</div>
