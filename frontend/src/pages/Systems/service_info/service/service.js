import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import './service.css';
import { Modal, Input, Button } from 'antd';
// option select catagory service
const categoryOptions = [
    { value: "รักษาฮากแข่ว", label: "รักษาฮากแข่ว" },
    { value: "จัดแข่ว", label: "จัดแข่ว" },
    { value: "แข่วปลอม", label: "แข่วปลอม" },
];
const AddService = () => {
    const [items, setItems] = useState([]);
    const [currentCategory, setCurrentCategory] = useState("");
    const [editIndex, setEditIndex] = useState(null);
    const [newItem, setNewItem] = useState({
        name: "",
        price: 0,
        detail: "",
        category: "",
    });
    const [modal, setModal] = useState({
        visible: false,
        type: null,
        detail: '',
        itemIndex: null,
    });
    const filteredItems = currentCategory
        ? items.filter(item => item.category === currentCategory)
        : items;
    const handleChange = (field, value, index) => {
        if (index === undefined) {
            setNewItem(prev => (Object.assign(Object.assign({}, prev), { [field]: value })));
        }
        else {
            const updated = [...items];
            updated[index] = Object.assign(Object.assign({}, updated[index]), { [field]: value });
            setItems(updated);
        }
    };
    const handleAddItem = () => {
        if (!newItem.name || isNaN(newItem.price) || !currentCategory)
            return;
        setItems([...items, Object.assign(Object.assign({}, newItem), { id: Date.now(), category: currentCategory })]);
        setNewItem({ name: '', price: 0, detail: '', category: '' });
    };
    const handleDelete = (id) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };
    const handleEdit = (index) => setEditIndex(index);
    const handleSave = () => setEditIndex(null);
    const openModal = (type, index) => {
        if (type === 'add') {
            setModal({ visible: true, type, detail: '', itemIndex: null });
        }
        else if (index !== null) {
            setModal({
                visible: true,
                type,
                detail: items[index].detail,
                itemIndex: index
            });
        }
    };
    const handleModalSave = () => {
        if (modal.type === 'add') {
            setNewItem(prev => (Object.assign(Object.assign({}, prev), { detail: modal.detail })));
        }
        else if (modal.type === 'view' && modal.itemIndex !== null) {
            const updated = [...items];
            updated[modal.itemIndex].detail = modal.detail;
            setItems(updated);
        }
        setModal({ visible: false, type: null, detail: '', itemIndex: null });
    };
    return (_jsxs("div", { style: {
            width: '1220px',
            height: '550px',
            border: 'solid 2px #ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '25px',
        }, children: [_jsx("div", { style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '1200px',
                    marginTop: '20px',
                    border: 'solid 2px #ffffff',
                }, children: _jsxs("div", { style: {
                        display: 'flex',
                        gap: '20px',
                        justifyContent: 'center',
                        border: 'solid 2px #ffffff',
                    }, children: [_jsx("div", { style: { fontSize: '18px', fontWeight: 'bold' }, children: "\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23" }), _jsxs("select", { className: "select_category", value: currentCategory, onChange: (e) => setCurrentCategory(e.target.value), children: [_jsx("option", { value: "", children: "-- \u0E41\u0E2A\u0E14\u0E07\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14 --" }), categoryOptions.map(cat => (_jsx("option", { value: cat.value, children: cat.label }, cat.value)))] })] }) }), _jsxs("div", { style: {
                    width: '1200px',
                    height: '450px',
                    margin: '0', border: 'solid 2px #b8b8b8ff',
                    marginBottom: '30px',
                }, children: [_jsx("div", { style: {
                            width: '100%',
                            height: '446px',
                            border: 'solid 2px #fff',
                            overflow: 'auto',
                            marginBottom: '30px',
                        }, children: _jsxs("table", { className: "item-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { style: { width: '30%' }, children: "\u0E0A\u0E37\u0E48\u0E2D\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23" }), _jsx("th", { style: { width: '20%' }, children: "\u0E23\u0E32\u0E04\u0E32" }), _jsx("th", { style: { width: '16%' }, children: "\u0E2B\u0E21\u0E27\u0E14\u0E2B\u0E21\u0E39\u0E48" }), _jsx("th", { style: { width: '16%' }, children: "\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14" }), _jsx("th", { style: { width: '16%' }, children: "\u0E01\u0E32\u0E23\u0E08\u0E31\u0E14\u0E01\u0E32\u0E23" })] }) }), _jsxs("tbody", { children: [filteredItems.map((item, index) => (_jsxs("tr", { children: [_jsx("td", { children: editIndex === index ? (_jsx(Input, { value: item.name, onChange: (e) => handleChange('name', e.target.value, index) })) : item.name }), _jsx("td", { children: editIndex === index ? (_jsx(Input, { type: "number", value: item.price, onChange: (e) => handleChange('price', Number(e.target.value), index) })) : item.price }), _jsx("td", { children: item.category }), _jsx("td", { children: _jsx(Button, { onClick: () => openModal('view', index), children: "\u0E14\u0E39\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14" }) }), _jsxs("td", { className: "edit", children: [editIndex === index ? (_jsx(Button, { onClick: handleSave, children: "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01" })) : (_jsx(Button, { onClick: () => handleEdit(index), children: "\u0E41\u0E01\u0E49\u0E44\u0E02" })), _jsx(Button, { danger: true, onClick: () => handleDelete(item.id), children: "\u0E25\u0E1A" })] })] }, item.id))), currentCategory && (_jsxs("tr", { children: [_jsx("td", { children: _jsx(Input, { placeholder: "\u0E0A\u0E37\u0E48\u0E2D\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23", value: newItem.name, onChange: (e) => handleChange('name', e.target.value) }) }), _jsx("td", { children: _jsx(Input, { type: "number", placeholder: "\u0E23\u0E32\u0E04\u0E32", value: newItem.price, onChange: (e) => handleChange('price', Number(e.target.value)) }) }), _jsx("td", { children: currentCategory }), _jsx("td", { children: _jsx(Button, { onClick: () => openModal('add', null), children: "\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14" }) }), _jsx("td", { children: _jsx(Button, { type: "primary", onClick: handleAddItem, children: "\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23" }) })] }))] })] }) }), _jsx(Modal, { open: modal.visible, title: modal.type === 'add' ? 'เพิ่มรายละเอียด' : 'ดูรายละเอียด', onOk: handleModalSave, onCancel: () => setModal({ visible: false, type: null, detail: '', itemIndex: null }), okText: "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01", cancelText: "\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01", children: _jsx(Input.TextArea, { rows: 4, placeholder: "\u0E1E\u0E34\u0E21\u0E1E\u0E4C\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E17\u0E35\u0E48\u0E19\u0E35\u0E48...", value: modal.detail, onChange: (e) => setModal(Object.assign(Object.assign({}, modal), { detail: e.target.value })) }) })] })] }));
};
export default AddService;
