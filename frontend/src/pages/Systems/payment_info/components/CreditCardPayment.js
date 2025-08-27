import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, Form, Input, Space, Typography } from "antd";
const { Text } = Typography;
const CreditCardPayment = ({ form }) => {
    return (_jsxs(Card, { title: "\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E1A\u0E31\u0E15\u0E23\u0E40\u0E04\u0E23\u0E14\u0E34\u0E15", size: "small", style: { marginBottom: '16px' }, children: [_jsx(Form.Item, { label: "\u0E2B\u0E21\u0E32\u0E22\u0E40\u0E25\u0E02\u0E1A\u0E31\u0E15\u0E23", name: "cardNumber", rules: [
                    { required: true, message: 'กรุณาระบุหมายเลขบัตร' },
                    { pattern: /^[0-9]{16}$/, message: 'หมายเลขบัตรต้องเป็นตัวเลข 16 หลัก' }
                ], children: _jsx(Input, { placeholder: "1234 5678 9012 3456", maxLength: 16 }) }), _jsx(Form.Item, { label: "\u0E0A\u0E37\u0E48\u0E2D\u0E1C\u0E39\u0E49\u0E16\u0E37\u0E2D\u0E1A\u0E31\u0E15\u0E23", name: "cardHolder", rules: [{ required: true, message: 'กรุณาระบุชื่อผู้ถือบัตร' }], children: _jsx(Input, { placeholder: "JOHN DOE", style: { textTransform: 'uppercase' } }) }), _jsxs(Space.Compact, { style: { width: '100%' }, children: [_jsx(Form.Item, { label: "\u0E27\u0E31\u0E19\u0E2B\u0E21\u0E14\u0E2D\u0E32\u0E22\u0E38", name: "expiryDate", style: { width: '50%' }, rules: [
                            { required: true, message: 'กรุณาระบุวันหมดอายุ' },
                            { pattern: /^(0[1-9]|1[0-2])\/([0-9]{2})$/, message: 'รูปแบบ: MM/YY' }
                        ], children: _jsx(Input, { placeholder: "MM/YY", maxLength: 5 }) }), _jsx(Form.Item, { label: "CVV", name: "cvv", style: { width: '50%' }, rules: [
                            { required: true, message: 'กรุณาระบุ CVV' },
                            { pattern: /^[0-9]{3,4}$/, message: 'CVV ต้องเป็นตัวเลข 3-4 หลัก' }
                        ], children: _jsx(Input, { placeholder: "123", maxLength: 4 }) })] }), _jsx("div", { style: { padding: '12px', backgroundColor: '#fff2e8', border: '1px solid #ffcc99', borderRadius: '6px' }, children: _jsx(Text, { type: "secondary", children: "\uD83D\uDD12 \u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1A\u0E31\u0E15\u0E23\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13\u0E08\u0E30\u0E16\u0E39\u0E01\u0E40\u0E02\u0E49\u0E32\u0E23\u0E2B\u0E31\u0E2A\u0E41\u0E25\u0E30\u0E1B\u0E25\u0E2D\u0E14\u0E20\u0E31\u0E22" }) })] }));
};
export default CreditCardPayment;
