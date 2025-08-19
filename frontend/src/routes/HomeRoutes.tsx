import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import IndexLayout from "../layout/IndexLayout";
import Loadable from "../components/third-patry/Loadable";

const IndexPage = Loadable(lazy(() => import("../pages/index_page/index")));
const BookingPage = Loadable(lazy(() => import("../pages/index_page/booking_page/index")));
const BookingQueue = Loadable(lazy(() => import("../pages/index_page/booking_page/YourQueue")));

const IndexRoutes: RouteObject[] = [
  {
    path: "/",
    element: <IndexLayout />,
    children: [
      {
        path: "/",
        element: <IndexPage />,
      },
      {
        path: "/booking",
        element: <BookingPage />,
        children: [
          {
            path: "queue",  
            element: <BookingQueue />,
          },
        ],
      },
    ],
  },
];

export default IndexRoutes;
