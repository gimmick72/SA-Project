import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./design/contact.css";
// FullLayout removed - now handled by route wrapper
const InitialPage = () => {
    return (_jsxs("div", { className: "wrapper", children: [_jsx("div", { className: "header", children: _jsx("h2", { style: { fontWeight: "600" }, children: "\u0E2D\u0E32\u0E01\u0E32\u0E23\u0E40\u0E1A\u0E37\u0E49\u0E2D\u0E07\u0E15\u0E49\u0E19" }) }), _jsxs("div", { style: { paddingLeft: "3rem" }, children: [_jsxs("div", { className: "row1", children: [_jsxs("div", { children: [_jsx("div", { children: "\u0E23\u0E2B\u0E31\u0E2A\u0E04\u0E19\u0E44\u0E02\u0E49" }), _jsx("input", { className: "inputbox", type: "text", id: "patientID", name: "patientID", required: true })] }), _jsxs("div", { children: [_jsx("div", { children: "\u0E40\u0E25\u0E02\u0E1A\u0E31\u0E15\u0E23\u0E1B\u0E23\u0E30\u0E0A\u0E32\u0E0A\u0E19" }), _jsx("input", { className: "inputbox", type: "text", id: "citizenID", name: "citizenID" })] })] }), _jsx("div", { children: _jsxs("div", { className: "contact-row", children: [_jsxs("div", { children: [_jsx("div", { children: "\u0E04\u0E33\u0E19\u0E33\u0E2B\u0E19\u0E49\u0E32" }), _jsx("input", { type: "text", id: "prefix", name: "prefix", className: "inputbox" })] }), _jsxs("div", { children: [_jsx("div", { children: "\u0E0A\u0E37\u0E48\u0E2D" }), _jsx("input", { type: "text", id: "firstname", name: "firstname", className: "inputbox" })] }), _jsxs("div", { children: [_jsx("div", { children: "\u0E19\u0E32\u0E21\u0E2A\u0E01\u0E38\u0E25" }), _jsx("input", { type: "text", id: "lastname", name: "lastname", className: "inputbox" })] }), _jsxs("div", { children: [_jsx("div", { children: "\u0E0A\u0E37\u0E48\u0E2D\u0E40\u0E25\u0E48\u0E19" }), _jsx("input", { type: "text", id: "nickname", name: "nickname", className: "inputbox" })] })] }) }), _jsxs("div", { className: "row5", children: [_jsxs("div", { children: [_jsx("span", { style: {
                                            fontWeight: "700",
                                            width: "100px",
                                            marginRight: "3rem",
                                            fontSize: "16px",
                                        }, children: "\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E17\u0E31\u0E19\u0E15\u0E01\u0E23\u0E23\u0E21" }), _jsx("input", { className: "service", type: "text", id: "service", name: "service", style: { width: "200px", height: "30px", marginRight: "3rem", fontSize: "16px", border: "0.5px solid #000", borderRadius: "7px" } })] }), _jsxs("div", { children: [_jsx("span", { style: {
                                            fontWeight: "700",
                                            width: "100px",
                                            marginRight: "3rem",
                                            fontSize: "16px",
                                        }, children: "\u0E2D\u0E31\u0E15\u0E23\u0E32\u0E01\u0E32\u0E23\u0E40\u0E15\u0E49\u0E19\u0E2B\u0E31\u0E27\u0E43\u0E08" }), _jsx("input", { className: "heart-rate", type: "text", id: "heart-rate", name: "heart-rate", style: { width: "200px", height: "30px", marginRight: "3rem", fontSize: "16px", border: "0.5px solid #000", borderRadius: "7px" } })] })] }), _jsx("br", {}), _jsxs("div", { className: "row6", children: [_jsxs("div", { children: [_jsx("span", { style: {
                                            fontWeight: "700",
                                            width: "100px",
                                            marginRight: "3rem",
                                            fontSize: "16px",
                                        }, children: "\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E40\u0E02\u0E49\u0E32\u0E23\u0E31\u0E1A\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23" }), _jsx("input", { className: "visit-date", type: "datetime-local", id: "date", name: "date", style: { width: "200px", height: "30px", marginRight: "3rem", fontSize: "16px", border: "0.5px solid #000", borderRadius: "7px" } })] }), _jsxs("div", { children: [_jsx("span", { style: {
                                            fontWeight: "700",
                                            width: "100px",
                                            marginRight: "3rem",
                                            fontSize: "16px",
                                        }, children: "\u0E04\u0E27\u0E32\u0E21\u0E14\u0E31\u0E19" }), _jsx("input", { className: "blood-pressure", type: "text", id: "blood-pressure", name: "blood-pressure", style: { width: "200px", height: "30px", marginRight: "3rem", fontSize: "16px", border: "0.5px solid #000", borderRadius: "7px" } })] })] }), _jsx("br", {}), _jsx("div", { className: "row7", children: _jsxs("div", { children: [_jsx("span", { style: {
                                        fontWeight: "700",
                                        width: "100px",
                                        marginRight: "3rem",
                                        fontSize: "16px",
                                    }, children: "\u0E2D\u0E32\u0E01\u0E32\u0E23" }), _jsx("input", { className: "initial-symptoms", type: "text", id: "initial-symptoms", name: "initial-symptoms", style: { width: "250px", height: "50px", marginRight: "3rem", fontSize: "16px", border: "0.5px solid #000", borderRadius: "7px" } })] }) }), _jsxs("div", { className: "button-contact", children: [_jsx("button", { type: "submit", className: "save-button", children: "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01" }), _jsx("button", { type: "button", className: "cancel-button", onClick: () => window.history.back(), children: "\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01" })] })] })] }));
};
export default InitialPage;
