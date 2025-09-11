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
import { useState } from "react";
import { Card, Form, Input, Typography, Divider, Button } from "antd";
import { QrcodeOutlined, CopyOutlined, CheckOutlined } from "@ant-design/icons";
const { Text, Title } = Typography;
const OnlinePayment = ({ form }) => {
    const [copied, setCopied] = useState(false);
    // PromptPay ID for clinic
    const promptPayId = "0643070129"; // Clinic's PromptPay ID
    const clinicName = "คลินิกทันตกรรม ABC";
    const copyPromptPayId = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield navigator.clipboard.writeText(promptPayId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
        catch (error) {
            console.error('Failed to copy:', error);
        }
    });
    return (_jsxs(Card, { title: "\u0E01\u0E32\u0E23\u0E0A\u0E33\u0E23\u0E30\u0E40\u0E07\u0E34\u0E19\u0E14\u0E49\u0E27\u0E22\u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E40\u0E1E\u0E22\u0E4C", size: "small", style: { marginBottom: '16px' }, children: [_jsxs("div", { style: { textAlign: 'center', marginBottom: '20px' }, children: [_jsx("div", { style: {
                            backgroundColor: '#6B46C1',
                            color: 'white',
                            padding: '12px',
                            borderRadius: '8px 8px 0 0',
                            marginBottom: '0'
                        }, children: _jsx(Title, { level: 4, style: { color: 'white', margin: 0 }, children: "\uD83C\uDFE6 SCB" }) }), _jsxs("div", { style: {
                            backgroundColor: '#1E40AF',
                            color: 'white',
                            padding: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px'
                        }, children: [_jsx(QrcodeOutlined, { style: { fontSize: '24px' } }), _jsx(Text, { style: { color: 'white', fontSize: '18px', fontWeight: 'bold' }, children: "THAI QR PAYMENT" })] }), _jsx("div", { style: {
                            backgroundColor: 'white',
                            padding: '12px',
                            borderBottom: '1px solid #e0e0e0'
                        }, children: _jsxs("div", { style: {
                                border: '2px solid #1E40AF',
                                borderRadius: '4px',
                                padding: '8px 16px',
                                display: 'inline-block',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                color: '#1E40AF'
                            }, children: ["Prompt", _jsx("span", { style: { color: '#10B981' }, children: "Pay" })] }) }), _jsx("div", { style: {
                            backgroundColor: 'white',
                            padding: '20px',
                            display: 'flex',
                            justifyContent: 'center'
                        }, children: _jsx("img", { src: "/promtpayqrcode.jpeg", alt: "PromptPay QR Code", style: { maxWidth: '200px', height: 'auto' } }) }), _jsxs("div", { style: {
                            backgroundColor: 'white',
                            padding: '16px',
                            border: '1px solid #d9d9d9',
                            borderTop: 'none'
                        }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }, children: [_jsx(Text, { strong: true, children: "PAY TO PROMPTPAY" }), _jsx(Text, { children: promptPayId.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3') })] }), _jsx(Divider, { style: { margin: '12px 0' } }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsx(Text, { strong: true, children: "AMOUNT" }), _jsx(Text, { style: { fontSize: '18px' }, children: "___" })] }), _jsx(Text, { type: "secondary", style: { fontSize: '12px', marginTop: '8px' }, children: "* Payer to specify amount" })] }), _jsx("div", { style: {
                            backgroundColor: '#6B46C1',
                            height: '20px',
                            borderRadius: '0 0 8px 8px'
                        } })] }), _jsx(Divider, {}), _jsxs("div", { style: { marginTop: '16px' }, children: [_jsx(Text, { strong: true, children: "\u0E2B\u0E23\u0E37\u0E2D\u0E42\u0E2D\u0E19\u0E40\u0E07\u0E34\u0E19\u0E14\u0E49\u0E27\u0E22\u0E15\u0E19\u0E40\u0E2D\u0E07:" }), _jsxs("div", { style: {
                            backgroundColor: '#f6f6f6',
                            padding: '12px',
                            borderRadius: '6px',
                            marginTop: '8px'
                        }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsxs("div", { children: [_jsx(Text, { strong: true, children: "\u0E2B\u0E21\u0E32\u0E22\u0E40\u0E25\u0E02\u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E40\u0E1E\u0E22\u0E4C:" }), _jsx("br", {}), _jsx(Text, { copyable: { text: promptPayId }, children: promptPayId })] }), _jsx(Button, { icon: copied ? _jsx(CheckOutlined, {}) : _jsx(CopyOutlined, {}), onClick: copyPromptPayId, type: copied ? "primary" : "default", size: "small", children: copied ? 'คัดลอกแล้ว' : 'คัดลอก' })] }), _jsxs(Text, { type: "secondary", style: { fontSize: '12px' }, children: ["\u0E0A\u0E37\u0E48\u0E2D\u0E1A\u0E31\u0E0D\u0E0A\u0E35: ", clinicName] })] })] }), _jsxs("div", { style: {
                    marginTop: '16px',
                    padding: '12px',
                    backgroundColor: '#e6f7ff',
                    border: '1px solid #91d5ff',
                    borderRadius: '6px'
                }, children: [_jsx(Text, { strong: true, style: { display: 'block', marginBottom: '8px' }, children: "\uD83D\uDCF1 \u0E27\u0E34\u0E18\u0E35\u0E01\u0E32\u0E23\u0E0A\u0E33\u0E23\u0E30\u0E40\u0E07\u0E34\u0E19:" }), _jsxs("ul", { style: { margin: 0, paddingLeft: '20px', fontSize: '14px' }, children: [_jsx("li", { children: "\u0E40\u0E1B\u0E34\u0E14\u0E41\u0E2D\u0E1B\u0E18\u0E19\u0E32\u0E04\u0E32\u0E23\u0E2B\u0E23\u0E37\u0E2D\u0E41\u0E2D\u0E1B PromptPay" }), _jsx("li", { children: "\u0E40\u0E25\u0E37\u0E2D\u0E01 \"\u0E2A\u0E41\u0E01\u0E19 QR\" \u0E2B\u0E23\u0E37\u0E2D \"\u0E42\u0E2D\u0E19\u0E40\u0E07\u0E34\u0E19\"" }), _jsx("li", { children: "\u0E2A\u0E41\u0E01\u0E19 QR Code \u0E2B\u0E23\u0E37\u0E2D\u0E43\u0E2A\u0E48\u0E2B\u0E21\u0E32\u0E22\u0E40\u0E25\u0E02\u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E40\u0E1E\u0E22\u0E4C" }), _jsx("li", { children: "\u0E23\u0E30\u0E1A\u0E38\u0E08\u0E33\u0E19\u0E27\u0E19\u0E40\u0E07\u0E34\u0E19\u0E41\u0E25\u0E30\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E01\u0E32\u0E23\u0E42\u0E2D\u0E19" }), _jsx("li", { children: "\u0E40\u0E01\u0E47\u0E1A\u0E2B\u0E25\u0E31\u0E01\u0E10\u0E32\u0E19\u0E01\u0E32\u0E23\u0E42\u0E2D\u0E19\u0E40\u0E07\u0E34\u0E19" })] })] }), _jsx(Form.Item, { label: "\u0E2B\u0E21\u0E32\u0E22\u0E40\u0E25\u0E02\u0E2D\u0E49\u0E32\u0E07\u0E2D\u0E34\u0E07\u0E01\u0E32\u0E23\u0E42\u0E2D\u0E19\u0E40\u0E07\u0E34\u0E19 (\u0E16\u0E49\u0E32\u0E21\u0E35)", name: "transactionRef", style: { marginTop: '16px' }, children: _jsx(Input, { placeholder: "\u0E40\u0E0A\u0E48\u0E19 TXN123456789" }) })] }));
};
export default OnlinePayment;
