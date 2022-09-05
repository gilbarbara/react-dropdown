import React from 'react';
import styled from '@emotion/styled';

import { LIB_NAME } from '../constants';
import { ComponentProps } from '../propTypes';

const SeparatorComponent = styled.div`
  border-left: 1px solid #ccc;
  width: 1px;
  height: 25px;
  display: block;
`;

function Separator({ methods, props, state }) {
  return props.separatorRenderer ? (
    props.separatorRenderer({ props, state, methods })
  ) : (
    <SeparatorComponent className={`${LIB_NAME}-separator`} />
  );
}

Separator.propTypes = ComponentProps;

export default Separator;
