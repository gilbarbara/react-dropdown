import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import isPropValid from '@emotion/is-prop-valid';
import styled from '@emotion/styled';
import isEqual from '@gilbarbara/deep-equal';

import Clear from './components/Clear';
import ClickOutside from './components/ClickOutside';
import Content from './components/Content';
import Dropdown from './components/Dropdown';
import DropdownHandle from './components/DropdownHandle';
import Loading from './components/Loading';
import Separator from './components/Separator';
import { LIB_NAME } from './constants';
import { Props } from './propTypes';
import {
  debounce,
  getByPath,
  getProp,
  hexToRGBA,
  isomorphicWindow,
  valueExistInSelected,
} from './util';

const ReactDropdownSelect = styled('div', {
  shouldForwardProp: prop =>
    isPropValid(prop) &&
    ![
      'onClearAll',
      'onCreateNew',
      'onDropdownClose',
      'onDropdownCloseRequest',
      'onDropdownOpen',
      'onSelectAll',
    ].includes(prop),
})`
  box-sizing: border-box;
  position: relative;
  display: flex;
  border: 1px solid #ccc;
  width: 100%;
  border-radius: 2px;
  padding: 2px 5px;
  flex-direction: row;
  direction: ${({ direction }) => direction};
  align-items: center;
  cursor: pointer;
  min-height: 36px;
  ${({ disabled }) =>
    disabled ? 'cursor: not-allowed;pointer-events: none;opacity: 0.3;' : 'pointer-events: all;'}

  :hover,
  :focus-within {
    border-color: ${({ color }) => color};
  }

  :focus,
  :focus-within {
    outline: 0;
    box-shadow: 0 0 0 3px ${({ color }) => hexToRGBA(color, 0.2)};
  }

  * {
    box-sizing: border-box;
  }
`;

