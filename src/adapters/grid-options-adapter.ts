import GridOptionsV24Adapter from './grid-options-v24-adapter'
import GridOptionsV25Adapter from './grid-options-v25-adapter'
import GridOptionsV29Adapter from './grid-options-v29-adapter'
import GridOptionsV30Adapter from './grid-options-v30-adapter'
import GridOptionsV32Adapter from './grid-options-v32-adapter'
import { IGridOptionsAdapter } from './grid-options-interfaces'

/**
 * Factory function to create the appropriate adapter based on the available properties
 */
export default function createGridOptionsAdapter(gridInstance: any): IGridOptionsAdapter {
  if (!('context' in gridInstance)) {
    return new GridOptionsV32Adapter(gridInstance)
  }
  if ('gos' in gridInstance) {
    // gos (gridOptionsService shorthand) exists on gridApi in v30-v31
    return new GridOptionsV30Adapter(gridInstance.gos)
  }
  if ('gridOptionsService' in gridInstance) {
    // gridOptionsService exists on gridApi only in v29 (v30+ replaced it with gos)
    return new GridOptionsV29Adapter(gridInstance.gridOptionsService)
  }
  if ('setGridAriaProperty' in gridInstance) {
    // setGridAriaProperty was introduced on v25
    return new GridOptionsV25Adapter(gridInstance.gridOptionsWrapper)
  }
  return new GridOptionsV24Adapter()
}
