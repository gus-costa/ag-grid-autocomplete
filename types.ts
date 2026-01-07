import { ICellEditorParams, PopupComponent } from 'ag-grid-community'

import { AutocompleteItem, EventTrigger } from './autocompleter/types'

export interface DataFormat extends AutocompleteItem {
  value: number | string
  label: string
  group?: string
}

export type AutocompleteClient = DataFormat & AutocompleteItem

/**
 * Settings for the autocompleter component.
 * The generic U parameter represents the component context passed to callbacks.
 */
export interface IAutocompleterSettings<T extends AutocompleteItem, U = unknown> {
  render?: (context: U, item: T, currentValue: string) => HTMLElement
  renderGroup?: (context: U, name: string, currentValue: string) => HTMLElement
  className?: string
  minLength?: number
  emptyMsg?: string
  strict?: boolean
  autoselectfirst?: boolean
  onFreeTextSelect?: (context: U, item: T, input: HTMLInputElement) => void
  onSelect?: (context: U, item: T | undefined, input: HTMLInputElement) => void
  fetch?: (context: U, text: string, update: (items: T[] | false) => void, trigger?: EventTrigger) => void
  debounceWaitMs?: number
  showOnFocus?: boolean
  customize?: (
    context: U,
    input: HTMLInputElement,
    inputRect: DOMRect,
    container: HTMLDivElement,
    maxHeight: number,
  ) => void
}

/**
 * Parameters for the AutocompleteSelectCellEditor.
 * Note: U extends PopupComponent for backward compatibility with existing user code
 * that accesses cell editor methods in callbacks.
 */
export interface IAutocompleteSelectCellEditorParameters<U extends PopupComponent> extends ICellEditorParams {
  autocomplete?: IAutocompleterSettings<DataFormat, U>
  selectData: Array<DataFormat> | ((parameters: IAutocompleteSelectCellEditorParameters<U>) => Array<DataFormat>)
  placeholder?: string
  required?: boolean
}