export class Select extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // eslint-disable-next-line react/no-unused-state
      cursor: null,
      dropdown: false,
      search: '',
      // eslint-disable-next-line react/no-unused-state
      searchResults: props.options,
      selectBounds: {},
      values: props.values,
    };

    this.methods = {
      addItem: this.addItem,
      areAllSelected: this.areAllSelected,
      clearAll: this.clearAll,
      createNew: this.createNew,
      dropDown: this.dropDown,
      getInputSize: this.getInputSize,
      getSelectBounds: this.getSelectBounds,
      getSelectRef: this.getSelectRef,
      handleKeyDown: this.handleKeyDown,
      isSelected: this.isSelected,
      removeItem: this.removeItem,
      safeString: this.safeString,
      searchResults: this.searchResults,
      selectAll: this.selectAll,
      setSearch: this.setSearch,
      sortBy: this.sortBy,
      toggleSelectAll: this.toggleSelectAll,
    };

    this.select = React.createRef();
    this.dropdownRoot = typeof document !== 'undefined' && document.createElement('div');
  }

  componentDidMount() {
    const { portal } = this.props;

    if (portal) {
      portal.appendChild(this.dropdownRoot);
    }

    isomorphicWindow().addEventListener('resize', debounce(this.updateSelectBounds));
    isomorphicWindow().addEventListener('scroll', debounce(this.onScroll));

    this.dropDown('close');

    if (this.select) {
      this.updateSelectBounds();
    }
  }

  componentDidUpdate(previousProps, previousState) {
    const { dropdown, search, values: stateValues } = this.state;
    const { closeOnSelect, compareValuesFunc, multi, onChange, onDropdownOpen, options, values } =
      this.props;

    if (
      !compareValuesFunc(previousProps.values, values) &&
      compareValuesFunc(previousProps.values, previousState.values)
    ) {
      this.setState(
        {
          values,
        },
        () => {
          onChange(stateValues);
        },
      );
      this.updateSelectBounds();
    }

    if (previousProps.options !== options) {
      // eslint-disable-next-line react/no-unused-state
      this.setState({ searchResults: this.searchResults() });
    }

    if (previousState.values !== stateValues) {
      onChange(stateValues);
      this.updateSelectBounds();
    }

    if (previousState.search !== search) {
      this.updateSelectBounds();
    }

    if (previousState.values !== stateValues && closeOnSelect) {
      this.dropDown('close');
    }

    if (previousProps.multi !== multi) {
      this.updateSelectBounds();
    }

    if (previousState.dropdown && previousState.dropdown !== dropdown) {
      this.onDropdownClose();
    }

    if (!previousState.dropdown && previousState.dropdown !== dropdown) {
      onDropdownOpen();
    }
  }

  componentWillUnmount() {
    const { debounceDelay, portal } = this.props;

    if (portal) {
      portal.removeChild(this.dropdownRoot);
    }

    isomorphicWindow().removeEventListener(
      'resize',
      debounce(this.updateSelectBounds, debounceDelay),
    );
    isomorphicWindow().removeEventListener('scroll', debounce(this.onScroll, debounceDelay));
  }

  onDropdownClose = () => {
    const { onDropdownClose } = this.props;

    // eslint-disable-next-line react/no-unused-state
    this.setState({ cursor: null });
    onDropdownClose();
  };

  onScroll = () => {
    const { closeOnScroll } = this.props;

    if (closeOnScroll) {
      this.dropDown('close');
    }

    this.updateSelectBounds();
  };

  updateSelectBounds = () =>
    this.select.current &&
    this.setState({
      selectBounds: this.select.current.getBoundingClientRect(),
    });

  // eslint-disable-next-line react/destructuring-assignment
  getSelectBounds = () => this.state.selectBounds;

  dropDown = (action = 'toggle', event, force = false) => {
    const { dropdown, search } = this.state;
    const {
      clearOnBlur,
      closeOnScroll,
      closeOnSelect,
      keepOpen,
      onDropdownCloseRequest,
      options,
      portal,
    } = this.props;
    const target = (event && event.target) || (event && event.srcElement);

    if (onDropdownCloseRequest && dropdown && force === false && action === 'close') {
      onDropdownCloseRequest({
        props: this.props,
        methods: this.methods,
        state: this.state,
        close: () => this.dropDown('close', null, true),
      });

      return;
    }

    if (
      portal &&
      !closeOnScroll &&
      !closeOnSelect &&
      event &&
      target &&
      target.offsetParent &&
      target.offsetParent.classList.contains('react-dropdown-select-dropdown')
    ) {
      return;
    }

    if (keepOpen) {
      this.setState({ dropdown: true });

      return;
    }

    if (action === 'close' && dropdown) {
      this.select.current.blur();

      this.setState({
        dropdown: false,
        search: clearOnBlur ? '' : search,
        // eslint-disable-next-line react/no-unused-state
        searchResults: options,
      });

      return;
    }

    if (action === 'open' && !dropdown) {
      this.setState({ dropdown: true });

      return;
    }

    if (action === 'toggle') {
      this.select.current.focus();

      this.setState({ dropdown: !dropdown });
    }
  };

  getSelectRef = () => this.select.current;

  addItem = item => {
    const { values } = this.state;
    const { clearOnSelect, multi, valueField } = this.props;

    if (multi) {
      if (valueExistInSelected(getByPath(item, valueField), values, this.props)) {
        return this.removeItem(null, item, false);
      }

      this.setState({
        values: [...values, item],
      });
    } else {
      this.setState({
        values: [item],
        dropdown: false,
      });
    }

    if (clearOnSelect) {
      this.setState({ search: '' });
    }

    return true;
  };

  removeItem = (event, item, close = false) => {
    const { values } = this.state;
    const { valueField } = this.props;

    if (event && close) {
      event.preventDefault();
      event.stopPropagation();
      this.dropDown('close');
    }

    this.setState({
      values: values.filter(data => getByPath(data, valueField) !== getByPath(item, valueField)),
    });
  };

  setSearch = event => {
    this.setState(
      {
        // eslint-disable-next-line react/no-unused-state
        cursor: null,
        search: event.target.value,
      },
      () => {
        // eslint-disable-next-line react/no-unused-state
        this.setState({ searchResults: this.searchResults() });
      },
    );
  };

  getInputSize = () => {
    const { addPlaceholder, placeholder } = this.props;
    const { search, values } = this.state;

    if (search) {
      return search.length;
    }

    if (values.length > 0) {
      return addPlaceholder.length;
    }

    return placeholder.length;
  };

  toggleSelectAll = () => {
    return this.setState(s => ({
      values: s.values.length === 0 ? this.selectAll() : this.clearAll(),
    }));
  };

  clearAll = () => {
    const { onClearAll } = this.props;

    onClearAll();
    this.setState({
      values: [],
    });
  };

  selectAll = (valuesList = []) => {
    const { onSelectAll, options } = this.props;

    onSelectAll();

    const values = valuesList.length > 0 ? valuesList : options.filter(option => !option.disabled);

    this.setState({ values });
  };

  isSelected = option => {
    const { valueField } = this.props;
    const { values } = this.state;

    return !!values.some(value => getByPath(value, valueField) === getByPath(option, valueField));
  };

  areAllSelected = () => {
    const { options } = this.props;
    const { values } = this.state;

    return values.length === options.filter(option => !option.disabled).length;
  };

  // eslint-disable-next-line class-methods-use-this
  safeString = string => string.replace(/[$()*+.?[\\\]^{|}]/g, '\\$&');

  sortBy = () => {
    const { options, sortBy } = this.props;

    if (!sortBy) {
      return options;
    }

    options.sort((a, b) => {
      if (getProp(a, sortBy) < getProp(b, sortBy)) {
        return -1;
      } else if (getProp(a, sortBy) > getProp(b, sortBy)) {
        return 1;
      }

      return 0;
    });

    return options;
  };

  searchFn = ({ methods, state }) => {
    const { searchBy, valueField } = this.props;
    const regexp = new RegExp(methods.safeString(state.search), 'i');

    return methods
      .sortBy()
      .filter(item => regexp.test(getByPath(item, searchBy) || getByPath(item, valueField)));
  };

  searchResults = () => {
    const { searchFn } = this.props;

    const data = { state: this.state, props: this.props, methods: this.methods };

    return searchFn(data) || this.searchFn(data);
  };

  handleKeyDown = event => {
    const { handleKeyDownFn } = this.props;
    const data = {
      event,
      state: this.state,
      props: this.props,
      methods: this.methods,
      setState: this.setState.bind(this),
    };

    return handleKeyDownFn(data) || this.handleKeyDownFn(data);
  };

  handleKeyDownFn = ({ event, methods, props, setState, state }) => {
    const { cursor, searchResults, values } = state;
    const escape = event.key === 'Escape';
    const enter = event.key === 'Enter';
    const arrowUp = event.key === 'ArrowUp';
    const arrowDown = event.key === 'ArrowDown';
    const backspace = event.key === 'Backspace';
    const tab = event.key === 'Tab' && !event.shiftKey;
    const shiftTab = event.shiftKey && event.key === 'Tab';

    if (arrowDown && !state.dropdown) {
      event.preventDefault();
      this.dropDown('open');

      setState({
        cursor: 0,
      });

      return;
    }

    if ((arrowDown || (tab && state.dropdown)) && cursor === null) {
      setState({
        cursor: 0,
      });

      return;
    }

    if (arrowUp || arrowDown || (shiftTab && state.dropdown) || (tab && state.dropdown)) {
      event.preventDefault();
    }

    if (escape) {
      this.dropDown('close');
    }

    if (enter) {
      const currentItem = searchResults[cursor];

      if (currentItem && !currentItem.disabled) {
        if (props.create && valueExistInSelected(state.search, state.values, props)) {
          return;
        }

        methods.addItem(currentItem);
      }
    }

    if ((arrowDown || (tab && state.dropdown)) && searchResults.length === cursor) {
      setState({
        cursor: 0,
      });

      return;
    }

    if (arrowDown || (tab && state.dropdown)) {
      setState(previousState => ({
        cursor: previousState.cursor + 1,
      }));
    }

    if ((arrowUp || (shiftTab && state.dropdown)) && cursor > 0) {
      setState(previousState => ({
        cursor: previousState.cursor - 1,
      }));
    }

    if ((arrowUp || (shiftTab && state.dropdown)) && cursor === 0) {
      setState({
        cursor: searchResults.length,
      });
    }

    if (backspace && props.backspaceDelete && this.getInputSize() === 0) {
      this.setState({
        values: values.slice(0, -1),
      });
    }
  };

  renderDropdown = () => {
    const { portal } = this.props;

    if (portal) {
      return ReactDOM.createPortal(
        <Dropdown methods={this.methods} props={this.props} state={this.state} />,
        this.dropdownRoot,
      );
    }

    return <Dropdown methods={this.methods} props={this.props} state={this.state} />;
  };

  createNew = item => {
    const { labelField, onCreateNew, valueField } = this.props;
    const newValue = {
      [labelField]: item,
      [valueField]: item,
    };

    this.addItem(newValue);
    onCreateNew(newValue);
    this.setState({ search: '' });
  };

  render() {
    const { dropdown, values } = this.state;
    const {
      additionalProps,
      className,
      clearable,
      color,
      direction,
      disabled,
      dropdownHandle,
      labelField,
      loading,
      name,
      pattern,
      required,
      separator,
      style,
    } = this.props;

    const classes = [LIB_NAME, className].filter(Boolean).join(' ');

    return (
      <ClickOutside onClickOutside={event => this.dropDown('close', event)}>
        <ReactDropdownSelect
          ref={this.select}
          aria-expanded={dropdown}
          aria-label="Dropdown select"
          className={classes}
          color={color}
          direction={direction}
          disabled={disabled}
          onClick={event => this.dropDown('open', event)}
          onKeyDown={this.handleKeyDown}
          style={style}
          tabIndex={disabled ? '-1' : '0'}
          {...additionalProps}
        >
          <Content methods={this.methods} props={this.props} state={this.state} />

          {(name || required) && (
            <input
              defaultValue={values.map(value => value[labelField]).toString() || []}
              disabled={disabled}
              name={name}
              pattern={pattern}
              required={required}
              style={{ opacity: 0, width: 0, position: 'absolute' }}
              tabIndex={-1}
            />
          )}

          {loading && <Loading props={this.props} />}

          {clearable && <Clear methods={this.methods} props={this.props} state={this.state} />}

          {separator && <Separator methods={this.methods} props={this.props} state={this.state} />}

          {dropdownHandle && (
            <DropdownHandle
              methods={this.methods}
              onClick={() => this.select.current.focus()}
              props={this.props}
              state={this.state}
            />
          )}

          {dropdown && !disabled && this.renderDropdown()}
        </ReactDropdownSelect>
      </ClickOutside>
    );
  }
}

