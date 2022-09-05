import React from 'react';
import styled from '@emotion/styled';

import { LIB_NAME } from '../constants';
import { ComponentProps } from '../propTypes';

const DropdownHandleComponent = styled.div`
  text-align: center;
  ${({ dropdownOpen, rotate }) =>
    dropdownOpen
      ? `
      pointer-events: all;
      ${rotate ? 'transform: rotate(0deg);margin: 0px 0 -3px 5px;' : ''}
      `
      : `
      pointer-events: none;
      ${rotate ? 'margin: 0 0 0 5px;transform: rotate(180deg);' : ''}
      `};
  cursor: pointer;

  svg {
    width: 16px;
    height: 16px;
  }

  :hover {
    path {
      stroke: ${({ color }) => color};
    }
  }

  :focus {
    outline: none;

    path {
      stroke: ${({ color }) => color};
    }
  }
`;

function DropdownHandle({ methods, props, state }) {
  return (
    <DropdownHandleComponent
      className={`${LIB_NAME}-dropdown-handle`}
      color={props.color}
      data-component-name="DropdownHandle"
      dropdownOpen={state.dropdown}
      onClick={event => methods.dropDown(state.dropdown ? 'close' : 'open', event)}
      onKeyDown={event => methods.dropDown('toggle', event)}
      onKeyPress={event => methods.dropDown('toggle', event)}
      rotate={props.dropdownHandleRenderer ? 0 : 1}
      tabIndex="-1"
    >
      {props.dropdownHandleRenderer ? (
        props.dropdownHandleRenderer({ props, state, methods })
      ) : (
        <svg fill="currentColor" viewBox="0 0 40 40">
          <path d="M31 26.4q0 .3-.2.5l-1.1 1.2q-.3.2-.6.2t-.5-.2l-8.7-8.8-8.8 8.8q-.2.2-.5.2t-.5-.2l-1.2-1.2q-.2-.2-.2-.5t.2-.5l10.4-10.4q.3-.2.6-.2t.5.2l10.4 10.4q.2.2.2.5z" />
        </svg>
      )}
    </DropdownHandleComponent>
  );
}

DropdownHandle.propTypes = ComponentProps;

export default DropdownHandle;
