import { MouseEvent } from 'react';
import styled from '@emotion/styled';

import { SLUG } from '~/config';

import { getTextColor } from '~/modules/colors';
import { getComponentMinHeight, getOptionData } from '~/modules/helpers';

import { ComponentProps, Styles } from '~/types';

import Input from './Input';
import Option from './Option';

const StyledContent = styled.div<Styles>`
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  min-height: ${({ minHeight }) => getComponentMinHeight(minHeight)};
  padding: 2px ${({ spacingX }) => spacingX};

  > span + input {
    margin-left: 6px;
  }
`;

const StyledSingleOption = styled.span<Styles>`
  align-items: center;
  align-self: stretch;
  box-sizing: border-box;
  color: ${({ bgColor }) => getTextColor(bgColor)};
  display: inline-flex;
  justify-content: center;
`;

export default function Content(props: ComponentProps) {
  const {
    methods: { getStyles, setStatus },
    props: { contentComponent, multi, onClickSelector, searchable },
    state: { status, values },
  } = props;

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setStatus('toggle', event);

    if (onClickSelector) {
      onClickSelector(status);
    }
  };

  return (
    <StyledContent
      className={`${SLUG}-content ${multi ? `${SLUG}-type-multi` : `${SLUG}-type-single`}`}
      onClick={handleClick}
      {...getStyles()}
    >
      {contentComponent ? (
        contentComponent(props)
      ) : (
        <>
          {multi
            ? values.map(item => (
                <Option
                  key={`${getOptionData(item, 'label')}${getOptionData(item, 'value')}`}
                  item={item}
                  {...props}
                />
              ))
            : !!values.length && (
                <StyledSingleOption data-component-name="DropdownSingleOption" {...getStyles()}>
                  {getOptionData(values[0], 'label')}
                </StyledSingleOption>
              )}
          {(!values.length || searchable) && <Input {...props} />}
        </>
      )}
    </StyledContent>
  );
}
