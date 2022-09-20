import Dropdown from "@gilbarbara/react-dropdown";
import { options } from "../config";

import { Title, Wrapper } from "./styled";

export default function MenuPosition() {
  return (
    <Wrapper>
      <Title>MenuPosition: Auto</Title>
      <Dropdown options={options} menuPosition="auto" />
    </Wrapper>
  );
}
