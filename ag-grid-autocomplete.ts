import { Component, GridApi, ICellEditorComp, SuppressKeyboardEventParams } from 'ag-grid-community'
import { IAutocompleteSelectCellEditorParameters, DataFormat } from './types'
import createGridOptionsAdapter from './src/adapters/grid-options-adapter'
import { IGridOptionsAdapter } from './src/adapters/grid-options-interfaces'
import { AutocompleteInput, AutocompleteInputConfig } from './src/autocomplete-input'

// use require instead of import to generate the .css file with webpack but avoid import into the .d.ts file
// eslint-disable-next-line unicorn/prefer-module
require('./ag-grid-autocomplete.scss')

// Key codes (legacy numeric for v23-v26)
const KEY_BACKSPACE = 8
const KEY_DELETE = 46
const KEY_ENTER = 13
const KEY_TAB = 9
const KEY_UP = 38
const KEY_DOWN = 40

// Key strings (modern for v27+)
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

type AutocompleteParameters = IAutocompleteSelectCellEditorParameters<AutocompleteSelectCellEditor>

/**
 * Autocomplete cell editor for AG Grid.
 * This is a thin wrapper around AutocompleteInput that handles AG Grid integration.
 */
export default class AutocompleteSelectCellEditor extends Component implements ICellEditorComp {
  // The autocomplete input component
  private autocompleteInput!: AutocompleteInput

  // AG Grid integration
  private focusAfterAttached: boolean = false

  private startedByEnter: boolean = false

  private required: boolean = false

  private gridApi?: GridApi

  private gridOptionsAdapter!: IGridOptionsAdapter

  private stopEditing?: (cancel?: boolean) => void

  /**
   * Originally AgGrid would always trigger cell editing when backspace was hit
   */
  private backspaceTriggersEdit = true

  constructor() {
    // Use the same wrapper structure as the original implementation
    // This matches the template in AutocompleteInput for consistency
    super(
      '<div class="ag-wrapper ag-input-wrapper ag-text-field-input-wrapper ag-cell-editor-autocomplete-wrapper" style="padding: 0 !important;"><input class="ag-input-field-input ag-text-field-input ag-cell-editor-autocomplete-input" type="text"/></div>',
    )
  }

  /**
   * Initialize the cell editor
   * @param parameters - Cell editor parameters from AG Grid
   */
  public init(parameters: AutocompleteParameters): void {
    this.gridApi = parameters.api
    this.stopEditing = parameters.stopEditing
    this.focusAfterAttached = parameters.cellStartedEdit
    this.startedByEnter = parameters.eventKey === KEY_ENTER_STRING
    this.required = parameters.required ?? false

    // Create the grid options adapter based on the instance
    this.gridOptionsAdapter = createGridOptionsAdapter(this.gridApi)

    // The behavior for deleting cell values changed from v28 and beyond
    if (this.gridOptionsAdapter.version >= 28) {
      this.backspaceTriggersEdit = this.gridOptionsAdapter.isEnableCellEditingOnBackspace()
    }

    // Get the input element from our template
    const inputElement = this.getGui().querySelector('input') as HTMLInputElement

    // Create the autocomplete input component, passing our existing input element
    this.autocompleteInput = new AutocompleteInput({
      placeholder: parameters.placeholder,
      initialValue: AutocompleteSelectCellEditor.getStartValue(parameters),
      selectData: () => AutocompleteSelectCellEditor.getSelectData(parameters),
      autocompleteSettings: this.transformAutocompleteSettings(parameters),
      onSelect: (item, event) => {
        this.handleSelection(item, event)
      },
      onItemMousedown: (item) => {
        this.autocompleteInput.currentItem = item
      },
      inputElement,
    })

    // Setup keyboard suppression if not already configured
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
  }

  public afterGuiAttached(): void {
    if (this.focusAfterAttached) {
      this.autocompleteInput.focusAndSelect()
      this.autocompleteInput.setCaretAtEnd()
    }

    // When started by Enter key, trigger the autocomplete dropdown
    if (this.startedByEnter) {
      setTimeout(() => {
        this.autocompleteInput.triggerAutocomplete()
      })
    }
  }

  public focusIn(): void {
    this.autocompleteInput.focusAndSelect()
  }

  public focusOut(): void {
    this.autocompleteInput.blur()
    this.autocompleteInput.destroy()
  }

  public getValue(): DataFormat | undefined {
    return this.autocompleteInput.getValue()
  }

  public isCancelAfterEnd(): boolean {
    return this.required && !this.autocompleteInput.getValue()
  }

  // For backward compatibility - expose currentItem
  public get currentItem(): DataFormat | undefined {
    return this.autocompleteInput?.currentItem
  }

  public set currentItem(value: DataFormat | undefined) {
    if (this.autocompleteInput) {
      this.autocompleteInput.currentItem = value
    }
  }

  // Private methods

  private handleSelection(item: DataFormat | undefined, event: KeyboardEvent | MouseEvent): void {
    // Check if this was a keyboard event (Enter/Tab) vs mouse click
    // Need the second check because of cypress testing changing the view context
    const isKeyboardEvent =
      event instanceof KeyboardEvent || event instanceof event.view!.document.defaultView!.KeyboardEvent

    if (isKeyboardEvent) {
      this.handleKeyboardSelection(event as KeyboardEvent)
    } else if (item) {
      this.selectAndClose()
    }
  }

