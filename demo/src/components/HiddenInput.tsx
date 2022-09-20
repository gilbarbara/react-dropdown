import { FormEvent, useState } from "react";
import Dropdown, { Option } from "@gilbarbara/react-dropdown";
import { options } from "../config";

import { Button, Title, Wrapper } from "./styled";

export default function HiddenInput() {
  const [selectedValue, setSelectValue] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const options = (event.target as HTMLFormElement).elements.namedItem(
      "options"
    ) as HTMLInputElement;

    setSelectValue(options?.value);
  };

  const handleChange = (values: Option[]) => {
    if (!values.length) {
      setSelectValue("");
    }
  };

  return (
    <Wrapper>
      <Title>Hidden input</Title>
      <form onSubmit={handleSubmit}>
        <Dropdown
          closeOnSelect
          hiddenInput={{ name: "options", required: true }}
          onChange={handleChange}
          options={options}
        />
        <p>Input value: {selectedValue}</p>
        <Button type="submit">Send</Button>
      </form>
    </Wrapper>
  );
}
