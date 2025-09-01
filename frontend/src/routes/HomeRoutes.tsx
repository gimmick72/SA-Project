import { lazy } from "react"; 
import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import App from "../pages/First_pages/App";
import Booking from "../pages/First_pages/First_pages/Booking/Booking";

const IndexRoutes: RouteObject[] = [
  {
    path: "/",                         // 👉 root
    element: <App/>,          // layout
    children: [
      {
        index: true,                   // 👉 default ของ "/"
        element: <Navigate to="/home" replace />, // redirect ไป /home
      },

      {
        path:"/booking", 
        element: <Booking />,
      },
      
    ],
  },
];

export default IndexRoutes;
