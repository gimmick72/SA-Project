import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from "react-router-dom";
import Layout from "antd/es/layout";
import Navbar from "../Container/index_page/navbar";
const IndexLayout = () => {
    return (_jsxs("div", { children: [_jsx(Navbar, {}), _jsx(Layout, { style: { minHeight: "100vh" }, children: _jsx(Layout.Content, { style: { padding: "20px" }, children: _jsx(Outlet, {}) }) })] }));
};
export default IndexLayout;
