import { jsx as _jsx } from "react/jsx-runtime";
import { Card } from "antd";
import DraggableCard from "./DraggableCard";
const QueueSidebar = ({ patients }) => {
    return (_jsx(Card, { title: "\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E04\u0E34\u0E27\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14", style: {
            height: "560px",
            overflowY: "auto",
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        }, headStyle: { backgroundColor: "#F0EBFA", fontWeight: 600 }, children: patients.map((p) => (_jsx(DraggableCard, { patient: p }, p.id))) }));
};
export default QueueSidebar;
