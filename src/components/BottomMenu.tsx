import React from 'react'
import styled from 'styled-components'

type Props = {}

const MenuContainer = styled.div`
  position: fixed;
  bottom: 0px;

  width: 100%;

  display: flex;
  justify-content: center;
`

const Menu = styled.div`
  background-color: rgba(200, 200, 200, 0.609);

  display: flex;
  justify-content: space-evenly;
  gap: 5px;
`

const MenuButton = styled.div`
  height: 50px;
  width: 50px;
  background-color: rgb(82, 82, 82);
`

export default function BottomMenu({}: Props) {
  return (
    <MenuContainer>
      <Menu>
        <MenuButton>a</MenuButton>
        <MenuButton>a</MenuButton>
        <MenuButton>a</MenuButton>
        <MenuButton>a</MenuButton>
        <MenuButton>a</MenuButton>
        <MenuButton>a</MenuButton>
        <MenuButton>a</MenuButton>
        <MenuButton>a</MenuButton>
        <MenuButton>a</MenuButton>
        <MenuButton>a</MenuButton>
      </Menu>
    </MenuContainer>
  )
}
