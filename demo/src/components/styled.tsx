import styled from "@emotion/styled";

export const Button = styled.button`
  appearance: none;
  background: transparent;
  border: 1px solid #777;
  border-radius: 4px;
  color: #777;
  margin: 0;
  overflow: visible;
  padding: 4px 8px;
  width: auto;
`;

export const Flex = styled.div`
  align-items: center;
  display: flex;

  > * + * {
    margin-left: 16px;
  }
`;

export const Title = styled.h3`
  margin: 0 0 8px;
`;

export const Wrapper = styled.div`
  max-width: 600px;
  margin: 0 auto 32px;
`;
