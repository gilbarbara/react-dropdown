import Dropdown from "@gilbarbara/react-dropdown";
import { options } from "../config";

import { Title, Wrapper } from "./styled";

export default function Basic() {
  return (
    <Wrapper>
      <Title>Basic</Title>
      <Dropdown options={options} />
    </Wrapper>
  );
}
