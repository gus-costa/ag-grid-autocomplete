import { AutocompleteSelectCellEditor } from 'ag-grid-autocomplete-editor'
import { ColDef, Grid, GridOptions } from '../../../utils/ag-grid'
import getOptions from '../../../utils/get-options'

function getGridOptions(columnDefs: ColDef[], rowDatas: any[]): GridOptions {
  return {
    columnDefs,
    rowData: rowDatas,
    suppressScrollOnNewData: false,
    suppressBrowserResizeObserver: true,
    ...getOptions<GridOptions>(Cypress.env('AG_GRID_VERSION'), 'gridOptions'),
  }
}

describe('ag-grid-autocomplete-editor end-to-end clicks tests', () => {
  it('should create and enter edit mode with AutocompleteSelectCellEditor when cell double clicked', function () {
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
      const gridOptions = getGridOptions(columnDefs, rowDatas)
      // eslint-disable-next-line sonarjs/constructor-for-side-effects
      new Grid(<HTMLElement>indexQueryElement.get(0), gridOptions)
    })
    // ag-grid should be created on the DOM
    cy.get('.ag-root').should('exist')
    // Start the edition
    cy.get('.ag-row-first > .ag-cell ').dblclick()
    // should have created the input text
    cy.get('div.ag-cell-editor-autocomplete-wrapper > .ag-cell-editor-autocomplete-input').should('exist')
    cy.get('*[placeholder="Select an option"]').should('exist')
  })
  it('should close the autocomplete editor when another cell clicked is triggered', function () {
    cy.fixture('selectDatas/names.json').as('selectDatas')
    // @ts-ignore
    cy.visit(Cypress.env('SANDBOX_HTML_FILE'))
    cy.get('#myGrid').then((indexQueryElement) => {
      const rowDatas = [
        { 'autocomplete-column': undefined, 'second-column': undefined },
        { 'autocomplete-column': undefined, 'second-column': undefined },
        { 'autocomplete-column': undefined, 'second-column': undefined },
        { 'autocomplete-column': undefined, 'second-column': undefined },
        { 'autocomplete-column': undefined, 'second-column': undefined },
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
          },
          valueFormatter: (parameters) => {
            if (parameters.value) {
              return parameters.value.label || parameters.value.value || parameters.value
            }
            return ''
          },
          editable: true,
        },
        {
          headerName: 'Second Column',
          field: 'second-column',
          editable: true,
        },
      ]
      const gridOptions = getGridOptions(columnDefs, rowDatas)
      // eslint-disable-next-line sonarjs/constructor-for-side-effects
      new Grid(<HTMLElement>indexQueryElement.get(0), gridOptions)
    })
    // ag-grid should be created on the DOM
    cy.get('.ag-root').should('exist')
    // Cell should be empty
    cy.get('[row-index="0"] > [aria-colindex="1"]').contains('Kelley Santana').should('not.exist')
    // Start the edition
    cy.get('[row-index="0"] > [aria-colindex="1"]').type('{enter}')
    cy.get('[row-index="0"] > [aria-colindex="1"]').type('Kelley Santana')
    cy.get('.autocomplete.ag-cell-editor-autocomplete').should('exist')
    // Should dismiss the value after click outside the editor
    cy.get('[row-index="1"] > [aria-colindex="1"]').realClick()
    cy.get('.autocomplete.ag-cell-editor-autocomplete').should('not.exist')
    cy.get('[row-index="0"] > [aria-colindex="1"]').contains('Kelley Santana').should('not.exist')
  })
  it('should not create if the cell is just single clicked', function () {
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
      const gridOptions = getGridOptions(columnDefs, rowDatas)
      // eslint-disable-next-line sonarjs/constructor-for-side-effects
      new Grid(<HTMLElement>indexQueryElement.get(0), gridOptions)
    })
    // ag-grid should be created on the DOM
    cy.get('.ag-root').should('exist')
    // Start the edition
    cy.get('.ag-row-first > .ag-cell ').click()
    // should have created the input text
    cy.get('div.ag-cell-editor-autocomplete-wrapper > .ag-cell-editor-autocomplete-input').should('not.exist')
    cy.get('*[placeholder="Select an option"]').should('not.exist')
  })
  it('should select autocomplete the data and put it into ag-grid when clicked 1st', function () {
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
      const gridOptions = getGridOptions(columnDefs, rowDatas)
      // eslint-disable-next-line sonarjs/constructor-for-side-effects
      new Grid(<HTMLElement>indexQueryElement.get(0), gridOptions)
    })
    // ag-grid should be created on the DOM
    cy.get('.ag-root').should('exist')
    cy.get('.ag-row-first > .ag-cell ').contains('Kelley Santana').should('not.exist')
    // Start the edition
    cy.get('.ag-row-first > .ag-cell ').click()
    cy.get('.ag-row-first > .ag-cell ').type('{enter}')
    cy.get('.ag-row-first > .ag-cell ').type('Ke')
    // Should select the first element and click it to select
    cy.get('.autocomplete.ag-cell-editor-autocomplete > div:eq(0)').click()
    // input should have been closed
    cy.get('div.ag-cell-editor-autocomplete-wrapper > .ag-cell-editor-autocomplete-input').should('not.exist')
    // Input should have been selected and sent to ag-grid
    cy.get('.ag-row-first > .ag-cell ').contains('Kelley Santana').should('exist')
  })
  it('should select autocomplete the data and put it into ag-grid when clicked 2nd', function () {
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
      const gridOptions = getGridOptions(columnDefs, rowDatas)
      // eslint-disable-next-line sonarjs/constructor-for-side-effects
      new Grid(<HTMLElement>indexQueryElement.get(0), gridOptions)
    })
    // ag-grid should be created on the DOM
    cy.get('.ag-root').should('exist')
    cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('not.exist')
    // Start the edition
    cy.get('.ag-row-first > .ag-cell ').click()
    cy.get('.ag-row-first > .ag-cell ').type('{enter}')
    cy.get('.ag-row-first > .ag-cell ').type('Ke')
    // Should select the second element and click it to select
    cy.get('.autocomplete.ag-cell-editor-autocomplete > div:eq(1)').click()
    // input should have been closed
    cy.get('div.ag-cell-editor-autocomplete-wrapper > .ag-cell-editor-autocomplete-input').should('not.exist')
    // Input should have been selected and sent to ag-grid
    cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('exist')
  })
})
