// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'cypress'
import initPlugins from './cypress/plugins'

export default defineConfig({
  projectId: 'eqz3n2',
  e2e: {
    setupNodeEvents(on, config) {
      return initPlugins(on, config)
    },
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
  },
})
