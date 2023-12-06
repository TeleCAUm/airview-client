import React, { useState, useContext } from 'react'
import styled from 'styled-components'
import ColorPick from './ColorPick'
import { FaRegPenToSquare } from 'react-icons/fa6'
import { LuEraser } from 'react-icons/lu'
import { MdOutlineCancelPresentation } from 'react-icons/md'
import { DrawingMenuContext } from '../../context/DrawingMenuContext'

const DrawingMenu = () => {
  const [showDrawingMenu, setShowDrawingMenu] = useState(false)
  const { state, dispatch } = useContext(DrawingMenuContext)
  const { color, thickness } = state // Get color and thickness from context

  const toggleDrawing = () => {
    dispatch({ type: 'TOGGLE_DRAWING' })
  }

  const toggleErasing = () => {
    dispatch({ type: 'TOGGLE_ERASING' })
  }

  document.addEventListener('mousemove', function (e) {
    var mouseY = e.clientY

    if (mouseY < 80) {
      setShowDrawingMenu(true)
    } else {
      setShowDrawingMenu(false)
    }
  })

  const handleThicknessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_THICKNESS', payload: Number(e.target.value) })
  }

  if (showDrawingMenu) {
    return (
      <Wrapper>
        <MenuBtn onClick={toggleDrawing} isActive={state.isDrawing}>
          <FaRegPenToSquare />
        </MenuBtn>
        <MenuBtn onClick={toggleErasing} isActive={state.isErasing}>
          <LuEraser />
        </MenuBtn>
        <ColorPick
          color={color}
          setColor={(color) => dispatch({ type: 'SET_COLOR', payload: color })}
        />
        <StrokeSliderWrapper>
          <span>선 굵기</span>
          <input type="range" min="1" max="10" value={thickness} onChange={handleThicknessChange} />
        </StrokeSliderWrapper>
        <MenuBtn isActive={false}>
          <MdOutlineCancelPresentation />
        </MenuBtn>
      </Wrapper>
    )
  }
  return <HiddenWrapper>Plz be hidden</HiddenWrapper>
}

export default DrawingMenu

// ... (rest of your styled components)

const HiddenWrapper = styled.div`
  position: fixed;
  top: -100px;
  width: 100%;
  transition: top 0.5s;
`

const Wrapper = styled.div`
  position: fixed;
  width: auto;
  height: auto;
  top: 0px;
  margin: 10px;
  border-radius: 5px;
  border: none;
  background-color: rgba(0, 0, 0, 0.2);
  transition: bottom 0.5s;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: center;
  z-index: 100;
`

type MenuBtnProps = {
  isActive: boolean
}

const MenuBtn = styled.button<MenuBtnProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90px;
  height: 40px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: rgb(239, 239, 239);
  box-shadow: ${({ isActive }) => (isActive ? 'inset 0 2px 4px rgba(0, 0, 0, 0.1)' : 'none')};
  cursor: pointer;
  margin: 10px;
  svg {
    font-size: 20px;
  }
  &:hover {
    background-color: #ececec; // Hover color same as active color
  }
`

const StrokeSliderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 150px;
  height: 40px;
  border-radius: 5px;
  border: none;
  margin: 10px;
  svg {
    font-size: 20px;
  }
  span {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.8);
    margin: 3px;
  }
  input {
    width: 150px;
  }
`
