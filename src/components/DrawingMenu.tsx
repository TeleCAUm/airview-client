import React, { useState } from "react";
import styled from "styled-components";

const DrawingMenu = () => {
  const [showDrawingMenu, setShowDrawingMenu] = useState(false);

  document.addEventListener("mousemove", function (e) {
    var mouseY = e.clientY;

    if (mouseY < 50) {
      setShowDrawingMenu(true);
    } else {
      setShowDrawingMenu(false);
    }
  });

  if (showDrawingMenu) {
    return (
      <Wrapper>
        <MenuBtn>펜</MenuBtn>
        <MenuBtn>지우개</MenuBtn>
        <MenuBtn>색상</MenuBtn>
        <MenuBtn>펜 굵기</MenuBtn>
        <MenuBtn>전체 지우기</MenuBtn>
      </Wrapper>
    );
  }
  return <HiddenWrapper>Plz be hidden</HiddenWrapper>;
};

export default DrawingMenu;

const HiddenWrapper = styled.div`
  position: fixed;
  top: -100px;
  width: 100%;
  transition: bottom 0.5s;
`;

const Wrapper = styled.div`
  position: fixed;
  width: auto;
  height: auto;
  top: 0px;
  margin: 10px;
  border-radius: 5px;
  border: none;
  background-color: rgba(0, 0, 0, 0.2);
  transition: bottom 0.5s;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: center;
  z-index: 100;
`;

const MenuBtn = styled.button`
  width: 90px;
  height: 40px;
  border-radius: 5px;
  border: none;
  text-align: center;
  cursor: pointer;
  margin: 10px;
`;
