import { ChangeEvent, Component, createRef, KeyboardEvent, MouseEvent, RefObject } from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import isEqual from '@gilbarbara/deep-equal';

import { defaultProps, SLUG, styledOptions } from '~/config';

import { hexToRGBA } from '~/modules/colors';
import {
  canUseDOM,
  debounce,
  getAllOptions,
  getCursor,
  getLabels,
  getOptionData,
  getStyles,
  isNumber,
  matchOptions,
  px,
} from '~/modules/helpers';

import Clear from '~/components/Clear';
import Content from '~/components/Content';
import Handle from '~/components/Handle';
import Loading from '~/components/Loading';
import Menu from '~/components/Menu';
import Separator from '~/components/Separator';

import { Actions, Methods, Option, OptionKeys, Props, State, Styles } from '~/types';

const ReactDropdown = styled(
  'div',
  styledOptions,
)<Styles & Required<Pick<Props, 'direction' | 'disabled'>>>(props => {
  const { bgColor, borderColor, borderRadius, color, direction, disabled, minHeight, width } =
    props;

  return css`
    align-items: start;
    background-color: ${bgColor};
    border-radius: ${borderRadius};
    border: 1px solid ${borderColor};
    box-sizing: border-box;
    cursor: pointer;
    direction: ${direction};
    display: flex;
    flex-direction: row;
    min-height: ${px(minHeight)};
    position: relative;
    width: ${width};
    ${disabled
      ? `
      cursor: not-allowed;
      opacity: 0.6;
      pointer-events: none;
      `
      : `
      pointer-events: all;
      `};

    :hover,
    :focus-within {
      border-color: ${color};
    }

    :focus,
    :focus-within {
      outline: 0;
      box-shadow: 0 0 0 3px ${hexToRGBA(color, 0.2)};
    }

    * {
      box-sizing: border-box;
    }
  `;
});

export class Dropdown extends Component<Props, State> {
  private readonly dropdownRef: RefObject<HTMLDivElement>;
  private readonly methods: Methods;

  static defaultProps = defaultProps;

  constructor(props: Props) {
    super(props);

    this.state = {
      cursor: null,
      dropdownBounds: {},
      search: '',
      searchResults: props.options,
      status: props.open || false,
      values: props.values || [],
    };

    this.methods = {
      addItem: this.addItem,
      areAllSelected: this.areAllSelected,
      clearAll: this.clearAll,
      createItem: this.createItem,
      // eslint-disable-next-line react/destructuring-assignment
      getDropdownBounds: () => this.state.dropdownBounds,
      getDropdownRef: () => this.dropdownRef.current,
      getInputSize: this.getInputSize,
      getLabels: this.getLabels,
      getOptionData: this.getOptionData,
      getStyles: this.getStyles,
      handleKeyDown: this.handleKeyDown,
      isSelected: this.isSelected,
      removeItem: this.removeItem,
      safeString: this.safeString,
      searchResults: this.searchResults,
      selectAll: this.selectAll,
      setSearch: this.setSearch,
      setStatus: this.setStatus,
      toggleAll: this.toggleAll,
    };

    this.dropdownRef = createRef();
  }

  componentDidMount() {
    if (!canUseDOM()) {
      return;
    }

    window.addEventListener('resize', this.handleResize, true);
    window.addEventListener('scroll', this.handleScroll, true);

    if (this.dropdownRef) {
      this.updateDropdownBounds();
    }
  }

  componentDidUpdate(previousProps: Props, previousState: State) {
    const { search, status, values: stateValues } = this.state;
    const {
      closeOnSelect,
      comparatorFn = defaultProps.comparatorFn,
      multi,
      onChange,
      onClose,
      onOpen,
      open,
      options,
      values = [],
    } = this.props;

    if (
      !comparatorFn(previousProps.values || [], values) &&
      comparatorFn(previousProps.values || [], previousState.values)
    ) {
      this.setState({ values });
      this.updateDropdownBounds();
    }

    if (!comparatorFn(previousProps.options, options)) {
      this.setState({ searchResults: this.searchResults() });
    }

    if (!comparatorFn(previousState.values, stateValues)) {
      this.updateDropdownBounds();

      if (onChange) {
        onChange(stateValues);
      }
    }

    if (previousState.search !== search) {
      this.updateDropdownBounds();
    }

    if (!isEqual(previousState.values, stateValues) && closeOnSelect) {
      this.setStatus('close');
    }

    if (previousProps.open !== open && typeof open === 'boolean') {
      this.setStatus(open ? 'open' : 'close');
    }

    if (previousProps.multi !== multi) {
      this.updateDropdownBounds();
    }

    if (previousState.status && !status) {
      document.removeEventListener('click', this.handleClickOutside);

      this.setState({ cursor: null });

      if (onClose) {
        onClose();
      }
    }

    if (!previousState.status && status) {
      document.addEventListener('click', this.handleClickOutside);

      if (onOpen) {
        onOpen();
      }
    }
  }

