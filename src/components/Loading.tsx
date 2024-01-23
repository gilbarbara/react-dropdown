import styled from '@emotion/styled';

import { SLUG } from '~/config';

import { getTextColor } from '~/modules/colors';
import { getComponentMinHeight } from '~/modules/helpers';

import Spinner from '~/icons/Spinner';
import { ComponentProps, Styles } from '~/types';

const StyledLoading = styled.div<Styles>`
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  align-items: center;
  color: ${({ bgColor }) => getTextColor(bgColor)};
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  min-height: ${({ minHeight }) => getComponentMinHeight(minHeight)};
  width: 24px;

  path:nth-of-type(1) {
    transform-origin: 50% 50%;
    animation: spin 1s linear infinite;
  }
`;

function Loading(props: ComponentProps) {
  const {
    methods: { getStyles },
    props: { loaderComponent },
  } = props;

  if (loaderComponent) {
    return loaderComponent(props);
  }

  return (
    <StyledLoading className={`${SLUG}-loading`} {...getStyles()}>
      <Spinner />
    </StyledLoading>
  );
}

export default Loading;
