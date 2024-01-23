import {
  ChangeEvent,
  CSSProperties,
  KeyboardEvent,
  MouseEvent,
  ReactElement,
  ReactNode,
  RefObject,
} from 'react';

export type AnyObject<T = any> = Record<string, T>;

export type Actions = 'close' | 'open' | 'toggle';
export type OptionKeys = 'label' | 'value';
export type Direction = 'ltr' | 'rtl';
export type Position = 'auto' | 'bottom' | 'top';

export interface Option {
  [key: string]: any;
  disabled?: boolean;
  label: ReactNode;
  style?: CSSProperties;
  value: string | number;
}

export interface ComponentProps {
  methods: Methods;
  props: Props;
  state: State;
}

export interface InputComponentProps extends ComponentProps {
  inputRef: RefObject<HTMLInputElement>;
}

export interface ItemComponentProps extends ComponentProps {
  item: Option;
  itemIndex: number;
}

export interface OptionComponentProps extends ComponentProps {
  item: Option;
}

export interface HiddenInput {
  /**
   * The key of the option for the input value.
   * @default 'value'
   */
  key?: OptionKeys;
  /**
   * The name of the hidden input.
   */
  name?: string;
  /**
   * Set a pattern to the hidden input.
   */
  pattern?: string;
  /**
   * Set the input as required.
   */
  required?: boolean;
  /**
   * The separator to use between the values with multiple selection.
   * @default ','
   */
  separator?: string;
}

export interface Labels {
  clear: string;
  /**
   * The label used for the create option. You can use {search} to display the search string.
   * @default 'Add {search}'
   */
  create: string;
  disabled: string;
  noData: string;
  toggle: string;
}

export interface Methods {
  addItem: (item: Option) => void;
  areAllSelected: () => boolean;
  clearAll: () => void;
  createItem: (searchText: string) => void;
  getDropdownBounds: () => DOMRect | AnyObject;
  getDropdownRef: () => HTMLDivElement | null;
  getInputSize: () => number;
  getLabels: () => Labels;
  getOptionData: (input: Option, key: OptionKeys) => string | number;
  getStyles: () => Styles;
  handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  isSelected: (item: Option) => boolean;
  removeItem: (event: MouseEvent<HTMLElement> | null, item: Option, close: boolean) => void;
  safeString: (input: string) => string;
  searchResults: () => Option[];
  selectAll: (items?: Option[]) => void;
  setSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  setStatus: (
    action: Actions,
    event?: Event | MouseEvent<HTMLElement> | KeyboardEvent<HTMLDivElement>,
  ) => void;
  toggleAll: () => void;
}

