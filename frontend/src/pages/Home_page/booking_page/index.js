import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import Card from "antd/es/card";
const { Meta } = Card;
import { Outlet } from "react-router-dom";
const BookingPage = () => {
    return (_jsxs(_Fragment, { children: [_jsx(Outlet, {}), _jsxs("div", { style: {
                    padding: "2rem",
                    borderRadius: "20px",
                    display: "grid",
                    placeItems: "center",
                    justifyContent: "center",
                }, children: [_jsx("div", { style: {
                            display: "flex",
                            justifyContent: "center",
                            fontSize: "2rem",
                            fontWeight: "bold",
                            marginBottom: "3rem",
                        }, children: "\u0E04\u0E38\u0E13\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E17\u0E33\u0E2D\u0E30\u0E44\u0E23" }), _jsx(Link, { to: "/booking/queue", children: _jsx(Card, { hoverable: true, style: { width: 300, height: 400, marginRight: "2rem" }, cover: _jsx("img", { alt: "example", src: "https://tse3.mm.bing.net/th/id/OIP.MHcgIR-4n7KYqKvFE3hp0QHaE7?cb=thfvnext&rs=1&pid=ImgDetMain&o=7&rm=3" }), children: _jsx(Meta, { title: "\u0E08\u0E31\u0E14\u0E1F\u0E31\u0E19", description: "dhjsgdhgsj" }) }) }), _jsx(Link, { to: "/booking/select-queue", children: _jsx(Card, { hoverable: true, style: { width: 300, height: 400, marginRight: "2rem" }, cover: _jsx("img", { alt: "example", src: "https://tse3.mm.bing.net/th/id/OIP.MHcgIR-4n7KYqKvFE3hp0QHaE7?cb=thfvnext&rs=1&pid=ImgDetMain&o=7&rm=3" }), children: _jsx(Meta, { title: "\u0E08\u0E31\u0E14\u0E1F\u0E31\u0E19", description: "dhjsgdhgsj" }) }) }), _jsx(Link, { to: "/booking/select-queue", children: _jsx(Card, { hoverable: true, style: { width: 300, height: 400 }, cover: _jsx("img", { alt: "example", src: "https://tse3.mm.bing.net/th/id/OIP.MHcgIR-4n7KYqKvFE3hp0QHaE7?cb=thfvnext&rs=1&pid=ImgDetMain&o=7&rm=3" }), children: _jsx(Meta, { title: "\u0E08\u0E31\u0E14\u0E1F\u0E31\u0E19", description: "dhjsgdhgsj" }) }) })] })] }));
};
export default BookingPage;
