import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Layout from "antd/es/layout";
import Sidebar from "../Container/sidebar";
import NavbarTop from "../Container/navbartop";
import Content from "../Container/content";
const FullLayout = ({ children }) => {
    return (_jsxs(Layout, { style: { height: "100vh", overflow: "hidden" }, children: [_jsx(Sidebar, {}), _jsxs(Layout, { style: { display: "flex", flexDirection: "column" }, children: [_jsx(NavbarTop, {}), _jsxs(Content, { children: [" ", children] })] })] }));
};
export default FullLayout;
