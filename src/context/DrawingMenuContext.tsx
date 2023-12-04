import React, { createContext, useReducer, Dispatch } from 'react'

type StateType = {
  color: string
  thickness: number
  isDrawing: boolean
  isErasing: boolean
}

// Update initialState
const initialState: StateType = {
  color: '#FF8B8B',
  thickness: 5,
  isDrawing: false,
  isErasing: false
}

// Update ActionType
type ActionType =
  | { type: 'SET_COLOR'; payload: string }
  | { type: 'SET_THICKNESS'; payload: number }
  | { type: 'TOGGLE_DRAWING' }
  | { type: 'TOGGLE_ERASING' }

export const DrawingMenuContext = createContext<{
  state: StateType
  dispatch: Dispatch<ActionType>
}>({
  state: initialState,
  dispatch: () => null
})

const colorReducer = (state: StateType, action: ActionType) => {
  switch (action.type) {
    case 'SET_COLOR':
      return {
        ...state,
        color: action.payload
      }
    case 'SET_THICKNESS':
      return {
        ...state,
        thickness: action.payload
      }
    case 'TOGGLE_DRAWING':
      return {
        ...state,
        isDrawing: !state.isDrawing,
        isErasing: false
      }
    case 'TOGGLE_ERASING':
      return {
        ...state,
        isErasing: !state.isErasing,
        isDrawing: false
      }

    default:
      return state
  }
}

type DrawingMenuProviderProps = {
  children: React.ReactNode
}

export const DrawingMenuProvider: React.FC<DrawingMenuProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(colorReducer, initialState)

  return (
    <DrawingMenuContext.Provider value={{ state, dispatch }}>
      {children}
    </DrawingMenuContext.Provider>
  )
}
