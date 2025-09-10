import { lazy } from "react";

// Lazy load authentication components
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));

const AuthRoutes = [
  {
    path: "/auth",
    children: [
      {
        path: "login",
        element: <LoginPage />
      },
      {
        path: "register", 
        element: <RegisterPage />
      }
    ]
  }
];

export default AuthRoutes;
