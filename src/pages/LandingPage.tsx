import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { useRoom } from '../context/RoomContext'

const LandingPage = () => {
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();
  const [roomInfo, dispatch] = useRoom()


  const handleInputChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setRoomCode(e.target.value);
  };

  const handleButtonClick = () => {
    if(roomCode === ""){
      const fullId = uuidv4();
      const first8Chars = fullId.slice(0, 8);
      dispatch({ type: 'enter_room', roomCode: first8Chars })
      navigate(`/naming`);
    }
    else{
      dispatch({ type: 'enter_room', roomCode: roomCode })
      navigate(`/naming`);
    }
  }; 

  return (
    <Wrapper>
      <AirViewLogo>AirView</AirViewLogo>
      <GetUserNameWrapper>
        <UserNameInputBox>
          <input placeholder="Enter the Room Code" value={roomCode} onChange={handleInputChange}/>
          <ButtonWrapper>
            <Button onClick={handleButtonClick} >Go!</Button>
          </ButtonWrapper>
        </UserNameInputBox>
      </GetUserNameWrapper>
      <Description>Just Press "Go!" to Make a Room !</Description>
    </Wrapper>
  );
};

export default LandingPage;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const AirViewLogo = styled.div`
  text-align: center;
  font-family: NotoSansBold;
  font-size: 15vh;
`;


const GetUserNameWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
  gap: 10px;
  margin: 30px 30px 0px 30px;
  font-family: NotoSansBold;
`;

const UserNameInputBox = styled.div`
  display: flex;
  width: 550px;
  background-color: white;
  border-radius: 20px;
  padding: 10px 10px 10px 5px;
  
  & > input {
    width: 100%;
    border-top: none;
    border-left: none;
    border-right: none;
    border-bottom: 3px solid black;
    margin : 20px 20px 10px 20px;
    padding: 10px 10px 10px 5px;
    font-size: 20px;
    font-family: NotoSansRegular;
    &:focus {
      outline: none;
    }
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Button = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #c9c9c9;
  border-radius: 10px;
  font-size: 25px;
  color: white;
  padding: 10px;
  width: 80px;

  cursor: pointer;
  &:hover {
    background-color: white;
    color: #c9c9c9; 
  }
`;

const Description = styled.div`
  text-align: center;
  font-size: 20px;
  padding-right: 50px;
  color: #c9c9c9; 
  font-family: NotoSansRegular;
`;
