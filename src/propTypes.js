import PropTypes from 'prop-types';

export const Methods = {
  addItem: PropTypes.func,
  areAllSelected: PropTypes.func,
  clearAll: PropTypes.func,
  createNew: PropTypes.func,
  dropDown: PropTypes.func,
  getInputSize: PropTypes.func,
  getSelectBounds: PropTypes.func,
  getSelectRef: PropTypes.func,
  handleKeyDown: PropTypes.func,
  isSelected: PropTypes.func,
  removeItem: PropTypes.func,
  safeString: PropTypes.func,
  searchResults: PropTypes.func,
  selectAll: PropTypes.func,
  setSearch: PropTypes.func,
  sortBy: PropTypes.func,
  toggleSelectAll: PropTypes.func,
};

export const Props = {
  additionalProps: PropTypes.object,
  addPlaceholder: PropTypes.string,
  autoFocus: PropTypes.bool,
  backspaceDelete: PropTypes.bool,
  className: PropTypes.string,
  clearOnBlur: PropTypes.bool,
  clearOnSelect: PropTypes.bool,
  clearRenderer: PropTypes.func,
  clearable: PropTypes.bool,
  closeOnScroll: PropTypes.bool,
  closeOnSelect: PropTypes.bool,
  color: PropTypes.string,
  compareValuesFunc: PropTypes.func,
  contentRenderer: PropTypes.func,
  create: PropTypes.bool,
  createNewLabel: PropTypes.string,
  debounceDelay: PropTypes.number,
  direction: PropTypes.oneOf(['ltr', 'rtl']),
  disabled: PropTypes.bool,
  disabledLabel: PropTypes.string,
  dropdownGap: PropTypes.number,
  dropdownHandle: PropTypes.bool,
  dropdownHandleRenderer: PropTypes.func,
  dropdownHeight: PropTypes.string,
  dropdownRenderer: PropTypes.func,
  dropdownPosition: PropTypes.oneOf(['auto', 'top', 'bottom']),
  handleKeyDownFn: PropTypes.func,
  inputRenderer: PropTypes.func,
  itemRenderer: PropTypes.func,
  keepOpen: PropTypes.bool,
  keepSelectedInList: PropTypes.bool,
  labelField: PropTypes.string,
  loading: PropTypes.bool,
  loadingRenderer: PropTypes.func,
  multi: PropTypes.bool,
  name: PropTypes.string,
  noDataLabel: PropTypes.string,
  noDataRenderer: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onClearAll: PropTypes.func,
  onCreateNew: PropTypes.func,
  onDropdownClose: PropTypes.func,
  onDropdownCloseRequest: PropTypes.func,
  onDropdownOpen: PropTypes.func,
  onSelectAll: PropTypes.func,
  optionRenderer: PropTypes.func,
  options: PropTypes.array.isRequired,
  pattern: PropTypes.string,
  placeholder: PropTypes.string,
  portal: PropTypes.object,
  required: PropTypes.bool,
  searchable: PropTypes.bool,
  searchBy: PropTypes.string,
  searchFn: PropTypes.func,
  separator: PropTypes.bool,
  separatorRenderer: PropTypes.func,
  sortBy: PropTypes.string,
  style: PropTypes.object,
  valueField: PropTypes.string,
  values: PropTypes.array,
};

export const State = {
  cursor: PropTypes.number,
  dropdown: PropTypes.bool,
  search: PropTypes.string,
  searchResults: PropTypes.array,
  selectBounds: PropTypes.object,
  values: PropTypes.array,
};

export const ComponentProps = {
  methods: PropTypes.shape(Methods).isRequired,
  props: PropTypes.shape(Props).isRequired,
  state: PropTypes.shape(State).isRequired,
};