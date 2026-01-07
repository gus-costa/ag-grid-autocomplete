import autocomplete from '../autocompleter/autocomplete'
import { AutocompleteResult, AutocompleteSettings } from '../autocompleter/types'
import { DataFormat } from '../types'

export interface AutocompleteInputConfig {
  placeholder?: string
  initialValue?: string
  selectData: DataFormat[] | (() => DataFormat[])
  autocompleteSettings?: Partial<AutocompleteSettings<DataFormat>>
  onSelect?: (item: DataFormat | undefined, event: KeyboardEvent | MouseEvent) => void
  onItemMousedown?: (item: DataFormat, event: MouseEvent) => void
  /** Optional existing input element to use instead of creating one */
  inputElement?: HTMLInputElement
}

const TEMPLATE = `<div class="ag-wrapper ag-input-wrapper ag-text-field-input-wrapper ag-cell-editor-autocomplete-wrapper" style="padding: 0 !important;">
  <input class="ag-input-field-input ag-text-field-input ag-cell-editor-autocomplete-input" type="text"/>
</div>`

/**
 * Autocomplete input component - handles autocomplete UI and selection logic.
 * This is separated from the cell editor to allow for cleaner AG Grid version compatibility.
 */
export class AutocompleteInput {
  private readonly container?: HTMLDivElement

  private readonly eInput: HTMLInputElement

  private autocompleter?: AutocompleteResult

  private config: AutocompleteInputConfig

  private selectedItem?: DataFormat

  public get currentItem(): DataFormat | undefined {
    return this.selectedItem
  }

  public set currentItem(value: DataFormat | undefined) {
    this.selectedItem = value
  }

  constructor(config: AutocompleteInputConfig) {
    this.config = config

    // Use provided input element or create new DOM structure
    if (config.inputElement) {
      this.eInput = config.inputElement
    } else {
      const template = document.createElement('template')
      template.innerHTML = TEMPLATE.trim()
      this.container = template.content.firstChild as HTMLDivElement
      this.eInput = this.container.querySelector('input') as HTMLInputElement
    }

    // Setup input
    this.eInput.placeholder = config.placeholder ?? ''
    if (config.initialValue) {
      this.eInput.value = config.initialValue
    }

    // Setup autocomplete
    this.setupAutocomplete()
  }

  public getGui(): HTMLElement | undefined {
    return this.container
  }

  public getInputElement(): HTMLInputElement {
    return this.eInput
  }

  public getValue(): DataFormat | undefined {
    return this.selectedItem
  }

  public setValue(value: string): void {
    this.eInput.value = value
  }

  public focus(): void {
    this.eInput.focus()
  }

  public select(): void {
    this.eInput.select()
  }

  public blur(): void {
    this.eInput.blur()
  }

  public focusAndSelect(): void {
    this.focus()
    this.select()
  }

  public setCaretAtEnd(): void {
    const length = this.eInput.value?.length ?? 0
    if (length > 0) {
      this.eInput.setSelectionRange(length, length)
    }
  }

  public triggerAutocomplete(): void {
    this.eInput.dispatchEvent(new Event('input', { bubbles: true }))
  }

  public destroy(): void {
    this.autocompleter?.destroy()
  }

  private getSelectData(): DataFormat[] {
    const { selectData } = this.config
    if (typeof selectData === 'function') {
      return selectData()
    }
    if (Array.isArray(selectData)) {
      return selectData
    }
    return []
  }

  private setupAutocomplete(): void {
    const defaultSettings = this.getDefaultAutocompleteSettings()
    const mergedSettings = { ...defaultSettings, ...this.config.autocompleteSettings }

    this.autocompleter = autocomplete<DataFormat>({
      input: this.eInput,
      render: mergedSettings.render,
      renderGroup: mergedSettings.renderGroup,
      className: mergedSettings.className,
      minLength: mergedSettings.minLength,
      emptyMsg: mergedSettings.emptyMsg,
      strict: mergedSettings.strict,
      autoselectfirst: mergedSettings.autoselectfirst,
      showOnFocus: mergedSettings.showOnFocus,
      onFreeTextSelect: mergedSettings.onFreeTextSelect,
      onSelect: (item: DataFormat | undefined, input: HTMLInputElement, event: KeyboardEvent | MouseEvent) => {
        this.selectedItem = item
        mergedSettings.onSelect(item, input, event)
        this.config.onSelect?.(item, event)
      },
      fetch: mergedSettings.fetch,
      debounceWaitMs: mergedSettings.debounceWaitMs,
      customize: mergedSettings.customize,
    })
  }

  private getDefaultAutocompleteSettings(): Required<Omit<AutocompleteSettings<DataFormat>, 'input'>> {
    return {
      showOnFocus: false,
      render: (item, value) => {
        const itemElement = document.createElement('div')
        const escapedValue = (value ?? '').replaceAll(/[$()*+.?[\\\]^{|}]/g, String.raw`\$&`)
        const regex = new RegExp(escapedValue, 'gi')
        const fieldItem = document.createElement('span')
        fieldItem.innerHTML = item.label.replace(regex, (match: string) => `<strong>${match}</strong>`)
        itemElement.append(fieldItem)

        // Handle mousedown for item selection
        const eventFunction = (event: MouseEvent) => {
          this.selectedItem = item
          event.stopPropagation()
          this.config.onItemMousedown?.(item, event)
        }
        itemElement.addEventListener('mousedown', eventFunction)

        return itemElement
      },
      renderGroup: (name, _currentValue) => {
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
      onFreeTextSelect: () => {},
      onSelect: () => {},
      fetch: (text, callback) => {
        const items = this.getSelectData()
        const match = text.toLowerCase() || this.eInput.value.toLowerCase()
        callback(items.filter((n) => n.label.toLowerCase().includes(match)))
      },
      debounceWaitMs: 200,
      customize: (input, inputRect, dropdownContainer, maxHeight) => {
        if (maxHeight < 100) {
          /* eslint-disable no-param-reassign */
          dropdownContainer.style.top = '10px'
          dropdownContainer.style.bottom = `${window.innerHeight - inputRect.bottom + input.offsetHeight}px`
          dropdownContainer.style.maxHeight = '140px'
          /* eslint-enable no-param-reassign */
        }
      },
    }
  }
}
