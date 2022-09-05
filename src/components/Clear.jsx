import React from 'react';
import styled from '@emotion/styled';

import { LIB_NAME } from '../constants';
import { ComponentProps } from '../propTypes';

const ClearComponent = styled.div`
  line-height: 25px;
  margin: 0 10px;
  cursor: pointer;

  :focus {
    outline: none;
  }

  :hover {
    color: tomato;
  }
`;

function Clear({ methods, props, state }) {
  return props.clearRenderer ? (
    props.clearRenderer({ props, state, methods })
  ) : (
    <ClearComponent
      className={`${LIB_NAME}-clear`}
      onClick={() => methods.clearAll()}
      onKeyPress={() => methods.clearAll()}
      tabIndex="-1"
    >
      &times;
    </ClearComponent>
  );
}

Clear.propTypes = ComponentProps;

export default Clear;
