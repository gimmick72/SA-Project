import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Modal, Input, Form, Select } from 'antd';
const AddEventModal = ({ visible, onAdd, onCancel }) => {
    const [title, setTitle] = useState('');
    const [timein, setTimein] = useState('');
    const [timeout, setTimeout] = useState('');
    const handleOk = () => {
        if (title && timein && timeout) {
            const today = new Date();
            const start = new Date(today.toDateString() + ' ' + timein);
            const end = new Date(today.toDateString() + ' ' + timeout);
            onAdd({ title, start, end });
            setTitle('');
            setTimein('');
            setTimeout('');
        }
    };
    //option of room
    const rooms = ["x001", "x002", "x003", "004"];
    return (_jsx(Modal, { title: "\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E01\u0E34\u0E08\u0E01\u0E23\u0E23\u0E21", open: visible, onOk: handleOk, onCancel: () => {
            setTitle('');
            onCancel();
        }, okText: "\u0E40\u0E1E\u0E34\u0E48\u0E21", cancelText: "\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01", children: _jsx(Form, { layout: "vertical", children: _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: 0 }, children: [_jsx(Form.Item, { label: "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E2B\u0E49\u0E2D\u0E07", children: _jsx(Select, { value: title, onChange: (value) => setTitle(value), placeholder: "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E2B\u0E49\u0E2D\u0E07", options: rooms.map((room) => ({
                                value: room,
                                label: room,
                            })) }) }), _jsx(Form.Item, { label: "\u0E40\u0E27\u0E25\u0E32\u0E40\u0E02\u0E49\u0E32\u0E07\u0E32\u0E19", children: _jsx(Input, { type: 'time', value: timein, onChange: (e) => setTimein(e.target.value) }) }), _jsx(Form.Item, { label: "\u0E40\u0E27\u0E25\u0E32\u0E2D\u0E2D\u0E01\u0E07\u0E32\u0E19", children: _jsx(Input, { type: 'time', value: timeout, onChange: (e) => setTimeout(e.target.value) }) })] }) }) }));
};
export default AddEventModal;
