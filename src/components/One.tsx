import React from 'react'
import styled from 'styled-components'

type Props = {
  ref: React.RefObject<HTMLVideoElement>
}

export default function One({ ref }: Props) {
  return (
    <video
      style={{
        width: 240,
        height: 240,
        margin: 5,
        backgroundColor: 'black'
      }}
      muted
      ref={ref}
      autoPlay
    />
  )
}
