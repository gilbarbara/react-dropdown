# @gilbarbara/react-dropdown

[![npm version](https://badge.fury.io/js/%40gilbarbara%2Freact-dropdown.svg)](https://badge.fury.io/js/%40gilbarbara%2Freact-dropdown) [![CI](https://github.com/gilbarbara/react-dropdown/actions/workflows/main.yml/badge.svg)](https://github.com/gilbarbara/react-dropdown/actions/workflows/main.yml) [![Maintainability](https://api.codeclimate.com/v1/badges/97517e18698eb36d4336/maintainability)](https://codeclimate.com/github/gilbarbara/react-dropdown/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/97517e18698eb36d4336/test_coverage)](https://codeclimate.com/github/gilbarbara/react-dropdown/test_coverage)

Flexible dropdown component with search, create, and multi selection.
It uses [emotion](https://github.com/emotion-js/emotion) for styling.

Check out the [demo](https://codesandbox.io/s/github/gilbarbara/react-dropdown/tree/main/demo).

## Highlights

- 🏖 **Easy to use:** Just set the `options` prop.
- 🛠 **Flexible:** Personalize the options to fit your needs.
- 🚀 **Customizable:** You can use your own components to complete control the UI.
- 🟦 **Typescript:** Nicely typed

## Installation

```shell
npm i @gilbarbara/react-dropdown
```

### Usage

```tsx
import Dropdown from '@gilbarbara/react-dropdown';

function App() {
  const options = [
    {
      label: "Alister Chilles",
      value: "achilleso",
    },
    {
      label: "Alyosha Keerl",
      value: "akeerl6",
    },
  ];
  
  return <Dropdown options={options} />;
}
```

## API

The only required props is `options`.

#### Base props

| Prop                   | Type                                                      | Default     | Description                                                  |
| ---------------------- | --------------------------------------------------------- | ----------- | ------------------------------------------------------------ |
| autoFocus              | `boolean`                                                 | true        | Focus the input when the menu opens.<br/>(if searchable is true) |
| className              | `string`                                                  |             | A custom class name for the Dropdown root.                   |
| clearOnClose           | `boolean`                                                 | true        | Clear the input when the menu closes.                        |
| clearOnSelect          | `boolean`                                                 | true        | Clear the input when an item is selected.                    |
| closeOnScroll          | `boolean`                                                 | false       | Close the menu when the user scrolls.                        |
| closeOnSelect          | `boolean`                                                 | false       | Close the menu when an item is selected.                     |
| comparatorFn           | `(previousValues: Option[], values: Option[]) => boolean` |             | Overrides the internal comparator function.                  |
| create                 | `boolean`                                                 | false       | Create an option from the search string if no results are found.<br />(Fires the onCreate callback) |
| direction              | `Direction`                                               | 'ltr'       | The text direction of the component.                         |
| disabled               | `boolean`                                                 | false       | Disable the Dropdown.                                        |
| hiddenInput            | `HiddenInput`                                             |             | Add an input with type hidden to the component with the selected value(s). |
| hideHandle             | `boolean`                                                 | false       | Hide the handle.                                             |
| keepSelectedInList     | `boolean`                                                 | true        | Keep the selected item(s) in the list.                       |
| labels                 | `Partial<Labels>`                                         |             | Component labels.                                            |
| loading                | `boolean`                                                 | false       | Show a spinner while loading data.                           |
| menuPosition           | Position                                                  | 'bottom'    | The menu position.                                           |
| multi                  | `boolean`                                                 | false       | Select multiple options.                                     |
| open                   | `boolean`                                                 |             | Control the menu visibility.                                 |
| options **(required)** | `Option[]`                                                |             | The dropdown options.                                        |
| placeholder            | `string`                                                  | 'Select...' | The placeholder of the input.                                |
| searchBy               | `OptionKeys`                                              | 'label'     | The field to search.                                         |
| searchFn               | `(props: ComponentProps) => Option[]`                     |             | Overrides the internal search function.                      |
| searchable             | `boolean`                                                 | true        | Search the options.                                          |
| secondaryPlaceholder   | `string`                                                  |             | The placeholder on the search field if a value is selected (if `searchable` is true). |
| showClearButton        | `boolean`                                                 | false       | Show a button to clear the selection.                        |
| showSeparator          | `boolean`                                                 | False       | Show a separator between the content and handle.             |
| style                  | `CSSProperties`                                           |             | Set the style on the component root.                         |
| styles                 | `Partial<Styles>`                                         |             | The styling of the component. (color, background, border, etc.) |
| values                 | `Option[]`                                                |             | The selected values.                                         |

### Callback props

| Prop            | Type                                          | Description                                          |
| --------------- | --------------------------------------------- | ---------------------------------------------------- |
| onChange        | `(value: Option[]) => void`                   | Values change callback.                              |
| onClearAll      | `() => void`                                  | Clear all values callback (with custom components).  |
| onClickSelector | `(isOpen: boolean) => void`                   | Click selector callback.                             |
| onClose         | `() => void`                                  | Close dropdown callback.                             |
| onCreate        | `(search: string, close: () => void) => void` | Create option callback.                              |
| onOpen          | `() => void`                                  | Open dropdown callback.                              |
| onSelectAll     | `() => void`                                  | Select all values callback (with custom components). |



### Custom components

| Prop               | Type                                                    | Description                 |
| ------------------ | ------------------------------------------------------- | --------------------------- |
| clearComponent     | `(props: ComponentProps) => JSX.Element`                | Custom Clear component.     |
| contentComponent   | `(props: ComponentProps) => JSX.Element`                | Custom Content component.   |
| handleComponent    | `(props: ComponentProps) => JSX.Element`                | Custom Handle component.    |
| inputComponent     | `(props: InputComponentProps) => JSX.Element`           | Custom Input component.     |
| loaderComponent    | `(props: Pick<ComponentProps, 'props'>) => JSX.Element` | Custom Loader component.    |
| menuComponent      | `(props: ComponentProps) => JSX.Element`                | Custom Menu component.      |
| menuItemComponent  | `(props: ItemComponentProps) => JSX.Element`            | Custom MenuItem component.  |
| noDataComponent    | `(props: ComponentProps) => JSX.Element`                | Custom NoData component.    |
| optionComponent    | `(props: OptionComponentProps) => JSX.Element`          | Custom Option component.    |
| separatorComponent | `(props: ComponentProps) => JSX.Element`                | Custom Separator component. |

*All the types are available [here](./src/types/index.ts).

## Credits

Inspired by [react-dropdown-select](https://github.com/sanusart/react-dropdown-select) and [react-select](https://github.com/JedWatson/react-select).

## License

MIT
