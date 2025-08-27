import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { Calendar, theme } from "antd";
import "./booking.css";
import { Outlet } from "react-router-dom";
const onPanelChange = (value, mode) => {
    console.log(value.format("YYYY-MM-DD"), mode);
};
const Booking = () => {
    const { token } = theme.useToken();
    const wrapperStyle = {
        width: 300,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
    };
    return (_jsxs(_Fragment, { children: [_jsx(Outlet, {}), _jsxs("div", { style: {
                    minHeight: "70vh",
                    padding: "2rem",
                    border: `1px solid black`,
                    borderRadius: "20px",
                    display: "grid",
                    marginLeft: "10rem",
                    marginRight: "10rem",
                    marginTop: "2rem",
                    marginBottom: "2rem",
                    fontFamily: "sans-serif",
                    // backgroundColor:" #FDFAFF"
                }, children: [_jsxs("div", { style: {
                            display: "flex",
                            justifyContent: "space-between",
                            paddingLeft: "2rem",
                        }, children: [_jsxs("div", { children: [_jsx("h1", { children: "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E27\u0E31\u0E19\u0E41\u0E25\u0E30\u0E40\u0E27\u0E25\u0E32" }), _jsx("p", { children: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolores, vel." }), _jsx("br", {}), _jsxs("div", { children: [_jsx("h1", { children: "Day" }), _jsx("button", { className: "time-button", children: "time" }), _jsx("button", { className: "time-button", children: "time" }), _jsx("div", { style: {
                                                    width: "300px",
                                                    height: "100px",
                                                    margin: "2rem",
                                                    border: "1px solid #000",
                                                    borderRadius: "20px",
                                                    textAlign: "center",
                                                    alignContent: "center",
                                                }, children: "status" })] }), _jsx(Link, { to: "/booking/your-queue", children: _jsx("button", { className: "booking-button", children: "\u0E08\u0E2D\u0E07\u0E04\u0E34\u0E27" }) })] }), _jsx("div", { style: {
                                    marginTop: "2rem",
                                    width: "40%",
                                    height: "350px",
                                    // border: `1px solid black`,
                                    borderRadius: "20px",
                                    padding: "1rem",
                                }, children: _jsx(Calendar, { fullscreen: false, onPanelChange: onPanelChange }) }), _jsx("div", {})] }), _jsx("button", { className: "back-button", children: "\u0E22\u0E49\u0E2D\u0E19\u0E01\u0E25\u0E31\u0E1A" })] })] }));
};
export default Booking;
