import Create from '~/components/Create';

import {
  ComponentProps,
  InputComponentProps,
  ItemComponentProps,
  OptionComponentProps,
} from '~/types';

export const options = [
  { label: 'One', value: 1 },
  { label: 'Two', value: 2 },
  { label: 'Three', value: 3, disabled: true },
];

export const optionsAlt = [...options, { label: 'Four', value: 4 }];

export function searchFn({ methods, props, state }: ComponentProps) {
  const { getOptionData } = methods;
  const { options: optionsProps, searchBy = 'label' } = props;
  const regexp = new RegExp(methods.safeString(state.search), 'i');

  return optionsProps.filter(item => regexp.test(`${getOptionData(item, searchBy)}`));
}

export function Content(props: ComponentProps) {
  const {
    methods: { getOptionData, setSearch },
    props: { multi },
    state: { values },
  } = props;

  return (
    <div data-component-name="CustomContent">
      {multi
        ? values.map(item => (
            <Option
              key={`${getOptionData(item, 'label')}${getOptionData(item, 'value')}`}
              item={item}
              {...props}
            />
          ))
        : !!values.length && (
            <div data-component-name="CustomSingleOption">{getOptionData(values[0], 'label')}</div>
          )}
      <input data-component-name="CustomContentInput" onChange={setSearch} type="text" />
    </div>
  );
}

export function Clear() {
  return <div data-component-name="CustomClear">X</div>;
}

export function Handle() {
  return <div data-component-name="CustomHandle">⬇</div>;
}

export function Input({ inputRef, methods: { setSearch } }: InputComponentProps) {
  return <input ref={inputRef} data-component-name="CustomInput" onChange={setSearch} />;
}

export function MenuItem(props: ItemComponentProps) {
  const { item, methods } = props;

  const handleSelect = () => {
    if (methods.isSelected(item)) {
      methods.removeItem(null, item, false);
    } else {
      methods.addItem(item);
    }
  };

  return (
    <div data-component-name="CustomItem" onClick={handleSelect} role="presentation">
      {item.label}
    </div>
  );
}

export function Menu(props: ComponentProps) {
  const {
    methods: { areAllSelected, clearAll, selectAll, toggleAll },
    state: { searchResults },
  } = props;

  return (
    <div data-component-name="CustomMenu">
      <div>
        {areAllSelected() ? (
          <button data-component-name="ClearAll" onClick={clearAll} type="button">
            Clear all
          </button>
        ) : (
          <button data-component-name="SelectAll" onClick={() => selectAll()} type="button">
            Select all
          </button>
        )}
        <button data-component-name="ToggleAll" onClick={toggleAll} type="button">
          Toggle all
        </button>
      </div>
      <Create {...props} />
      {!searchResults.length ? (
        <NoData />
      ) : (
        searchResults.map((item, index) => (
          <MenuItem
            key={item.value}
            data-component-name="CustomMenuItem"
            item={item}
            itemIndex={index}
            {...props}
          />
        ))
      )}
    </div>
  );
}

export function Loader() {
  return <div data-component-name="CustomLoader">🔁</div>;
}

export function NoData() {
  return <div data-component-name="CustomNoData">Nothing found</div>;
}

export function Option({ item }: OptionComponentProps) {
  return <div data-component-name="CustomOption">{item.label}</div>;
}

export function Separator() {
  return <div data-component-name="CustomSeparator">|</div>;
}
