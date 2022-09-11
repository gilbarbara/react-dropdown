import styled from '@emotion/styled';

import { SLUG } from '~/config';

import { ComponentProps, Styles } from '~/types';

const StyledNoData = styled.div<Styles>`
  color: ${({ color }) => color};
  padding: 10px;
  text-align: center;
`;

function NoData(props: ComponentProps) {
  const {
    methods: { getLabels, getStyles },
    props: { noDataComponent },
  } = props;
  const { noData } = getLabels();

  if (noDataComponent) {
    return noDataComponent(props);
  }

  return (
    <StyledNoData
      className={`${SLUG}-no-data`}
      data-component-name="DropdownNoData"
      {...getStyles()}
    >
      {noData}
    </StyledNoData>
  );
}

export default NoData;
