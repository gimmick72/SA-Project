import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Layout, Space } from "antd";
import { FaRegUserCircle } from "react-icons/fa";
import LogoutButton from "../components/LogoutButton";
const { Header } = Layout;
const NavbarTop = () => {
    return (_jsx(Header, { style: {
            padding: 0,
            background: "#CBC6FF",
            maxHeight: "6vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingRight: "4%",
        }, children: _jsxs(Space, { align: "center", size: "middle", children: [_jsx(FaRegUserCircle, { style: { marginRight: "8px", marginTop: "2px", width: "20px", height: "auto" } }), _jsx("span", { style: {
                        color: "black",
                        fontSize: "17px",
                        fontWeight: "500",
                    }, children: localStorage.getItem('username') || 'Admin' }), _jsx(LogoutButton, {})] }) }));
};
export default NavbarTop;