export interface Props {
  /**
   * Focus the input when the menu opens.
   * (if searchable is true)
   * @default true
   */
  autoFocus?: boolean;
  /**
   * A custom class name for the Dropdown root.
   */
  className?: string;
  /**
   * Custom Clear component.
   */
  clearComponent?: (props: ComponentProps) => ReactElement;
  /**
   * Clear the input when the menu closes.
   * @default true
   */
  clearOnClose?: boolean;
  /**
   * Clear the input when an item is selected.
   * @default true
   */
  clearOnSelect?: boolean;
  /**
   * Close the menu when the user scrolls.
   * @default false
   */
  closeOnScroll?: boolean;
  /**
   * Close the menu when an item is selected.
   * @default false
   */
  closeOnSelect?: boolean;
  /**
   * Overrides the internal comparator function.
   */
  comparatorFn?: (previousValues: Option[], values: Option[]) => boolean;
  /**
   * Custom Content component.
   */
  contentComponent?: (props: ComponentProps) => ReactElement;
  /**
   * Create an option from the search string if no results are found.
   * (Fires the onCreate callback)
   * @default false
   */
  create?: boolean;
  /**
   * The text direction of the component.
   * @default 'ltr'
   */
  direction?: Direction;
  /**
   * Disable the Dropdown.
   * @default false
   */
  disabled?: boolean;
  /**
   * Custom Handle component.
   */
  handleComponent?: (props: ComponentProps) => ReactElement;
  /**
   * Add an input with type hidden to the component with the selected value(s).
   */
  hiddenInput?: HiddenInput;
  /**
   * Hide the handle.
   * @default false
   */
  hideHandle?: boolean;
  /**
   * Custom Input component.
   */
  inputComponent?: (props: InputComponentProps) => ReactElement;
  /**
   * Keep the selected item(s) in the list.
   * @default true
   */
  keepSelectedInList?: boolean;
  /**
   * Component labels.
   */
  labels?: Partial<Labels>;
  /**
   * Custom Loader component.
   */
  loaderComponent?: (props: Pick<ComponentProps, 'props'>) => ReactElement;
  /**
   * Show a spinner while loading data.
   * @default false
   */
  loading?: boolean;
  /**
   * Custom Menu component.
   */
  menuComponent?: (props: ComponentProps) => ReactElement;
  /**
   * Custom MenuItem component.
   */
  menuItemComponent?: (props: ItemComponentProps) => ReactElement;
  /**
   * The menu position.
   * @default 'bottom'
   */
  menuPosition?: Position;
  /**
   * Select multiple options.
   * @default false
   */
  multi?: boolean;
  /**
   * Custom NoData component.
   */
  noDataComponent?: (props: ComponentProps) => ReactElement;
  /**
   * Values change callback.
   */
  onChange?: (value: Option[]) => void;
  /**
   * Clear all values callback (with custom components).
   */
  onClearAll?: () => void;
  /**
   * Click selector callback.
   */
  onClickSelector?: (isOpen: boolean) => void;
  /**
   * Close dropdown callback.
   */
  onClose?: () => void;
  /**
   * Create option callback.
   */
  onCreate?: (search: string, close: () => void) => void;
  /**
   * Open dropdown callback.
   */
  onOpen?: () => void;
  /**
   * Select all values callback (with custom components).
   */
  onSelectAll?: () => void;
  /**
   * Control the menu visibility.
   */
  open?: boolean;
  /**
   * Custom Option component.
   */
  optionComponent?: (props: OptionComponentProps) => ReactElement;
  /**
   * The dropdown options.
   * @required
   */
  options: Option[];
  /**
   * The placeholder of the input.
   * @default 'Select...'
   */
  placeholder?: string;
  /**
   * The field to search.
   * @default 'label'
   */
  searchBy?: OptionKeys;
  /**
   * Overrides the internal search function.
   */
  searchFn?: (props: ComponentProps) => Option[];
  /**
   * Search the options.
   * @default true
   */
  searchable?: boolean;
  /**
   * The placeholder on the search field if a value is selected.
   * (If searchable is true)
   */
  secondaryPlaceholder?: string;
  /**
   * Custom Separator component.
   */
  separatorComponent?: (props: ComponentProps) => ReactElement;
  /**
   * Show a button to clear the selection.
   * @default false
   */
  showClearButton?: boolean;
  /**
   * Show a separator between the content and handle.
   * @default false
   */
  showSeparator?: boolean;
  /**
   * Set the style on the component root.
   */
  style?: CSSProperties;
  /**
   * The styling of the component.
   * (color, background, border, etc.)
   */
  styles?: Partial<Styles>;
  /**
   * The selected values.
   * @default []
   */
  values?: Option[];
}

export interface State {
  cursor: number | null;
  dropdownBounds: DOMRect | AnyObject;
  search: string;
  searchResults: Option[];
  status: boolean;
  values: Option[];
}

export interface Styles {
  /**
   * The background color of the Dropdown.
   * @default '#fff'
   */
  bgColor: string;
  /**
   * The border color of the Dropdown.
   * @default '#ccc'
   */
  borderColor: string;
  /**
   * The border radius of the Dropdown.
   * @default '4px'
   */
  borderRadius: string | number;
  /**
   * The accent color of the Dropdown.
   * @default '#1E90FF'
   */
  color: string;
  /**
   * The disabled background color of the menu item.
   * @default '#f2f2f2'
   */
  disabledItemBgColor: string;
  /**
   * The disabled color of the menu item.
   * @default '#999'
   */
  disabledItemColor: string;
  /**
   * The gap between the selector and the menu.
   * @default 2
   */
  gap: number;
  /**
   * The hover color of the menu item.
   * Fallbacks to `color` if not set.
   */
  hoverColor: string;
  /**
   * The hover opacity of the menu item.
   * @default 0.2
   */
  hoverOpacity: number;
  /**
   * The maximum height of the menu.
   * @default 300
   */
  menuMaxHeight: number;
  /**
   * The minimum height of the selector.
   * @default 36
   */
  minHeight: number;
  /**
   * The placeholder color of the selector input.
   * @default '#999'
   */
  placeholderColor: string;
  /**
   * The x spacing of the selector and menu items.
   * @default 12
   */
  spacingX: string | number;
  /**
   * The y spacing of the selector and menu items.
   * @default 8
   */
  spacingY: string | number;
  /**
   * The width of the Dropdown.
   * @default '100%'
   */
  width: string | number;
}
