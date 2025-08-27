import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import logo from "../assets/logo.png";
import { menuItems } from "../components/menuItems";
import { useNavigate, useLocation } from "react-router-dom";
const { Sider } = Layout;
const Sidebar = () => {
    var _a;
    const navigate = useNavigate();
    const location = useLocation(); // ดึง path ปัจจุบัน
    const handleMenuClick = (e) => {
        const item = menuItems.find((i) => i.key === e.key);
        if (item) {
            navigate(item.path);
        }
    };
    const displayItems = menuItems.map(({ key, icon, label }) => ({ key, icon, label }));
    // หา key ของเมนูที่ตรงกับ path ปัจจุบัน
    const selectedKey = (_a = menuItems.find((item) => item.path === location.pathname)) === null || _a === void 0 ? void 0 : _a.key;
    return (_jsxs(Sider, { style: {
            backgroundColor: "white",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }, children: [_jsxs("div", { style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "15px 0",
                }, children: [_jsx("img", { src: logo, alt: "Logo", style: {
                            width: "50px",
                            borderRadius: "50%",
                            border: "2px solid #8E55D9",
                            marginRight: "8px",
                        } }), _jsx("span", { style: { fontSize: "25px", fontWeight: "600" }, children: "TooThoot" })] }), _jsx("hr", { style: {
                    border: "none",
                    height: "2px",
                    backgroundColor: "#8E55D9",
                    margin: "12px 16px 16px 16px",
                } }), _jsx(Menu, { theme: "light", mode: "inline", selectedKeys: selectedKey ? [selectedKey] : [], items: displayItems, onClick: handleMenuClick })] }));
};
export default Sidebar;
