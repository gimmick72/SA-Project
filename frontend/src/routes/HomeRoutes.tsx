import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import IndexLayout from "../layout/IndexLayout";
import Loadable from "../components/third-patry/Loadable";


// HomePage
const HomePage = Loadable(lazy(() => import("../pages/Home_page/index")));
const BookingPage = Loadable(lazy(() => import("../pages/Home_page/First_pages/Booking")));
const OurDentist = Loadable(lazy(() => import("../pages/Home_page/First_pages/OurDentistsPage/OurDentistsPage")));
const ContactUs = Loadable(lazy(() => import("../pages/Home_page/contactUs/index")));
const PriceGuide = Loadable(lazy(() => import("../pages/Home_page/priceGuide/index")));
const ServicePage = Loadable(lazy(() => import("../pages/Home_page/services")));

const IndexRoutes: RouteObject[] = [
  {
    path: "/",                         
    element: <IndexLayout />,          
    children: [
      {
        index: true,                   
        element: <Navigate to="/home" replace />, // redirect ไป /home
      },
      {
        path: "home",                  
        element: <HomePage />,
      },
      {
        path: "booking",
        element: <BookingPage />,
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
