import styled from '@emotion/styled';

import { SLUG } from '~/config';

import { ComponentProps, Styles } from '~/types';

const StyledSeparator = styled.div<Styles>`
  align-self: stretch;
  background-color: ${({ borderColor }) => borderColor};
  display: block;
  width: 1px;
`;

export default function Separator(props: ComponentProps) {
  const {
    methods: { getStyles },
    props: { separatorComponent },
  } = props;

  if (separatorComponent) {
    return separatorComponent(props);
  }

  return <StyledSeparator className={`${SLUG}-separator`} {...getStyles()} />;
}
