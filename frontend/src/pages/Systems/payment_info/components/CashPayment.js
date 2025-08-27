import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, Form, Input, Typography } from "antd";
const { Text } = Typography;
const CashPayment = ({ form }) => {
    return (_jsxs(Card, { title: "\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E01\u0E32\u0E23\u0E0A\u0E33\u0E23\u0E30\u0E14\u0E49\u0E27\u0E22\u0E40\u0E07\u0E34\u0E19\u0E2A\u0E14", size: "small", style: { marginBottom: '16px' }, children: [_jsx(Form.Item, { label: "\u0E08\u0E33\u0E19\u0E27\u0E19\u0E40\u0E07\u0E34\u0E19\u0E17\u0E35\u0E48\u0E23\u0E31\u0E1A\u0E21\u0E32", name: "receivedAmount", rules: [
                    { required: true, message: 'กรุณาระบุจำนวนเงินที่รับมา' },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            const amount = getFieldValue('amount');
                            if (!value || value >= amount) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('จำนวนเงินที่รับมาต้องมากกว่าหรือเท่ากับยอดที่ต้องชำระ'));
                        },
                    }),
                ], children: _jsx(Input, { type: "number", prefix: "\u0E3F", placeholder: "0.00" }) }), _jsx(Form.Item, { dependencies: ['amount', 'receivedAmount'], children: ({ getFieldValue }) => {
                    const amount = getFieldValue('amount') || 0;
                    const received = getFieldValue('receivedAmount') || 0;
                    const change = received - amount;
                    return change > 0 ? (_jsx("div", { style: { padding: '12px', backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: '6px' }, children: _jsxs(Text, { strong: true, style: { color: '#52c41a' }, children: ["\u0E40\u0E07\u0E34\u0E19\u0E17\u0E2D\u0E19: \u0E3F", change.toFixed(2)] }) })) : null;
                } })] }));
};
export default CashPayment;
