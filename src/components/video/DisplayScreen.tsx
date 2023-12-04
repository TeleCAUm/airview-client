import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { useWebRTC } from "../../context/WebRTCContext";

type props = {
  focusScreen: string;
  handleFocus: (focusScreen: string) => void;
};

const DisplayScreen = ({ focusScreen, handleFocus }: props) => {
  const [users, dispatch] = useWebRTC();
  const refs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    refs.current = refs.current.slice(0, users.length);
  }, [users, focusScreen]);

  useEffect(() => {
    users.forEach((user, idx) => {
      const ref = refs.current[idx];
      if (ref) ref.srcObject = user.stream;
    });
  }, [users, focusScreen]);

  const columns = Math.ceil(Math.sqrt(users.length));
  const rows = Math.ceil(users.length / columns);
  if (focusScreen !== "" && users.length > 1) {
    return (
      <Container>
        {users.map((user, idx) => {
          if (focusScreen === user.id) {
            return (
              <VideoContainer
                key={user.id}
                onClick={() => {
                  handleFocus(user.id);
                }}
              >
                <Video
                  ref={(ref) => (refs.current[idx] = ref)}
                  autoPlay
                ></Video>
              </VideoContainer>
            );
          }
        })}
      </Container>
    );
    // focus view
  }

  return (
    // tile view
    <GridContainer columns={columns} rows={rows}>
      {users.map((user, idx) => {
        if (users.length === 3 && idx === 2) {
          return (
            <VideoContainer
              key={user.id}
              style={{
                gridColumn: "span 2",
                gridRow: "auto / span 2",
              }}
              onClick={() => {
                handleFocus(user.id);
              }}
            >
              <Video ref={(ref) => (refs.current[idx] = ref)} autoPlay></Video>
            </VideoContainer>
          );
        }
        return (
          <VideoContainer
            key={user.id}
            onClick={() => {
              handleFocus(user.id);
            }}
          >
            <Video ref={(ref) => (refs.current[idx] = ref)} autoPlay></Video>
          </VideoContainer>
        );
      })}
    </GridContainer>
  );
};

export default DisplayScreen;

const GridContainer = styled.div<{
  columns: number;
  rows: number;
}>`
  position: relative;
  width: 100vw;
  height: 100vh;
  display: grid;
  place-items: center;
  grid-template-columns: repeat(${(props) => props.columns}, 1fr);
  grid-template-rows: repeat(${(props) => props.rows}, 1fr);
  row-gap: 0.1vw;
  column-gap: 0.1vh;
  background-color: gray;
`;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justyify-content: center;
  background-color: gray;
`;

const VideoContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgb(172, 172, 172);
  display: flex;
  justify-content: center;
`;

const Video = styled.video`
  width: 100%;
  object-fit: contain;
  cursor: pointer;
`;
