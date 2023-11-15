import React, { useState, useRef, useEffect, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { WebRTCUser } from './types'
import One from './components/One'
import Two from './components/Two'
import Three from './components/Three'
import Four from './components/Four'
import Multiple from './components/Four'
import styled from 'styled-components'
import BottomMenu from './components/BottomMenu'
import ParticipantMenu from './components/ParticipantMenu'

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

const pc_config = {
  iceServers: [
    // {
    //   urls: 'stun:[STUN_IP]:[PORT]',
    //   'credentials': '[YOR CREDENTIALS]',
    //   'username': '[USERNAME]'
    // },
    {
      urls: 'stun:stun.l.google.com:19302'
    }
  ]
}
const SOCKET_SERVER_URL = 'http://localhost:8080'

const App = () => {
  const socketRef = useRef<Socket>()
  const pcsRef = useRef<{ [socketId: string]: RTCPeerConnection }>({})
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const localStreamRef = useRef<MediaStream>()
  const [users, setUsers] = useState<WebRTCUser[]>([])

  const getLocalStream = useCallback(async () => {
    try {
      const localStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: 1920,
          height: 1080
        }
      })
      localStreamRef.current = localStream
      if (localVideoRef.current) localVideoRef.current.srcObject = localStream
      if (!socketRef.current) return
      socketRef.current.emit('join_room', {
        room: '1234',
        email: 'sample@naver.com'
      })
    } catch (e) {
      console.log(`getUserMedia error: ${e}`)
    }
  }, [])

  const createPeerConnection = useCallback((socketID: string, email: string) => {
    try {
      const pc = new RTCPeerConnection(pc_config)

      pc.onicecandidate = (e) => {
        if (!(socketRef.current && e.candidate)) return
        console.log('onicecandidate')
        socketRef.current.emit('candidate', {
          candidate: e.candidate,
          candidateSendID: socketRef.current.id,
          candidateReceiveID: socketID
        })
      }

      pc.oniceconnectionstatechange = (e) => {
        console.log(e)
      }

      pc.ontrack = (e) => {
        console.log('ontrack success')
        setUsers((oldUsers) =>
          oldUsers
            .filter((user) => user.id !== socketID)
            .concat({
              id: socketID,
              email,
              stream: e.streams[0]
            })
        )
      }

      if (localStreamRef.current) {
        console.log('localstream add')
        localStreamRef.current.getTracks().forEach((track) => {
          if (!localStreamRef.current) return
          pc.addTrack(track, localStreamRef.current)
        })
      } else {
        console.log('no local stream')
      }

      return pc
    } catch (e) {
      console.error(e)
      return undefined
    }
  }, [])

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL)
    getLocalStream()

    socketRef.current.on('all_users', (allUsers: Array<{ id: string; email: string }>) => {
      allUsers.forEach(async (user) => {
        if (!localStreamRef.current) return
        const pc = createPeerConnection(user.id, user.email)
        if (!(pc && socketRef.current)) return
        pcsRef.current = { ...pcsRef.current, [user.id]: pc }
        try {
          const localSdp = await pc.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true
          })
          console.log('create offer success')
          await pc.setLocalDescription(new RTCSessionDescription(localSdp))
          socketRef.current.emit('offer', {
            sdp: localSdp,
            offerSendID: socketRef.current.id,
            offerSendEmail: 'offerSendSample@sample.com',
            offerReceiveID: user.id
          })
        } catch (e) {
          console.error(e)
        }
      })
    })

    socketRef.current.on(
      'getOffer',
      async (data: { sdp: RTCSessionDescription; offerSendID: string; offerSendEmail: string }) => {
        const { sdp, offerSendID, offerSendEmail } = data
        console.log('get offer')
        if (!localStreamRef.current) return
        const pc = createPeerConnection(offerSendID, offerSendEmail)
        if (!(pc && socketRef.current)) return
        pcsRef.current = { ...pcsRef.current, [offerSendID]: pc }
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(sdp))
          console.log('answer set remote description success')
          const localSdp = await pc.createAnswer({
            offerToReceiveVideo: true,
            offerToReceiveAudio: true
          })
          await pc.setLocalDescription(new RTCSessionDescription(localSdp))
          socketRef.current.emit('answer', {
            sdp: localSdp,
            answerSendID: socketRef.current.id,
            answerReceiveID: offerSendID
          })
        } catch (e) {
          console.error(e)
        }
      }
    )

    socketRef.current.on(
      'getAnswer',
      (data: { sdp: RTCSessionDescription; answerSendID: string }) => {
        const { sdp, answerSendID } = data
        console.log('get answer')
        const pc: RTCPeerConnection = pcsRef.current[answerSendID]
        if (!pc) return
        pc.setRemoteDescription(new RTCSessionDescription(sdp))
      }
    )

    socketRef.current.on(
      'getCandidate',
      async (data: { candidate: RTCIceCandidateInit; candidateSendID: string }) => {
        console.log('get candidate')
        const pc: RTCPeerConnection = pcsRef.current[data.candidateSendID]
        if (!pc) return
        await pc.addIceCandidate(new RTCIceCandidate(data.candidate))
        console.log('candidate add success')
      }
    )

    socketRef.current.on('user_exit', (data: { id: string }) => {
      if (!pcsRef.current[data.id]) return
      pcsRef.current[data.id].close()
      delete pcsRef.current[data.id]
      setUsers((oldUsers) => oldUsers.filter((user) => user.id !== data.id))
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
      users.forEach((user) => {
        if (!pcsRef.current[user.id]) return
        pcsRef.current[user.id].close()
        delete pcsRef.current[user.id]
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createPeerConnection, getLocalStream])

  console.log(users.length)

  let a

  if (users.length === 0) {
    a = (
      <Container>
        <VideoContainer>
          <Video ref={localVideoRef} autoPlay></Video>
        </VideoContainer>
      </Container>
    )
  } else if (users.length === 1) {
    a = <One user={users[0]}></One>
  } else if (users.length === 2) {
    a = <Two userLeft={users[0]} userRight={users[1]}></Two>
  } else if (users.length === 3) {
    a = <Three userLeft={users[0]} userRight={users[1]} userBottom={users[2]}></Three>
  } else if (users.length >= 4) {
    a = (
      <Four
        userTopLeft={users[0]}
        userTopRight={users[1]}
        userBottomLeft={users[2]}
        userBottomRight={users[3]}
      ></Four>
    )
  }

  return (
    <div>
      <BottomMenu></BottomMenu>
      <ParticipantMenu></ParticipantMenu>
      {a}
    </div>
  )
}

export default App
