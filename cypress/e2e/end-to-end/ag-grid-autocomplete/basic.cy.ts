import { AutocompleteSelectCellEditor } from 'ag-grid-autocomplete'
import createGrid from 'utils/create-grid'
import { ColDef } from '../../../utils/ag-grid'

describe('ag-grid-autocomplete end-to-end basic tests', () => {
  it('should create an ag-grid with some AutocompleteSelectCellEditor without crash', function () {
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
      createGrid(<HTMLElement>indexQueryElement.get(0), columnDefs, rowDatas, Cypress.env('AG_GRID_VERSION'))
    })
    // ag-grid should be created on the DOM
    cy.get('.ag-root').should('exist')
    // ag-grid should have rows and cells created as well
    cy.get('.ag-row-first ').should('exist')
    cy.get('[row-index="3"]').should('exist')
    cy.get('[row-index="3"] > .ag-cell').should('exist')
  })
  it('should create and enter edit mode with AutocompleteSelectCellEditor when cell clicked then Enter pressed', function () {
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
      createGrid(<HTMLElement>indexQueryElement.get(0), columnDefs, rowDatas, Cypress.env('AG_GRID_VERSION'))
    })
    // ag-grid should be created on the DOM
    cy.get('.ag-root').should('exist')
    // Start the edition
    cy.get('.ag-row-first > .ag-cell ').click()
    cy.get('.ag-row-first > .ag-cell ').type('{enter}')
    // should have created the input text
    cy.get('div.ag-cell-editor-autocomplete-wrapper > .ag-cell-editor-autocomplete-input').should('exist')
    cy.get('*[placeholder="Select an option"]').should('exist')
  })
  it('should create input taking the entire space of the column', function () {
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
          width: 350,
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
      createGrid(<HTMLElement>indexQueryElement.get(0), columnDefs, rowDatas, Cypress.env('AG_GRID_VERSION'))
    })
    // ag-grid should be created on the DOM
    cy.get('.ag-root').should('exist')
    // Start the edition
    cy.get('.ag-row-first > .ag-cell ').click()
    cy.get('.ag-row-first > .ag-cell ').type('{enter}')
    // should have created the input text
    cy.get('div.ag-cell-editor-autocomplete-wrapper > .ag-cell-editor-autocomplete-input').should('exist')
    // input width should be the same as the defined column grid definition
    cy.get('div.ag-cell-editor-autocomplete-wrapper > .ag-cell-editor-autocomplete-input').then(($element) => {
      const rect = $element[0].getBoundingClientRect()
      // input width should be equal to column width minus 2px (border left + border right)
      cy.wrap(rect.width).should('eq', 350 - 2)
    })
  })
  it('should close opened input when Enter hit', function () {
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
      createGrid(<HTMLElement>indexQueryElement.get(0), columnDefs, rowDatas, Cypress.env('AG_GRID_VERSION'))
    })
    // ag-grid should be created on the DOM
    cy.get('.ag-root').should('exist')
    // Start the edition
    cy.get('.ag-row-first > .ag-cell ').click()
    cy.get('.ag-row-first > .ag-cell ').type('{enter}')
    // should have created the input text
    cy.get('div.ag-cell-editor-autocomplete-wrapper > .ag-cell-editor-autocomplete-input').should('exist')
    cy.get('*[placeholder="Select an option"]').should('exist')
    // Close the input
    cy.get('div.ag-cell-editor-autocomplete-wrapper > .ag-cell-editor-autocomplete-input').type('{enter}')
    // input should have been closed
    cy.get('div.ag-cell-editor-autocomplete-wrapper > .ag-cell-editor-autocomplete-input').should('not.exist')
    cy.get('*[placeholder="Select an option"]').should('not.exist')
  })
  it('should close opened input when Tab hit and open it into next row', function () {
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
      createGrid(<HTMLElement>indexQueryElement.get(0), columnDefs, rowDatas, Cypress.env('AG_GRID_VERSION'))
    })
    // ag-grid should be created on the DOM
    cy.get('.ag-root').should('exist')
    // Start the edition
    cy.get('.ag-row-first > .ag-cell ').click()
    cy.get('.ag-row-first > .ag-cell ').type('{enter}')
    // should have created the input text
    cy.get('[row-index="0"] > [aria-colindex="1"] > div > .ag-cell-editor-autocomplete-input').should('exist')
    cy.get('[row-index="0"] > [aria-colindex="1"] > div > [placeholder="Select an option"]').should('exist')
    // Close the input
    cy.get('div.ag-cell-editor-autocomplete-wrapper > .ag-cell-editor-autocomplete-input')
    cy.realPress('Tab')
    // input should have been closed
    cy.get('[row-index="0"] > [aria-colindex="1"] > div > .ag-cell-editor-autocomplete-input').should('not.exist')
    cy.get('[row-index="0"] > [aria-colindex="1"] > div > [placeholder="Select an option"]').should('not.exist')
    // next autocomplete input should be open
    cy.get('[row-index="1"] > [aria-colindex="1"] > div > .ag-cell-editor-autocomplete-input').should('exist')
    cy.get('[row-index="1"] > [aria-colindex="1"] > div > [placeholder="Select an option"]').should('exist')
  })
  it('should show selection list when some text is typed in search', function () {
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
      createGrid(<HTMLElement>indexQueryElement.get(0), columnDefs, rowDatas, Cypress.env('AG_GRID_VERSION'))
    })
    // ag-grid should be created on the DOM
    cy.get('.ag-root').should('exist')
    // Start the edition
    cy.get('.ag-row-first > .ag-cell ').click()
    cy.get('.ag-row-first > .ag-cell ').type('{enter}')
    cy.get('.ag-row-first > .ag-cell ').type('Ke')
    // Should have created the autocomplete selection box
    cy.get('.autocomplete.ag-cell-editor-autocomplete').should('exist')
    // Should have two elements matching Ke coming from the data
    cy.get('.autocomplete.ag-cell-editor-autocomplete').find('div').should('have.length', 2)
  })
  it('should show selection list with regexIsh data', function () {
    cy.fixture('selectDatas/regexish.json').as('selectDatas')
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
            minLength: 0,
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
    // Start the edition
    cy.get('.ag-row-first > .ag-cell ').click()
    cy.get('.ag-row-first > .ag-cell ').type('{enter}')
    cy.get('.ag-row-first > .ag-cell ').type('(')
    // Should have created the autocomplete selection box
    cy.get('.autocomplete.ag-cell-editor-autocomplete').should('exist')
    // Should have two elements matching Ke coming from the data
    cy.get('.autocomplete.ag-cell-editor-autocomplete').find('div').should('have.length', 4)
    cy.get('.autocomplete > *').should(($element) => {
      expect($element).to.have.length(4)
      expect($element.eq(0).html()).to.equal('<span><strong>(</strong></span>')
      expect($element.eq(1).html()).to.equal('<span><strong>(</strong>)$^</span>')
      expect($element.eq(2).html()).to.equal('<span>^$<strong>(</strong>)</span>')
      expect($element.eq(3).html()).to.equal('<span><strong>(</strong>.*^)$</span>')
    })
  })
  it('should select autocomplete the data and put it into ag-grid when Enter hit 1st', function () {
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
      createGrid(<HTMLElement>indexQueryElement.get(0), columnDefs, rowDatas, Cypress.env('AG_GRID_VERSION'))
    })
    // ag-grid should be created on the DOM
    cy.get('.ag-root').should('exist')
    cy.get('.ag-row-first > .ag-cell ').contains('Kelley Santana').should('not.exist')
    // Start the edition
    cy.get('.ag-row-first > .ag-cell ').type('{enter}')
    cy.get('.ag-row-first > .ag-cell ').type('Ke')
    cy.get('.autocomplete.ag-cell-editor-autocomplete').should('exist')
    // Should select the first element and hit enter it to select
    cy.get('.ag-row-first > .ag-cell ').type('{enter}')
    // input should have been closed
    cy.get('div.ag-cell-editor-autocomplete-wrapper > .ag-cell-editor-autocomplete-input').should('not.exist')
    // Input should have been selected and sent to ag-grid
    cy.get('.ag-row-first > .ag-cell ').contains('Kelley Santana').should('exist')
  })
  it('should select autocomplete the data and put it into ag-grid when Enter hit 2nd', function () {
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
  })
  it('should select autocomplete the data and put it into ag-grid and go to next row when Tab hit', function () {
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
      createGrid(<HTMLElement>indexQueryElement.get(0), columnDefs, rowDatas, Cypress.env('AG_GRID_VERSION'))
    })
    // ag-grid should be created on the DOM
    cy.get('.ag-root').should('exist')
    cy.get('.ag-row-first > .ag-cell ').contains('Kelley Santana').should('not.exist')
    // Start the edition
    cy.get('.ag-row-first > .ag-cell ').type('{enter}')
    cy.get('.ag-row-first > .ag-cell ').type('Ke')
    cy.get('.autocomplete.ag-cell-editor-autocomplete').should('exist')
    // Should select the first element and hit enter it to select
    cy.get('.ag-row-first > .ag-cell ').realPress('Tab')
    // input should have been closed
    cy.get('[row-index="0"] > [aria-colindex="1"] > div > .ag-cell-editor-autocomplete-input').should('not.exist')
    cy.get('[row-index="0"] > [aria-colindex="1"] > div > [placeholder="Select an option"]').should('not.exist')
    // next autocomplete input should be open
    cy.get('[row-index="1"] > [aria-colindex="1"] > div > .ag-cell-editor-autocomplete-input').should('exist')
    cy.get('[row-index="1"] > [aria-colindex="1"] > div > [placeholder="Select an option"]').should('exist')
  })
  it('should select autocomplete the data and put it into ag-grid and go the the next column in edit mode when Tab hit', function () {
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
      createGrid(<HTMLElement>indexQueryElement.get(0), columnDefs, rowDatas, Cypress.env('AG_GRID_VERSION'))
    })
    // ag-grid should be created on the DOM
    cy.get('.ag-root').should('exist')
    cy.get('[row-index="0"] > [aria-colindex="1"]').contains('Kelley Santana').should('not.exist')
    // Start the edition
    cy.get('[row-index="0"] > [aria-colindex="1"]').type('{enter}')
    cy.get('[row-index="0"] > [aria-colindex="1"]').type('Ke')
    cy.get('.autocomplete.ag-cell-editor-autocomplete').should('exist')
    // Should select the first element and hit enter it to select
    cy.get('.ag-column-hover > .ag-wrapper > .ag-input-field-input').focus()
    cy.get('.ag-column-hover > .ag-wrapper > .ag-input-field-input').realPress('Tab')
    // input should have been closed
    cy.get('div.ag-cell-editor-autocomplete-wrapper > .ag-cell-editor-autocomplete-input').should('not.exist')
    // Input should have been selected and sent to ag-grid
    cy.get('[row-index="0"] > [aria-colindex="1"]').contains('Kelley Santana').should('exist')
    // The second column should be selected
    cy.get('[row-index="0"] > [aria-colindex="2"]').should('have.class', 'ag-cell-focus')
  })
  it('should select autocomplete the data and put it into ag-grid and go the the next column in edit mode when Tab hit and focus the input field', function () {
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
      createGrid(<HTMLElement>indexQueryElement.get(0), columnDefs, rowDatas, Cypress.env('AG_GRID_VERSION'))
    })
    // ag-grid should be created on the DOM
    cy.get('.ag-root').should('exist')
    cy.get('[row-index="0"] > [aria-colindex="1"]').contains('Kenya Gallagher').should('not.exist')
    cy.get('[row-index="0"] > [aria-colindex="2"]').contains('Dana Nolan').should('not.exist')
    // Start the edition
    cy.get('[row-index="0"] > [aria-colindex="1"]').type('{enter}')
    cy.get('[row-index="0"] > [aria-colindex="1"]').type('Ke')
    cy.get('.autocomplete.ag-cell-editor-autocomplete').should('exist')
    // Should select the first element and hit enter it to select
    cy.get('.ag-column-hover > .ag-wrapper > .ag-input-field-input').focus()
    cy.get('.ag-column-hover > .ag-wrapper > .ag-input-field-input').realPress('Tab')
    // input should have been closed
    cy.get(
      '[row-index="0"] > [aria-colindex="1"] > div.ag-cell-editor-autocomplete-wrapper > .ag-cell-editor-autocomplete-input',
    ).should('not.exist')
    // Input should have been selected and sent to ag-grid
    cy.get('[row-index="0"] > [aria-colindex="1"]').contains('Kelley Santana').should('exist')
    // The second column should be selected and in edit mode
    cy.get('[row-index="0"] > [aria-colindex="2"]').should('have.class', 'ag-cell-inline-editing')
    // The next input field should be focused
    cy.focused().should('have.class', 'ag-cell-editor-autocomplete-input')
    cy.get('[row-index="0"] > [aria-colindex="2"].ag-cell-inline-editing > .ag-wrapper > .ag-input-field-input').should(
      'exist',
    )
    // Should be able to type data into the next input
    cy.focused().type('Dana')
    cy.get('.autocomplete.ag-cell-editor-autocomplete').should('exist')
    cy.focused().type('{enter}')
    cy.get('[row-index="0"] > [aria-colindex="2"]').contains('Dana Nolan').should('exist')
  })
  it('should remove actual value by starting edit with delete', function () {
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
    cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('not.exist')
  })
  it('should remove actual value by starting edit with backspace', function () {
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
    cy.get('.ag-row-first > .ag-cell ').contains('Kenya Gallagher').should('not.exist')
  })
})
