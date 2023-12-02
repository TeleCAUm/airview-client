import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { WebRTCUser } from "../../types";

type props = {
  participants: WebRTCUser[];
};

const DisplayScreen = ({ participants }: props) => {
  const videoRefs = useRef<Array<React.RefObject<HTMLVideoElement>>>([]);

  useEffect(() => {
    videoRefs.current.forEach((ref, index) => {
      if (ref.current) {
        ref.current.srcObject = participants[index].stream;
      }
    });
  }, [videoRefs, participants]);

  // participants, selectedScreen 따로 관리

  return (
    <Container>
      <VideoListContainer>
        {videoRefs.current.map((ref, index) => (
          <VideoContainer key={index}>
            <Video ref={ref} autoPlay></Video>
          </VideoContainer>
        ))}
      </VideoListContainer>
    </Container>
  );
};

export default DisplayScreen;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: gray;

  display: flex;
  flex-direction: column;
  justify-content: center;
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

const VideoListContainer = styled.div`
  height: 50%;
  width: 100%;
  display: flex;

  gap: 5px;
`;
