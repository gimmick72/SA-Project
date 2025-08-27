import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Layout } from "antd";
import { FaRegUserCircle } from "react-icons/fa";
const { Header } = Layout;
const NavbarTop = () => {
    return (_jsxs(_Fragment, { children: [_jsxs(Header, { style: {
                    padding: 0,
                    background: "#CBC6FF",
                    maxHeight: "6vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingRight: "4%",
                }, children: [_jsx(FaRegUserCircle, { style: { marginRight: "18px", marginTop: "2px", width: "20px", height: "auto" } }), _jsx("span", { style: {
                            color: "black",
                            fontSize: "17px",
                            fontWeight: "500",
                        }, children: "Username" })] }), _jsx(Header, { style: {
                    padding: 0,
                    backgroundColor: "#FFFFFF",
                    boxShadow: "0 2px 4px #E6E6E6",
                    maxHeight: "5vh",
                } })] }));
};
export default NavbarTop;
