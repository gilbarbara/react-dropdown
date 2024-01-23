import { MouseEvent } from 'react';
import isPropValid from '@emotion/is-prop-valid';
import styled from '@emotion/styled';

import { SLUG } from '~/config';

import { getTextColor } from '~/modules/colors';
import { getComponentMinHeight } from '~/modules/helpers';

import Arrow from '~/icons/Arrow';
import { ComponentProps, Styles } from '~/types';

const StyledHandle = styled('div', {
  shouldForwardProp: prop => isPropValid(prop) && prop !== 'rotate',
})<Styles & { status: boolean }>`
  align-self: stretch;
  align-items: start;
  color: ${({ bgColor }) => getTextColor(bgColor)};
  cursor: pointer;
  display: flex;

  :hover {
    path {
      fill: ${({ hoverColor }) => hoverColor};
    }
  }

  :focus {
    outline: none;

    path {
      fill: ${({ hoverColor }) => hoverColor};
    }
  }

  > div {
    align-items: center;
    display: inline-flex;
    height: ${({ minHeight }) => getComponentMinHeight(minHeight)};
    justify-content: center;
    min-width: 30px;
    transition: transform 0.2s ease-in-out;
    transform: rotate(${({ status }) => (status ? 180 : 0)}deg);
  }
`;

export default function Handle(props: ComponentProps) {
  const {
    methods: { getDropdownRef, getLabels, getStyles, setStatus },
    props: { handleComponent, onClickSelector },
    state: { status },
  } = props;
  const { toggle } = getLabels();

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    getDropdownRef()?.focus();
    setStatus('toggle', event);

    if (onClickSelector) {
      onClickSelector(status);
    }
  };

  return (
    <StyledHandle
      aria-label={toggle}
      className={`${SLUG}-handle`}
      data-component-name="DropdownHandle"
      onClick={handleClick}
      status={status}
      tabIndex={0}
      title={toggle}
      {...getStyles()}
    >
      <div>{handleComponent ? handleComponent(props) : <Arrow />}</div>
    </StyledHandle>
  );
}
