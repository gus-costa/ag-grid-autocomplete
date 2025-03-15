import { GridApi, ICellEditorComp, PopupComponent, SuppressKeyboardEventParams } from '@ag-grid-community/core'
import { IAutocompleteSelectCellEditorParameters, DataFormat, IAutocompleterSettings } from './types'
import createGridOptionsAdapter from './src/adapters/grid-options-adapter'
import { IGridOptionsAdapter } from './src/adapters/grid-options-interfaces'

import autocomplete from './autocompleter/autocomplete'

// use require instead of import to generate the .css file with webpack but avoid import into the .d.ts file
// eslint-disable-next-line unicorn/prefer-module
require('./ag-grid-autocomplete-editor.scss')

const KEY_BACKSPACE = 8
const KEY_DELETE = 46
const KEY_ENTER = 13
const KEY_TAB = 9
const KEY_UP = 38
const KEY_DOWN = 40

// New key string constants for eventKey
const KEY_BACKSPACE_STRING = 'Backspace'
const KEY_DELETE_STRING = 'Delete'
const KEY_ENTER_STRING = 'Enter'
const KEY_TAB_STRING = 'Tab'
const KEY_UP_STRING = 'ArrowUp'
const KEY_DOWN_STRING = 'ArrowDown'

const KeysHandled = new Set([KEY_BACKSPACE, KEY_DELETE, KEY_ENTER, KEY_TAB, KEY_UP, KEY_DOWN])
const KeysHandledStrings = new Set([
  KEY_BACKSPACE_STRING,
  KEY_DELETE_STRING,
  KEY_ENTER_STRING,
  KEY_TAB_STRING,
  KEY_UP_STRING,
  KEY_DOWN_STRING,
])
export default class AutocompleteSelectCellEditor extends PopupComponent implements ICellEditorComp {
  public currentItem?: DataFormat

  private focusAfterAttached: boolean = false

  private readonly eInput: HTMLInputElement

  private autocompleter?: any

  private required: boolean = false

  private stopEditing?: (cancel?: boolean) => void

  /**
   * Originally AgGrid would always trigger cell editing when backspace was hit
   */
  private backspaceTriggersEdit = true

  private gridApi?: GridApi

  private gridOptionsAdapter!: IGridOptionsAdapter

  private static getSelectData(
    parameters: IAutocompleteSelectCellEditorParameters<AutocompleteSelectCellEditor>,
  ): Array<DataFormat> {
    if (typeof parameters.selectData === 'function') {
      return parameters.selectData(parameters)
    }

    if (Array.isArray(parameters.selectData)) {
      return parameters.selectData as Array<DataFormat>
    }
    return []
  }

  private static getDefaultAutocompleteSettings(
    parameters: IAutocompleteSelectCellEditorParameters<AutocompleteSelectCellEditor>,
  ): Required<IAutocompleterSettings<DataFormat, AutocompleteSelectCellEditor>> {
    return {
      showOnFocus: false,
      render(cellEditor, item, value) {
        const itemElement = document.createElement('div')
        const escapedValue = (value ?? '').replaceAll(/[$()*+.?[\\\]^{|}]/g, String.raw`\$&`)
        const regex = new RegExp(escapedValue, 'gi')
        const fieldItem = document.createElement('span')
        fieldItem.innerHTML = item.label.replace(regex, function strongify(match: string) {
          return `<strong>${match}</strong>`
        })
        itemElement.append(fieldItem)
        cellEditor.addManagedListener(itemElement, 'mousedown', (event: MouseEvent) => {
          // eslint-disable-next-line no-param-reassign
          cellEditor.currentItem = item
          event.stopPropagation()
        })
        return itemElement
      },
      renderGroup(_, name) {
        const div = document.createElement('div')
        div.textContent = name
        div.className = 'group'
        return div
      },
      className: 'ag-cell-editor-autocomplete',
      minLength: 1,
      emptyMsg: 'None',
      strict: true,
      autoselectfirst: true,
      onFreeTextSelect() {},
      onSelect(cellEditor, item: DataFormat | undefined) {
        // eslint-disable-next-line no-param-reassign
        cellEditor.currentItem = item
      },
      fetch: (cellEditor, text, callback) => {
        const items = AutocompleteSelectCellEditor.getSelectData(parameters)
        const match = text.toLowerCase() || cellEditor.eInput.value.toLowerCase()
        callback(
          items.filter(function caseInsensitiveIncludes(n) {
            return n.label.toLowerCase().includes(match)
          }),
        )
      },
      debounceWaitMs: 200,
      customize(_, input, inputRect, container, maxHeight) {
        if (maxHeight < 100) {
          /* eslint-disable no-param-reassign */
          container.style.top = '10px'
          container.style.bottom = `${window.innerHeight - inputRect.bottom + input.offsetHeight}px`
          container.style.maxHeight = '140px'
          /* eslint-enable no-param-reassign */
        }
      },
    }
  }

