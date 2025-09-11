import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import Loadable from "../components/third-patry/Loadable";

// Authentication Pages
const LoginPage = Loadable(lazy(() => import("../pages/Authentication/LoginPage")));
const RegisterPage = Loadable(lazy(() => import("../pages/Authentication/RegisterPage")));
const AuthenticationIndex = Loadable(lazy(() => import("../pages/Authentication/index")));

const AuthenticationRoutes: RouteObject[] = [
  {
    path: "/auth",
    children: [
      {
        index: true,
        element: <AuthenticationIndex />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
    ],
  },
];

export default AuthenticationRoutes;
