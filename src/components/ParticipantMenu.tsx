import React from 'react'
import styled from 'styled-components'

const ParticipantListContainer = styled.div`
  position: fixed;
  top: 0px;
  right: 0px;

  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
`

const ParticipantList = styled.div`
  background-color: rgba(200, 200, 200, 0.609);

  max-height: 70%;

  display: flex;
  flex-direction: column;
  overflow: scroll;
  justify-content: center;
  gap: 5px;
`

const Participant = styled.div`
  height: 50px;
  width: 50px;
  background-color: rgb(82, 82, 82);

  flex-shrink: 0;
`

type Props = {}

export default function ParticipantMenu({}: Props) {
  return (
    <ParticipantListContainer>
      <ParticipantList>
        <Participant>a</Participant>
        <Participant>a</Participant>
        <Participant>a</Participant>
        <Participant>a</Participant>
        <Participant>a</Participant>
        <Participant>a</Participant>
        <Participant>a</Participant>
        <Participant>a</Participant>
      </ParticipantList>
    </ParticipantListContainer>
  )
}
