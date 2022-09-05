declare module '@gilbarbara/react-dropdown' {
  import * as React from 'react';

  type AnyObject<T = any> = Record<string, T>;

  export interface SetStateFnArguments<T> {
    cursor?: number | null;
    dropdown?: boolean;
    search?: string;
    selectBounds?: DOMRect | AnyObject;
    values?: T[];
  }

  export interface SelectState<T> {
    cursor: number;
    dropdown: boolean;
    search: string;
    selectBounds: AnyObject;
    values: T[];
  }

  export interface SelectMethods<T> {
    addItem: (item: T) => void;
    areAllSelected: () => boolean;
    clearAll: () => void;
    createNew: (searchText: string) => void;
    dropDown: (action: string, event?: React.MouseEvent<HTMLElement, MouseEvent> | null) => void;
    getInputSize: () => number;
    getSelectBounds: () => DOMRect | AnyObject;
    getSelectRef: () => HTMLDivElement;
    handleKeyDown: (event: KeyboardEvent) => void;
    isSelected: (item: T) => boolean;
    removeItem: (
      event: React.MouseEvent<HTMLElement, MouseEvent> | null,
      item: T,
      close: boolean,
    ) => void;
    safeString: (input: string) => string;
    searchResults: () => T[];
    selectAll: (items?: T[]) => void;
    setSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
    sortBy: () => T[];
    toggleSelectAll: () => void;
  }

  export interface SelectRenderer<T> {
    methods: SelectMethods<T>;
    props: SelectProps<T>;
    state: SelectState<T>;
  }

  export interface SelectOnDropdownCloseRequest<T> {
    close: () => void;
    methods: SelectMethods<T>;
    props: SelectProps<T>;
    state: SelectState<T>;
  }

  export interface SelectKeyDown<T> {
    event: KeyboardEvent;
    methods: SelectMethods<T>;
    props: SelectProps<T>;
    setState: (
      setter:
        | ((arguments_: SetStateFnArguments<T>) => SetStateFnArguments<T>)
        | SetStateFnArguments<T>,
    ) => void;
    state: SelectState<T>;
  }

  export interface SelectItemRenderer<T> {
    item: T;
    itemIndex?: number;
    methods: SelectMethods<T>;
    props: SelectProps<T>;
    state: SelectState<T>;
  }

  export interface SelectProps<T> {
    addPlaceholder?: string;
    additionalProps?: React.HTMLAttributes<HTMLDivElement>;
    autoFocus?: boolean;
    backspaceDelete?: boolean;
    className?: string;
    clearOnBlur?: boolean;
    clearOnSelect?: boolean;
    clearRenderer?: ({ methods, props, state }: SelectRenderer<T>) => JSX.Element;
    clearable?: boolean;
    closeOnScroll?: boolean;
    closeOnSelect?: boolean;
    color?: string;
    contentRenderer?: ({ methods, props, state }: SelectRenderer<T>) => JSX.Element;
    create?: boolean;
    createNewLabel?: string;
    debounceDelay?: number;
    direction?: 'ltr' | 'rtl';
    disabled?: boolean;
    disabledLabel?: string;
    dropdownGap?: number;
    dropdownHandle?: boolean;
    dropdownHandleRenderer?: ({ methods, props, state }: SelectRenderer<T>) => JSX.Element;
    dropdownHeight?: string;
    dropdownPosition?: 'top' | 'bottom' | 'auto';
    dropdownRenderer?: ({ methods, props, state }: SelectRenderer<T>) => JSX.Element;
    handleKeyDownFn?: ({ event, methods, props, setState, state }: SelectKeyDown<T>) => void;
    inputRenderer?: ({
      inputRef,
      methods,
      props,
      state,
    }: SelectRenderer<T> & {
      inputRef: React.RefObject<HTMLInputElement>;
    }) => JSX.Element;
    itemRenderer?: ({
      item,
      itemIndex,
      methods,
      props,
      state,
    }: SelectItemRenderer<T>) => JSX.Element;
    keepOpen?: boolean;
    keepSelectedInList?: boolean;
    labelField?: string;
    loading?: boolean;
    loadingRenderer?: ({ props }: SelectItemRenderer<T>) => JSX.Element;
    multi?: boolean;
    name?: string;
    noDataLabel?: string;
    noDataRenderer?: ({ methods, props, state }: SelectRenderer<T>) => JSX.Element;
    onChange: (value: T[]) => void;
    onClearAll?: () => void;
    onCreateNew?: (item: T) => void;
    onDropdownClose?: () => void;
    onDropdownCloseRequest?: ({
      close,
      methods,
      props,
      state,
    }: SelectOnDropdownCloseRequest<T>) => T[];
    onDropdownOpen?: () => void;
    onSelectAll?: () => void;
    optionRenderer?: ({ item, methods, props, state }: SelectItemRenderer<T>) => JSX.Element;
    options: T[];
    pattern?: string;
    placeholder?: string;
    portal?: HTMLElement;
    required?: boolean;
    searchBy?: string;
    searchFn?: ({ methods, props, state }: SelectRenderer<T>) => T[];
    searchable?: boolean;
    separator?: boolean;
    separatorRenderer?: ({ methods, props, state }: SelectRenderer<T>) => JSX.Element;
    sortBy?: string;
    style?: React.CSSProperties;
    valueField?: string;
    values: T[];
  }

  export interface DropDownProps {
    dropdownGap: number;
    dropdownHeight: string;
    dropdownPosition: 'auto' | 'top' | 'bottom';
    portal: HTMLElement;
    selectBounds: DOMRect;
  }

  const Select: <T extends AnyObject | string = AnyObject>(
    props: React.PropsWithRef<SelectProps<T>>,
  ) => JSX.Element;
  export default Select;
}
