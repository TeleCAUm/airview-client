import React, { useEffect, useRef, useState, useContext } from 'react'
import styled from 'styled-components'
import { useWebRTC } from '../../context/WebRTCContext'
import Canvas from '../drawing/Canvas'
import { DrawingMenuContext } from '../../context/DrawingMenuContext'

type props = {
  focusScreen: string
  handleFocus: (focusScreen: string) => void
}

const DisplayScreen = ({ focusScreen, handleFocus }: props) => {
  const [users, dispatch] = useWebRTC()
  const refs = useRef<(HTMLVideoElement | null)[]>([])
  const { state } = useContext(DrawingMenuContext)
  const { color, thickness, isDrawing, isErasing } = state

  useEffect(() => {
    refs.current = refs.current.slice(0, users.length)
  }, [users, focusScreen])

  useEffect(() => {
    users.forEach((user, idx) => {
      const ref = refs.current[idx]
      if (ref) ref.srcObject = user.stream
    })
  }, [users, focusScreen])

  const [videoDimensions, setVideoDimensions] = useState<{ width: number; height: number }[]>([])

  useEffect(() => {
    refs.current = refs.current.slice(0, users.length)
    const newDimensions = users.map((_, idx) => {
      const element = refs.current[idx]
      return {
        width: element?.offsetWidth || 0,
        height: element?.offsetHeight || 0
      }
    })
    setVideoDimensions(newDimensions)
  }, [users])

  const columns = Math.ceil(Math.sqrt(users.length))
  const rows = Math.ceil(users.length / columns)
  if (focusScreen !== '' && users.length > 1) {
    return (
      <Container>
        {users.map((user, idx) => {
          if (focusScreen === user.id) {
            return (
              <VideoContainer
                key={user.id}
                onClick={() => {
                  if (!isDrawing && !isErasing) handleFocus(user.id)
                }}
              >
                <Video ref={(ref) => (refs.current[idx] = ref)} autoPlay></Video>
                <Canvas
                  width={videoDimensions[idx]?.width || 0}
                  height={videoDimensions[idx]?.height || 0}
                />
              </VideoContainer>
            )
          }
        })}
      </Container>
    )
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
                gridColumn: 'span 2',
                gridRow: 'auto / span 2'
              }}
              onClick={() => {
                if (!isDrawing && !isErasing) handleFocus(user.id)
              }}
            >
              <Video ref={(ref) => (refs.current[idx] = ref)} autoPlay></Video>
              <Canvas
                width={videoDimensions[idx]?.width || 0}
                height={videoDimensions[idx]?.height || 0}
              />
            </VideoContainer>
          )
        }
        return (
          <VideoContainer
            key={user.id}
            onClick={() => {
              if (!isDrawing && !isErasing) handleFocus(user.id)
            }}
          >
            <Video ref={(ref) => (refs.current[idx] = ref)} autoPlay></Video>
            <Canvas
              width={videoDimensions[idx]?.width || 0}
              height={videoDimensions[idx]?.height || 0}
            />
          </VideoContainer>
        )
      })}
    </GridContainer>
  )
}

export default DisplayScreen

const GridContainer = styled.div<{
  columns: number
  rows: number
}>`
  position: relative;
  width: 100vw;
  height: 100vh;
  display: grid;
  place-items: center;
  grid-template-columns: repeat(${(props) => props.columns}, 1fr);
  grid-template-rows: repeat(${(props) => props.rows}, 1fr);
  row-gap: 0.3vw;
  column-gap: 0.3vh;
  background-color: gray;
`

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  background-color: gray;
`

const VideoContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgb(172, 172, 172);
  display: flex;
  justify-content: center;
`

const Video = styled.video`
  width: 100%;
  object-fit: contain;
  cursor: pointer;
`
