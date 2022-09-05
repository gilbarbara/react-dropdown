import React from 'react';
import styled from '@emotion/styled';

import { LIB_NAME } from '../constants';
import { ComponentProps } from '../propTypes';

const LoadingComponent = styled.div`
  @keyframes dual-ring-spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(180deg);
    }
  }

  padding: 0 5px;
  display: block;
  width: auto;
  height: auto;

  :after {
    content: ' ';
    display: block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border-width: 1px;
    border-style: solid;
    border-color: ${({ color }) => color} transparent;
    animation: dual-ring-spin 0.7s ease-in-out infinite;
    margin: 0 0 0 -10px;
  }
`;

function Loading({ props }) {
  return props.loadingRenderer ? (
    props.loadingRenderer({ props })
  ) : (
    <LoadingComponent className={`${LIB_NAME}-loading`} color={props.color} />
  );
}

Loading.propTypes = ComponentProps;

export default Loading;
