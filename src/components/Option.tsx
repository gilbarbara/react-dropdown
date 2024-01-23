import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { defaultProps, SLUG } from '~/config';

import { getTextColor } from '~/modules/colors';
import { getOptionData, getStyles } from '~/modules/helpers';

import Times from '~/icons/Times';
import { Direction, OptionComponentProps, Styles } from '~/types';

const StyledOption = styled.span<Styles & { direction: Direction }>(props => {
  const { color, direction } = props;

  return css`
    align-items: center;
    background-color: ${color};
    border-radius: 2px;
    color: ${getTextColor(color)};
    display: flex;
    flex-direction: ${direction === 'rtl' ? 'row-reverse' : 'row'};
    line-height: 1;
    margin: 3px 6px 3px 0;
    padding: 4px;

    :hover,
    :hover > span {
      opacity: 0.9;
    }
  `;
});

const RemoveButton = styled.button<Styles>`
  align-items: center;
  appearance: none;
  background-color: transparent;
  border: none;
  color: ${({ color }) => getTextColor(color)};
  cursor: pointer;
  display: inline-flex;
  height: 16px;
  justify-content: center;
  margin-left: 4px;
  padding: 0;
  width: 16px;
`;

export default function Option(props: OptionComponentProps) {
  const {
    item,
    methods: { removeItem },
    props: {
      closeOnSelect = defaultProps.closeOnSelect,
      direction = defaultProps.direction,
      optionComponent,
      styles,
    },
  } = props;

  if (optionComponent) {
    return optionComponent(props);
  }

  return (
    <StyledOption
      className={`${SLUG}-option`}
      data-component-name="DropdownOption"
      direction={direction}
      role="listitem"
      {...getStyles(styles)}
    >
      <span className={`${SLUG}-option-label`}>{getOptionData(item, 'label')}</span>
      <RemoveButton
        className={`${SLUG}-option-remove`}
        data-component-name="DropdownOptionRemove"
        onClick={event => removeItem(event, item, closeOnSelect)}
        role="presentation"
        {...getStyles(styles)}
      >
        <Times />
      </RemoveButton>
    </StyledOption>
  );
}
