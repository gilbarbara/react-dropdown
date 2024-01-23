import { MouseEvent } from 'react';
import styled from '@emotion/styled';

import { SLUG } from '~/config';

import { getTextColor, hexToRGBA } from '~/modules/colors';
import { matchOptions } from '~/modules/helpers';

import { ComponentProps, Styles } from '~/types';

const StyledCreate = styled.div<Styles>`
  color: ${({ color }) => color};
  padding: 5px 10px;

  :hover,
  :focus {
    background-color: ${({ color }) => hexToRGBA(color, 0.1)};
    outline: none;
    cursor: pointer;
  }

  &.${SLUG}-create-active {
    background-color: ${({ color }) => color};
    color: ${({ color }) => getTextColor(color)};
  }
`;

export default function Create(props: ComponentProps): JSX.Element | null {
  const {
    methods: { createItem, getLabels, getStyles },
    props: { create, options },
    state: { cursor, search, values },
  } = props;
  const shouldRender = create && search && !matchOptions([...values, ...options], search, false);

  const { create: createLabel } = getLabels();

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    createItem(search);
  };

  if (!shouldRender) {
    return null;
  }

  const classes = [`${SLUG}-create`];

  if (cursor === 0) {
    classes.push(`${SLUG}-create-active`);
  }

  return (
    <StyledCreate
      className={classes.join(' ')}
      data-component-name="DropdownCreate"
      onClick={handleClick}
      role="button"
      {...getStyles()}
    >
      {createLabel.replace('{search}', `"${search}"`)}
    </StyledCreate>
  );
}
