import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { useWebRTC } from "../../context/WebRTCContext";

const ParticipantMenu = () => {
  const [users, dispatch] = useWebRTC();

  return (
    <ParticipantListContainer>
      <ParticipantList>
        {users.map((user) => {
          return <Participant>{user.id}</Participant>;
        })}
      </ParticipantList>
    </ParticipantListContainer>
  );
};
export default ParticipantMenu;

const ParticipantListContainer = styled.div`
  position: fixed;
  top: 0px;
  right: 0px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: rgba(200, 200, 200, 0.609);
  overflow: auto;
  z-index: 100;
`;

const ParticipantList = styled.div`
  max-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  justify-content: flex-start;
  overflow-y: scroll;
`;

const Participant = styled.div`
  height: 100px;
  width: 180px;
  margin: 10px;
  background-color: rgb(82, 82, 82);
  flex-shrink: 0;
`;
