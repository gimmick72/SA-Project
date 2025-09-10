import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import Loadable from "../components/third-patry/Loadable";
import FullLayout from "../layout/FullLayout";

const AdminPage = Loadable(lazy(() => import("../pages/Systems/superAdmin/admin")));
const MemberPage = Loadable(lazy(() => import("../pages/Systems/patient_info/index"))); 

const SuperAdminRoutes: RouteObject[] = [
  {
    path: "/superadmin",
    element: <FullLayout />,
    children: [
      {
        index: true,
        element: <AdminPage />,
      },
      {
        path: "member",
        element: <MemberPage/>,
      },

    ],
  },
];

export default SuperAdminRoutes;