import { IGridOptionsAdapter } from './grid-options-interfaces'

/**
 * Adapter implementation for AG Grid v32
 * Reads options directly from gridApi
 */
export default class GridOptionsV32Adapter implements IGridOptionsAdapter {
  version = 32

  constructor(private readonly gridApi: any) {}

  isEnableCellEditingOnBackspace(): boolean {
    return this.gridApi.getGridOption('enableCellEditingOnBackspace')
  }
}
