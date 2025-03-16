import * as agGrid from './ag-grid'
import getOptions from './get-options'

function getGridOptions(columnDefs: agGrid.ColDef[], rowData: any[]): agGrid.GridOptions {
  return {
    columnDefs,
    rowData,
    suppressScrollOnNewData: false,
    suppressBrowserResizeObserver: true,
    ...getOptions<agGrid.GridOptions>(Cypress.env('AG_GRID_VERSION'), 'gridOptions'),
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
 * @param {agGrid.ColDef[]} columnDefs - Column definitions for the grid
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
  columnDefs: agGrid.ColDef[],
  rowData: any[],
  agGridVersion = 0,
): void {
  const gridOptions = getGridOptions(columnDefs, rowData)

  if (agGridVersion >= 31) {
    agGrid.createGrid(element, gridOptions)
    return
  }

  // eslint-disable-next-line sonarjs/constructor-for-side-effects
  new agGrid.Grid(element, gridOptions)
}
