import React, { createContext, useContext, useReducer } from "react";

type ModalState = {
  isOpen: boolean
}

type Action = 
  | { type: "modal_open"; }
  | { type: "modal_close";}
  | { type: "modal_clicked"};

export const ModalContext = createContext<[ModalState, React.Dispatch<Action>]| undefined>(undefined);

const modalReducer = (state: ModalState, action: Action) => {
  switch (action.type) {
    case "modal_open":
      return { isOpen: true };;
    case "modal_close":
      return { isOpen: false };
    case "modal_clicked":
      return { isOpen: !state.isOpen };
    default:
      return state;
  }
};

export const ModalProvider = ({ children }: { children: React.ReactNode })=> {
    const [state, dispatch] = useReducer(modalReducer, {isOpen:false});
  
    return (
      <ModalContext.Provider value={[state, dispatch]}>
        {children}
      </ModalContext.Provider>
    );
};
  
export const useModal = () => {
    const context = useContext(ModalContext);
    if (context === undefined) {
      throw new Error("useRoom must be used within a ModalProvider");
    }
    return context;
};
