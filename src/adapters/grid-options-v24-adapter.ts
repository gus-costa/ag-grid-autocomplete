import { IGridOptionsAdapter } from './grid-options-interfaces'

/**
 * Adapter implementation for AG Grid v24
 */
export default class GridOptionsV24Adapter implements IGridOptionsAdapter {
  version = 24

  // eslint-disable-next-line class-methods-use-this
  isEnableCellEditingOnBackspace(): boolean {
    return true
  }
}
