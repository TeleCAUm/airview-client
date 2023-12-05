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
      navigate(`naming`);
    }
    else{
      dispatch({ type: 'enter_room', roomCode: roomCode })
      navigate(`/naming`);
    }
  }; 

  return (
    <Wrapper>
      <GetUserNameWrapper>
        <UserNameInputBox>
          <input placeholder="Enter the Room Code" value={roomCode} onChange={handleInputChange}/>
          <Button onClick={handleButtonClick} >Go!</Button>
        </UserNameInputBox>
      </GetUserNameWrapper>
    </Wrapper>
  );
};

export default LandingPage;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const GetUserNameWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
  gap: 10px;
`;

const UserNameInputBox = styled.div`
  display: flex;
  width: 50%;
  background-color: white;
  border-radius: 20px;
  padding: 10px 10px 10px 5px;
  & > input {
    width: 80%;
    border-radius: 20px;
    border: none;
    margin-left: 20px;
    padding: 10px 10px 10px 5px;
    font-size: 20px;
    &:focus {
      outline: none;
    }
  }
`;

const Button = styled.div`
  display: flex;
  width: 20%;
  background-color: #c9c9c9;
  border-radius: 10px;
  font-size: 20px;
  justify-content: center;
  align-items: center;
  color: #969696;
  cursor: pointer;
`;
