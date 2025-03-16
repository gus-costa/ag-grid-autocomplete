import GridOptionsV24Adapter from './grid-options-v24-adapter'
import GridOptionsV28Adapter from './grid-options-v28-adapter'
import GridOptionsV29Adapter from './grid-options-v29-adapter'
import GridOptionsV31Adapter from './grid-options-v31-adapter'
import { IGridOptionsAdapter } from './grid-options-interfaces'

/**
 * Factory function to create the appropriate adapter based on the available properties
 */
export default function createGridOptionsAdapter(gridInstance: any): IGridOptionsAdapter {
  if ('gos' in gridInstance) {
    // gridOptionsService was renamed to gos on v31.3.0
    return new GridOptionsV31Adapter(gridInstance.gos)
  }
  if ('gridOptionsService' in gridInstance) {
    if ('in' in gridInstance.gridOptionsService) {
      return new GridOptionsV29Adapter(gridInstance.gridOptionsService)
    }
    // Method `in` was removed from `gridOptionsService` on V31.0.0
    return new GridOptionsV31Adapter(gridInstance.gridOptionsService)
  }
  if ('gridOptionsWrapper' in gridInstance) {
    return new GridOptionsV28Adapter(gridInstance.gridOptionsWrapper)
  }
  return new GridOptionsV24Adapter()
}
