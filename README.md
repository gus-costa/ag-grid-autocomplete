# ag-grid-autocomplete

[![npm version](https://badge.fury.io/js/ag-grid-autocomplete.svg)](https://badge.fury.io/js/ag-grid-autocomplete)
[![Release](https://github.com/gus-costa/ag-grid-autocomplete/actions/workflows/cd.yml/badge.svg)](https://github.com/gus-costa/ag-grid-autocomplete/actions/workflows/cd.yml)

**Transform AG Grid cells into intelligent search interfaces.**

A powerful autocomplete cell editor for [ag-Grid](https://github.com/ag-grid/ag-grid) that enhances data selection with typeahead functionality, grouping capabilities, and flexible data retrieval.

> **Note:** This package is a direct, drop-in replacement for `ag-grid-autocomplete-editor` with enhanced compatibility for AG Grid v23-v32 (v33 support coming soon!). All imports, APIs, and configurations work exactly the same - just update your package name!

## Why ag-grid-autocomplete?

Data grids often struggle with selection interfaces for large datasets. Traditional dropdowns become unwieldy, and free-text entry lacks validation. This component bridges that gap by providing:

- Intuitive typeahead search within grid cells
- Support for grouped options with visual hierarchy
- Local and remote data source flexibility
- Keyboard navigation and accessibility features
- Full compatibility with all AG Grid versions from v23 to v32

## Installation

```bash
npm install --save ag-grid-autocomplete
```

If migrating from ag-grid-autocomplete-editor:

```bash
npm uninstall ag-grid-autocomplete-editor
npm install --save ag-grid-autocomplete
```

Then update your imports:

```js
// Old import
import { AutocompleteSelectCellEditor } from 'ag-grid-autocomplete-editor';
import 'ag-grid-autocomplete-editor/dist/main.css';

// New import
import { AutocompleteSelectCellEditor } from 'ag-grid-autocomplete';
import 'ag-grid-autocomplete/dist/main.css';
```

## Key Features

- **Simple Configuration** - Works with minimal setup using local data
- **Remote Data** - Fetch options from APIs with built-in debouncing
- **Grouped Options** - Organize related choices with intuitive grouping
- **Free Text Support** - Allow users to enter custom values when needed
- **Broad Compatibility** - Works with AG Grid v23 through v32

## Usage Examples

### Basic Local Data Autocomplete

```js
// In your column definitions:
{
   headerName: "Country",
   field: "country",
   cellEditor: AutocompleteSelectCellEditor,
   cellEditorParams: {
       selectData: [
           { label: 'Canada', value: 'CA', group: 'North America' },
           { label: 'United States', value: 'US', group: 'North America' },
           { label: 'Uzbekistan', value: 'UZ', group: 'Asia' },
           { label: 'Japan', value: 'JP', group: 'Asia' },
           { label: 'South Korea', value: 'KR', group: 'Asia' },
       ],
       placeholder: 'Select a country',
   },
   valueFormatter: (params) => {
       if (params.value) {
           return params.value.label || params.value.value || params.value;
       }
       return "";
   },
   editable: true,
}
```

### Remote Data with API

```js
{
   headerName: "Country Search",
   field: "country",
   cellEditor: AutocompleteSelectCellEditor,
   cellEditorParams: {
       placeholder: 'Search for a country',
       autocomplete: {
           fetch: (cellEditor, text, update) => {
               const match = text.toLowerCase();
               fetch(`https://restcountries.com/v3.1/name/${match}`)
                   .then(response => response.json())
                   .then(data => {
                       const items = data.map(country => ({ 
                           value: country.cca3, 
                           label: country.name.common,
                           group: country.region 
                       }));
                       update(items);
                   })
                   .catch(() => update([]));
           },
           debounceWaitMs: 300,
       },
   },
   valueFormatter: (params) => {
       if (params.value) {
           return params.value.label || params.value.value || params.value;
       }
       return "";
   },
   editable: true,
}
```

### Free Text Entry with Suggestions

```js
{
   headerName: "Tag Input",
   field: "tag",
   cellEditor: AutocompleteSelectCellEditor,
   cellEditorParams: {
       selectData: [
           { label: 'JavaScript', value: 'js' },
           { label: 'TypeScript', value: 'ts' },
           { label: 'Python', value: 'py' },
       ],
       placeholder: 'Enter or select a tag',
       autocomplete: {
           strict: false,
           autoselectfirst: false,
           onFreeTextSelect: (cellEditor, item) => {
               // Create a new tag from free text
               return { label: item.label, value: item.label.toLowerCase() };
           },
       },
   },
   editable: true,
}
```

## Configuration

### Cell Editor Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `selectData` | `Array` or `fn(params: IAutocompleteSelectCellEditorParams)` | Data source for autocomplete suggestions with format `{value: string, label: string, group?: string}` |
| `placeholder` | String | Input field placeholder text |
| `required` | `boolean` | Whether to cancel changes if no selection made (default: `false`) |
| `autocomplete` | Object | Configuration for the autocomplete behavior (see below) |

### Autocomplete Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `className` | `string` | `'ag-cell-editor-autocomplete'` | CSS class for the autocomplete dropdown |
| `minLength` | `number` | `1` | Minimum character length to trigger suggestions |
| `showOnFocus` | `boolean` | `false` | Show suggestions when input is focused |
| `emptyMsg` | `string` | `'None'` | Message when no results match |
| `strict` | `boolean` | `true` | Only allow selection from the dropdown |
| `autoselectfirst` | `boolean` | `true` | Auto-select first item in dropdown |
| `debounceWaitMs` | `number` | `200` | Debounce time for fetch requests |
| `onFreeTextSelect` | Function | - | Called when user selects text not in suggestions (requires `strict: false`) |

### Custom Rendering Functions

The following functions can be customized for advanced control:

| Function | Parameters | Description |
|----------|------------|-------------|
| `render` | `(cellEditor, item, currentValue)` | Customize rendering of each suggestion |
| `renderGroup` | `(cellEditor, groupName)` | Customize rendering of group headers |
| `onSelect` | `(cellEditor, item)` | Called when an item is selected |
| `fetch` | `(cellEditor, text, update)` | Custom function to retrieve and filter suggestions |
| `customize` | `(cellEditor, input, inputRect, container, maxHeight)` | Customize autocomplete dropdown position and appearance |

```js
cellEditorParams: {
    // ...
    autocomplete: {
        render: (cellEditor, item, currentValue) => {
            // Custom item rendering
            const div = document.createElement('div');
            div.textContent = item.label;
            return div;
        },
        renderGroup: (cellEditor, groupName) => {
            // Custom group header rendering
            const div = document.createElement('div');
            div.textContent = groupName;
            div.className = 'group';
            return div;
        }
    }
}
```

## Credits

- Original package by [Andrew Valleteau](https://github.com/avallete/ag-grid-autocomplete-editor)
- Based on [autocompleter](https://github.com/denis-taran/autocomplete) for the core autocomplete functionality
- Works with [ag-Grid](https://github.com/ag-grid/ag-grid) Community and Enterprise editions

## License

MIT