import React from 'react'
import { useRef, useEffect } from 'react'
import styled from 'styled-components'
import { WebRTCUser } from '../types'

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: gray;

  display: flex;
  flex-direction: column;
  justify-content: center;

  gap: 5px;
`

const VideoContainer = styled.div`
  width: 100%;
  height: 100%;

  background-color: rgb(172, 172, 172);

  display: flex;
`

const Video = styled.video`
  width: 100%;
  object-fit: contain;
`

const VideoListContainer = styled.div`
  height: 50%;
  width: 100%;
  display: flex;

  gap: 5px;
`

type Props = {
  userTopLeft: WebRTCUser
  userTopRight: WebRTCUser
  userBottomLeft: WebRTCUser
  userBottomRight: WebRTCUser
}

export default function Three({
  userTopLeft,
  userTopRight,
  userBottomLeft,
  userBottomRight
}: Props) {
  const refTopLeft = useRef<HTMLVideoElement>(null)
  const refTopRight = useRef<HTMLVideoElement>(null)
  const refBottomLeft = useRef<HTMLVideoElement>(null)
  const refBottomRight = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (refTopLeft.current) refTopLeft.current.srcObject = userTopLeft.stream
    if (refTopRight.current) refTopRight.current.srcObject = userTopRight.stream
    if (refBottomLeft.current) refBottomLeft.current.srcObject = userBottomLeft.stream
    if (refBottomRight.current) refBottomRight.current.srcObject = userBottomRight.stream
  }, [userTopLeft.stream, userTopRight.stream, userBottomLeft.stream, userBottomRight.stream])

  return (
    <Container>
      <VideoListContainer>
        <VideoContainer>
          <Video ref={refTopLeft} autoPlay></Video>
        </VideoContainer>
        <VideoContainer>
          <Video ref={refTopRight} autoPlay></Video>
        </VideoContainer>
      </VideoListContainer>
      <VideoListContainer>
        <VideoContainer>
          <Video ref={refBottomLeft} autoPlay></Video>
        </VideoContainer>
        <VideoContainer>
          <Video ref={refBottomRight} autoPlay></Video>
        </VideoContainer>
      </VideoListContainer>
    </Container>
  )
}
