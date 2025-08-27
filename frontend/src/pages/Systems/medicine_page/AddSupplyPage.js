import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Form, Input, Button, InputNumber, Select, DatePicker, message, Card, Space, Row, Col } from 'antd';
import dayjs from 'dayjs';
const { Option } = Select;
const AddSupplyPage = () => {
    const [form] = Form.useForm();
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
        message.success('เพิ่มเวชภัณฑ์สำเร็จ!');
        form.resetFields();
    };
    const onReset = () => {
        form.resetFields();
        message.info('ฟอร์มถูกล้างข้อมูลแล้ว');
    };
    const categories = ['ยาเม็ด', 'ของเหลว', 'อุปกรณ์ทำแผล'];
    return (_jsx(Card, { title: "\u0E41\u0E1A\u0E1A\u0E1F\u0E2D\u0E23\u0E4C\u0E21\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E40\u0E27\u0E0A\u0E20\u0E31\u0E13\u0E11\u0E4C", bordered: true, style: { borderRadius: '12px' }, children: _jsxs(Form, { form: form, layout: "vertical", name: "add_supply_form", onFinish: onFinish, initialValues: { importDate: dayjs() }, scrollToFirstError: true, children: [_jsxs(Row, { gutter: 24, children: [_jsx(Col, { span: 12, children: _jsx(Form.Item, { name: "code", label: "\u0E23\u0E2B\u0E31\u0E2A\u0E40\u0E27\u0E0A\u0E20\u0E31\u0E13\u0E11\u0E4C", rules: [{ required: true, message: 'กรุณากรอกรหัสเวชภัณฑ์!' }], children: _jsx(Input, { placeholder: "\u0E40\u0E0A\u0E48\u0E19 MED001" }) }) }), _jsx(Col, { span: 12, children: _jsx(Form.Item, { name: "name", label: "\u0E0A\u0E37\u0E48\u0E2D\u0E40\u0E27\u0E0A\u0E20\u0E31\u0E13\u0E11\u0E4C", rules: [{ required: true, message: 'กรุณากรอกชื่อเวชภัณฑ์!' }], children: _jsx(Input, { placeholder: "\u0E40\u0E0A\u0E48\u0E19 \u0E22\u0E32\u0E41\u0E01\u0E49\u0E1B\u0E27\u0E14\u0E1E\u0E32\u0E23\u0E32\u0E40\u0E0B\u0E15\u0E32\u0E21\u0E2D\u0E25" }) }) }), _jsx(Col, { span: 12, children: _jsx(Form.Item, { name: "category", label: "\u0E2B\u0E21\u0E27\u0E14\u0E2B\u0E21\u0E39\u0E48", rules: [{ required: true, message: 'กรุณาเลือกหมวดหมู่!' }], children: _jsx(Select, { placeholder: "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E2B\u0E21\u0E27\u0E14\u0E2B\u0E21\u0E39\u0E48", children: categories.map((category) => (_jsx(Option, { value: category, children: category }, category))) }) }) }), _jsx(Col, { span: 12, children: _jsx(Form.Item, { name: "quantity", label: "\u0E08\u0E33\u0E19\u0E27\u0E19", rules: [{ required: true, message: 'กรุณากรอกจำนวน!' }], children: _jsx(InputNumber, { min: 1, style: { width: '100%' }, placeholder: "\u0E08\u0E33\u0E19\u0E27\u0E19" }) }) }), _jsx(Col, { span: 12, children: _jsx(Form.Item, { name: "unit", label: "\u0E2B\u0E19\u0E48\u0E27\u0E22", rules: [{ required: true, message: 'กรุณากรอกหน่วย!' }], children: _jsx(Input, { placeholder: "\u0E40\u0E0A\u0E48\u0E19 \u0E40\u0E21\u0E47\u0E14, \u0E02\u0E27\u0E14, \u0E41\u0E1C\u0E07" }) }) }), _jsx(Col, { span: 12, children: _jsx(Form.Item, { name: "importDate", label: "\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E19\u0E33\u0E40\u0E02\u0E49\u0E32", rules: [{ required: true, message: 'กรุณาเลือกวันที่นำเข้า!' }], children: _jsx(DatePicker, { style: { width: '100%' } }) }) }), _jsx(Col, { span: 12, children: _jsx(Form.Item, { name: "expiryDate", label: "\u0E27\u0E31\u0E19\u0E2B\u0E21\u0E14\u0E2D\u0E32\u0E22\u0E38", rules: [{ required: true, message: 'กรุณาเลือกวันหมดอายุ!' }], children: _jsx(DatePicker, { style: { width: '100%' } }) }) })] }), _jsx(Form.Item, { style: { marginTop: '24px' }, children: _jsxs(Space, { children: [_jsx(Button, { type: "primary", htmlType: "submit", children: "\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E40\u0E27\u0E0A\u0E20\u0E31\u0E13\u0E11\u0E4C" }), _jsx(Button, { htmlType: "button", onClick: onReset, children: "\u0E25\u0E49\u0E32\u0E07\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25" })] }) })] }) }));
};
export default AddSupplyPage;
