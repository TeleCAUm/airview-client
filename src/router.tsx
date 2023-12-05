import { createBrowserRouter } from "react-router-dom";
import DisplayPage from "./pages/DisplayPage";
import LandingPage from "./pages/LandingPage";
import { WebRTCProvider } from "./context/WebRTCContext";
import { DrawingMenuProvider } from './context/DrawingMenuContext'

const router = createBrowserRouter([
  {
    path: "/",
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
]);

export default router;
