import { jsx as _jsx } from "react/jsx-runtime";
import { lazy } from "react";
import Loadable from "../components/third-patry/Loadable";
// Authentication Pages
const LoginPage = Loadable(lazy(() => import("../pages/Authentication/LoginPage")));
const RegisterPage = Loadable(lazy(() => import("../pages/Authentication/RegisterPage")));
const AuthenticationIndex = Loadable(lazy(() => import("../pages/Authentication/index")));
const AuthenticationRoutes = [
    {
        path: "/auth",
        children: [
            {
                index: true,
                element: _jsx(AuthenticationIndex, {}),
            },
            {
                path: "login",
                element: _jsx(LoginPage, {}),
            },
            {
                path: "register",
                element: _jsx(RegisterPage, {}),
            },
        ],
    },
];
export default AuthenticationRoutes;
