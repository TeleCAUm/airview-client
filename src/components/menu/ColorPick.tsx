import React, { useState } from "react";
import styled from "styled-components";

// ref) https://velog.io/@owlsuri/react-color-%EC%84%A0%ED%83%9D

type ColorPickProps = {
  color: string;
  setColor: (color: string) => void;
};

const ColorPick = ({ color, setColor }: ColorPickProps) => {
  const [isSelect, setIsSelect] = useState([
    { key: "0", value: "#FF8B8B", checked: false },
    { key: "1", value: "#FFCA8B", checked: false },
    { key: "2", value: "#FFEC8B", checked: false },
    { key: "3", value: "#D3FF8B", checked: false },
    { key: "4", value: "#9BFF8B", checked: false },
    { key: "5", value: "#8BFFCE", checked: false },
  ]);

  const onChangeCheck =
    (el: { key: string; value: string; checked: boolean }) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const temp = isSelect.map((item, idx) => {
        return { ...item, checked: idx === Number(event?.target.id) };
      });
      setIsSelect(temp);
      setColor(el.value);
    };

  return (
    <Wrapper>
      {isSelect.map((el, idx) => (
        <label className="checkbox" key={el.key}>
          <input
            type="checkbox"
            key={el.key}
            id={String(idx)}
            onChange={onChangeCheck(el)}
            checked={Boolean(el.checked)}
          />
          {idx === 5 && <span></span>}
          <Circle
            className="checkbox_color"
            style={{ backgroundColor: el.value }}
          ></Circle>
        </label>
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  width: 200px;
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
`;

const Circle = styled.div`
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 1rem;
  cursor: pointer;
`;

export default ColorPick;
