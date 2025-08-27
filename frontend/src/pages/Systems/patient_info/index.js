import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import "./design/index.css";
import PatienTable from "./component_patient/table";
// FullLayout removed - now handled by route wrapper
const PatientInfoPage = () => {
    return (_jsx(_Fragment, { children: _jsxs("div", { className: "wrapper", children: [_jsx("div", { className: "header", children: _jsx("h2", { style: { fontWeight: "600" }, children: "\u0E23\u0E32\u0E22\u0E0A\u0E37\u0E48\u0E2D\u0E04\u0E19\u0E44\u0E02\u0E49" }) }), _jsxs("div", { children: [_jsx("input", { type: "search", placeholder: "Search", className: "search-input" }), _jsx(Link, { to: '/patient/add', children: _jsx("button", { className: "add-button", children: "\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34" }) })] }), _jsx("br", {}), _jsx(PatienTable, {})] }) }));
};
export default PatientInfoPage;
