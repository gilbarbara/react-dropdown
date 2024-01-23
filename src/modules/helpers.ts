import innerText from 'react-innertext';

import { defaultProps } from '~/config';

import { ComponentProps, Labels, Option, OptionKeys, Position, Styles } from '~/types';

export function canUseDOM(): boolean {
  return !!(typeof window !== 'undefined' && window.document && window.document.createElement);
}

export function debounce(fn: (...input: any[]) => void, delay = 0) {
  let timerId: number;

  return (...arguments_: any[]) => {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = window.setTimeout(() => {
      fn(...arguments_);
      timerId = 0;
    }, delay);
  };
}

export function getAllOptions(options: Option[], values: Option[]) {
  const nextValues = options.filter(option => !option.disabled);

  if (values.length) {
    values.forEach(value => {
      if (!nextValues.some(option => option.value === value.value)) {
        nextValues.push(value);
      }
    });
  }

  return nextValues;
}

export function getComponentMinHeight(minHeight: number, amount = 2): string {
  return px(minHeight - amount);
}

export function getCursor(cursor: number | null, type: 'down' | 'up', values: Option[] = []) {
  const total = values.length;
  const lastValidIndex = values.map(item => !!item.disabled).lastIndexOf(false);
  const disabled = values.reduce<number[]>((acc, value, index) => {
    if (value.disabled) {
      acc.push(index);
    }

    return acc;
  }, []);

  const getNextCursor = (nextCursor: number): number => {
    if (type === 'down') {
      if (nextCursor === total) {
        return 0;
      }

      if (disabled.includes(nextCursor)) {
        return getNextCursor(nextCursor + 1);
      }
    } else if (type === 'up') {
      if (nextCursor < 0) {
        return lastValidIndex;
      }

      if (disabled.includes(nextCursor)) {
        return getNextCursor(nextCursor - 1);
      }
    }

    return nextCursor;
  };

  if (cursor === null) {
    return type === 'down' ? 0 : lastValidIndex;
  } else if (type === 'down') {
    return getNextCursor(cursor + 1);
  } else if (type === 'up') {
    return getNextCursor(cursor - 1);
  }

  return cursor;
}

export function getLabels(labels?: Partial<Labels>): Labels {
  const {
    clear = 'Clear',
    create = 'Add {search}',
    disabled = 'disabled',
    noData = 'No data',
    toggle = 'Toggle',
  } = labels || {};

  return {
    clear,
    create,
    disabled,
    noData,
    toggle,
  };
}

export function getOptionData(input: Option, key: 'label'): string;
export function getOptionData(input: Option, key: 'value'): string | number;

export function getOptionData(input: Option, key: OptionKeys): string | number {
  const value = input[key];

  if (!isString(value) && !isNumber(value)) {
    return innerText(value);
  }

  return value;
}

export function getPosition(props: ComponentProps, list: HTMLDivElement | null): Position {
  const {
    methods: { getDropdownRef, getStyles: getStylesMethod },
    props: { menuPosition = defaultProps.menuPosition },
  } = props;

  const dropdown = getDropdownRef();
  const { gap } = getStylesMethod();
  const spacing = 16;

  if (menuPosition !== 'auto' || !list || !dropdown) {
    return menuPosition;
  }

  const { bottom } = dropdown.getBoundingClientRect();
  const { height } = list.getBoundingClientRect();
  const viewportHeight = isomorphicWindow().innerHeight;

  const totalHeight = bottom + height + gap + spacing;

  if (totalHeight > viewportHeight) {
    return 'top';
  }

  return 'bottom';
}

export function getStyles(styles?: Partial<Styles>): Styles {
  const {
    bgColor = '#fff',
    borderColor = '#ccc',
    borderRadius = '4px',
    color = '#1E90FF',
    disabledItemBgColor = '#f2f2f2',
    disabledItemColor = '#999',
    gap = 2,
    hoverColor,
    hoverOpacity = 0.2,
    menuMaxHeight = 300,
    minHeight = 36,
    placeholderColor = '#999',
    spacingX = 12,
    spacingY = 8,
    width = '100%',
  } = styles || {};

  return {
    bgColor,
    borderColor,
    borderRadius: px(borderRadius),
    color,
    disabledItemBgColor,
    disabledItemColor,
    gap,
    hoverColor: hoverColor || color,
    hoverOpacity,
    menuMaxHeight,
    minHeight,
    placeholderColor,
    spacingX: px(spacingX),
    spacingY: px(spacingY),
    width: px(width),
  };
}

export function isomorphicWindow() {
  if (typeof window === 'undefined') {
    return {
      innerHeight: 0,
    };
  }

  return window;
}

export function isNumber(input: any): input is number {
  return typeof input === 'number';
}

export function isString(input: any): input is string {
  return typeof input === 'string';
}

export function matchOptions(options: Option[], search: string | number, strict = true) {
  return options.some(d => {
    const label = strict
      ? getOptionData(d, 'label') === search
      : getOptionData(d, 'label').includes(String(search));
    const value = strict
      ? getOptionData(d, 'value') === search
      : String(getOptionData(d, 'value')).includes(String(search));

    return label || value;
  });
}

export function parseNumber(input: string | number) {
  if (isString(input)) {
    return parseInt(input, 10);
  }

  return input;
}

export function px(input: string | number): string {
  return isString(input) ? input : `${input}px`;
}
