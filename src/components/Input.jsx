import React, { Component } from 'react';
import styled from '@emotion/styled';

import { LIB_NAME } from '../constants';
import { ComponentProps } from '../propTypes';
import { valueExistInSelected } from '../util';

const InputComponent = styled.input`
  line-height: inherit;
  border: none;
  margin-left: 5px;
  background: transparent;
  padding: 0;
  width: calc(${({ size }) => `${size}ch`} + 5px);
  font-size: smaller;
  ${({ readOnly }) => readOnly && 'cursor: pointer;'}
  :focus {
    outline: none;
  }
`;

const handlePlaceHolder = (props, state) => {
  const { addPlaceholder, placeholder, searchable } = props;
  const noValues = state.values && state.values.length === 0;
  const hasValues = state.values && state.values.length > 0;

  if (hasValues && addPlaceholder && searchable) {
    return addPlaceholder;
  }

  if (noValues) {
    return placeholder;
  }

  if (hasValues && !searchable) {
    return '';
  }

  return '';
};

class Input extends Component {
  input = React.createRef();

  componentDidUpdate(previousProps) {
    const {
      props: { autoFocus },
      state: { dropdown },
    } = this.props;

    if (dropdown || (previousProps.state.dropdown !== dropdown && dropdown) || autoFocus) {
      this.input.current.focus();
    }

    if (previousProps.state.dropdown !== dropdown && !dropdown) {
      this.input.current.blur();
    }
  }

  onBlur = event => {
    event.stopPropagation();
    const {
      state: { dropdown },
    } = this.props;

    if (!dropdown) {
      return this.input.current.blur();
    }

    return this.input.current.focus();
  };

  handleKeyPress = event => {
    const { methods, props, state } = this.props;

    return (
      props.create &&
      event.key === 'Enter' &&
      !valueExistInSelected(state.search, [...state.values, ...props.options], this.props) &&
      state.search &&
      state.cursor === null &&
      methods.createNew(state.search)
    );
  };

  render() {
    const { methods, props, state } = this.props;

    if (props.inputRenderer) {
      return props.inputRenderer({ props, state, methods, inputRef: this.input });
    }

    return (
      <InputComponent
        ref={this.input}
        className={`${LIB_NAME}-input`}
        data-component-name="Input"
        disabled={props.disabled}
        onBlur={this.onBlur}
        onChange={methods.setSearch}
        onClick={() => methods.dropDown('open')}
        onFocus={event => event.stopPropagation()}
        onKeyPress={this.handleKeyPress}
        placeholder={handlePlaceHolder(props, state)}
        readOnly={!props.searchable}
        size={methods.getInputSize()}
        tabIndex="-1"
        value={state.search}
      />
    );
  }
}

Input.propTypes = ComponentProps;

export default Input;
