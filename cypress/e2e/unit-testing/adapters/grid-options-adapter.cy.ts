import { AutocompleteSelectCellEditor } from 'ag-grid-autocomplete'
import { ColDef } from 'ag-grid-community'
import createGrid from 'utils/create-grid'

/**
 * Maps AG Grid versions to expected adapter versions based on gridApi properties:
 * - v32+: no context property → V32Adapter
 * - v30-31: has gos property → V30Adapter
 * - v29: has gridOptionsService → V29Adapter
 * - v25-28: has gridOptionsWrapper → V25Adapter (reports 25 or 28)
 * - v24 and below: fallback → V24Adapter
 */
function getExpectedAdapterVersion(agGridVersion: number): number {
  if (agGridVersion >= 32) return 32
  if (agGridVersion >= 30) return 30
  if (agGridVersion >= 29) return 29
  if (agGridVersion >= 28) return 28
  if (agGridVersion >= 25) return 25
  return 24
}

describe('Grid Options Adapter Detection', () => {
  const agVersion = Cypress.env('AG_GRID_VERSION')

  beforeEach(() => {
    cy.visit(`${Cypress.env('SANDBOX_HTML_FILE')}?v=${agVersion}`)
  })

  it(`should detect the correct adapter version for AG Grid v${agVersion}`, function () {
    let capturedAdapterVersion: number | undefined

    cy.get('#myGrid').then((element) => {
      const columnDefs: ColDef[] = [
        {
          headerName: 'Test',
          field: 'test',
          // @ts-ignore
          cellEditor: AutocompleteSelectCellEditor,
          cellEditorParams: {
            selectData: [{ label: 'Item A', value: 'a' }],
            autocomplete: {
              // Capture the adapter version when render is called
              render: (cellEditor: any, item: any) => {
                if (capturedAdapterVersion === undefined) {
                  capturedAdapterVersion = cellEditor.gridOptionsAdapter?.version
                }
                const div = document.createElement('div')
                div.textContent = item.label
                return div
              },
            },
          },
          editable: true,
        },
      ]
      createGrid(<HTMLElement>element.get(0), columnDefs, [{ test: undefined }], agVersion)
    })

    // Open editor and type to trigger the render callback
    cy.get('.ag-row-first > .ag-cell').click()
    cy.get('.ag-row-first > .ag-cell').type('{enter}')
    cy.get('.ag-cell-editor-autocomplete-input').should('exist')
    cy.get('.ag-cell-editor-autocomplete-input').type('Item')
    cy.get('.autocomplete.ag-cell-editor-autocomplete').should('exist')

    // Verify the adapter version
    cy.then(() => {
      expect(capturedAdapterVersion, 'Adapter version should be captured').to.exist

      const expectedVersion = getExpectedAdapterVersion(agVersion)
      expect(capturedAdapterVersion).to.equal(
        expectedVersion,
        `AG Grid v${agVersion} should use adapter v${expectedVersion}`,
      )
    })
  })
})
