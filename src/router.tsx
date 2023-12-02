import { createBrowserRouter } from "react-router-dom";
import DisplayPage from "./pages/DisplayPage";
import LandingPage from "./pages/LandingPage";
import { WebRTCProvider } from "./context/WebRTCContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <WebRTCProvider>
        <DisplayPage />
      </WebRTCProvider>
    ),
  },
  {
    path: "/landing",
    element: <LandingPage />,
  },
]);

export default router;
