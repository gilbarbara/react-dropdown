import React, { Component } from 'react';
import styled from '@emotion/styled';
import * as PropTypes from 'prop-types';

import { LIB_NAME } from '../constants';
import { ComponentProps } from '../propTypes';
import { getByPath, hexToRGBA } from '../util';

const ItemComponent = styled.span`
  padding: 5px 10px;
  cursor: pointer;
  border-bottom: 1px solid #fff;

  &.${LIB_NAME}-item-active {
    border-bottom: 1px solid #fff;
    ${({ color, disabled }) => !disabled && color && `background: ${hexToRGBA(color, 0.1)};`}
  }

  :hover,
  :focus {
    background: ${({ color }) => color && hexToRGBA(color, 0.1)};
    outline: none;
  }

  &.${LIB_NAME}-item-selected {
    ${({ color, disabled }) =>
      disabled
        ? `
    background: #f2f2f2;
    color: #ccc;
    `
        : `
    background: ${color};
    color: #fff;
    border-bottom: 1px solid #fff;
    `}
  }

  ${({ disabled }) =>
    disabled
      ? `
    background: #f2f2f2;
    color: #ccc;

    ins {
      text-decoration: none;
      border:1px solid #ccc;
      border-radius: 2px;
      padding: 0px 3px;
      font-size: x-small;
      text-transform: uppercase;
    }
    `
      : ''}
`;

class Item extends Component {
  item = React.createRef();

  componentDidUpdate() {
    const {
      itemIndex,
      state: { cursor },
    } = this.props;

    if (cursor === itemIndex && this.item.current) {
      this.item.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  }

  render() {
    const { item, itemIndex, methods, props, state } = this.props;

    if (props.itemRenderer) {
      return props.itemRenderer({ item, itemIndex, props, state, methods });
    }

    if (!props.keepSelectedInList && methods.isSelected(item)) {
      return null;
    }

    return (
      <ItemComponent
        key={`${getByPath(item, props.valueField)}${getByPath(item, props.labelField)}`}
        ref={this.item}
        aria-disabled={item.disabled}
        aria-label={getByPath(item, props.labelField)}
        aria-selected={methods.isSelected(item)}
        className={`${LIB_NAME}-item ${
          methods.isSelected(item) ? `${LIB_NAME}-item-selected` : ''
        } ${state.cursor === itemIndex ? `${LIB_NAME}-item-active` : ''} ${
          item.disabled ? `${LIB_NAME}-item-disabled` : ''
        }`}
        color={props.color}
        disabled={item.disabled}
        onClick={item.disabled ? undefined : () => methods.addItem(item)}
        onKeyPress={item.disabled ? undefined : () => methods.addItem(item)}
        role="option"
        tabIndex="-1"
      >
        {getByPath(item, props.labelField)} {item.disabled && <ins>{props.disabledLabel}</ins>}
      </ItemComponent>
    );
  }
}

Item.propTypes = {
  ...ComponentProps,
  item: PropTypes.any,
  itemIndex: PropTypes.any,
};

export default Item;
