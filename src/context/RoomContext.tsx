import React, { createContext, useContext, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";

type RoomState = {
  roomCode: string;
  userName: string;
};

type Action =
  | { type: "enter_room"; roomCode: string }
  | { type: "set_name"; userName: string }
  | { type: "enter_by_link"; roomCode: string }
  | { type: "exit_room" };

const initialState: RoomState = {
  roomCode: "",
  userName: "",
};

export const RoomContext = createContext<
  [RoomState, React.Dispatch<Action>] | undefined
>(undefined);

const roomReducer = (state: RoomState, action: Action) => {
  switch (action.type) {
    case "enter_room":
      console.log(action.roomCode);
      return { ...state, roomCode: action.roomCode };
    case "set_name":
      return { ...state, userName: action.userName };
    case "enter_by_link":
      const userName = uuidv4().slice(0, 4);
      return { roomCode: action.roomCode, userName: userName };
    case "exit_room":
      return { roomCode: "", userName: "" };
    default:
      return state;
  }
};

export const RoomProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(roomReducer, initialState);

  return (
    <RoomContext.Provider value={[state, dispatch]}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error("useRoom must be used within a RoomProvider");
  }
  return context;
};
