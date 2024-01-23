import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';

import Dropdown, { Option } from '~/index';

import {
  Clear,
  Content,
  Handle,
  Input,
  Loader,
  Menu,
  MenuItem,
  NoData,
  Option as OptionComponent,
  options,
  optionsAlt,
  searchFn,
  Separator,
} from './__fixtures__';

jest.useFakeTimers();

const mockOnChange = jest.fn();
const mockOnClickSelector = jest.fn();
const mockOnClose = jest.fn();
const mockOnClearAll = jest.fn();
const mockOnSelectAll = jest.fn();
const mockOnCreate = jest.fn();
const mockOnOpen = jest.fn();

Element.prototype.scrollIntoView = jest.fn();

describe('Dropdown', () => {
  let values: Option[] = [];

  afterEach(() => {
    jest.clearAllMocks();
    values = [];
  });

  const handleOnChange = (data: Option[]) => {
    mockOnChange(data);
    values = data;
  };

  test('basic functionality', () => {
    render(<Dropdown onChange={handleOnChange} options={options} values={values} />);

    // open the menu
    fireEvent.click(screen.getByTestId('DropdownHandle'));

    expect(screen.getByTestId('DropdownMenu')).toBeInTheDocument();
    expect(screen.getAllByTestId('DropdownMenuItem')).toHaveLength(3);

    // select the first item
    fireEvent.click(screen.getAllByTestId('DropdownMenuItem')[0]);

    expect(screen.getByTestId('DropdownSingleOption')).toHaveTextContent('One');

    expect(mockOnChange).toHaveBeenLastCalledWith(options.slice(0, 1));
  });

  test('with multiple items', async () => {
    render(
      <Dropdown
        loading
        multi
        onChange={handleOnChange}
        options={options}
        secondaryPlaceholder="Add more..."
        showClearButton
        showSeparator
        values={values}
      />,
    );

    // open the menu
    fireEvent.click(screen.getByTestId('DropdownHandle'));

    expect(screen.getByTestId('DropdownMenu')).toBeInTheDocument();
    expect(screen.getAllByTestId('DropdownMenuItem')).toHaveLength(3);

    // select the first item
    fireEvent.click(screen.getAllByTestId('DropdownMenuItem')[0]);

    expect(screen.getByTestId('DropdownOption')).toBeInTheDocument();
    expect(screen.getByTestId<HTMLInputElement>('DropdownInput').placeholder).toBe('Add more...');

    // deselect the first item
    fireEvent.click(screen.getAllByTestId('DropdownMenuItem')[0]);

    expect(screen.queryByTestId('DropdownOption')).not.toBeInTheDocument();

    // select the first item again
    fireEvent.click(screen.getAllByTestId('DropdownMenuItem')[0]);

    expect(screen.getByTestId('DropdownOption')).toBeInTheDocument();

    // select the second item
    fireEvent.click(screen.getAllByTestId('DropdownMenuItem')[1]);

    expect(screen.getAllByTestId('DropdownOption')).toHaveLength(2);

    expect(mockOnChange).toHaveBeenLastCalledWith(options.slice(0, 2));

    fireEvent.click(screen.getAllByTestId('DropdownOptionRemove')[0]);

    expect(screen.getByTestId('DropdownOption')).toBeInTheDocument();

    expect(mockOnChange).toHaveBeenLastCalledWith(options.slice(1, 2));

    // clear the selection
    fireEvent.click(screen.getByTestId('DropdownClear'));

    // select the first item
    fireEvent.click(screen.getAllByTestId('DropdownMenuItem')[0]);

    // select the second item
    fireEvent.click(screen.getAllByTestId('DropdownMenuItem')[1]);

    expect(screen.getAllByTestId('DropdownOption')).toHaveLength(2);
  });

  test('with keyboard navigation', () => {
    render(
      <Dropdown multi onChange={handleOnChange} options={options} searchable values={values} />,
    );

    // navigate to the first item
    fireEvent.keyDown(screen.getByTestId('Dropdown'), {
      key: 'ArrowDown',
    });

    expect(screen.getByTestId('DropdownMenu')).toBeInTheDocument();

    // search an invalid word
    fireEvent.change(screen.getByTestId('DropdownInput'), { target: { value: 'To' } });

    expect(screen.getByTestId('DropdownNoData')).toBeInTheDocument();

    // search a valid word
    fireEvent.change(screen.getByTestId('DropdownInput'), { target: { value: 'Tw' } });

    expect(screen.getByTestId('DropdownMenuItem')).toBeInTheDocument();

    // clear the search
    fireEvent.change(screen.getByTestId('DropdownInput'), { target: { value: '' } });

    // navigate to the first item
    fireEvent.keyDown(screen.getByTestId('Dropdown'), {
      key: 'ArrowDown',
    });

    // navigate to the second item
    fireEvent.keyDown(screen.getByTestId('Dropdown'), {
      key: 'ArrowDown',
    });

    // navigate to the first item again
    fireEvent.keyDown(screen.getByTestId('Dropdown'), {
      key: 'ArrowUp',
    });

    // select the item
    fireEvent.keyDown(screen.getByTestId('Dropdown'), {
      key: 'Enter',
    });

    expect(screen.getByTestId('DropdownOption')).toBeInTheDocument();

    // deselect the item
    fireEvent.keyDown(screen.getByTestId('Dropdown'), {
      key: 'Backspace',
    });

    expect(screen.queryByTestId('DropdownOption')).not.toBeInTheDocument();

    // close the menu
    fireEvent.keyDown(screen.getByTestId('Dropdown'), {
      key: 'Escape',
    });

    // open the menu
    fireEvent.click(screen.getByTestId('DropdownInput'));

    // navigate to the first item
    fireEvent.keyDown(screen.getByTestId('Dropdown'), {
      key: 'ArrowDown',
    });

    // select the item
    fireEvent.keyDown(screen.getByTestId('Dropdown'), {
      key: 'Enter',
    });

    // close the menu
    fireEvent.click(document.body);

    expect(screen.queryByTestId('DropdownMenu')).not.toBeInTheDocument();
  });

  test('with searchFn', () => {
    render(
      <Dropdown
        multi
        onChange={handleOnChange}
        options={options}
        searchBy="value"
        searchFn={searchFn}
        values={values}
      />,
    );

    // open the menu
    fireEvent.click(screen.getByTestId('DropdownHandle'));

    expect(screen.getAllByTestId('DropdownMenuItem')).toHaveLength(3);

    // search a valid label
    fireEvent.change(screen.getByTestId('DropdownInput'), { target: { value: 'One' } });

    expect(screen.queryByTestId('DropdownMenuItem')).not.toBeInTheDocument();

    // search a valid value
    fireEvent.change(screen.getByTestId('DropdownInput'), { target: { value: 1 } });

    expect(screen.getByTestId('DropdownMenuItem')).toHaveTextContent('One');
  });

  test('with open, onClickSelector, and closeOnSelect', () => {
    const props = {
      closeOnSelect: true,
      onChange: handleOnChange,
      onClickSelector: mockOnClickSelector,
      open: true,
      options,
      values,
    };

    const { rerender } = render(<Dropdown {...props} />);

    expect(screen.getByTestId('DropdownMenu')).toBeInTheDocument();

    // click the handle
    fireEvent.click(screen.getByTestId('DropdownHandle'));

    // the menu should still be opened
    expect(screen.getByTestId('DropdownMenu')).toBeInTheDocument();
    expect(mockOnClickSelector).toHaveBeenCalledWith(true);

    // select the first item
    fireEvent.click(screen.getAllByTestId('DropdownMenuItem')[0]);

    expect(mockOnChange).toHaveBeenLastCalledWith(options.slice(0, 1));

    // the menu should still be opened
    expect(screen.getByTestId('DropdownMenu')).toBeInTheDocument();

    rerender(<Dropdown {...props} open={false} />);

    // the menu should be hidden
    expect(screen.queryByTestId('DropdownMenu')).not.toBeInTheDocument();
  });

  test('with hiddenInput', () => {
    const props = {
      hiddenInput: {
        name: 'test',
      },
      onChange: handleOnChange,
      options,
      values,
    };

    const { rerender } = render(<Dropdown {...props} />);

    // open the menu
    fireEvent.click(screen.getByTestId('DropdownHandle'));

    // select the first item
    fireEvent.click(screen.getAllByTestId('DropdownMenuItem')[0]);

    let input = screen.getAllByRole<HTMLInputElement>('textbox').find(d => d.name === 'test');

    expect(input).toHaveValue('1');

    rerender(<Dropdown {...props} hiddenInput={{ ...props.hiddenInput, key: 'label' }} />);

    input = screen.getAllByRole<HTMLInputElement>('textbox').find(d => d.name === 'test');

    expect(input).toHaveValue('One');
  });

  test('with handlers and rerender', () => {
    const { rerender } = render(
      <Dropdown
        onChange={mockOnChange}
        onClose={mockOnClose}
        onOpen={mockOnOpen}
        options={options}
        values={values}
      />,
    );

    rerender(
      <Dropdown
        closeOnSelect
        menuPosition="auto"
        multi
        onChange={mockOnChange}
        onClose={mockOnClose}
        onOpen={mockOnOpen}
        options={optionsAlt}
        values={[...values, optionsAlt[0]]}
      />,
    );

    expect(mockOnChange).toHaveBeenLastCalledWith(optionsAlt.slice(0, 1));

    // open the menu
    fireEvent.click(screen.getByTestId('DropdownHandle'));
    expect(mockOnOpen).toHaveBeenCalled();

    // select the second item
    fireEvent.click(screen.getAllByTestId('DropdownMenuItem')[1]);

    expect(screen.queryByTestId('DropdownMenu')).not.toBeInTheDocument();

    expect(mockOnChange).toHaveBeenLastCalledWith(optionsAlt.slice(0, 2));
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('with scroll and resize', async () => {
    render(<Dropdown closeOnScroll onClose={mockOnClose} options={options} values={values} />);

    // open the menu
    fireEvent.click(screen.getByTestId('DropdownHandle'));
    fireEvent.resize(window, { target: { innerWidth: 1000 } });

    expect(screen.getByTestId('DropdownMenu')).toBeInTheDocument();

    fireEvent.scroll(window, { target: { scrollY: 100 } });

    await act(async () => {
      jest.runOnlyPendingTimers();
    });

    expect(screen.queryByTestId('DropdownMenu')).not.toBeInTheDocument();
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('with custom components', () => {
    render(
      <Dropdown
        clearComponent={Clear}
        handleComponent={Handle}
        inputComponent={Input}
        loaderComponent={Loader}
        loading
        menuItemComponent={MenuItem}
        multi
        noDataComponent={NoData}
        onChange={handleOnChange}
        optionComponent={OptionComponent}
        options={options}
        separatorComponent={Separator}
        showClearButton
        showSeparator
        values={values}
      />,
    );

    expect(screen.getByTestId('CustomInput')).toBeInTheDocument();
    expect(screen.getByTestId('CustomLoader')).toBeInTheDocument();
    expect(screen.getByTestId('CustomSeparator')).toBeInTheDocument();
    expect(screen.getByTestId('CustomHandle')).toBeInTheDocument();

    // open the menu
    fireEvent.click(screen.getByTestId('DropdownHandle'));

    expect(screen.getAllByTestId('CustomItem')).toHaveLength(3);

    // search an invalid word
    fireEvent.change(screen.getByTestId('CustomInput'), { target: { value: 'To' } });

    expect(screen.getByTestId('CustomNoData')).toBeInTheDocument();

    // search a valid word
    fireEvent.change(screen.getByTestId('CustomInput'), { target: { value: 'On' } });

    expect(screen.getByTestId('CustomItem')).toBeInTheDocument();

    // select the first item
    fireEvent.click(screen.getAllByTestId('CustomItem')[0]);

    expect(screen.getByTestId('CustomOption')).toHaveTextContent('One');
    expect(screen.getByTestId('CustomClear')).toBeInTheDocument();

    expect(mockOnChange).toHaveBeenLastCalledWith(options.slice(0, 1));
  });

  test('with custom containers', () => {
    render(
      <Dropdown
        contentComponent={Content}
        menuComponent={Menu}
        multi
        onChange={handleOnChange}
        options={options}
        searchable
        values={values}
      />,
    );

    expect(screen.getByTestId('CustomContent')).toBeInTheDocument();

    // open the menu
    fireEvent.click(screen.getByTestId('DropdownHandle'));

    // search an invalid word
    fireEvent.change(screen.getByTestId('CustomContentInput'), { target: { value: 'To' } });

    expect(screen.getByTestId('CustomNoData')).toBeInTheDocument();

    // search a valid word
    fireEvent.change(screen.getByTestId('CustomContentInput'), { target: { value: 'Tw' } });

    expect(screen.getByTestId('CustomItem')).toBeInTheDocument();

    // select the first item
    fireEvent.click(screen.getAllByTestId('CustomItem')[0]);

    expect(screen.getByTestId('CustomOption')).toHaveTextContent('Two');

    expect(mockOnChange).toHaveBeenLastCalledWith(options.slice(1, 2));

    // close the menu
    fireEvent.click(screen.getByTestId('DropdownHandle'));

    expect(screen.queryByTestId('CustomMenu')).not.toBeInTheDocument();
  });

  test('with custom containers and create', () => {
    render(
      <Dropdown
        create
        menuComponent={Menu}
        multi
        onChange={handleOnChange}
        onClearAll={mockOnClearAll}
        onCreate={mockOnCreate}
        onSelectAll={mockOnSelectAll}
        options={options}
        searchable
        values={values}
      />,
    );

    // open the menu
    fireEvent.click(screen.getByTestId('DropdownHandle'));

    // search an invalid word
    fireEvent.change(screen.getByTestId('DropdownInput'), { target: { value: 'To' } });

    expect(screen.getByTestId('CustomNoData')).toBeInTheDocument();

    // search a valid word
    fireEvent.change(screen.getByTestId('DropdownInput'), { target: { value: 'Tw' } });

    expect(screen.getByTestId('CustomItem')).toBeInTheDocument();

    // select the first item
    fireEvent.click(screen.getAllByTestId('CustomItem')[0]);

    expect(screen.getByTestId('DropdownOption')).toHaveTextContent('Two');

    expect(mockOnChange).toHaveBeenLastCalledWith(options.slice(1, 2));

    // search for a new word
    fireEvent.change(screen.getByTestId('DropdownInput'), { target: { value: 'Seven' } });

    fireEvent.click(screen.getByTestId('DropdownCreate'));

    expect(screen.getAllByTestId('DropdownOption')[0]).toHaveTextContent('Two');
    expect(screen.getAllByTestId('DropdownOption')[1]).toHaveTextContent('Seven');

    expect(mockOnCreate).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenLastCalledWith([
      ...options.slice(1, 2),
      { label: 'Seven', value: 'Seven' },
    ]);

    // search for another word
    fireEvent.change(screen.getByTestId('DropdownInput'), { target: { value: 'Eight' } });

    fireEvent.keyDown(screen.getByTestId('Dropdown'), {
      key: 'ArrowDown',
    });

    fireEvent.keyDown(screen.getByTestId('Dropdown'), {
      key: 'Enter',
    });

    expect(screen.getAllByTestId('DropdownOption')[0]).toHaveTextContent('Two');
    expect(screen.getAllByTestId('DropdownOption')[1]).toHaveTextContent('Seven');
    expect(screen.getAllByTestId('DropdownOption')[2]).toHaveTextContent('Eight');

    expect(mockOnCreate).toHaveBeenCalledTimes(2);
    expect(mockOnChange).toHaveBeenLastCalledWith([
      ...options.slice(1, 2),
      { label: 'Seven', value: 'Seven' },
      { label: 'Eight', value: 'Eight' },
    ]);

    // select all options including the new ones
    fireEvent.click(screen.getByTestId('SelectAll'));

    expect(screen.getAllByTestId('DropdownOption')).toHaveLength(4);

    // clear the selection and remove the created options
    fireEvent.click(screen.getByTestId('ClearAll'));

    expect(mockOnClearAll).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId('DropdownOption')).not.toBeInTheDocument();

    // select all available options
    fireEvent.click(screen.getByTestId('ToggleAll'));

    expect(screen.getAllByTestId('DropdownOption')).toHaveLength(2);

    // deselect all available options
    fireEvent.click(screen.getByTestId('ToggleAll'));

    expect(screen.queryByTestId('DropdownOption')).not.toBeInTheDocument();

    fireEvent.keyDown(screen.getByTestId('Dropdown'), {
      key: 'Escape',
    });

    expect(screen.queryByTestId('CustomMenu')).not.toBeInTheDocument();
  });
});
