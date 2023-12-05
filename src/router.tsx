import { createBrowserRouter } from "react-router-dom";
import DisplayPage from "./pages/DisplayPage";
import LandingPage from "./pages/LandingPage";
import NamingPage from "./pages/NamingPage";
import { WebRTCProvider } from "./context/WebRTCContext";
import { DrawingMenuProvider } from './context/DrawingMenuContext'

const router = createBrowserRouter([
  {
    path: "/:roomCode",
    element: (
      <WebRTCProvider>
          <DrawingMenuProvider>
          <DisplayPage />
        </DrawingMenuProvider>
      </WebRTCProvider>
    ),
  },
  {
    path: "/landing",
    element: <LandingPage />,
  },
  {
    path: "/:roomCode/naming",
    element: <NamingPage />,
  },
  
]);

export default router;