  componentWillUnmount() {
    if (!canUseDOM()) {
      return;
    }

    window.removeEventListener('resize', this.handleResize, true);
    window.removeEventListener('scroll', this.handleScroll, true);
    document.removeEventListener('click', this.handleClickOutside);
  }

  handleClickOutside = (event: Event) => {
    const { current } = this.dropdownRef;
    const { target } = event;

    if (!current || !target) {
      return;
    }

    if (current === target || !current.contains(target as Node)) {
      this.setStatus('close');
    }
  };

  handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const { cursor, search, searchResults, status, values } = this.state;
    const { create } = this.props;

    if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.stopPropagation();
    }

    switch (event.key) {
      case 'ArrowDown': {
        if (!status) {
          this.setStatus('open');
          this.setState({
            cursor: 0,
          });

          return;
        }

        this.setState({
          cursor: getCursor(cursor, 'down', searchResults),
        });

        break;
      }
      case 'ArrowUp': {
        this.setState({
          cursor: getCursor(cursor, 'up', searchResults),
        });

        break;
      }
      case 'Backspace': {
        if (isNumber(cursor) && !search.length) {
          const nextValues = values.filter(value => !isEqual(value, searchResults[cursor]));

          if (nextValues.length !== values.length) {
            this.setState({
              values: nextValues,
            });
          }
        }

        break;
      }
      case 'Enter': {
        if (isNumber(cursor)) {
          const currentItem = searchResults[cursor];

          if (currentItem && !currentItem.disabled) {
            if (create && matchOptions(values, search, false)) {
              return;
            }

            this.addItem(currentItem);
          } else if (search) {
            this.createItem(search);
          }
        } else if (!search) {
          this.setStatus('toggle', event);
        }

        break;
      }
      case 'Escape': {
        this.setStatus('close');
        break;
      }
    }
  };

  // eslint-disable-next-line react/sort-comp
  handleResize = debounce(() => {
    this.updateDropdownBounds();
  }, 150);

  handleScroll = debounce(() => {
    const { status } = this.state;
    const { closeOnScroll } = this.props;

    this.updateDropdownBounds();

    if (closeOnScroll && status) {
      this.setStatus('close');
    }
  }, 150);

  setStatus = (
    action: Actions,
    event?: Event | MouseEvent<HTMLElement> | KeyboardEvent<HTMLDivElement>,
  ) => {
    const { search, status } = this.state;
    const { clearOnClose, closeOnScroll, closeOnSelect, open, options } = this.props;
    const target = event && ((event.target || event.currentTarget) as HTMLElement);
    const isMenuTarget =
      target &&
      target.offsetParent &&
      target.offsetParent.classList.contains('react-dropdown-menu');

    if (!closeOnScroll && !closeOnSelect && event && isMenuTarget) {
      return;
    }

    if (typeof open === 'boolean') {
      this.setState({ status: open });

      return;
    }

    if (action === 'close' && status) {
      this.dropdownRef.current?.blur();

      this.setState({
        status: false,
        search: clearOnClose ? '' : search,
        searchResults: options,
      });

      return;
    }

    if (action === 'open' && !status) {
      this.setState({ status: true });

      return;
    }

    if (action === 'toggle') {
      this.dropdownRef.current?.focus();

      this.setState({ status: !status });
    }
  };

  updateDropdownBounds = () => {
    if (this.dropdownRef.current) {
      this.setState({
        dropdownBounds: this.dropdownRef.current.getBoundingClientRect(),
      });
    }
  };

  getInputSize = () => {
    const { placeholder, secondaryPlaceholder } = this.props;
    const { search, values } = this.state;

    if (search) {
      return search.length;
    }

    if (secondaryPlaceholder && values.length) {
      return secondaryPlaceholder.length;
    }

    return values.length ? 3 : placeholder?.length || 0;
  };

  getLabels = () => {
    const { labels } = this.props;

    return getLabels(labels);
  };

  // eslint-disable-next-line class-methods-use-this
  getOptionData = (input: Option, key: OptionKeys) =>
    key === 'label' ? getOptionData(input, 'label') : getOptionData(input, 'value');

  getStyles = () => {
    const { styles } = this.props;

    return getStyles(styles);
  };

  addItem = (item: Option) => {
    const { values } = this.state;
    const { clearOnSelect, multi } = this.props;

    if (multi) {
      if (matchOptions(values, getOptionData(item, 'value'))) {
        this.removeItem(null, item, false);

        return;
      }

      this.setState({
        values: [...values, item],
      });
    } else {
      this.setState({
        values: [item],
      });

      this.setStatus('close');
    }

    if (clearOnSelect) {
      this.setState({ search: '' });
    }
  };

  removeItem = (event: MouseEvent<HTMLElement> | null, item: Option, close = false) => {
    const { values } = this.state;

    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (close) {
      this.setStatus('close');
    }

    this.setState({
      values: values.filter(data => getOptionData(data, 'value') !== getOptionData(item, 'value')),
    });
  };

  setSearch = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState(
      {
        cursor: null,
        search: (event.target as HTMLInputElement).value,
      },
      () => {
        this.setState({ searchResults: this.searchResults() });
      },
    );
  };

  areAllSelected = () => {
    const { options } = this.props;
    const { values } = this.state;

    return values.length === getAllOptions(options, values).length;
  };

  clearAll = () => {
    const { onClearAll } = this.props;

    if (onClearAll) {
      onClearAll();
    }

    this.setState({
      values: [],
    });
  };

  createItem = (search: string) => {
    const { onCreate, options } = this.props;
    const newValue = {
      label: search,
      value: search,
    };

    this.addItem(newValue);

    if (onCreate) {
      onCreate(search, () => this.setStatus('close'));
    }

    this.setState({ search: '', searchResults: [...options, newValue] });
  };

  isSelected = (option: Option) => {
    const { values } = this.state;

    return values.some(value => getOptionData(value, 'value') === getOptionData(option, 'value'));
  };

  selectAll = (valuesList: Option[] = []) => {
    const { values } = this.state;
    const { onSelectAll, options } = this.props;

    if (onSelectAll) {
      onSelectAll();
    }

    const nextValues = valuesList.length ? valuesList : getAllOptions(options, values);

    this.setState({ values: nextValues });
  };

  toggleAll = () => {
    const { values } = this.state;

    if (values.length) {
      this.clearAll();
    } else {
      this.selectAll();
    }
  };

  // eslint-disable-next-line class-methods-use-this
  safeString = (input: string) => input.replace(/[$()*+.?[\\\]^{|}]/g, '\\$&');

  searchFn = () => {
    const { search } = this.state;
    const { options, searchBy = 'label' } = this.props;
    const regexp = new RegExp(this.safeString(search), 'i');

    return options.filter(item => regexp.test(`${this.getOptionData(item, searchBy)}`));
  };

  searchResults = () => {
    const { searchFn } = this.props;

    if (searchFn) {
      return searchFn({ methods: this.methods, props: this.props, state: this.state });
    }

    return this.searchFn();
  };

  render() {
    const { status, values } = this.state;
    const {
      className,
      direction = 'ltr',
      disabled = false,
      hiddenInput,
      hideHandle,
      loading,
      showClearButton,
      showSeparator,
      style,
    } = this.props;

    const classes = [SLUG, className].filter(Boolean).join(' ');

    return (
      <ReactDropdown
        ref={this.dropdownRef}
        aria-expanded={status}
        aria-label="Dropdown"
        className={classes}
        data-component-name="Dropdown"
        direction={direction}
        disabled={disabled}
        onKeyDown={this.handleKeyDown}
        style={style}
        tabIndex={disabled ? -1 : 0}
        {...this.getStyles()}
      >
        <Content methods={this.methods} props={this.props} state={this.state} />

        {hiddenInput && (
          <input
            defaultValue={
              values
                .map(value => {
                  const { key = 'value' } = hiddenInput;

                  if (key === 'value') {
                    return getOptionData(value, 'value');
                  }

                  return getOptionData(value, 'label');
                })
                .join(hiddenInput.separator) || ''
            }
            disabled={disabled}
            name={hiddenInput.name}
            pattern={hiddenInput.pattern}
            required={!!hiddenInput.required}
            style={{ opacity: 0, width: 0, position: 'absolute' }}
            tabIndex={-1}
          />
        )}

        {showClearButton && !!values.length && (
          <Clear methods={this.methods} props={this.props} state={this.state} />
        )}

        {loading && <Loading methods={this.methods} props={this.props} state={this.state} />}

        {showSeparator && (
          <Separator methods={this.methods} props={this.props} state={this.state} />
        )}

        {!hideHandle && <Handle methods={this.methods} props={this.props} state={this.state} />}

        {status && !disabled && (
          <Menu methods={this.methods} props={this.props} state={this.state} />
        )}
      </ReactDropdown>
    );
  }
}

export default Dropdown;

export * from '~/types';