  /**
   * Determines whether a keyboard event should be suppressed in a grid cell.
   * Supports both modern (key-based) and legacy (keyCode-based) keyboard event handling.
   *
   * @param parameters - Event parameters from ag-grid
   * @param isRequired - Whether the cell represents a required field
   * @param backspaceTriggersEdit - Whether pressing backspace should trigger cell editing
   * @param isVersionGte28 - Whether using ag-grid version 28 or greater (which changed edit behavior)
   * @returns True if the event should be suppressed, false otherwise
   */
  private static suppressKeyboardEvent(
    parameters: SuppressKeyboardEventParams,
    isRequired = false,
    backspaceTriggersEdit = true,
    isVersionGte28 = false,
  ): boolean {
    // Check for both keyCode (deprecated) and key (new string-based approach)
    // eslint-disable-next-line sonarjs/deprecation
    const { keyCode } = parameters.event
    const { key } = parameters.event

    // Handle both numeric keyCode and string key approaches
    if (parameters.editing && (key ? KeysHandledStrings.has(key) : KeysHandled.has(keyCode))) {
      return true
    }

    // Logic below this point is required only if we are using ag-grid>=28, field is required, and is not in edit mode
    if (!isVersionGte28 || !isRequired || parameters.editing) {
      return false
    }

    // If the user hits delete, prevent it as it doesn't trigger a cell edit anymore
    if (key ? key === KEY_DELETE_STRING : keyCode === KEY_DELETE) {
      return true
    }

    // If the user hits backspace and cell editing is not enabled, prevent it
    return !backspaceTriggersEdit && (key ? key === KEY_BACKSPACE_STRING : keyCode === KEY_BACKSPACE)
  }

  private static getStartValue(parameters: IAutocompleteSelectCellEditorParameters<AutocompleteSelectCellEditor>) {
    // Check for new eventKey (v27+) or fall back to keyPress for backward compatibility
    // Use type assertion with 'as any' to access potentially undefined properties
    // without modifying the interface definition
    const eventKey = (parameters as any).eventKey as string
    const keyPress = (parameters as any).keyPress as number

    // Check for backspace or delete using either the string eventKey or numeric keyPress
    const isBackspace = eventKey ? eventKey === KEY_BACKSPACE_STRING : keyPress === KEY_BACKSPACE
    const isDelete = eventKey ? eventKey === KEY_DELETE_STRING : keyPress === KEY_DELETE
    const keyPressBackspaceOrDelete = isBackspace || isDelete

    if (keyPressBackspaceOrDelete) {
      return ''
    }
    // Detecting if the pressed key is a character
    if (parameters.eventKey?.length === 1) {
      return parameters.eventKey
    }
    return parameters.formatValue(parameters.value)
  }

  constructor() {
    super(
      '<div class="ag-wrapper ag-input-wrapper ag-text-field-input-wrapper ag-cell-editor-autocomplete-wrapper" style="padding: 0 !important;"><input class="ag-input-field-input ag-text-field-input ag-cell-editor-autocomplete-input" type="text"/></div>',
    )
    this.eInput = this.getGui().querySelector('input') as HTMLInputElement
    if (this.currentItem) {
      this.eInput.value = this.currentItem.label || (this.currentItem.value as string)
    }
  }

