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

  gap: 5px;
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
  userBottom: WebRTCUser;
};

export default function Three({ userLeft, userRight, userBottom }: Props) {
  const refLeft = useRef<HTMLVideoElement>(null);
  const refRight = useRef<HTMLVideoElement>(null);
  const refBottom = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (refLeft.current) refLeft.current.srcObject = userLeft.stream;
    if (refRight.current) refRight.current.srcObject = userRight.stream;
    if (refBottom.current) refBottom.current.srcObject = userBottom.stream;
  }, [userLeft.stream, userRight.stream, userBottom.stream]);

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
      <VideoListContainer>
        <VideoContainer>
          <Video ref={refBottom} autoPlay></Video>
        </VideoContainer>
      </VideoListContainer>
    </Container>
  );
}
