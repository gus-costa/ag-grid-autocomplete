import { AutocompleteSelectCellEditor } from 'ag-grid-autocomplete'
import createGrid from 'utils/create-grid'
import { ColDef } from '../../../utils/ag-grid'

describe('ag-grid-autocomplete end-to-end required option tests', () => {
  it('should not remove actual value by starting edit with delete', function () {
    cy.fixture('selectDatas/names.json').as('selectDatas')
    // @ts-ignore
    cy.visit(Cypress.env('SANDBOX_HTML_FILE'))
    cy.get('#myGrid').then((indexQueryElement) => {
      const rowDatas = [
        { 'autocomplete-column': undefined },
        { 'autocomplete-column': undefined },
        { 'autocomplete-column': undefined },
        { 'autocomplete-column': undefined },
        { 'autocomplete-column': undefined },
      ]
      const columnDefs: ColDef[] = [
        {
          headerName: 'Already present data selector',
          field: 'autocomplete-column',
          // @ts-ignore
          cellEditor: AutocompleteSelectCellEditor,
          cellEditorParams: {
            selectData: this.selectDatas,
            placeholder: 'Select an option',
            required: true,
          },
          valueFormatter: (parameters) => {
            if (parameters.value) {
              return parameters.value.label || parameters.value.value || parameters.value
            }
            return ''
          },
          editable: true,
        },
      ]
      createGrid(<HTMLElement>indexQueryElement.get(0), columnDefs, rowDatas, Cypress.env('AG_GRID_VERSION'))
    })
    // ag-grid should be created on the DOM
    cy.get('.ag-root').should('exist')
    cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('not.exist')
    // Start the edition
    cy.get('.ag-row-first > .ag-cell ').type('{enter}')
    cy.get('.ag-row-first > .ag-cell ').type('Ke')
    cy.get('.autocomplete.ag-cell-editor-autocomplete').should('exist')
    // Should select the first element and hit enter it to select
    cy.get('.ag-row-first > .ag-cell ').type('{downArrow}')
    cy.get('.ag-row-first > .ag-cell ').type('{enter}')
    // input should have been closed
    cy.get('div.ag-cell-editor-autocomplete-wrapper > .ag-cell-editor-autocomplete-input').should('not.exist')
    // Input should have been selected and sent to ag-grid
    cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('exist')
    cy.get('.ag-row-first > .ag-cell ').type('{del}')
    // From ag-grid v28 and onwards hitting the delete key won't trigger cell edit
    if (Cypress.env('AG_GRID_VERSION') < 28) {
      cy.get('.ag-row-first > .ag-cell ').type('{enter}')
    }
    cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('exist')
  })
  it('should not remove actual value by starting edit with backspace', function () {
    cy.fixture('selectDatas/names.json').as('selectDatas')
    // @ts-ignore
    cy.visit(Cypress.env('SANDBOX_HTML_FILE'))
    cy.get('#myGrid').then((indexQueryElement) => {
      const rowDatas = [
        { 'autocomplete-column': undefined },
        { 'autocomplete-column': undefined },
        { 'autocomplete-column': undefined },
        { 'autocomplete-column': undefined },
        { 'autocomplete-column': undefined },
      ]
      const columnDefs: ColDef[] = [
        {
          headerName: 'Already present data selector',
          field: 'autocomplete-column',
          // @ts-ignore
          cellEditor: AutocompleteSelectCellEditor,
          cellEditorParams: {
            selectData: this.selectDatas,
            placeholder: 'Select an option',
            required: true,
          },
          valueFormatter: (parameters) => {
            if (parameters.value) {
              return parameters.value.label || parameters.value.value || parameters.value
            }
            return ''
          },
          editable: true,
        },
      ]
      createGrid(<HTMLElement>indexQueryElement.get(0), columnDefs, rowDatas, Cypress.env('AG_GRID_VERSION'))
    })
    // ag-grid should be created on the DOM
    cy.get('.ag-root').should('exist')
    cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('not.exist')
    // Start the edition
    cy.get('.ag-row-first > .ag-cell ').type('{enter}')
    cy.get('.ag-row-first > .ag-cell ').type('Ke')
    cy.get('.autocomplete.ag-cell-editor-autocomplete').should('exist')
    // Should select the first element and hit enter it to select
    cy.get('.ag-row-first > .ag-cell ').type('{downArrow}')
    cy.get('.ag-row-first > .ag-cell ').type('{enter}')
    // input should have been closed
    cy.get('div.ag-cell-editor-autocomplete-wrapper > .ag-cell-editor-autocomplete-input').should('not.exist')
    // Input should have been selected and sent to ag-grid
    cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('exist')
    cy.get('.ag-row-first > .ag-cell ').type('{backspace}')
    cy.get('.ag-row-first > .ag-cell ').type('{enter}')
    cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('exist')
  })
  it('should keep last valid value if new value does not match any item', function () {
    cy.fixture('selectDatas/names.json').as('selectDatas')
    // @ts-ignore
    cy.visit(Cypress.env('SANDBOX_HTML_FILE'))
    cy.get('#myGrid').then((indexQueryElement) => {
      const rowDatas = [
        { 'autocomplete-column': undefined },
        { 'autocomplete-column': undefined },
        { 'autocomplete-column': undefined },
        { 'autocomplete-column': undefined },
        { 'autocomplete-column': undefined },
      ]
      const columnDefs: ColDef[] = [
        {
          headerName: 'Already present data selector',
          field: 'autocomplete-column',
          // @ts-ignore
          cellEditor: AutocompleteSelectCellEditor,
          cellEditorParams: {
            selectData: this.selectDatas,
            placeholder: 'Select an option',
            required: true,
          },
          valueFormatter: (parameters) => {
            if (parameters.value) {
              return parameters.value.label || parameters.value.value || parameters.value
            }
            return ''
          },
          editable: true,
        },
      ]
      createGrid(<HTMLElement>indexQueryElement.get(0), columnDefs, rowDatas, Cypress.env('AG_GRID_VERSION'))
    })
    // ag-grid should be created on the DOM
    cy.get('.ag-root').should('exist')
    cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('not.exist')
    // Start the edition
    cy.get('.ag-row-first > .ag-cell ').type('{enter}')
    cy.get('.ag-row-first > .ag-cell ').type('Ke')
    cy.get('.autocomplete.ag-cell-editor-autocomplete').should('exist')
    // Should select the first element and hit enter it to select
    cy.get('.ag-row-first > .ag-cell ').type('{downArrow}')
    cy.get('.ag-row-first > .ag-cell ').type('{enter}')
    // input should have been closed
    cy.get('div.ag-cell-editor-autocomplete-wrapper > .ag-cell-editor-autocomplete-input').should('not.exist')
    // Input should have been selected and sent to ag-grid
    cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('exist')
    cy.get('.ag-row-first > .ag-cell ').type('{del}')
    cy.get('.ag-row-first > .ag-cell ').type('not a valid name')
    cy.get('.ag-row-first > .ag-cell ').type('{enter}')
    cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('exist')
  })
  it('should keep last valid value if isCancelBeforeEnd called', function () {
    cy.fixture('selectDatas/names.json').as('selectDatas')
    // @ts-ignore
    cy.visit(Cypress.env('SANDBOX_HTML_FILE'))
    cy.get('#myGrid').then((indexQueryElement) => {
      const rowDatas = [
        { 'autocomplete-column': undefined },
        { 'autocomplete-column': undefined },
        { 'autocomplete-column': undefined },
        { 'autocomplete-column': undefined },
        { 'autocomplete-column': undefined },
      ]
      const columnDefs: ColDef[] = [
        {
          headerName: 'Already present data selector',
          field: 'autocomplete-column',
          // @ts-ignore
          cellEditor: AutocompleteSelectCellEditor,
          cellEditorParams: {
            selectData: this.selectDatas,
            placeholder: 'Select an option',
            required: true,
          },
          valueFormatter: (parameters) => {
            if (parameters.value) {
              return parameters.value.label || parameters.value.value || parameters.value
            }
            return ''
          },
          editable: true,
        },
      ]
      createGrid(<HTMLElement>indexQueryElement.get(0), columnDefs, rowDatas, Cypress.env('AG_GRID_VERSION'))
    })
    // ag-grid should be created on the DOM
    cy.get('.ag-root').should('exist')
    cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('not.exist')
    // Start the edition
    cy.get('.ag-row-first > .ag-cell ').type('{enter}')
    cy.get('.ag-row-first > .ag-cell ').type('Ke')
    cy.get('.autocomplete.ag-cell-editor-autocomplete').should('exist')
    // Should select the first element and hit enter it to select
    cy.get('.ag-row-first > .ag-cell ').type('{downArrow}')
    cy.get('.ag-row-first > .ag-cell ').type('{enter}')
    // input should have been closed
    cy.get('div.ag-cell-editor-autocomplete-wrapper > .ag-cell-editor-autocomplete-input').should('not.exist')
    // Input should have been selected and sent to ag-grid
    cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('exist')
    cy.get('.ag-row-first > .ag-cell ').type('{enter}')
    cy.get('div.ag-cell-editor-autocomplete-wrapper > .ag-cell-editor-autocomplete-input').should('exist')
    cy.get('.ag-row-first > .ag-cell ').type('{esc}')
    cy.get('div.ag-cell-editor-autocomplete-wrapper > .ag-cell-editor-autocomplete-input').should('not.exist')
    cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('exist')
  })
})
