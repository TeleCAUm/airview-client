import React, { useState, useEffect } from "react";
import styled from "styled-components";

const LandingPage = () => {
  const [btnActive, setBtnActive] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (userName === "") {
      setBtnActive("");
    } else {
      setBtnActive("active");
    }
  }, [userName]);

  return (
    <Wrapper>
      <TitleWrapper>
        <div>로고</div>
        <div>이름</div>
        <div>부제</div>
      </TitleWrapper>

      <GetUserNameWrapper>
        <UserNameInputBox>
          <input placeholder="Enter the Room Code" />
          <Button className={btnActive}>Go!</Button>
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

const TitleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
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
`;
