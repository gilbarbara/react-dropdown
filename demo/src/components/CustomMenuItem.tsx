import Dropdown, { ItemComponentProps } from "@gilbarbara/react-dropdown";
import { options } from "../config";
import styled from "@emotion/styled";

import { Title, Wrapper } from "./styled";

const StyledMenuItem = styled.div`
  padding: 10px;
  color: #555;
  border-radius: 3px;
  margin: 3px;
  cursor: pointer;
  > div {
    display: flex;
    align-items: center;
  }
  input {
    margin-right: 10px;
  }
  :hover {
    background: #f2f2f2;
  }
`;

function MenuItem({ item, methods }: ItemComponentProps) {
  return (
    <StyledMenuItem>
      {item.disabled ? (
        <div aria-disabled>{item.label}</div>
      ) : (
        <div onClick={() => methods.addItem(item)}>
          <input
            onChange={() => methods.addItem(item)}
            type="checkbox"
            checked={methods.isSelected(item)}
          />{" "}
          {item.label}
        </div>
      )}
    </StyledMenuItem>
  );
}

export default function CustomMenuItem() {
  return (
    <Wrapper>
      <Title>Custom Menu Item</Title>
      <Dropdown multi menuItemComponent={MenuItem} options={options} />
    </Wrapper>
  );
}
