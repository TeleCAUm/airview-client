import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import styled from "styled-components";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { useRoom } from '../context/RoomContext'


const NamingPage = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const [roomInfo, dispatch] = useRoom()

  if(roomInfo.roomCode === ""){
    navigate('');
  }

  const handleInputChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setUserName(e.target.value);
  };

  const handleButtonClick = () => {
    if(userName === ""){
        const fullId = uuidv4();
        const first8Chars = fullId.slice(0, 4);
        dispatch({ type: 'set_name', userName: first8Chars })
        navigate(`/${roomInfo.roomCode}`);
      }
    else{
        dispatch({ type: 'set_name', userName: userName })
        navigate(`/${roomInfo.roomCode}`);
    }
  }; 

  return (
    <Wrapper>
      <GetUserNameWrapper>
        <UserNameInputBox>
          <input placeholder="Enter your Name" value={userName} onChange={handleInputChange} />
          <Button onClick={handleButtonClick}>Go!</Button>
        </UserNameInputBox>
      </GetUserNameWrapper>
    </Wrapper>
  );
};

export default NamingPage;

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
