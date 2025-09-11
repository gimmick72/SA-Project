import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import Typography from "antd/es/typography";
import Avatar from "antd/es/avatar";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo.png";
const { Header } = Layout;
const { Title } = Typography;
const items = [
    { key: "home", label: _jsx(Link, { to: "/home", children: "\u0E2B\u0E19\u0E49\u0E32\u0E41\u0E23\u0E01" }) },
    { key: "dentists", label: _jsx(Link, { to: "/dentists", children: "\u0E17\u0E31\u0E19\u0E15\u0E41\u0E1E\u0E17\u0E22\u0E4C\u0E02\u0E2D\u0E07\u0E40\u0E23\u0E32" }) },
    { key: "services", label: _jsx(Link, { to: "/services", children: "\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23" }) },
    { key: "contact", label: _jsx(Link, { to: "/contact", children: "\u0E15\u0E34\u0E14\u0E15\u0E48\u0E2D\u0E40\u0E23\u0E32" }) },
    { key: "booking", label: _jsx(Link, { to: "/booking", children: "\u0E08\u0E2D\u0E07\u0E04\u0E34\u0E27" }) }
];
const HomePage = () => {
    return (_jsxs(Header, { style: {
            backgroundColor: "#E7DDF6",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 40px",
        }, children: [_jsxs("div", { style: { display: "flex", alignItems: "center", gap: "12px" }, children: [_jsx(Avatar, { src: Logo, shape: "circle", size: "large", style: { border: "2px solid #8E55D9", } }), _jsx(Title, { level: 3, style: { margin: 0, color: "#722ED1" }, children: "TooThoot" })] }), _jsx(Menu, { mode: "horizontal", style: {
                    backgroundColor: "#E7DDF6",
                    borderBottom: "none",
                    display: "flex",
                    justifyContent: "center",
                    flex: 1,
                }, items: items }), _jsxs(Link, { to: "/auth/login", style: { color: "#722ED1", fontWeight: 600, textDecoration: "none" }, children: [_jsx(UserOutlined, { style: { marginRight: 6 } }), "\u0E25\u0E07\u0E0A\u0E37\u0E48\u0E2D\u0E40\u0E02\u0E49\u0E32\u0E43\u0E0A\u0E49"] })] }));
};
export default HomePage;
