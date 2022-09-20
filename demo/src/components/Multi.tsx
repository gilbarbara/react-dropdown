import Dropdown from "@gilbarbara/react-dropdown";
import { options } from "../config";

import { Title, Wrapper } from "./styled";

export default function Basic() {
  return (
    <Wrapper>
      <Title>Multi selection</Title>
      <Dropdown multi options={options} />
    </Wrapper>
  );
}
