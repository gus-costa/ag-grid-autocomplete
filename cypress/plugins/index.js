/// <reference types="cypress" />

const { readFileSync, writeFileSync, existsSync, mkdirSync } = require("node:fs");
const path = require("node:path");

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

const PROJECT_ROOT = path.resolve(__dirname, '../../');
const DEFAULT_SANDBOX_FILE = './cypress/static/ag-grid-autocomplete-editor-test-sandbox.html';

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  on('after:run', () => {
    writeImportFile(null);
  })

  config.env.SANDBOX_HTML_FILE = DEFAULT_SANDBOX_FILE;
  const packageJson = require('../../node_modules/ag-grid-community/package.json');
  config.env.AG_GRID_VERSION = Number.parseInt(packageJson.version.split('.')[0])

  if (process.env.AG_GRID_VERSION) {
    const version = Number.parseInt(process.env.AG_GRID_VERSION)
    config.env.AG_GRID_VERSION = version

    const sandboxFile = writeSandboxFile(version);

    config.env.SANDBOX_HTML_FILE = sandboxFile;
  }

  writeImportFile(process.env.AG_GRID_VERSION);

  return config
}

function writeSandboxFile(version) {
  const packageFolder = `deps-cache/node_modules/ag-grid-community-${version}`;
  const sandboxFile = `./cypress/static/temp/ag-grid-autocomplete-editor-test-sandbox-${version}.html`;

  createStaticTempDir(path.resolve(PROJECT_ROOT, './cypress/static/temp'));

  const template = readFileSync(path.resolve(PROJECT_ROOT, DEFAULT_SANDBOX_FILE), { encoding: 'utf-8' });
  let newFile = template
    .replaceAll('node_modules/ag-grid-community', packageFolder)
    .replaceAll('base href="../../"', 'base href="../../../"');

  if (version < 29) {
    newFile = newFile.replaceAll('styles/', 'dist/styles/')
  }

  writeFileSync(path.resolve(PROJECT_ROOT, sandboxFile), newFile);
  return sandboxFile;
}

function createStaticTempDir(versionDir) {
  if (existsSync(versionDir))
    return;

  mkdirSync(versionDir, { recursive: true });
}

function writeImportFile(version) {
  const importStatements = version ?
    `export { ColDef, Grid, GridOptions, createGrid } from '../../deps-cache/node_modules/ag-grid-community-${version}'\n` :
    `export { ColDef, Grid, GridOptions, createGrid } from 'ag-grid-community'\n`;

  writeFileSync(path.resolve(PROJECT_ROOT, './cypress/utils/ag-grid.ts'), importStatements);
}