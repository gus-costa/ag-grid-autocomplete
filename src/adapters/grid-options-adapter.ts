import GridOptionsV24Adapter from './grid-options-v24-adapter'
import GridOptionsV28Adapter from './grid-options-v28-adapter'
import GridOptionsV29Adapter from './grid-options-v29-adapter'
import { IGridOptionsAdapter } from './grid-options-interfaces'

/**
 * Factory function to create the appropriate adapter based on the available properties
 */
export default function createGridOptionsAdapter(gridInstance: any): IGridOptionsAdapter {
  if ('gridOptionsService' in gridInstance) {
    return new GridOptionsV29Adapter(gridInstance.gridOptionsService)
  }
  if ('gridOptionsWrapper' in gridInstance) {
    return new GridOptionsV28Adapter(gridInstance.gridOptionsWrapper)
  }
  return new GridOptionsV24Adapter()
}
