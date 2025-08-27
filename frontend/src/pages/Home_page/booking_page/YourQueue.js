import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Card } from 'antd';
import './yourQueue.css';
const YourQueue = () => {
    return (_jsx(_Fragment, { children: _jsx("div", { style: {
                // border: `1px solid black`,
                borderRadius: "20px",
                display: "grid",
                marginLeft: "10rem",
                marginRight: "10rem",
                marginTop: "5rem",
                marginBottom: "2rem",
                fontFamily: "sans-serif",
                justifyContent: "center",
            }, children: _jsx(Card, { title: "\u0E19\u0E31\u0E14\u0E2B\u0E21\u0E32\u0E22\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13", variant: "borderless", style: { width: 400, border: "1px solid black" }, children: _jsx("div", { style: {
                        // backgroundColor:"#F3F3F3",
                        padding: "2rem",
                        borderRadius: "10px",
                        margin: "2rem",
                    }, children: _jsxs("div", { children: [_jsxs("div", { children: ["\u0E0A\u0E37\u0E48\u0E2D \u0E19\u0E32\u0E21\u0E2A\u0E01\u0E38\u0E25", _jsx("div", { className: "box", children: "name" })] }), _jsxs("div", { children: ["\u0E2B\u0E21\u0E32\u0E22\u0E40\u0E25\u0E02\u0E42\u0E17\u0E23\u0E28\u0E31\u0E1E\u0E17\u0E4C", _jsx("div", { className: "box", children: "phone number" })] }), _jsxs("div", { children: ["\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E19\u0E31\u0E14\u0E2B\u0E21\u0E32\u0E22", _jsx("div", { className: "box", children: "date" })] }), _jsxs("div", { children: ["\u0E0A\u0E48\u0E27\u0E07\u0E40\u0E27\u0E25\u0E32", _jsx("div", { className: "box", children: "time" })] })] }) }) }) }) }));
};
export default YourQueue;
