import React, { useState } from "react";
import { usePeerConnection } from "../hooks/usePeerConnection";
import styled from "styled-components";
import DisplayScreen from "../components/video/DisplayScreen";
import BottomMenu from "../components/menu/BottomMenu";
import DrawingMenu from "../components/menu/DrawingMenu";
import ParticipantMenu from "../components/menu/ParticipantMenu";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useWebRTC } from "../context/WebRTCContext";

const DisplayPage = () => {
  const { localVideoRef, getLocalStream } = usePeerConnection();
  const [openTgl, setOpenTgl] = useState(false);
  const [focusScreen, setFocusScreen] = useState("");
  const [users, dispatch] = useWebRTC();

  console.log(users.length);

  const handleFocus = (id: string) => {
    setFocusScreen((prevId) => {
      if (prevId === id) return "";
      else return id;
    });
  };

  if (users.length === 0) {
    // local
    return (
      <div>
        <MenuWrapper>
          <BottomMenu setFocusScreen={setFocusScreen} />
          <DrawingMenu />
          <ToggleWrapper>
            <ToggleBtn
              openTgl={openTgl}
              onClick={() => {
                setOpenTgl((prevOpenTgl) => !prevOpenTgl);
              }}
            >
              {openTgl ? <IoIosArrowForward /> : <IoIosArrowBack />}
            </ToggleBtn>
            {openTgl && <ParticipantMenu />}
          </ToggleWrapper>
        </MenuWrapper>
        <Video ref={localVideoRef} autoPlay></Video>
      </div>
    );
  }

  return (
    <div>
      <MenuWrapper>
        <BottomMenu setFocusScreen={setFocusScreen} />
        <DrawingMenu />
        <ToggleWrapper>
          <ToggleBtn
            openTgl={openTgl}
            onClick={() => {
              setOpenTgl((prevOpenTgl) => !prevOpenTgl);
            }}
          >
            {openTgl ? <IoIosArrowForward /> : <IoIosArrowBack />}
          </ToggleBtn>
          {openTgl && <ParticipantMenu />}
        </ToggleWrapper>
      </MenuWrapper>
      <DisplayScreen focusScreen={focusScreen} handleFocus={handleFocus} />
    </div>
  );
};

export default DisplayPage;

const MenuWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const ToggleBtn = styled.button<{ openTgl: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  width: 30px;
  height: 30px;
  margin: 10px;
  right: ${({ openTgl }) => (openTgl ? "210px" : "0")};
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 5px;
  border: none;
  cursor: pointer;
  z-index: 100;
`;

const Video = styled.video`
  width: 100%;
  object-fit: contain;
`;