Select.propTypes = Props;

Select.defaultProps = {
  additionalProps: null,
  addPlaceholder: '',
  autoFocus: false,
  backspaceDelete: true,
  clearable: false,
  clearOnBlur: true,
  clearOnSelect: true,
  closeOnScroll: false,
  closeOnSelect: false,
  color: '#0074D9',
  compareValuesFunc: isEqual,
  create: false,
  createNewLabel: 'add {search}',
  debounceDelay: 0,
  direction: 'ltr',
  disabled: false,
  disabledLabel: 'disabled',
  dropdownGap: 5,
  dropdownHandle: true,
  dropdownHeight: '300px',
  dropdownPosition: 'bottom',
  handleKeyDownFn: () => undefined,
  keepOpen: undefined,
  keepSelectedInList: true,
  labelField: 'label',
  multi: false,
  name: null,
  noDataLabel: 'No data',
  onClearAll: () => undefined,
  onCreateNew: () => undefined,
  onDropdownClose: () => undefined,
  onDropdownCloseRequest: undefined,
  onDropdownOpen: () => undefined,
  onSelectAll: () => undefined,
  pattern: undefined,
  placeholder: 'Select...',
  portal: null,
  required: false,
  searchable: true,
  searchBy: 'label',
  searchFn: () => undefined,
  separator: false,
  sortBy: null,
  valueField: 'value',
  values: [],
};

export default Select;
