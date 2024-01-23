import { useEffect, useRef, useState } from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { SLUG } from '~/config';

import { hexToRGBA } from '~/modules/colors';
import { getPosition, px } from '~/modules/helpers';

import { AnyObject, ComponentProps, Position, Styles } from '~/types';

import Create from './Create';
import MenuItem from './MenuItem';
import NoData from './NoData';

const StyledMenu = styled('div')<
  Styles & {
    dropdownBounds: DOMRect | AnyObject;
    isVisible: boolean;
    position: Position;
  }
>(props => {
  const {
    bgColor,
    borderColor,
    borderRadius,
    dropdownBounds,
    gap,
    isVisible,
    menuMaxHeight,
    position,
  } = props;
  const borderWidth = 2;

  return css`
    background-color: ${bgColor};
    border-radius: ${borderRadius};
    border: 1px solid ${borderColor};
    box-shadow: 0 0 10px 0 ${hexToRGBA('#000000', 0.2)};
    display: flex;
    flex-direction: column;
    left: -1px;
    max-height: ${px(menuMaxHeight)};
    opacity: ${isVisible ? 1 : 0};
    overflow: auto;
    position: absolute;
    width: ${dropdownBounds.width}px;
    z-index: 9;
    ${
      position === 'top'
        ? `bottom: ${dropdownBounds.height + borderWidth + gap}px`
        : `top: ${dropdownBounds.height + borderWidth + gap}px`
    };

    :focus {
      outline: none;
    }
  }
  `;
});

function Menu(props: ComponentProps) {
  const {
    methods: { getStyles },
    props: { menuComponent },
    state: { dropdownBounds, searchResults },
  } = props;
  const listRef = useRef<HTMLDivElement>(null);
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const position = getPosition(props, listRef.current);

  return (
    <StyledMenu
      ref={listRef}
      className={`${SLUG}-menu ${SLUG}-menu-position-${position}`}
      data-component-name="DropdownMenu"
      dropdownBounds={dropdownBounds}
      isVisible={isVisible}
      position={position}
      role="list"
      tabIndex={-1}
      {...getStyles()}
    >
      {menuComponent ? (
        menuComponent(props)
      ) : (
        <>
          <Create {...props} />
          {searchResults.length ? (
            searchResults.map((item, itemIndex) => (
              <MenuItem key={item.value} item={item} itemIndex={itemIndex} {...props} />
            ))
          ) : (
            <NoData {...props} />
          )}
        </>
      )}
    </StyledMenu>
  );
}

export default Menu;
