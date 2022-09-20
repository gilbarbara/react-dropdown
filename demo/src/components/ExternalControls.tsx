import { useState } from "react";
import Dropdown, { Option } from "@gilbarbara/react-dropdown";
import { options } from "../config";

import { Button, Flex, Title, Wrapper } from "./styled";

function getOption(values: Option[]): Option {
  const newOption = options[Math.floor(Math.random() * options.length)];

  if (values.some((v) => v.value === newOption.value || newOption.disabled)) {
    return getOption(values);
  }

  return newOption;
}

export default function CustomStyles() {
  const [isOpen, setOpen] = useState(false);
  const [values, setValues] = useState<Option[]>([options[0]]);

  const handleOnChange = (selectedValues: Option[]) => {
    setValues(selectedValues);
  };

  const handleClickSet = () => {
    setValues((s) => [...s, getOption(values)]);
  };

  const handleChangeToggle = () => {
    setOpen((s) => !s);
  };

  return (
    <Wrapper>
      <Title>External control</Title>
      <Flex>
        <label>
          <input
            type="checkbox"
            checked={isOpen}
            onChange={handleChangeToggle}
          />{" "}
          {isOpen ? "Close" : "Open"}
        </label>
        <p>
          Set values{" "}
          <Button onClick={handleClickSet}>
            <span role="img" aria-label="set">
              ➡️
            </span>{" "}
            set
          </Button>
        </p>
        <p>
          Reset values{" "}
          <Button onClick={() => handleOnChange([options[0]])}>
            <span role="img" aria-label="clear">
              ❌
            </span>{" "}
            clear
          </Button>
        </p>
      </Flex>
      <Dropdown
        multi
        onChange={handleOnChange}
        onClickSelector={handleChangeToggle}
        open={isOpen}
        options={options}
        values={values}
      />
    </Wrapper>
  );
}
