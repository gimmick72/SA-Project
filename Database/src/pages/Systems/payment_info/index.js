var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Form, Card, Typography, Button, Radio, message, Input, Divider, Space } from 'antd';
import { DollarOutlined, MobileOutlined, CreditCardOutlined } from '@ant-design/icons';
import CashPayment from './components/CashPayment';
import OnlinePayment from './components/OnlinePayment';
import CreditCardPayment from './components/CreditCardPayment';
import PaymentSuccess from './components/PaymentSuccess';
import PaymentError from './components/PaymentError';
import { paymentApi } from '../../../services/paymentApi';
const { Title, Text } = Typography;
const PaymentInfoPage = () => {
    const [form] = Form.useForm();
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [loading, setLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('form');
    const [paymentData, setPaymentData] = useState(null);
    const [errorInfo, setErrorInfo] = useState(null);
    const onFinish = (values) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        try {
            // Prepare payment request based on payment method
            const paymentRequest = {
                amount: values.amount,
                paymentMethod: values.paymentMethod,
                reference: values.reference,
            };
            // Add method-specific data
            if (values.paymentMethod === 'cash') {
                paymentRequest.cashReceived = values.cashReceived || values.amount;
            }
            else if (values.paymentMethod === 'credit_card') {
                paymentRequest.cardNumber = values.cardNumber;
                paymentRequest.cardType = values.cardType;
                paymentRequest.expiryDate = values.expiryDate;
                paymentRequest.cvv = values.cvv;
            }
            // Process payment through API
            const response = yield paymentApi.processPayment(paymentRequest);
            if (response.status === 'completed' || response.status === 'pending') {
                setPaymentStatus('success');
                setPaymentData(Object.assign(Object.assign({}, values), { transactionId: response.transactionId, timestamp: response.timestamp, change: response.change }));
                message.success(response.message);
            }
            else {
                throw new Error(response.message || 'Payment failed');
            }
        }
        catch (error) {
            setErrorInfo({
                message: "เกิดข้อผิดพลาดในระบบ กรุณาติดต่อเจ้าหน้าที่",
                code: "ERR_SYSTEM_ERROR"
            });
            setPaymentStatus('error');
        }
        finally {
            setLoading(false);
        }
    });
    const handleRetry = () => {
        setPaymentStatus('form');
        setErrorInfo(null);
        setPaymentData(null);
    };
    const getPaymentMethodName = (method) => {
        switch (method) {
            case 'cash': return 'เงินสด';
            case 'promptpay': return 'พร้อมเพย์';
            case 'credit_card': return 'บัตรเครดิต';
            default: return method;
        }
    };
    // Show success page
    if (paymentStatus === 'success' && paymentData) {
        return (_jsx(PaymentSuccess, { paymentMethod: paymentData.paymentMethod, amount: paymentData.amount }));
    }
    // Show error page
    if (paymentStatus === 'error' && errorInfo) {
        return (_jsx(PaymentError, { errorMessage: errorInfo.message, errorCode: errorInfo.code, onRetry: handleRetry }));
    }
    // Show payment form
    return (_jsxs("div", { style: {
            padding: '24px',
            height: '100vh',
            overflow: 'auto'
        }, children: [_jsx(Title, { level: 2, children: "\u0E0A\u0E33\u0E23\u0E30\u0E40\u0E07\u0E34\u0E19" }), _jsx(Card, { style: { maxWidth: 800, margin: '0 auto' }, children: _jsxs(Form, { form: form, layout: "vertical", onFinish: onFinish, initialValues: { paymentMethod: 'cash', amount: 0 }, children: [_jsx(Form.Item, { label: "\u0E08\u0E33\u0E19\u0E27\u0E19\u0E40\u0E07\u0E34\u0E19\u0E17\u0E35\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E0A\u0E33\u0E23\u0E30", name: "amount", rules: [
                                { required: true, message: 'กรุณาระบุจำนวนเงิน' },
                                { type: 'number', min: 1, message: 'จำนวนเงินต้องมากกว่า 0' }
                            ], children: _jsx(Input, { type: "number", prefix: "\u0E3F", placeholder: "0.00", size: "large", style: { fontSize: '18px', fontWeight: 'bold' } }) }), _jsx(Divider, {}), _jsx(Form.Item, { label: "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E27\u0E34\u0E18\u0E35\u0E01\u0E32\u0E23\u0E0A\u0E33\u0E23\u0E30\u0E40\u0E07\u0E34\u0E19", name: "paymentMethod", rules: [{ required: true, message: 'กรุณาเลือกวิธีการชำระเงิน' }], children: _jsx(Radio.Group, { onChange: (e) => setPaymentMethod(e.target.value), size: "large", children: _jsxs(Space, { direction: "vertical", style: { width: '100%' }, children: [_jsx(Radio, { value: "cash", style: { padding: '12px', border: '1px solid #d9d9d9', borderRadius: '8px', width: '100%' }, children: _jsxs(Space, { children: [_jsx(DollarOutlined, { style: { fontSize: '20px', color: '#52c41a' } }), _jsxs("div", { children: [_jsx(Text, { strong: true, children: "\u0E40\u0E07\u0E34\u0E19\u0E2A\u0E14 (Cash)" }), _jsx("br", {}), _jsx(Text, { type: "secondary", children: "\u0E0A\u0E33\u0E23\u0E30\u0E14\u0E49\u0E27\u0E22\u0E40\u0E07\u0E34\u0E19\u0E2A\u0E14\u0E42\u0E14\u0E22\u0E15\u0E23\u0E07" })] })] }) }), _jsx(Radio, { value: "promptpay", style: { padding: '12px', border: '1px solid #d9d9d9', borderRadius: '8px', width: '100%' }, children: _jsxs(Space, { children: [_jsx(MobileOutlined, { style: { fontSize: '20px', color: '#1890ff' } }), _jsxs("div", { children: [_jsx(Text, { strong: true, children: "\u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E40\u0E1E\u0E22\u0E4C (PromptPay)" }), _jsx("br", {}), _jsx(Text, { type: "secondary", children: "\u0E0A\u0E33\u0E23\u0E30\u0E1C\u0E48\u0E32\u0E19\u0E23\u0E30\u0E1A\u0E1A\u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E40\u0E1E\u0E22\u0E4C" })] })] }) }), _jsx(Radio, { value: "credit_card", style: { padding: '12px', border: '1px solid #d9d9d9', borderRadius: '8px', width: '100%' }, children: _jsxs(Space, { children: [_jsx(CreditCardOutlined, { style: { fontSize: '20px', color: '#722ed1' } }), _jsxs("div", { children: [_jsx(Text, { strong: true, children: "\u0E1A\u0E31\u0E15\u0E23\u0E40\u0E04\u0E23\u0E14\u0E34\u0E15 (Credit Card)" }), _jsx("br", {}), _jsx(Text, { type: "secondary", children: "VISA, MasterCard, \u0E41\u0E25\u0E30\u0E2D\u0E37\u0E48\u0E19\u0E46" })] })] }) })] }) }) }), paymentMethod === 'cash' && _jsx(CashPayment, { form: form }), paymentMethod === 'promptpay' && _jsx(OnlinePayment, { form: form }), paymentMethod === 'credit_card' && _jsx(CreditCardPayment, { form: form }), _jsx(Form.Item, { children: _jsx(Button, { type: "primary", htmlType: "submit", loading: loading, size: "large", style: { width: '100%', height: '50px', fontSize: '18px' }, children: loading ? 'กำลังดำเนินการ...' : `ชำระเงินด้วย${getPaymentMethodName(paymentMethod)}` }) })] }) })] }));
};
export default PaymentInfoPage;
