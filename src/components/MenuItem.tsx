import { MouseEvent, useEffect, useRef } from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { SLUG } from '~/config';

import { getTextColor, hexToRGBA } from '~/modules/colors';
import { getOptionData } from '~/modules/helpers';

import { ItemComponentProps, Props, Styles } from '~/types';

const StyledMenuItem = styled.div<Styles & Required<Pick<Props, 'disabled'>>>(props => {
  const {
    bgColor,
    color,
    disabled,
    disabledItemBgColor,
    disabledItemColor,
    hoverColor,
    hoverOpacity,
    spacingX,
    spacingY,
  } = props;

  return css`
    color: ${getTextColor(bgColor)};
    cursor: pointer;
    padding: ${spacingY} ${spacingX};

    &.${SLUG}-item-active {
      ${!disabled && `background-color: ${hexToRGBA(color, 0.2)};`}
    }

    + div {
      border-top: 1px solid #fff;
    }

    :hover,
    :focus {
      background-color: ${hexToRGBA(hoverColor, hoverOpacity)};
      outline: none;
    }

    &.${SLUG}-item-selected {
      background-color: ${color};
      color: ${getTextColor(color)};

      &.${SLUG}-item-active {
        background-color: ${hexToRGBA(color, 0.9)};
      }
    }

    ${disabled &&
    css`
      background-color: ${disabledItemBgColor} !important;
      color: ${disabledItemColor} !important;
      cursor: not-allowed;

      ins {
        border-radius: 2px;
        border: 1px solid ${disabledItemColor};
        font-size: x-small;
        padding: 0 3px;
        text-decoration: none;
        text-transform: uppercase;
      }
    `}
  `;
});

export default function MenuItem(props: ItemComponentProps) {
  const {
    item,
    itemIndex,
    methods: { addItem, getLabels, getStyles, isSelected, removeItem },
    props: { keepSelectedInList, menuItemComponent },
    state: { cursor },
  } = props;
  const ref = useRef<HTMLDivElement>(null);
  const disabled = item.disabled || false;
  const { disabled: disabledLabel } = getLabels();

  useEffect(() => {
    if (cursor === itemIndex) {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  }, [cursor, itemIndex]);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();

    if (disabled) {
      return;
    }

    if (isSelected(item)) {
      removeItem(null, item, false);
    } else {
      addItem(item);
    }
  };

  if (menuItemComponent) {
    return menuItemComponent(props);
  }

  if (!keepSelectedInList && isSelected(item)) {
    return null;
  }

  const classes = [`${SLUG}-item`];

  if (isSelected(item)) {
    classes.push(`${SLUG}-item-selected`);
  }

  if (cursor === itemIndex) {
    classes.push(`${SLUG}-item-active`);
  }

  if (disabled) {
    classes.push(`${SLUG}-item-disabled`);
  }

  return (
    <StyledMenuItem
      key={`${getOptionData(item, 'value')}${getOptionData(item, 'label')}`}
      ref={ref}
      aria-disabled={disabled}
      aria-label={getOptionData(item, 'label')}
      aria-selected={isSelected(item)}
      className={classes.join(' ')}
      data-component-name="DropdownMenuItem"
      disabled={disabled}
      onClick={handleClick}
      role="option"
      tabIndex={-1}
      {...getStyles()}
      style={item.style}
    >
      {getOptionData(item, 'label')} {disabled && <ins>{disabledLabel}</ins>}
    </StyledMenuItem>
  );
}
