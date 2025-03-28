import autocomplete, { AutocompleteItem, AutocompleteSettings } from 'ag-grid-autocomplete/autocompleter/autocomplete'

describe('autocomplete end-to-end strict tests', () => {
  it('should call onSelect with undefined when strict is true and no elements from fetch', function () {
    const inputText = 'United'

    cy.fixture('selectDatas/united.json').as('selectData')
    // @ts-ignore
    cy.visit('./cypress/static/autocomplete-test-sandbox.html')
    // Get the input element and setup autocomplete to it
    cy.get('#autocompleter').then((indexQueryElement) => {
      autocomplete({
        autoselectfirst: false,
        fetch(search: string, update: <AutocompleteItem>(items: AutocompleteItem[] | false) => void) {
          update([])
        },
        onSelect(item: AutocompleteItem | undefined) {
          if (item && item.label) {
            indexQueryElement.val(item.label)
          } else {
            indexQueryElement.val('undefined')
          }
        },
        strict: true,
        input: <HTMLInputElement>indexQueryElement.get(0),
      })
    })
    // Type some text into the input and select the first element using arrow keys
    cy.get('#autocompleter').type(inputText)
    cy.get('#autocompleter').type('{downarrow}')
    cy.get('#autocompleter').type('{enter}')
    // Should click on the first element on the list
    cy.get('#autocompleter').then((indexQueryElement) => {
      expect(indexQueryElement.val()).to.be.equal('undefined')
    })
  })
  it('should not call onFreeTextSelect when strict is true', function () {
    const inputText = 'United'
    const autocompleteSettings: Partial<AutocompleteSettings<AutocompleteItem>> = {
      autoselectfirst: false,
      fetch(search: string, update: <AutocompleteItem>(items: AutocompleteItem[] | false) => void) {
        update([])
      },
      onSelect() {},
      onFreeTextSelect: () => {},
      strict: true,
    }
    const spyFreeTextSelect = cy.spy(autocompleteSettings, 'onFreeTextSelect').as('onFreeTextSpy')
    const spyOnSelect = cy.spy(autocompleteSettings, 'onSelect').as('onSelectSpy')

    // @ts-ignore
    cy.visit('./cypress/static/autocomplete-test-sandbox.html')
    // Get the input element and setup autocomplete to it
    cy.get('#autocompleter').then((indexQueryElement) => {
      autocompleteSettings.input = indexQueryElement.get(0) as HTMLInputElement
      autocomplete(autocompleteSettings as AutocompleteSettings<AutocompleteItem>)
    })
    // Type some text into the input and select the first element using arrow keys
    cy.get('#autocompleter').type(inputText)
    cy.get('#autocompleter').type('{downarrow}')
    cy.get('#autocompleter').type('{enter}')
    cy.get('#autocompleter').then(() => {
      expect(spyOnSelect).to.be.calledOnce
      // eslint-disable-next-line unicorn/no-useless-undefined
      expect(spyOnSelect.getCall(0).args[0]).to.eql(undefined)
      expect(spyFreeTextSelect).to.not.be.called
    })
  })
  it('should call onSelect actual input when strict is false and no elements from fetch', function () {
    const inputText = 'United'

    cy.fixture('selectDatas/united.json').as('selectData')
    // @ts-ignore
    cy.visit('./cypress/static/autocomplete-test-sandbox.html')
    // Get the input element and setup autocomplete to it
    cy.get('#autocompleter').then((indexQueryElement) => {
      autocomplete({
        autoselectfirst: false,
        fetch(search: string, update: <AutocompleteItem>(items: AutocompleteItem[] | false) => void) {
          update([])
        },
        onSelect(item: AutocompleteItem | undefined) {
          if (item && item.label) {
            indexQueryElement.val(item.label)
          } else {
            indexQueryElement.val('undefined')
          }
        },
        strict: false,
        input: <HTMLInputElement>indexQueryElement.get(0),
      })
    })
    // Type some text into the input and select the first element using arrow keys
    cy.get('#autocompleter').type(inputText)
    cy.get('#autocompleter').type('{downarrow}')
    cy.get('#autocompleter').type('{enter}')
    // Should click on the first element on the list
    cy.get('#autocompleter').then((indexQueryElement) => {
      expect(indexQueryElement.val()).to.be.equal('United')
    })
  })
  it('should call onFreeTextSelect when strict is true', function () {
    const inputText = 'United'
    const autocompleteSettings: Partial<AutocompleteSettings<AutocompleteItem>> = {
      autoselectfirst: false,
      fetch(search: string, update: <AutocompleteItem>(items: AutocompleteItem[] | false) => void) {
        update([])
      },
      onSelect() {},
      onFreeTextSelect: () => {},
      strict: false,
    }
    const spyFreeTextSelect = cy.spy(autocompleteSettings, 'onFreeTextSelect').as('onFreeTextSpy')
    const spyOnSelect = cy.spy(autocompleteSettings, 'onSelect').as('onSelectSpy')

    // @ts-ignore
    cy.visit('./cypress/static/autocomplete-test-sandbox.html')
    // Get the input element and setup autocomplete to it
    cy.get('#autocompleter').then((indexQueryElement) => {
      autocompleteSettings.input = indexQueryElement.get(0) as HTMLInputElement
      autocomplete(autocompleteSettings as AutocompleteSettings<AutocompleteItem>)
    })
    // Type some text into the input and select the first element using arrow keys
    cy.get('#autocompleter').type(inputText)
    cy.get('#autocompleter').type('{downarrow}')
    cy.get('#autocompleter').type('{enter}')
    cy.get('#autocompleter').then(() => {
      expect(spyOnSelect).to.be.calledOnce
      expect(spyOnSelect.getCall(0).args[0]).to.eql({ label: inputText })
      expect(spyFreeTextSelect).to.be.calledOnce
      expect(spyFreeTextSelect.getCall(0).args[0]).to.eql({ label: inputText })
    })
  })
})
