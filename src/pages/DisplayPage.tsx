import React, { useState } from "react";
import { usePeerConnection } from "../hooks/usePeerConnection";
import One from "../components/video/One";
import Two from "../components/video/Two";
import Three from "../components/video/Three";
import Four from "../components/video/Four";
import Multiple from "../components/video/Four";
import styled from "styled-components";
import BottomMenu from "../components/menu/BottomMenu";
import DrawingMenu from "../components/menu/DrawingMenu";
import ParticipantMenu from "../components/menu/ParticipantMenu";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const DisplayPage = () => {
  const { users, localVideoRef, getLocalStream } = usePeerConnection();
  const [openTgl, setOpenTgl] = useState(false);

  console.log(users.length);

  let a;

  if (users.length === 0) {
    a = (
      <Container>
        <VideoContainer>
          <Video ref={localVideoRef} autoPlay></Video>
        </VideoContainer>
      </Container>
    );
  } else if (users.length === 1) {
    a = <One user={users[0]}></One>;
  } else if (users.length === 2) {
    a = <Two userLeft={users[0]} userRight={users[1]}></Two>;
  } else if (users.length === 3) {
    a = (
      <Three
        userLeft={users[0]}
        userRight={users[1]}
        userBottom={users[2]}
      ></Three>
    );
  } else if (users.length >= 4) {
    a = (
      <Four
        userTopLeft={users[0]}
        userTopRight={users[1]}
        userBottomLeft={users[2]}
        userBottomRight={users[3]}
      ></Four>
    );
  }

  return (
    <div>
      <MenuWrapper>
        <BottomMenu />
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
      {a}
    </div>
  );
};

// {openTgl && <ParticipantMenu />}
export default DisplayPage;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: gray;

  display: flex;
`;

const VideoContainer = styled.div`
  width: 100%;
  height: 100%;

  background-color: rgb(172, 172, 172);

  display: flex;
`;

const Video = styled.video`
  width: 100%;
  object-fit: contain;
`;

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
