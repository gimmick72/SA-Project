import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card } from "antd";
import { Link } from "react-router-dom";
import HistoryTable from "./component_patient/historyTable";
import "./design/history.css";
import FullLayout from "../../../layout/FullLayout";
const columns = [
    {
        title: "วันที่เข้ารับบริการ",
        dataIndex: "visitDate",
        key: "visitDate",
    },
    {
        title: "บริการ",
        dataIndex: "service",
        key: "service",
    },
];
const data = [
    {
        key: "1",
        visitDate: "01/08/2025",
        service: "ขูดหินปูน",
    },
    {
        key: "2",
        visitDate: "05/07/2025",
        service: "อุดฟัน",
    },
    {
        key: "3",
        visitDate: "05/07/2025",
        service: "อุดฟัน",
    },
];
const HistoryPage = () => {
    return (_jsx(FullLayout, { children: _jsxs("div", { className: "wrapper", children: [_jsxs("div", { className: "header", children: [_jsx("h2", { style: { fontWeight: "600" }, children: "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1B\u0E23\u0E30\u0E08\u0E33\u0E15\u0E31\u0E27" }), _jsx("h3", { className: "header-element", children: _jsx(Link, { to: "/patient/contact", children: _jsxs("span", { style: { margin: "0.5rem", color: "black", fontWeight: "400" }, children: ["\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E01\u0E32\u0E23\u0E15\u0E34\u0E14\u0E15\u0E48\u0E2D", " "] }) }) }), _jsx("h3", { className: "header-element", children: _jsx(Link, { to: "/patient/history", children: _jsx("span", { style: { margin: "0.5rem", color: "black", fontWeight: "400" }, children: "\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E01\u0E32\u0E23\u0E23\u0E31\u0E01\u0E29\u0E32" }) }) })] }), _jsxs("div", { className: "content-box", children: [_jsx("div", { className: "table-section", children: _jsx(HistoryTable, {}) }), _jsxs("div", { className: "detail-section", children: [_jsx("h3", { style: { marginLeft: "45%" }, children: "\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14" }), _jsxs(Card, { style: { width: 400, backgroundColor: "#FCFCFF" }, children: [_jsxs("div", { style: { display: "flex", margin: "0" }, children: [_jsx("p", { style: { marginRight: "3rem" }, children: "\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E40\u0E02\u0E49\u0E32\u0E23\u0E31\u0E1A\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23" }), _jsx("p", { children: "\u0E40\u0E27\u0E25\u0E32" })] }), _jsx("p", { children: "\u0E0A\u0E37\u0E48\u0E2D \u0E19\u0E32\u0E21\u0E2A\u0E01\u0E38\u0E25" }), _jsx("p", { children: "\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E17\u0E31\u0E19\u0E15\u0E01\u0E23\u0E23\u0E21" }), _jsx("p", { children: "\u0E17\u0E31\u0E19\u0E15\u0E41\u0E1E\u0E17\u0E22\u0E4C\u0E1C\u0E39\u0E49\u0E23\u0E31\u0E01\u0E29\u0E32" }), _jsx("p", { children: "\u0E1C\u0E25\u0E01\u0E32\u0E23\u0E27\u0E34\u0E19\u0E31\u0E08\u0E09\u0E31\u0E22" }), _jsx("div", { style: {
                                                width: "300px",
                                                height: "100px",
                                                margin: "2rem",
                                                border: "1px solid #000",
                                                borderRadius: "20px",
                                                textAlign: "center",
                                                alignContent: "center",
                                                backgroundColor: "white",
                                            }, children: "deteail" })] })] })] })] }) }));
};
export default HistoryPage;