  private handleKeyboardSelection(event: KeyboardEvent): void {
    // eslint-disable-next-line sonarjs/deprecation
    const keyCode = event.which || event.keyCode || 0

    if (keyCode === KEY_TAB && this.gridApi) {
      // Tab key - navigate to next/previous cell
      if (event.shiftKey) {
        this.gridApi.tabToPreviousCell()
      } else {
        this.gridApi.tabToNextCell()
      }
    } else {
      // Enter key or other - just close
      this.selectAndClose()
    }
  }

  private selectAndClose(): void {
    this.focusOut()
    if (this.stopEditing) {
      this.stopEditing()
    }
  }

  /**
   * Wraps a user-provided callback to inject the cell editor as the first parameter.
   *
   * This enables backward compatibility: users expect callbacks like `render(cellEditor, item, value)`,
   * but internally AutocompleteInput uses simpler signatures like `render(item, value)`.
   *
   * @param callback - User's callback that expects the cell editor as first parameter
   * @returns A wrapped function that injects `this` (the cell editor) as the first argument
   *
   * @example
   * // User provides: (cellEditor, item, value) => HTMLElement
   * // We transform to: (item, value) => userCallback(this, item, value)
   * transformed.render = this.wrapCallback(userSettings.render)
   */
  private wrapCallback<Arguments extends any[], Return>(
    callback: (context: this, ...arguments_: Arguments) => Return,
  ): (...arguments_: Arguments) => Return {
    // Capture `this` (the cell editor) via closure and prepend it to all calls
    return (...arguments_: Arguments) => {
      return callback(this, ...arguments_)
    }
  }

  private transformAutocompleteSettings(
    parameters: AutocompleteParameters,
  ): AutocompleteInputConfig['autocompleteSettings'] {
    const userSettings = parameters.autocomplete
    if (!userSettings) {
      return {}
    }

    // Transform the settings to add AutocompleteInput as context to the callback functions
    const transformed: AutocompleteInputConfig['autocompleteSettings'] = {}

    if (userSettings.render) {
      transformed.render = this.wrapCallback(userSettings.render)
    }

    if (userSettings.renderGroup) {
      transformed.renderGroup = this.wrapCallback(userSettings.renderGroup)
    }

    if (userSettings.onFreeTextSelect) {
      transformed.onFreeTextSelect = this.wrapCallback(userSettings.onFreeTextSelect)
    }

    if (userSettings.onSelect) {
      transformed.onSelect = this.wrapCallback(userSettings.onSelect)
    }

    if (userSettings.fetch) {
      transformed.fetch = this.wrapCallback(userSettings.fetch)
    }

    if (userSettings.customize) {
      transformed.customize = this.wrapCallback(userSettings.customize)
    }

    // Copy non-function settings directly
    if (userSettings.className !== undefined) transformed.className = userSettings.className
    if (userSettings.minLength !== undefined) transformed.minLength = userSettings.minLength
    if (userSettings.emptyMsg !== undefined) transformed.emptyMsg = userSettings.emptyMsg
    if (userSettings.strict !== undefined) transformed.strict = userSettings.strict
    if (userSettings.autoselectfirst !== undefined) transformed.autoselectfirst = userSettings.autoselectfirst
    if (userSettings.showOnFocus !== undefined) transformed.showOnFocus = userSettings.showOnFocus
    if (userSettings.debounceWaitMs !== undefined) transformed.debounceWaitMs = userSettings.debounceWaitMs

    return transformed
  }

  // Static helper methods

  private static getSelectData(parameters: AutocompleteParameters): Array<DataFormat> {
    if (typeof parameters.selectData === 'function') {
      return parameters.selectData(parameters)
    }
    if (Array.isArray(parameters.selectData)) {
      return parameters.selectData
    }
    return []
  }

  private static getStartValue(parameters: AutocompleteParameters): string {
    // Check for new eventKey (v27+) or fall back to keyPress for backward compatibility
    const eventKey = (parameters as any).eventKey as string
    const keyPress = (parameters as any).keyPress as number

    // Check for backspace or delete using either the string eventKey or numeric keyPress
    const isBackspace = eventKey ? eventKey === KEY_BACKSPACE_STRING : keyPress === KEY_BACKSPACE
    const isDelete = eventKey ? eventKey === KEY_DELETE_STRING : keyPress === KEY_DELETE

    if (isBackspace || isDelete) {
      return ''
    }

    // Detecting if the pressed key is a character
    if (parameters.eventKey?.length === 1) {
      return parameters.eventKey
    }

    return parameters.formatValue(parameters.value) ?? ''
  }

  /**
   * Determines whether a keyboard event should be suppressed in a grid cell.
   * Supports both modern (key-based) and legacy (keyCode-based) keyboard event handling.
   */
  private static suppressKeyboardEvent(
    suppressParameters: SuppressKeyboardEventParams,
    isRequired = false,
    backspaceTriggersEdit = true,
    isVersionGte28 = false,
  ): boolean {
    // eslint-disable-next-line sonarjs/deprecation
    const { keyCode } = suppressParameters.event
    const { key } = suppressParameters.event

    // Handle both numeric keyCode and string key approaches
    if (suppressParameters.editing && (key ? KeysHandledStrings.has(key) : KeysHandled.has(keyCode))) {
      return true
    }

    // Logic below this point is required only if we are using ag-grid>=28, field is required, and is not in edit mode
    if (!isVersionGte28 || !isRequired || suppressParameters.editing) {
      return false
    }

    // If the user hits delete, prevent it as it doesn't trigger a cell edit anymore
    if (key ? key === KEY_DELETE_STRING : keyCode === KEY_DELETE) {
      return true
    }

    // If the user hits backspace and cell editing is not enabled, prevent it
    return !backspaceTriggersEdit && (key ? key === KEY_BACKSPACE_STRING : keyCode === KEY_BACKSPACE)
  }
}
