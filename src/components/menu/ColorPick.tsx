import React, { useState, useContext } from 'react'
import styled from 'styled-components'
import { DrawingMenuContext } from '../../context/DrawingMenuContext'

type ColorPickProps = {
  color: string
  setColor: (color: string) => void
}

const ColorPick: React.FC<ColorPickProps> = ({ color, setColor }) => {
  const { state, dispatch } = useContext(DrawingMenuContext)

  const colors = ['#000000', '#FF8B8B', '#FFCA8B', '#FFEC8B', '#D3FF8B', '#9BFF8B', '#8BFFCE']

  const onChangeCheck = (color: string) => {
    dispatch({ type: 'SET_COLOR', payload: color })
  }

  return (
    <Wrapper>
      {colors.map((color, idx) => (
        <label className="checkbox" key={idx}>
          <input
            type="checkbox"
            id={String(idx)}
            onChange={() => onChangeCheck(color)}
            checked={state.color === color}
          />
          <Circle className="checkbox_color" style={{ backgroundColor: color }}></Circle>
        </label>
      ))}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  width: 300px;
  height: 40px;
  justify-content: center;
  align-items: center;

  .checkbox input {
    display: none;
  }
  .checkbox {
    margin-left: 0.1rem;
    margin-right: 0.1rem;
  }
  .checkbox input:checked + .checkbox_color {
    border: 3px solid #ffffff;
    box-shadow: 0rem 0rem 1rem rgba(0, 0, 0, 0.12);
  }
`

const Circle = styled.div`
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 1rem;
`

export default ColorPick
