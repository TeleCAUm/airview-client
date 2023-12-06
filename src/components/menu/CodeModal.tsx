import React, {useState} from "react";
import styled from "styled-components";
import { useRoom } from '../../context/RoomContext';
import { useModal } from '../../context/ModalContext';


const CodeModal = () => {
    const [roomInfo, dispatch] = useRoom();
    const [modal, dispatchModal] = useModal();

    console.log('abc');
    return (
        <ModalSection>
        <ModalStyle>
            <Description>Room Code:</Description>
            <div className='code'>{roomInfo.roomCode}</div>
            <Description>Paste the Code to Invite People</Description>
			<ButtonWrapper>
				<CloseBtn onClick={() => dispatchModal({type:"modal_close"})}>Close</CloseBtn>
			</ButtonWrapper>
        </ModalStyle>
    </ModalSection>
    );
}

export default CodeModal;

const ModalSection = styled.div`
	position: fixed;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 20%;
	height: 25%;
	top: 85%;
	left: 50%;
	transform: translate(-50%, -50%);
	background-color: rgba(0, 0, 0, 0.8);
    border-radius: 8px;
    font-family: NotoSansRegular;
	z-index: 101;
`;

const ModalStyle = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
    color: white;
	border-radius: 10px;
	z-index: 3;
	& >.code{
        font-size: 30px;
		font-family: NotoSansExtraBold;
	}
`;

const ButtonWrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
    padding: 5px;
`

const CloseBtn = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #c9c9c9;
    border: none;
    border-radius: 10px;
    font-size: 15px;
    color: white;
    padding: 10px;
    width: 60px;
    cursor: pointer;
    font-family: NotoSansBold;
    &:hover {
        background-color: white;
        color: #c9c9c9; 
    }
`

const Description = styled.div`
    margin : 10px;
`;