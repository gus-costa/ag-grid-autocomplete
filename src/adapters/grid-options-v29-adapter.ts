import { IGridOptionsAdapter } from './grid-options-interfaces'

/**
 * Adapter implementation for AG Grid v29
 * Uses gridOptionsService
 */
export default class GridOptionsV29Adapter implements IGridOptionsAdapter {
  version = 29

  constructor(private readonly gridOptionsService: any) {}

  isEnableCellEditingOnBackspace(): boolean {
    return this.gridOptionsService.is('enableCellEditingOnBackspace')
  }
}
