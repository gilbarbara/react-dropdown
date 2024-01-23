import { MouseEvent } from 'react';
import styled from '@emotion/styled';

import { SLUG } from '~/config';

import { getTextColor } from '~/modules/colors';
import { getComponentMinHeight } from '~/modules/helpers';

import Times from '~/icons/Times';
import { ComponentProps, Styles } from '~/types';

const StyledClear = styled.div<Styles>`
  align-items: center;
  color: ${({ bgColor }) => getTextColor(bgColor)};
  display: inline-flex;
  justify-content: center;
  min-height: ${({ minHeight }) => getComponentMinHeight(minHeight)};
  width: 24px;

  :focus {
    outline: none;
  }

  :hover {
    fill: ${({ hoverColor }) => hoverColor};
  }
`;

export default function Clear(props: ComponentProps) {
  const {
    methods: { clearAll, getLabels, getStyles },
    props: { clearComponent },
  } = props;
  const { clear } = getLabels();

  if (clearComponent) {
    return clearComponent(props);
  }

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    clearAll();
  };

  return (
    <StyledClear
      aria-label={clear}
      className={`${SLUG}-clear`}
      data-component-name="DropdownClear"
      onClick={handleClick}
      title={clear}
      {...getStyles()}
    >
      <Times />
    </StyledClear>
  );
}
