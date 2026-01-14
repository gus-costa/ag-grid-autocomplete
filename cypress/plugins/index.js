/// <reference types="cypress" />

// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const DEFAULT_SANDBOX_FILE = './cypress/static/ag-grid-autocomplete-editor-test-sandbox.html';

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  on('after:run', () => {
  })

  config.env.SANDBOX_HTML_FILE = DEFAULT_SANDBOX_FILE;
  const packageJson = require('../../node_modules/ag-grid-community/package.json');
  config.env.AG_GRID_VERSION = Number.parseInt(packageJson.version.split('.')[0])

  if (process.env.AG_GRID_VERSION) {
    const version = Number.parseInt(process.env.AG_GRID_VERSION)
    config.env.AG_GRID_VERSION = version
  }

  return config
}
