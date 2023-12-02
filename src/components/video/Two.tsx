import React from "react";
import { useRef, useEffect } from "react";
import styled from "styled-components";
import { WebRTCUser } from "../../types";

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

type Props = {
  userLeft: WebRTCUser;
  userRight: WebRTCUser;
};

export default function Two({ userLeft, userRight }: Props) {
  const refLeft = useRef<HTMLVideoElement>(null);
  const refRight = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (refLeft.current) refLeft.current.srcObject = userLeft.stream;
    if (refRight.current) refRight.current.srcObject = userRight.stream;
  }, [userLeft.stream, userRight.stream]);

  return (
    <Container>
      <VideoListContainer>
        <VideoContainer>
          <Video ref={refLeft} autoPlay></Video>
        </VideoContainer>
        <VideoContainer>
          <Video ref={refRight} autoPlay></Video>
        </VideoContainer>
      </VideoListContainer>
    </Container>
  );
}
