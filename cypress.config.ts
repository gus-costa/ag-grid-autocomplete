// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: 'eqz3n2',
  e2e: {
    setupNodeEvents(on, config) {
      // eslint-disable-next-line global-require, unicorn/prefer-module
      return require('./cypress/plugins/index')(on, config)
    },
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.js',
  },
})
