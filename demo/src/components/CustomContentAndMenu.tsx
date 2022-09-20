import Dropdown, { ComponentProps } from "@gilbarbara/react-dropdown";
import styled from "@emotion/styled";

import { options } from "../config";

import { Title, Wrapper } from "./styled";

const SearchAndToggle = styled.div`
  display: flex;
  flex-direction: column;

  input {
    border-radius: 3px;
    border: 1px solid #ccc;
    line-height: 30px;
    margin: 10px 10px 0;
    padding: 0 12px;

    :focus {
      outline: none;
      border: 1px solid deepskyblue;
    }
  }
`;

const StyledMenu = styled.div`
  max-height: 200px;
  min-height: 10px;
  overflow: auto;
`;

const MenuItem = styled.div<{ disabled: boolean }>`
  align-items: baseline;
  display: flex;
  margin: 10px;
  ${({ disabled }) => disabled && "text-decoration: line-through;"}
`;

const MenuItemLabel = styled.div`
  margin: 5px 10px;
`;

const Buttons = styled.div`
  align-items: flex-start;
  display: flex;
  justify-content: space-between;
  padding: 10px 10px 0;

  > div {
    font-weight: 600;
  }
`;

const Button = styled.button`
  background: none;
  border-radius: 3px;
  border: 1px solid #555;
  color: #555;
  cursor: pointer;
  font-size: 10px;
  margin-right: 10px;
  outline: none;
  padding: 3px 5px;
  text-transform: uppercase;

  &.clear {
    color: tomato;
    border: 1px solid tomato;
  }

  :hover {
    border: 1px solid deepskyblue;
    color: deepskyblue;
  }
`;

function Content({ props, state }: ComponentProps) {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {state.values.length} of {props.options.length} selected
    </div>
  );
}

function Menu({
  methods: {
    addItem,
    areAllSelected,
    clearAll,
    getOptionData,
    getStyles,
    isSelected,
    selectAll,
    setSearch
  },
  props: { keepSelectedInList, options: optionsProp, searchBy = "label" },
  state: { search, values }
}: ComponentProps) {
  const regexp = new RegExp(search, "i");

  return (
    <div>
      <SearchAndToggle color={getStyles().color}>
        <Buttons>
          <div>Search and select:</div>
          <div>
            {areAllSelected() ? (
              <Button className="clear" onClick={clearAll}>
                Clear all
              </Button>
            ) : (
              <Button onClick={() => selectAll()}>Select all</Button>
            )}
          </div>
        </Buttons>
        <input
          type="text"
          value={search}
          onChange={setSearch}
          placeholder="Type anything"
        />
      </SearchAndToggle>
      <StyledMenu>
        {optionsProp
          .filter((item) => regexp.test(`${getOptionData(item, searchBy)}`))
          .map((option) => {
            if (!keepSelectedInList && isSelected(option)) {
              return null;
            }

            return (
              <MenuItem
                disabled={!!option.disabled}
                key={option.value}
                onClick={option.disabled ? undefined : () => addItem(option)}
              >
                <input
                  type="checkbox"
                  onChange={() =>
                    option.disabled ? undefined : addItem(option)
                  }
                  checked={values.indexOf(option) !== -1}
                />
                <MenuItemLabel>{option.label}</MenuItemLabel>
              </MenuItem>
            );
          })}
      </StyledMenu>
    </div>
  );
}

export default function CustomContentAndMenu() {
  return (
    <Wrapper>
      <Title>Custom Content and Menu</Title>
      <Dropdown
        menuComponent={Menu}
        menuPosition="auto"
        multi
        options={options}
        contentComponent={Content}
      />
    </Wrapper>
  );
}
