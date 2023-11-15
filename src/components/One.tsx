import React from 'react'
import { useRef, useEffect } from 'react'
import styled from 'styled-components'
import { WebRTCUser } from '../types'

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: gray;

  display: flex;
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

type Props = {
  user: WebRTCUser
}

export default function One({ user }: Props) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (ref.current) ref.current.srcObject = user.stream
  }, [user.stream])

  return (
    <Container>
      <VideoContainer>
        <Video ref={ref} autoPlay></Video>
      </VideoContainer>
    </Container>
  )
}
