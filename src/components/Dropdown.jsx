import React from 'react';
import styled from '@emotion/styled';

import Item from './Item';
import NoData from './NoData';

import { LIB_NAME } from '../constants';
import { ComponentProps } from '../propTypes';
import { hexToRGBA, isomorphicWindow, valueExistInSelected } from '../util';

const DropDown = styled.div`
  background: #fff;
  border-radius: 2px;
  border: 1px solid #ccc;
  box-shadow: 0 0 10px 0 ${() => hexToRGBA('#000000', 0.2)};
  display: flex;
  flex-direction: column;
  max-height: ${({ dropdownHeight }) => dropdownHeight};
  overflow: auto;
  padding: 0;
  position: absolute;
  width: ${({ selectBounds }) => selectBounds.width}px;
  z-index: 9;

  ${({ dropdownGap, dropdownPosition, selectBounds }) =>
    dropdownPosition === 'top'
      ? `bottom: ${selectBounds.height + 2 + dropdownGap}px`
      : `top: ${selectBounds.height + 2 + dropdownGap}px`};

  
  ${({ dropdownGap, dropdownPosition, portal, selectBounds }) =>
    portal
      ? `
      position: fixed;
      ${
        dropdownPosition === 'bottom'
          ? `top: ${selectBounds.bottom + dropdownGap}px;`
          : `bottom: ${isomorphicWindow().innerHeight - selectBounds.top + dropdownGap}px;`
      }
      left: ${selectBounds.left - 1}px;`
      : 'left: -1px;'};

  :focus {
    outline: none;
  }
}
`;

const AddNew = styled.div`
  color: ${({ color }) => color};
  padding: 5px 10px;

  :hover {
    background: ${({ color }) => color && hexToRGBA(color, 0.1)};
    outline: none;
    cursor: pointer;
  }
`;

const getDropdownPosition = (props, methods) => {
  const DropdownBoundingClientRect = methods.getSelectRef().getBoundingClientRect();
  const dropdownHeight =
    DropdownBoundingClientRect.bottom +
    parseInt(props.dropdownHeight, 10) +
    parseInt(props.dropdownGap, 10);

  if (props.dropdownPosition !== 'auto') {
    return props.dropdownPosition;
  }

  if (
    dropdownHeight > isomorphicWindow().innerHeight &&
    dropdownHeight > DropdownBoundingClientRect.top
  ) {
    return 'top';
  }

  return 'bottom';
};

function Dropdown({ methods, props, state }) {
  return (
    <DropDown
      className={`${LIB_NAME}-dropdown ${LIB_NAME}-dropdown-position-${getDropdownPosition(
        props,
        methods,
      )}`}
      dropdownGap={props.dropdownGap}
      dropdownHeight={props.dropdownHeight}
      dropdownPosition={getDropdownPosition(props, methods)}
      portal={props.portal}
      role="list"
      selectBounds={state.selectBounds}
      tabIndex="-1"
    >
      {props.dropdownRenderer ? (
        props.dropdownRenderer({ props, state, methods })
      ) : (
        <>
          {props.create &&
            state.search &&
            !valueExistInSelected(state.search, [...state.values, ...props.options], props) && (
              <AddNew
                className={`${LIB_NAME}-dropdown-add-new`}
                color={props.color}
                onClick={() => methods.createNew(state.search)}
                role="button"
              >
                {props.createNewLabel.replace('{search}', `"${state.search}"`)}
              </AddNew>
            )}
          {state.searchResults.length === 0 ? (
            <NoData
              className={`${LIB_NAME}-no-data`}
              methods={methods}
              props={props}
              state={state}
            />
          ) : (
            state.searchResults.map((item, itemIndex) => (
              <Item
                key={item[props.valueField]}
                item={item}
                itemIndex={itemIndex}
                methods={methods}
                props={props}
                state={state}
              />
            ))
          )}
        </>
      )}
    </DropDown>
  );
}

Dropdown.propTypes = ComponentProps;

export default Dropdown;
