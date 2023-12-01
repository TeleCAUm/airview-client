import React, { useState } from "react";
import styled from "styled-components";
import ColorPick from "./ColorPick";
import { FaRegPenToSquare } from "react-icons/fa6";
import { LuEraser } from "react-icons/lu";
import { MdOutlineCancelPresentation } from "react-icons/md";

const DrawingMenu = () => {
  const [showDrawingMenu, setShowDrawingMenu] = useState(false);
  const [color, setColor] = useState("#FF8B8B");

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
        <MenuBtn>
          <FaRegPenToSquare />
        </MenuBtn>
        <MenuBtn>
          <LuEraser />
        </MenuBtn>
        <ColorPick color={color} setColor={setColor} />
        <StrokeSliderWrapper>
          <span>선 굵기</span>
          <input type="range" />
        </StrokeSliderWrapper>
        <MenuBtn>
          <MdOutlineCancelPresentation />
        </MenuBtn>
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
  transition: top 0.5s;
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
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90px;
  height: 40px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  margin: 10px;
  svg {
    font-size: 20px;
  }
`;

const StrokeSliderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 150px;
  height: 40px;
  border-radius: 5px;
  border: none;
  margin: 10px;
  svg {
    font-size: 20px;
  }
  span {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.8);
    margin: 3px;
  }
  input {
    width: 150px;
  }
`;
