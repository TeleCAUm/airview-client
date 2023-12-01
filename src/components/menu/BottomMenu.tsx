import React, { useState } from "react";
import styled from "styled-components";

const BottomMenu = () => {
  const [showBottomMenu, setShowBottomMenu] = useState(false);

  document.addEventListener("mousemove", function (e) {
    var windowHeight = window.innerHeight;
    var mouseY = e.clientY;

    if (mouseY > windowHeight - 50) {
      setShowBottomMenu(true);
    } else {
      setShowBottomMenu(false);
    }
  });

  if (showBottomMenu) {
    return (
      <Wrapper>
        <MenuBtn>화면 공유</MenuBtn>
        <MenuBtn>초대</MenuBtn>
        <MenuBtn>토글</MenuBtn>
        <MenuBtn>나가기</MenuBtn>
      </Wrapper>
    );
  }
  return <HiddenWrapper>Plz be hidden</HiddenWrapper>;
};

export default BottomMenu;

const HiddenWrapper = styled.div`
  position: fixed;
  bottom: -100px;
  width: 100%;
  transition: bottom 0.5s;
`;

const Wrapper = styled.div`
  position: fixed;
  width: auto;
  height: auto;
  bottom: 0px;
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
  width: 80px;
  height: 40px;
  border-radius: 5px;
  border: none;
  text-align: center;
  cursor: pointer;
  margin: 10px;
`;
