import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { useWebRTC } from "../../context/WebRTCContext";

type props = {
  selections: string[];
  handleSelections: (id: string) => void;
};

const ParticipantMenu = ({ selections, handleSelections }: props) => {
  const [users, dispatch] = useWebRTC();
  const refs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    refs.current = refs.current.slice(0, users.length);
  }, [users]);

  useEffect(() => {
    users.forEach((user, idx) => {
      const ref = refs.current[idx];
      if (ref) ref.srcObject = user.stream;
    });
  }, [users]);

  return (
    <ParticipantListContainer>
      <ParticipantList>
        {users.map((user, idx) => {
          if (selections.includes(user.id)) {
            return (
              <>
                <VideoContainer
                  key={user.id}
                  onClick={() => {
                    handleSelections(user.id);
                  }}
                >
                  <Video ref={(ref) => (refs.current[idx] = ref)} autoPlay />
                </VideoContainer>
                <UserNameContainer>{user.name}</UserNameContainer>
              </>
            );
          }
          return (
            <>
              <VideoContainer
                key={user.id}
                onClick={() => {
                  handleSelections(user.id);
                }}
              >
                <Video
                  ref={(ref) => (refs.current[idx] = ref)}
                  style={{ filter: "brightness(0.5)" }}
                  autoPlay
                />
              </VideoContainer>
              <UserNameContainer>{user.name}</UserNameContainer>
            </>
          );
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
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: rgba(200, 200, 200, 0.609);
  overflow-y: scroll;
  z-index: 100;
`;

const ParticipantList = styled.div`
  max-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
`;

const VideoContainer = styled.div`
  height: 100px;
  width: 180px;
  diplay: flex;
  background-color: transparent;
  flex-direction: row;
  justify-content: center;
  text-align: center;
`;

const UserNameContainer = styled.div`
  text-align: center;
  font-family: NotoSansLight;
`;

const Video = styled.video`
  height: 100px;
  width: 90%;
  margin: 5px;
  object-fit: contain;
  cursor: pointer;
  background-color: rgb(82, 82, 82);
  flex-shrink: 0;
`;
