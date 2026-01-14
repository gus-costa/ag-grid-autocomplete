import { ColDef, GridOptions } from 'ag-grid-community'
import getOptions from './get-options'

let modulesRegistered = false

function getGridOptions(columnDefs: ColDef[], rowData: any[]): GridOptions {
  return {
    columnDefs,
    rowData,
    suppressScrollOnNewData: false,
    suppressBrowserResizeObserver: true,
    ...getOptions<GridOptions>(Cypress.env('AG_GRID_VERSION'), 'gridOptions'),
  }
}

/**
 * Creates an AG Grid instance with compatibility support for different versions.
 *
 * This function handles the differences between AG Grid versions by using the appropriate
 * initialization method based on the version number. For version 31 and above, it uses
 * the new `createGrid` factory function. For older versions, it uses the `Grid` constructor.
 *
 * @param {HTMLElement} element - The DOM element where the grid will be rendered
 * @param {ColDef[]} columnDefs - Column definitions for the grid
 * @param {any[]} rowData - Data to be displayed in the grid
 * @param {number} [agGridVersion=0] - AG Grid version number to determine API compatibility
 *
 * @example
 * // Create a grid with the latest API (v31+)
 * createGrid(container, columns, data, 31);
 *
 * @example
 * // Create a grid with legacy API (pre-v31)
 * createGrid(container, columns, data, 28);
 *
 * @returns {void}
 */
export default function createGrid(
  element: HTMLElement,
  columnDefs: ColDef[],
  rowData: any[],
  agGridVersion = 0,
): void {
  // Get the window from the element's document to ensure we're in the correct context
  const win = element.ownerDocument.defaultView as Window
  const { agGrid } = win as any

  if (!agGrid) {
    throw new Error(`AG Grid v${agGridVersion} not loaded. Ensure the sandbox HTML loads AG Grid from CDN.`)
  }

  const gridOptions = getGridOptions(columnDefs, rowData)

  // Register modules for v33+ (only once)
  if (agGridVersion >= 33 && !modulesRegistered) {
    agGrid.ModuleRegistry.registerModules([agGrid.AllCommunityModule])
    modulesRegistered = true
  }

  if (agGridVersion >= 31) {
    agGrid.createGrid(element, gridOptions)
    return
  }

  // eslint-disable-next-line sonarjs/constructor-for-side-effects
  new agGrid.Grid(element, gridOptions)
}
