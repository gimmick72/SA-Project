import { lazy } from "react"; 
import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import IndexLayout from "../layout/IndexLayout";
import Loadable from "../components/third-patry/Loadable";

//Authentication
const LoginPage = Loadable(lazy(() => import("../pages/Authentication/LoginPage")));

//HomePage
const HomePage = Loadable(lazy(() => import("../pages/Home_page/index")));
const BookingPage = Loadable(lazy(() => import("../pages/Home_page/booking/index")));
const OurDentist = Loadable(lazy(() => import("../pages/Home_page/ourDentists/index")));
const ContactUs = Loadable(lazy(() => import("../pages/Home_page/contactUs/index")));
const PriceGuide = Loadable(lazy(() => import("../pages/Home_page/priceGuide/index")));
const ServicePage = Loadable(lazy(() => import("../pages/Home_page/services/index")));

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
