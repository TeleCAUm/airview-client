import { createBrowserRouter } from "react-router-dom";
import DisplayPage from "./pages/DisplayPage";
import LandingPage from "./pages/LandingPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DisplayPage />,
  },
  {
    path: "/landing",
    element: <LandingPage />,
  },
]);

export default router;
