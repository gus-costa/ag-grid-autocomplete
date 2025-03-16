import { IGridOptionsAdapter } from './grid-options-interfaces'

/**
 * Adapter implementation for AG Grid v31
 * Uses gridOptionsService
 */
export default class GridOptionsV31Adapter implements IGridOptionsAdapter {
  version = 31

  constructor(private readonly gridOptionsService: any) {}

  isEnableCellEditingOnBackspace(): boolean {
    return this.gridOptionsService.get('enableCellEditingOnBackspace')
  }
}
