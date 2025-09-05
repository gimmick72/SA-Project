import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Loadable from "../components/third-patry/Loadable";

// HomePage
const FirstPages = Loadable(lazy(() => import("../pages/First_pages/main")));
// const BookingPage = Loadable(lazy(() => import("../pages/First_pages/First_pages/booking_page/index")));
const AllBooking = Loadable(lazy(() => import("../pages/First_pages/First_pages/booking_page/Booking")));


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
        path: "Allbooking",
        element: <AllBooking />,
      },

    ],
  },
];

export default IndexRoutes;
