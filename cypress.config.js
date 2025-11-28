const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
      baseUrl: 'https://jqueryui.com',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1280,
    viewportHeight: 720,
    setupNodeEvents(on, config) {
      // register cypress-image-snapshot plugin
      try {
        const { addMatchImageSnapshotPlugin } = require('cypress-image-snapshot/plugin');
        addMatchImageSnapshotPlugin(on, config);
      } catch (err) {
        // plugin not installed yet — tests will still run but visual snapshots will error until install
        // console.warn('cypress-image-snapshot plugin not available:', err.message);
      }
      return config;
    },
  },
});
