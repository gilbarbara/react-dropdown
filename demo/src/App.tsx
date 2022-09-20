import "./styles.css";
import React from "react";
import styled from "@emotion/styled";

import Basic from "./components/Basic";
import Multi from "./components/Multi";
import CustomStyles from "./components/CustomStyles";
import CustomMenuItem from "./components/CustomMenuItem";
import CustomContentAndMenu from "./components/CustomContentAndMenu";
import MenuPosition from "./components/MenuPosition";
import RightToLeft from "./components/RightToLeft";
import ExternalControls from "./components/ExternalControls";
import HiddenInput from "./components/HiddenInput";

const H1 = styled.h1`
  text-align: center;
`;

export default function App() {
  return (
    <div className="App">
      <H1>@gilbarbara/react-dropdown</H1>
      <Basic />
      <Multi />
      <CustomStyles />
      <CustomMenuItem />
      <CustomContentAndMenu />
      <MenuPosition />
      <ExternalControls />
      <HiddenInput />
      <RightToLeft />
    </div>
  );
}
