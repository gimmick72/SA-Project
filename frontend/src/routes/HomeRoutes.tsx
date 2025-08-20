import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import IndexLayout from "../layout/IndexLayout";
import Loadable from "../components/third-patry/Loadable";

const HomePage = Loadable(lazy(() => import("../pages/index_page/index")));
const BookingPage = Loadable(lazy(() => import("../pages/index_page/booking_page/index")));
const BookingQueue = Loadable(lazy(() => import("../pages/index_page/booking_page/Booking")));

const OurDentist = Loadable(lazy(() => import("../pages/index_page/OurDentists/index")));
const ContactUs = Loadable(lazy(() => import("../pages/index_page/ContactUs/index")));
const PriceGuide = Loadable(lazy(() => import("../pages/index_page/PriceGuide/index")));
const ServicePage = Loadable(lazy(() => import("../pages/index_page/Services/index")));

const IndexRoutes: RouteObject[] = [
  {
    path: "/",                  // root path
    element: <IndexLayout />,   // layout ที่มี Navbar + Outlet
    children: [
      {
        index: true,            // default = "/"
        element: <HomePage />,
      },
      {
        path: "home",           // /home
        element: <HomePage />,
      },
      {
        path: "booking",        // /booking
        element: <BookingPage />,
        children: [
          {
            path: "queue",      // /booking/queue
            element: <BookingQueue />,
          },
        ],
      },
      {
        path: "dentists",       // /dentists
        element: <OurDentist />,
      },
      {
        path: "contact",        // /contact
        element: <ContactUs />,
      },
      {
        path: "guide-service",  // /guide-service
        element: <PriceGuide />,
      },
      {
        path: "services",       // /services
        element: <ServicePage />,
      },
    ],
  },
];

export default IndexRoutes;
