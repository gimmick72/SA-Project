import { lazy } from "react";
import Loadable from "../components/third-patry/Loadable";

// Lazy load authentication components
const LoginPage = Loadable(lazy(() => import("../pages/auth/LoginPage")));
const RegisterPage = Loadable(lazy(() => import("../pages/auth/RegisterPage")));

const AuthRoutes = [
  {
    path: "/auth/login",
    element: <LoginPage />
  },
  {
    path: "/auth/register", 
    element: <RegisterPage />
  }
];

export default AuthRoutes;
