import React, { createContext, useContext, useReducer } from "react";
import { WebRTCUser } from "../types";

const WebRTCContext = createContext<
  [WebRTCUser[], React.Dispatch<Action>] | undefined
>(undefined);

type Action =
  | { type: "add_conn"; user: WebRTCUser }
  | { type: "remove_conn"; id: string }; // add actions here

const webRTCReducer = (users: WebRTCUser[], action: Action) => {
  switch (action.type) {
    case "add_conn":
      return [...users, action.user];
    case "remove_conn":
      return users.filter((user) => user.id !== action.id);
    default:
      throw new Error("Unhandled action");
  }
};

export const WebRTCProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, dispatch] = useReducer(webRTCReducer, []);

  return (
    <WebRTCContext.Provider value={[users, dispatch]}>
      {children}
    </WebRTCContext.Provider>
  );
};

export const useWebRTC = () => {
  const context = useContext(WebRTCContext);
  if (context === undefined) {
    throw new Error("useWebRTC must be used within a WebRTCProvider");
  }
  return context;
};
