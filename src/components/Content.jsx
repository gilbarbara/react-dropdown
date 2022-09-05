import React from 'react';
import styled from '@emotion/styled';

import Input from './Input';
import Option from './Option';

import { LIB_NAME } from '../constants';
import { ComponentProps } from '../propTypes';
import { getByPath } from '../util';

const ContentComponent = styled.div`
  display: flex;
  flex: 1;
  flex-wrap: wrap;
`;

function Content({ methods, props, state }) {
  return (
    <ContentComponent
      className={`${LIB_NAME}-content ${
        props.multi ? `${LIB_NAME}-type-multi` : `${LIB_NAME}-type-single`
      }`}
      onClick={event => {
        event.stopPropagation();
        methods.dropDown('open');
      }}
    >
      {props.contentRenderer ? (
        props.contentRenderer({ props, state, methods })
      ) : (
        <React.Fragment>
          {props.multi
            ? state.values &&
              state.values.map(item => (
                <Option
                  key={`${getByPath(item, props.valueField)}${getByPath(item, props.labelField)}`}
                  item={item}
                  methods={methods}
                  props={props}
                  state={state}
                />
              ))
            : state.values &&
              state.values.length > 0 && (
                <span>{getByPath(state.values[0], props.labelField)}</span>
              )}
          <Input methods={methods} props={props} state={state} />
        </React.Fragment>
      )}
    </ContentComponent>
  );
}

Content.propTypes = { ...ComponentProps };

export default Content;
