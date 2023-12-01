import { createBrowserRouter } from "react-router-dom";
import DisplayPage from "./components/pages/DisplayPage";
import LandingPage from "./components/pages/LandingPage";

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