  public init(parameters: IAutocompleteSelectCellEditorParameters<AutocompleteSelectCellEditor>) {
    this.gridApi = parameters.api
    this.stopEditing = parameters.stopEditing
    const defaultSettings = AutocompleteSelectCellEditor.getDefaultAutocompleteSettings(parameters)
    this.focusAfterAttached = parameters.cellStartedEdit

    this.eInput.placeholder = parameters.placeholder || ''
    this.eInput.value = AutocompleteSelectCellEditor.getStartValue(parameters)

    const autocompleteParameters = { ...defaultSettings, ...parameters.autocomplete }

    this.autocompleter = autocomplete<DataFormat>({
      input: this.eInput,
      render: (item: DataFormat, currentValue: string) => {
        return autocompleteParameters.render(this, item, currentValue)
      },
      renderGroup: (name: string, currentValue: string) => {
        return autocompleteParameters.renderGroup(this, name, currentValue)
      },
      className: autocompleteParameters.className,
      minLength: autocompleteParameters.minLength,
      emptyMsg: autocompleteParameters.emptyMsg,
      strict: autocompleteParameters.strict,
      autoselectfirst: autocompleteParameters.autoselectfirst,
      showOnFocus: autocompleteParameters.showOnFocus,
      onFreeTextSelect: (item: DataFormat, input: HTMLInputElement) => {
        return autocompleteParameters.onFreeTextSelect(this, item, input)
      },
      onSelect: (item: DataFormat | undefined, input: HTMLInputElement, event: KeyboardEvent | MouseEvent) => {
        const result = autocompleteParameters.onSelect(this, item, input)
        // need the second argument because of cypress testing changing the view context
        if (event instanceof KeyboardEvent || event instanceof event.view!.document.defaultView!.KeyboardEvent) {
          this.handleTabEvent(event)
        } else {
          this.destroy()
        }
        return result
      },
      fetch: (text: string, update: (items: DataFormat[] | false) => void, trigger) => {
        return autocompleteParameters.fetch(this, text, update, trigger)
      },
      debounceWaitMs: autocompleteParameters.debounceWaitMs,
      customize: (input: HTMLInputElement, inputRect: DOMRect, container: HTMLDivElement, maxHeight: number) => {
        return autocompleteParameters.customize(this, input, inputRect, container, maxHeight)
      },
    })

    if (parameters.required) {
      this.required = true
    }

    // Create the grid options adapter based on the instance
    this.gridOptionsAdapter = createGridOptionsAdapter(this)

    if (!parameters.colDef.suppressKeyboardEvent) {
      // eslint-disable-next-line no-param-reassign
      parameters.colDef.suppressKeyboardEvent = (suppressParameters) =>
        AutocompleteSelectCellEditor.suppressKeyboardEvent(
          suppressParameters,
          this.required,
          this.backspaceTriggersEdit,
          this.gridOptionsAdapter.version >= 28,
        )
    }

    // The behavior for deleting cell values changed from v28 and beyond, so we need to track this option's value
    if (this.gridOptionsAdapter.version >= 28) {
      this.backspaceTriggersEdit = this.gridOptionsAdapter.isEnableCellEditingOnBackspace()
    }
  }

  handleTabEvent(event: KeyboardEvent) {
    // eslint-disable-next-line sonarjs/deprecation
    const keyCode = event.which || event.keyCode || 0

    if (keyCode === KEY_TAB && this.gridApi) {
      if (event.shiftKey) {
        this.gridApi.tabToPreviousCell()
      } else {
        this.gridApi.tabToNextCell()
      }
    } else {
      this.destroy()
    }
  }

  afterGuiAttached(): void {
    if (!this.focusAfterAttached) {
      return
    }

    const { eInput } = this
    eInput.focus()
    eInput.select()
    // when we started editing, we want the caret at the end, not the start.
    // this comes into play in two scenarios: a) when user hits F2 and b)
    // when user hits a printable character, then on IE (and only IE) the caret
    // was placed after the first character, thus 'apply' would end up as 'pplea'
    const length = eInput.value ? eInput.value.length : 0
    if (length > 0) {
      eInput.setSelectionRange(length, length)
    }
  }

  focusIn(): void {
    this.eInput.focus()
    this.eInput.select()
  }

  focusOut(): void {
    this.eInput.blur()
    this.autocompleter.destroy()
  }

  destroy(): void {
    this.focusOut()
    if (this.stopEditing) {
      this.stopEditing()
    }
  }

  getValue(): DataFormat | undefined {
    return this.currentItem
  }

  isCancelAfterEnd(): boolean {
    if (this.required) {
      return !this.currentItem
    }
    return false
  }

  // eslint-disable-next-line class-methods-use-this
  isCancelBeforeStart(): boolean {
    return false
  }

  // eslint-disable-next-line class-methods-use-this
  isPopup(): boolean {
    return false
  }
}
