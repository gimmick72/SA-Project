import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import IndexLayout from "../layout/IndexLayout";
import Loadable from "../components/third-patry/Loadable";


// HomePage
const HomePage = Loadable(lazy(() => import("../pages/Home_page/index")));
const BookingPage = Loadable(lazy(() => import("../pages/Home_page/First_pages/booking_page/BookingPage")));
const OurDentist = Loadable(lazy(() => import("../pages/Home_page/First_pages/OurDentistsPage/OurDentistsPage")));
const ContactUs = Loadable(lazy(() => import("../pages/Home_page/First_pages/ContactUs/ContactUs")));
const PriceGuide = Loadable(lazy(() => import("../pages/Home_page/First_pages/PriceGuide/PriceGuidePage")));
const ServicePage = Loadable(lazy(() => import("../pages/Home_page/First_pages/Services/ServicesPage")));

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
        path: "home/*",                  
        element: <HomePage />,
      },
      {
        path: "bookingPage",
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
