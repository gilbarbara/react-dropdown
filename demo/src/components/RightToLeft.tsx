import Dropdown from "@gilbarbara/react-dropdown";
import { optionsAlt } from "../config";

import { Title, Wrapper } from "./styled";

export default function RightToLeft() {
  return (
    <Wrapper>
      <Title>Right to left</Title>
      <Dropdown direction="rtl" options={optionsAlt} />
    </Wrapper>
  );
}
