import { lazy } from "react"; 
import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import IndexLayout from "../layout/IndexLayout";
import Loadable from "../components/third-patry/Loadable";

//Authentication
const LoginPage = Loadable(lazy(() => import("../pages/Authentication/LoginPage")));

//HomePage
const HomePage = Loadable(lazy(() => import("../pages/HomePage/index_page/index")));
const BookingPage = Loadable(lazy(() => import("../pages/HomePage/index_page/booking_page/index")));
const BookingQueue = Loadable(lazy(() => import("../pages/HomePage/index_page/booking_page/Booking")));
const OurDentist = Loadable(lazy(() => import("../pages/HomePage/index_page/OurDentists/index")));
const ContactUs = Loadable(lazy(() => import("../pages/HomePage/index_page/ContactUs/index")));
const PriceGuide = Loadable(lazy(() => import("../pages/HomePage/index_page/PriceGuide/index")));
const ServicePage = Loadable(lazy(() => import("../pages/HomePage/index_page/Services/index")));

const IndexRoutes: RouteObject[] = [
  {

    path: "/",                         // 👉 root
    element: <IndexLayout />,          // layout
    children: [
        {
         index: true,                   // 👉 default ของ "/"
         element: <Navigate to="/home" replace />, // redirect ไป /home
       },
       {
         path: "home",                  
         element: <HomePage />,
       },
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
      {
        path: "login",
        element: <LoginPage />,
      },
    ],


  },
  
];

export default IndexRoutes;
