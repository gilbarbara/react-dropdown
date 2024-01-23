import { FocusEvent, KeyboardEvent, useEffect, useRef } from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { SLUG } from '~/config';

import { getTextColor } from '~/modules/colors';
import { matchOptions } from '~/modules/helpers';
import { usePrevious } from '~/modules/hooks';

import { ComponentProps, Styles } from '~/types';

const StyledInput = styled.input<Styles>(props => {
  const { bgColor, placeholderColor, readOnly, size } = props;

  return css`
    background-color: transparent;
    border: none;
    color: ${getTextColor(bgColor)};
    ${readOnly && 'cursor: pointer;'}
    font-size: inherit;
    line-height: inherit;
    padding: 0;
    width: ${`${size}ch`};

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: ${placeholderColor};
    }
  `;
});

function getPlaceholder({ props, state }: ComponentProps) {
  const { placeholder, searchable, secondaryPlaceholder } = props;
  const hasValues = state.values && state.values.length > 0;

  if (hasValues && secondaryPlaceholder && searchable) {
    return secondaryPlaceholder;
  }

  if (!hasValues) {
    return placeholder;
  } else if (!searchable) {
    return '';
  }

  return '';
}

export default function Input(props: ComponentProps) {
  const {
    methods: { createItem, getInputSize, getStyles, setSearch },
    props: { autoFocus, create, disabled, inputComponent, options, searchable },
    state: { cursor, search, status, values },
  } = props;
  const ref = useRef<HTMLInputElement>(null);
  const previousStatus = usePrevious(status);

  useEffect(() => {
    if (previousStatus !== status && status && autoFocus) {
      ref.current?.focus();
    }

    if (previousStatus !== status && !status) {
      ref.current?.blur();
    }
  }, [autoFocus, status, previousStatus]);

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    event.stopPropagation();

    if (!status) {
      ref.current?.blur();

      return;
    }

    ref.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (
      create &&
      event.key === 'Enter' &&
      !matchOptions([...values, ...options], search, false) &&
      search &&
      cursor === null
    ) {
      createItem(search);
    }
  };

  if (inputComponent) {
    return inputComponent({ ...props, inputRef: ref });
  }

  return (
    <StyledInput
      ref={ref}
      className={`${SLUG}-input`}
      data-component-name="DropdownInput"
      disabled={disabled}
      onBlur={handleBlur}
      onChange={setSearch}
      onKeyDown={handleKeyDown}
      placeholder={getPlaceholder(props)}
      readOnly={!searchable}
      size={getInputSize()}
      tabIndex={-1}
      value={search}
      {...getStyles()}
    />
  );
}
