import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Loadable from "../components/third-patry/Loadable";
import BookingPage from "../pages/First_pages/First_pages/BookingPage/BookingPage";


// HomePage
const FirstPages = Loadable(lazy(() => import("../pages/First_pages/main")));

const IndexRoutes: RouteObject[] = [
  {
    path: "/",
    element: <FirstPages />,
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />, // redirect ไป /home
      },
      {
        path: "booking",
        element: <BookingPage/>,
      },

    ],
  },
];

export default IndexRoutes;
