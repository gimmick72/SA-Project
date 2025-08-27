import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, Button, Result, Typography } from "antd";
import { CheckCircleOutlined, HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
const { Text } = Typography;
const PaymentSuccess = ({ paymentMethod, amount, transactionId = `TXN${Date.now()}` }) => {
    const navigate = useNavigate();
    const getPaymentMethodName = (method) => {
        switch (method) {
            case 'cash': return 'เงินสด';
            case 'promptpay': return 'พร้อมเพย์';
            case 'credit_card': return 'บัตรเครดิต';
            default: return method;
        }
    };
    return (_jsx("div", { style: { padding: '24px', display: 'flex', justifyContent: 'center' }, children: _jsx(Card, { style: { maxWidth: 600, width: '100%' }, children: _jsx(Result, { icon: _jsx(CheckCircleOutlined, { style: { color: '#52c41a' } }), status: "success", title: "\u0E0A\u0E33\u0E23\u0E30\u0E40\u0E07\u0E34\u0E19\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08!", subTitle: _jsxs("div", { children: [_jsx(Text, { children: "\u0E01\u0E32\u0E23\u0E0A\u0E33\u0E23\u0E30\u0E40\u0E07\u0E34\u0E19\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A\u0E01\u0E32\u0E23\u0E14\u0E33\u0E40\u0E19\u0E34\u0E19\u0E01\u0E32\u0E23\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22\u0E41\u0E25\u0E49\u0E27" }), _jsx("br", {}), _jsxs(Text, { type: "secondary", children: ["\u0E23\u0E2B\u0E31\u0E2A\u0E18\u0E38\u0E23\u0E01\u0E23\u0E23\u0E21: ", transactionId] })] }), extra: [
                    _jsx("div", { style: { marginBottom: '20px' }, children: _jsxs(Card, { size: "small", style: { backgroundColor: '#f6ffed' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }, children: [_jsx(Text, { strong: true, children: "\u0E27\u0E34\u0E18\u0E35\u0E01\u0E32\u0E23\u0E0A\u0E33\u0E23\u0E30:" }), _jsx(Text, { children: getPaymentMethodName(paymentMethod) })] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }, children: [_jsx(Text, { strong: true, children: "\u0E08\u0E33\u0E19\u0E27\u0E19\u0E40\u0E07\u0E34\u0E19:" }), _jsxs(Text, { strong: true, style: { color: '#52c41a' }, children: ["\u0E3F", amount.toFixed(2)] })] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between' }, children: [_jsx(Text, { strong: true, children: "\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48:" }), _jsx(Text, { children: new Date().toLocaleDateString('th-TH') })] })] }) }, "details"),
                    _jsx(Button, { type: "primary", icon: _jsx(HomeOutlined, {}), onClick: () => navigate('/admin'), size: "large", children: "\u0E01\u0E25\u0E31\u0E1A\u0E2B\u0E19\u0E49\u0E32\u0E2B\u0E25\u0E31\u0E01" }, "home"),
                    _jsx(Button, { onClick: () => window.location.reload(), size: "large", children: "\u0E0A\u0E33\u0E23\u0E30\u0E40\u0E07\u0E34\u0E19\u0E43\u0E2B\u0E21\u0E48" }, "new")
                ] }) }) }));
};
export default PaymentSuccess;
