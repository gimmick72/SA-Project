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
import { Form, Input, Button, Card, Typography, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
const { Title, Text } = Typography;
const RegisterPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const onFinish = (values) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        try {
            // Simulate API call
            yield new Promise(resolve => setTimeout(resolve, 1000));
            message.success("สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ");
            navigate("/auth/login");
        }
        catch (error) {
            message.error("สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่");
        }
        finally {
            setLoading(false);
        }
    });
    return (_jsx("div", { style: {
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            padding: "20px"
        }, children: _jsxs(Card, { style: {
                width: "100%",
                maxWidth: "450px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
            }, children: [_jsxs("div", { style: { textAlign: "center", marginBottom: "24px" }, children: [_jsx(Title, { level: 2, style: { color: "#722ED1", marginBottom: "8px" }, children: "\u0E2A\u0E21\u0E31\u0E04\u0E23\u0E2A\u0E21\u0E32\u0E0A\u0E34\u0E01" }), _jsx(Text, { type: "secondary", children: "\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E40\u0E08\u0E49\u0E32\u0E2B\u0E19\u0E49\u0E32\u0E17\u0E35\u0E48\u0E43\u0E2B\u0E21\u0E48" })] }), _jsxs(Form, { name: "register", onFinish: onFinish, layout: "vertical", size: "large", children: [_jsx(Form.Item, { name: "username", rules: [{ required: true, message: "กรุณากรอกชื่อผู้ใช้!" }], children: _jsx(Input, { prefix: _jsx(UserOutlined, {}), placeholder: "\u0E0A\u0E37\u0E48\u0E2D\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49" }) }), _jsx(Form.Item, { name: "email", rules: [
                                { required: true, message: "กรุณากรอกอีเมล!" },
                                { type: "email", message: "รูปแบบอีเมลไม่ถูกต้อง!" }
                            ], children: _jsx(Input, { prefix: _jsx(MailOutlined, {}), placeholder: "\u0E2D\u0E35\u0E40\u0E21\u0E25" }) }), _jsx(Form.Item, { name: "phone", rules: [{ required: true, message: "กรุณากรอกเบอร์โทรศัพท์!" }], children: _jsx(Input, { prefix: _jsx(PhoneOutlined, {}), placeholder: "\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E42\u0E17\u0E23\u0E28\u0E31\u0E1E\u0E17\u0E4C" }) }), _jsx(Form.Item, { name: "password", rules: [
                                { required: true, message: "กรุณากรอกรหัสผ่าน!" },
                                { min: 6, message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร!" }
                            ], children: _jsx(Input.Password, { prefix: _jsx(LockOutlined, {}), placeholder: "\u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E48\u0E32\u0E19" }) }), _jsx(Form.Item, { name: "confirmPassword", dependencies: ['password'], rules: [
                                { required: true, message: "กรุณายืนยันรหัสผ่าน!" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('รหัสผ่านไม่ตรงกัน!'));
                                    },
                                }),
                            ], children: _jsx(Input.Password, { prefix: _jsx(LockOutlined, {}), placeholder: "\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E48\u0E32\u0E19" }) }), _jsx(Form.Item, { children: _jsx(Button, { type: "primary", htmlType: "submit", loading: loading, style: {
                                    width: "100%",
                                    backgroundColor: "#722ED1",
                                    borderColor: "#722ED1"
                                }, children: "\u0E2A\u0E21\u0E31\u0E04\u0E23\u0E2A\u0E21\u0E32\u0E0A\u0E34\u0E01" }) })] }), _jsxs("div", { style: { textAlign: "center" }, children: [_jsxs(Text, { type: "secondary", children: ["\u0E21\u0E35\u0E1A\u0E31\u0E0D\u0E0A\u0E35\u0E41\u0E25\u0E49\u0E27?", " ", _jsx(Link, { to: "/auth/login", style: { color: "#722ED1" }, children: "\u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E23\u0E30\u0E1A\u0E1A" })] }), _jsx("br", {}), _jsx(Link, { to: "/home", style: { color: "#722ED1" }, children: "\u2190 \u0E01\u0E25\u0E31\u0E1A\u0E2B\u0E19\u0E49\u0E32\u0E41\u0E23\u0E01" })] })] }) }));
};
export default RegisterPage;
