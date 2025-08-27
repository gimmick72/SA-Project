import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Modal } from 'antd';
const ShowEven = ({ event, visible, onClose }) => {
    return (_jsx(Modal, { title: "\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14", open: visible, onOk: onClose, onCancel: onClose, okText: "\u0E1B\u0E34\u0E14", cancelButtonProps: { style: { display: 'none' } }, children: event ? (_jsxs(_Fragment, { children: [_jsxs("p", { children: [_jsx("strong", { children: "\u0E2B\u0E49\u0E2D\u0E07:" }), " ", event.title || 'ไม่ระบุชื่อ'] }), _jsxs("p", { children: [_jsx("strong", { children: "\u0E40\u0E23\u0E34\u0E48\u0E21:" }), " ", event.start ? event.start.toLocaleString() : 'ไม่ระบุเวลาเริ่ม'] }), _jsxs("p", { children: [_jsx("strong", { children: "\u0E2A\u0E34\u0E49\u0E19\u0E2A\u0E38\u0E14:" }), " ", event.end ? event.end.toLocaleString() : 'ไม่ระบุเวลาสิ้นสุด'] })] })) : (_jsx("p", { children: "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E01\u0E34\u0E08\u0E01\u0E23\u0E23\u0E21" })) }));
};
export default ShowEven;
