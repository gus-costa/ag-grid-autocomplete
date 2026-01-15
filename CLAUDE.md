# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ag-grid-autocomplete is a cell editor component for AG Grid that provides autocomplete/typeahead functionality. It extends AG Grid's `PopupComponent` and implements `ICellEditorComp`.

**Version compatibility:** Supports AG Grid v23-v34+ via adapter pattern for handling API differences across versions.

## Commands

```bash
npm run build          # Production build (webpack)
npm run build:watch    # Watch mode
npm run lint           # ESLint
npm run lint:fix       # ESLint with auto-fix
npm test               # Run Cypress tests (builds first)
npm run test:matrix    # Run tests against all AG Grid versions (v23-v34)
```

### Running a single Cypress test

```bash
npx cypress run --spec "cypress/e2e/end-to-end/ag-grid-autocomplete/click.cy.ts"
```

### Running tests against a specific AG Grid version

```bash
AG_GRID_VERSION=33 npm test
```

## Architecture

### Component Structure (Separation of Concerns)

The codebase uses a clean separation pattern similar to AG Grid's internal structure (e.g., `SelectCellEditor` + `AgSelect`):

**`AutocompleteSelectCellEditor`** (`ag-grid-autocomplete.ts`) - AG Grid integration layer

- Thin wrapper extending `PopupComponent`, implements `ICellEditorComp`
- Handles AG Grid lifecycle: `init()`, `afterGuiAttached()`, `getValue()`, etc.
- Manages keyboard navigation (Tab → next cell, Enter → close)
- Contains version-specific logic via adapters
- Owns the DOM template with AG Grid CSS classes

**`AutocompleteInput`** (`src/autocomplete-input.ts`) - Reusable autocomplete UI component

- Pure autocomplete functionality, no AG Grid dependencies
- Can work standalone or attach to existing input elements
- Manages selection state (`currentItem`) and dropdown behavior
- Uses native `AutocompleteSettings<DataFormat>` from the autocompleter library
- Exported for potential standalone use

**Backward Compatibility Layer**

- `transformAutocompleteSettings()` - Adapts user callbacks for internal API
- `wrapCallback()` - Injects cell editor context into user callbacks
- Maintains existing API: users' callbacks receive `(cellEditor, item, value)`
- Internal API is simpler: callbacks use `(item, value)` directly

### Other Core Files

- `types.ts` - TypeScript interfaces (`DataFormat`, `IAutocompleteSelectCellEditorParameters`)
- `autocompleter/` - Embedded autocomplete library (forked)

### Version Compatibility Adapters

The `src/adapters/` directory contains adapters to handle AG Grid API changes across versions:

- `grid-options-adapter.ts` - Factory that detects AG Grid version and returns appropriate adapter
- `grid-options-v24-adapter.ts` - v24 and below (fallback)
- `grid-options-v25-adapter.ts` - v25-28 (uses `gridOptionsWrapper`)
- `grid-options-v29-adapter.ts` - v29 (uses `gridOptionsService.is()`)
- `grid-options-v30-adapter.ts` - v30-31 (uses `gos.get()`)
- `grid-options-v32-adapter.ts` - v32+ (uses `gridApi.getGridOption()`)

Version detection is done at runtime by checking which properties exist on the `gridApi`.

### Test Infrastructure

Tests load AG Grid dynamically from CDN rather than bundling it via npm. This approach:

- Ensures tests run against the actual distributed AG Grid builds
- Avoids webpack bundling issues that can affect keyboard event handling
- More closely mirrors how users consume AG Grid in production

Key files:

- `cypress/static/ag-grid-autocomplete-editor-test-sandbox.html` - Test page that loads AG Grid from CDN based on `?v=XX` URL parameter
- `cypress/utils/create-grid.ts` - Version-aware grid creation utility, gets AG Grid from `window.agGrid`
- `ag-grid-versions.json` - List of AG Grid versions to test against
- `test-helpers/` - Scripts for multi-version test matrix

### Keyboard Event Handling

The component handles both legacy numeric `keyCode` (v23-v26) and modern string-based `key` (v27+) for keyboard events.

Tab key navigation is handled specially:

- Tab press calls `gridApi.tabToNextCell()` / `tabToPreviousCell()`
- Enter press just closes the editor
- Mouse clicks close the editor immediately

## Migration Benefits

The separation of `AutocompleteSelectCellEditor` and `AutocompleteInput` provides:

1. **Isolated AG Grid changes** - Breaking API changes in AG Grid v34+ only affect the cell editor wrapper
2. **Reusable core logic** - `AutocompleteInput` can be used standalone or in non-AG-Grid contexts
3. **Easier testing** - Core autocomplete behavior can be tested independently
4. **Clear boundaries** - AG Grid-specific code (adapters, keyboard suppression) stays in one place

## Commits

Uses conventional commits with semantic-release. Commits must pass commitlint.
