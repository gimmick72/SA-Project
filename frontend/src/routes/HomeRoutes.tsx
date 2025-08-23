import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import IndexLayout from "../layout/IndexLayout";
import Loadable from "../components/third-patry/Loadable";
import HomePage from "../Container/index_page/navbar";

const IndexPage = Loadable(lazy(() => import("../pages/index_page/index")));
const BookingPage = Loadable(lazy(() => import("../pages/index_page/booking_page/index")));
const BookingQueue = Loadable(lazy(() => import("../pages/index_page/booking_page/Booking")));

const OurDentist = Loadable(lazy(() => import("../pages/index_page/OurDentists/index")));
const ContactUs = Loadable(lazy(() => import("../pages/index_page/ContactUs/index")));
const PriceGuide = Loadable(lazy(() => import("../pages/index_page/PriceGuide/index")));
const ServicePage = Loadable(lazy(() => import("../pages/index_page/Services/index")));

const IndexRoutes: RouteObject[] = [
  {
    path: "/",                         // 👉 root
    element: <IndexLayout />,          // layout
    children: [
      {
        index: true,                   // 👉 default ของ "/"
        element: <IndexPage />, // redirect ไป /home
      },
      // {
      //   path: "/",                  
      //   element: <IndexPage />,
      // },
      {
        path: "booking",
        element: <BookingPage />,
        children: [
          {
            path: "queue",
            element: <BookingQueue />,
          },
        ],
      },
      {
        path: "dentists",
        element: <OurDentist />,
      },
      {
        path: "contact",
        element: <ContactUs />,
      },
      {
        path: "guide-service",
        element: <PriceGuide />,
      },
      {
        path: "services",
        element: <ServicePage />,
      },
    ],
  },
];

export default IndexRoutes;
