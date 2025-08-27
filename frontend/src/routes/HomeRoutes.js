import { jsx as _jsx } from "react/jsx-runtime";
import { lazy } from "react";
import { Navigate } from "react-router-dom";
import IndexLayout from "../layout/IndexLayout";
import Loadable from "../components/third-patry/Loadable";
// HomePage
const HomePage = Loadable(lazy(() => import("../pages/Home_page/index")));
const BookingPage = Loadable(lazy(() => import("../pages/Home_page/booking/index")));
const OurDentist = Loadable(lazy(() => import("../pages/Home_page/ourDentists/index")));
const ContactUs = Loadable(lazy(() => import("../pages/Home_page/contactUs/index")));
const PriceGuide = Loadable(lazy(() => import("../pages/Home_page/priceGuide/index")));
const ServicePage = Loadable(lazy(() => import("../pages/Home_page/services/index")));
const IndexRoutes = [
    {
        path: "/", // 👉 root
        element: _jsx(IndexLayout, {}), // layout
        children: [
            {
                index: true, // 👉 default ของ "/"
                element: _jsx(Navigate, { to: "/home", replace: true }), // redirect ไป /home
            },
            {
                path: "home",
                element: _jsx(HomePage, {}),
            },
            {
                path: "booking",
                element: _jsx(BookingPage, {}),
            },
            {
                path: "dentists",
                element: _jsx(OurDentist, {}),
            },
            {
                path: "contact",
                element: _jsx(ContactUs, {}),
            },
            {
                path: "guide-service",
                element: _jsx(PriceGuide, {}),
            },
            {
                path: "services",
                element: _jsx(ServicePage, {}),
            },
        ],
    },
];
export default IndexRoutes;
