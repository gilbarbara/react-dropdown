import Dropdown from "@gilbarbara/react-dropdown";
import { options } from "../config";

import { Title, Wrapper } from "./styled";

export default function CustomStyles() {
  return (
    <Wrapper>
      <Title>Custom Styles</Title>
      <Dropdown
        options={options}
        styles={{
          bgColor: "#333",
          borderColor: "#000",
          borderRadius: 2,
          color: "#ff0044",
          disabledItemBgColor: "#666",
          disabledItemColor: "#000",
          gap: 0,
          menuMaxHeight: 200,
          minHeight: 48,
          placeholderColor: "#ccc",
          spacingX: 18,
          spacingY: 12,
          width: 320
        }}
      />
    </Wrapper>
  );
}
