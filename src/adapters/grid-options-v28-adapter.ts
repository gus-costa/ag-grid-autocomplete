import { IGridOptionsAdapter } from './grid-options-interfaces'

/**
 * Adapter implementation for AG Grid v28
 * Uses gridOptionsWrapper
 */
export default class GridOptionsV28Adapter implements IGridOptionsAdapter {
  version: 27 | 28

  constructor(private readonly gridOptionsWrapper: any) {
    // isEnableCellEditingOnBackspace is new on version 28, so it is safe to assume v28+
    this.version = typeof this.gridOptionsWrapper.isEnableCellEditingOnBackspace === 'function' ? 28 : 27
  }

  isEnableCellEditingOnBackspace(): boolean {
    // This option didn't exist before v28, the original behavior is as it was always set to true
    if (this.version < 28) return true
    return this.gridOptionsWrapper.isEnableCellEditingOnBackspace()
  }
}
