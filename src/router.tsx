import { createBrowserRouter } from "react-router-dom";
import DisplayPage from "./pages/DisplayPage";
import LandingPage from "./pages/LandingPage";
import NamingPage from "./pages/NamingPage";
import { WebRTCProvider } from "./context/WebRTCContext";
import { DrawingMenuProvider } from './context/DrawingMenuContext'
import { ModalProvider } from "./context/ModalContext";

const router = createBrowserRouter([
  {
    path: "/:roomCode",
    element: (
      <ModalProvider>
        <WebRTCProvider>
          <DrawingMenuProvider>
            <DisplayPage />
          </DrawingMenuProvider>
        </WebRTCProvider>
      </ModalProvider>
    ),
  },
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/naming",
    element: <NamingPage />,
  },
  
]);

export default router;
