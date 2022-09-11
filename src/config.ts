import isPropValid from '@emotion/is-prop-valid';
import isEqual from '@gilbarbara/deep-equal';
import { SetRequired } from 'type-fest';

import { Props } from '~/types';

export const SLUG = 'react-dropdown';

export const defaultProps: SetRequired<
  Omit<Props, 'options'>,
  'closeOnSelect' | 'comparatorFn' | 'direction' | 'menuPosition' | 'values'
> = {
  autoFocus: true,
  clearOnClose: true,
  clearOnSelect: true,
  closeOnScroll: false,
  closeOnSelect: false,
  comparatorFn: isEqual,
  create: false,
  direction: 'ltr' as const,
  disabled: false,
  hideHandle: false,
  keepSelectedInList: true,
  loading: false,
  menuPosition: 'bottom' as const,
  multi: false,
  placeholder: 'Select...',
  searchable: true,
  searchBy: 'label',
  secondaryPlaceholder: '',
  showClearButton: false,
  showSeparator: false,
  values: [],
};

export const styledOptions = {
  shouldForwardProp: (prop: string) =>
    isPropValid(prop) &&
    ![
      'color',
      'direction',
      'onClearAll',
      'onCreate',
      'onClose',
      'onOpen',
      'onSelectAll',
      'spacing',
      'width',
    ].includes(prop),
};
