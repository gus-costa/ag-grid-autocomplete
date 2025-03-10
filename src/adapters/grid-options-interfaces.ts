/**
 * Interface for the Grid Options Adapter
 * Abstracts away the differences between v28 and v29
 */
export interface IGridOptionsAdapter {
  /**
   * 24 means any version below 25
   * 27 means anything between 25 and 27
   * 29 means any version above 28
   */
  version: number
  isEnableCellEditingOnBackspace(): boolean
}
