import React, { useEffect, useRef, useState, useContext } from 'react'
import styled from 'styled-components'
import { useWebRTC } from '../../context/WebRTCContext'
import Canvas from '../drawing/Canvas'
import { DrawingMenuContext } from '../../context/DrawingMenuContext'

type props = {
  focusScreen: string
  handleFocus: (focusScreen: string) => void
  selections: string[]
}

const DisplayScreen = ({ focusScreen, handleFocus, selections }: props) => {
  const [users, dispatch] = useWebRTC()
  const refs = useRef<(HTMLVideoElement | null)[]>([])
  const { state } = useContext(DrawingMenuContext)
  const { color, thickness, isDrawing, isErasing } = state
  const [videoDimensions, setVideoDimensions] = useState<{ width: number; height: number }[]>([])
  let returnCount:number = 0;

  useEffect(() => {
    refs.current = refs.current.slice(0, users.length)
  }, [users, focusScreen, selections])

  useEffect(() => {
    users.forEach((user, idx) => {
      const ref = refs.current[idx]
      if (ref) ref.srcObject = user.stream
    })
  }, [users, focusScreen, selections])

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
  }, [users, focusScreen, selections])

  const columns = Math.ceil(Math.sqrt(selections.length))
  const rows = Math.ceil(selections.length / columns)
  if (focusScreen !== '') {   // focus view
    return (
      <Container>
        {users.map((user, idx) => {
          if (focusScreen === user.id) {
            return (
              <VideoContainer columns={100} rows={100}
                key={user.id}
                onClick={() => {
                  handleFocus(user.id)
                }}
              >
                <Video ref={(ref) => (refs.current[idx] = ref)} autoPlay></Video>
                <Canvas user={user} />
              </VideoContainer>
            )
          }
        })}
      </Container>
    )
    
  }

  return (
    // tile view
    <GridContainer columns={columns} rows={rows}>
      {users.map((user, idx) => {
        if (selections.includes(user.id)) {
          returnCount++;
          if(selections.length === 3 && selections.length === returnCount){    
            return (
              <VideoContainer columns={100/columns-0.1} rows={100/rows-0.15}
                key={user.id}
                onClick={() => {
                  handleFocus(user.id)
                }}
                style = {{
                  gridColumn: "span 2",
                  gridRow: "auto / span 2",
                }}
              >
                <Video ref={(ref) => (refs.current[idx] = ref)} autoPlay></Video>
                <Canvas user={user} />
              </VideoContainer>
            )
          }
          return (
            <VideoContainer columns={100/columns-0.1} rows={100/rows-0.15}
              key={user.id}
              onClick={() => {
                handleFocus(user.id)
              }}
            >
              <Video ref={(ref) => (refs.current[idx] = ref)} autoPlay></Video>
              <Canvas user={user} />
            </VideoContainer>
          )
        }
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
  row-gap: 0.1vw;
  column-gap: 0.1vh;
  background-color: gray;
`

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  background-color: gray;
`

const VideoContainer = styled.div<{
  columns: number
  rows: number
}>`
  width: ${(props) => props.columns}vw;
  height: ${(props) => props.rows}vh;
  background-color: rgb(172, 172, 172);
  display: flex;
  justify-content: center;
`

const Video = styled.video`
  height: 100%;
  width: 100%;
  object-fit: contain;
  cursor: pointer;
`
