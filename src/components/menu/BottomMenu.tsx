import React, { useState } from "react";
import styled from "styled-components";
import { MdOutlineScreenShare } from "react-icons/md";
import { MdPersonAddAlt1 } from "react-icons/md";
import { LuLayoutGrid } from "react-icons/lu";
import { PiSignOutBold } from "react-icons/pi";

type props = {
  setFocusScreen: (focusScreen: string) => void;
};

const BottomMenu = ({ setFocusScreen }: props) => {
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
        <MenuBtn>
          <MdOutlineScreenShare />
        </MenuBtn>
        <MenuBtn>
          <MdPersonAddAlt1 />
        </MenuBtn>
        <MenuBtn
          onClick={() => {
            setFocusScreen("");
          }}
        >
          <LuLayoutGrid />
        </MenuBtn>
        <MenuBtn>
          <PiSignOutBold />
        </MenuBtn>
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
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 40px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  margin: 10px;
  svg {
    font-size: 20px;
  }
`;
