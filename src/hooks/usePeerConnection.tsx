import React, { useState, useRef, useEffect, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { WebRTCUser } from '../types'
import { useWebRTC } from '../context/WebRTCContext'
import { useRoom } from '../context/RoomContext'

const pc_config = {
  // iceServers: [
  //   // {
  //   //   urls: 'stun:[STUN_IP]:[PORT]',
  //   //   'credentials': '[YOR CREDENTIALS]',
  //   //   'username': '[USERNAME]'
  //   // },
  //   {
  //     urls: 'stun:stun.l.google.com:19302'
  //   },
  //   {
  //     urls: 'TURN:freeturn.net:3478'
  //   }
  // ]
  iceServers: [
    { urls: 'stun:freeturn.net:5349' },
    { urls: 'turns:freeturn.tel:5349', username: 'free', credential: 'free' }
  ]
}
const SOCKET_SERVER_URL = 'https://airview.p-e.kr/'

export const usePeerConnection = () => {
  const socketRef = useRef<Socket>()
  const pcsRef = useRef<{ [socketId: string]: RTCPeerConnection }>({})
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const localStreamRef = useRef<MediaStream>()
  const [users, dispatchWebRTC] = useWebRTC()
  const [roomInfo, dispatchRoom] = useRoom()

  const getLocalStream = useCallback(async () => {
    try {
      console.log('getLocalStream')
      const localStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: 1920,
          height: 1080
        }
      })
      localStreamRef.current = localStream
      if (localVideoRef.current) localVideoRef.current.srcObject = localStream
      if (!socketRef.current) return
      console.log(roomInfo)
      socketRef.current.emit('join_room', {
        room: roomInfo.roomCode,
        name: roomInfo.userName
      })
    } catch (e) {
      console.log(`getUserMedia error: ${e}`)
    }
  }, [])

  const createPeerConnection = useCallback((socketID: string, name: string, ipAddress: string) => {
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
        const newUser: WebRTCUser = {
          id: socketID,
          name: name,
          ipAddress: ipAddress,
          stream: e.streams[0]
        }
        dispatchWebRTC({ type: 'add_conn', user: newUser })
        console.log('conn addition complete')
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
    console.log('useEffect')
    socketRef.current = io(SOCKET_SERVER_URL)
    getLocalStream()

    socketRef.current.on(
      'all_users',
      (allUsers: Array<{ id: string; name: string; ipAddress: string }>) => {
        allUsers.forEach(async (user) => {
          if (!localStreamRef.current) return
          const pc = createPeerConnection(user.id, user.name, user.ipAddress)
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
              offerSendName: roomInfo.userName,
              offerReceiveID: user.id
            })
          } catch (e) {
            console.error(e)
          }
        })
      }
    )

    socketRef.current.on(
      'getOffer',
      async (data: {
        sdp: RTCSessionDescription
        offerSendID: string
        offerSendName: string
        ipAddress: string
      }) => {
        const { sdp, offerSendID, offerSendName } = data
        console.log('get offer')
        if (!localStreamRef.current) return
        const pc = createPeerConnection(offerSendID, offerSendName, data.ipAddress)
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
      console.log('remove')

      dispatchWebRTC({ type: 'remove_conn', id: data.id })
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

  return {
    localVideoRef,
    getLocalStream
  }
}
