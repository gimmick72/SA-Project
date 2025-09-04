import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import IndexLayout from "../layout/IndexLayout";
import Loadable from "../components/third-patry/Loadable";


// HomePage
const FirstPages = Loadable(lazy(() => import("../pages/First_pages/main")));



const IndexRoutes: RouteObject[] = [
  {
    path: "/",                         
    element: <FirstPages/>,          
    children: [
      {
        index: true,                   
        element: <Navigate to="/home" replace />, // redirect ไป /home
      },
      // {
      //   path: "home",                  
      //   element: <HomePage />,
      // },

    ],
  },
];

export default IndexRoutes;
