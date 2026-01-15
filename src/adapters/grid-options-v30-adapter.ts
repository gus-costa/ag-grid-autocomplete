import { IGridOptionsAdapter } from './grid-options-interfaces'

/**
 * Adapter implementation for AG Grid v30
 * Uses gridOptionsService
 */
export default class GridOptionsV30Adapter implements IGridOptionsAdapter {
  version = 30

  constructor(private readonly gridOptionsService: any) {}

  isEnableCellEditingOnBackspace(): boolean {
    return this.gridOptionsService.get('enableCellEditingOnBackspace')
  }
}
