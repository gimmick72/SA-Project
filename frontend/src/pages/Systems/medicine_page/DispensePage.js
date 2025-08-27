import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/medicine_page/DispensePage.tsx
import { useState } from 'react';
import { Form, Input, Button, Select, InputNumber, Card, Row, Col, Table, message, Space } from 'antd';
import { MinusCircleOutlined } from '@ant-design/icons';
const { Option } = Select;
const mockSupplies = [
    { code: 'MED001', name: 'ยาแก้ปวดพาราเซตามอล', category: 'ยาเม็ด' },
    { code: 'MED002', name: 'แอลกอฮอล์ล้างแผล', category: 'ของเหลว' },
    { code: 'MED003', name: 'พลาสเตอร์ปิดแผล', category: 'อุปกรณ์ทำแผล' },
];
const DispensePage = () => {
    const [form] = Form.useForm();
    const [dispenseList, setDispenseList] = useState([]);
    const handleSupplyChange = (value) => {
        const selectedSupply = mockSupplies.find(item => item.code === value);
        if (selectedSupply) {
            form.setFieldsValue({
                supplyName: selectedSupply.name,
                supplyCategory: selectedSupply.category,
            });
        }
    };
    const handleAddToList = () => {
        form.validateFields(['caseCode', 'supplyCode', 'quantity'])
            .then(values => {
            const selectedSupply = mockSupplies.find(item => item.code === values.supplyCode);
            if (selectedSupply) {
                const newDispenseItem = {
                    key: `${values.caseCode}-${values.supplyCode}-${dispenseList.length}`,
                    caseCode: values.caseCode,
                    supplyCode: selectedSupply.code,
                    supplyName: selectedSupply.name,
                    quantity: values.quantity,
                };
                setDispenseList(prevList => [...prevList, newDispenseItem]);
                message.success('เพิ่มรายการเบิกสำเร็จ!');
                form.resetFields(['supplyCode', 'supplyName', 'supplyCategory', 'quantity']);
            }
        })
            .catch(info => {
            console.log('Validate Failed:', info);
        });
    };
    const handleDeleteItem = (key) => {
        setDispenseList(dispenseList.filter(item => item.key !== key));
        message.success('ลบรายการสำเร็จ!');
    };
    const handleConfirmDispense = () => {
        console.log("รายการที่เบิกจ่ายทั้งหมด:", dispenseList);
        message.success("ยืนยันการเบิกจ่ายสำเร็จ!");
        setDispenseList([]);
        form.resetFields();
    };
    const handleCancelDispense = () => {
        setDispenseList([]);
        form.resetFields();
        message.info("ยกเลิกการเบิกจ่าย");
    };
    const columns = [
        { title: 'ชื่อเวชภัณฑ์', dataIndex: 'supplyName', key: 'supplyName' },
        { title: 'จำนวน', dataIndex: 'quantity', key: 'quantity' },
        {
            title: 'ลบ',
            key: 'action',
            width: 70,
            render: (_, record) => (_jsx(Button, { type: "text", danger: true, icon: _jsx(MinusCircleOutlined, {}), onClick: () => handleDeleteItem(record.key) })),
        },
    ];
    return (_jsx(Card, { title: "\u0E01\u0E32\u0E23\u0E40\u0E1A\u0E34\u0E01/\u0E08\u0E48\u0E32\u0E22\u0E40\u0E27\u0E0A\u0E20\u0E31\u0E13\u0E11\u0E4C", bordered: true, style: { borderRadius: '12px' }, children: _jsxs(Row, { gutter: 32, children: [_jsx(Col, { span: 12, children: _jsxs(Form, { form: form, layout: "vertical", name: "dispense_form", children: [_jsx(Form.Item, { name: "caseCode", label: "\u0E23\u0E2B\u0E31\u0E2A\u0E40\u0E04\u0E2A", rules: [{ required: true, message: 'กรุณากรอกรหัสเคส!' }], children: _jsx(Input, { placeholder: "\u0E23\u0E2B\u0E31\u0E2A\u0E40\u0E04\u0E2A" }) }), _jsx(Form.Item, { name: "supplyCode", label: "\u0E23\u0E2B\u0E31\u0E2A\u0E40\u0E27\u0E0A\u0E20\u0E31\u0E13\u0E11\u0E4C", rules: [{ required: true, message: 'กรุณาเลือกรหัสเวชภัณฑ์!' }], children: _jsx(Select, { placeholder: "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E23\u0E2B\u0E31\u0E2A\u0E40\u0E27\u0E0A\u0E20\u0E31\u0E13\u0E11\u0E4C", onChange: handleSupplyChange, children: mockSupplies.map(supply => (_jsx(Option, { value: supply.code, children: supply.code }, supply.code))) }) }), _jsx(Form.Item, { name: "supplyName", label: "\u0E0A\u0E37\u0E48\u0E2D\u0E40\u0E27\u0E0A\u0E20\u0E31\u0E13\u0E11\u0E4C", children: _jsx(Input, { placeholder: "\u0E0A\u0E37\u0E48\u0E2D\u0E40\u0E27\u0E0A\u0E20\u0E31\u0E13\u0E11\u0E4C", disabled: true }) }), _jsx(Form.Item, { name: "supplyCategory", label: "\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17", children: _jsx(Input, { placeholder: "\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17", disabled: true }) }), _jsx(Form.Item, { name: "quantity", label: "\u0E08\u0E33\u0E19\u0E27\u0E19", rules: [{ required: true, message: 'กรุณากรอกจำนวน!' }], children: _jsx(InputNumber, { min: 1, style: { width: '100%' }, placeholder: "\u0E08\u0E33\u0E19\u0E27\u0E19" }) }), _jsx(Form.Item, { name: "dispenser", label: "\u0E1C\u0E39\u0E49\u0E40\u0E1A\u0E34\u0E01 / \u0E2B\u0E19\u0E48\u0E27\u0E22\u0E07\u0E32\u0E19", children: _jsx(Input, { placeholder: "\u0E0A\u0E37\u0E48\u0E2D\u0E1C\u0E39\u0E49\u0E40\u0E1A\u0E34\u0E01\u0E2B\u0E23\u0E37\u0E2D\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E07\u0E32\u0E19" }) }), _jsx(Form.Item, { children: _jsxs(Space, { children: [_jsx(Button, { type: "primary", onClick: handleAddToList, children: "\u0E40\u0E1E\u0E34\u0E48\u0E21" }), _jsx(Button, { onClick: () => form.resetFields(), children: "\u0E25\u0E49\u0E32\u0E07\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25" })] }) })] }) }), _jsx(Col, { span: 12, children: _jsxs(Card, { bordered: true, style: { borderRadius: '8px', minHeight: '400px' }, children: [_jsx(Table, { dataSource: dispenseList, columns: columns, pagination: false, locale: { emptyText: 'No data' }, style: { marginBottom: '16px' } }), _jsx("div", { style: { textAlign: 'right' }, children: _jsxs(Space, { children: [_jsx(Button, { type: "primary", onClick: handleConfirmDispense, children: "\u0E15\u0E01\u0E25\u0E07" }), _jsx(Button, { onClick: handleCancelDispense, children: "\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01" })] }) })] }) })] }) }));
};
export default DispensePage;
