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
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
const { Title, Text } = Typography;
const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const onFinish = (values) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        try {
            // Simulate API call
            yield new Promise(resolve => setTimeout(resolve, 1000));
            // For demo purposes, accept any credentials
            localStorage.setItem("isAuthenticated", "true");
            localStorage.setItem("isLogin", "true");
            localStorage.setItem("userRole", "admin");
            localStorage.setItem("username", values.username);
            message.success("เข้าสู่ระบบสำเร็จ!");
            navigate("/admin");
        }
        catch (error) {
            message.error("เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่");
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
                maxWidth: "400px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
            }, children: [_jsxs("div", { style: { textAlign: "center", marginBottom: "24px" }, children: [_jsx(Title, { level: 2, style: { color: "#722ED1", marginBottom: "8px" }, children: "\u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E23\u0E30\u0E1A\u0E1A" }), _jsx(Text, { type: "secondary", children: "\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E40\u0E08\u0E49\u0E32\u0E2B\u0E19\u0E49\u0E32\u0E17\u0E35\u0E48\u0E04\u0E25\u0E34\u0E19\u0E34\u0E01" })] }), _jsxs(Form, { name: "login", onFinish: onFinish, layout: "vertical", size: "large", children: [_jsx(Form.Item, { name: "username", rules: [{ required: true, message: "กรุณากรอกชื่อผู้ใช้!" }], children: _jsx(Input, { prefix: _jsx(UserOutlined, {}), placeholder: "\u0E0A\u0E37\u0E48\u0E2D\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49" }) }), _jsx(Form.Item, { name: "password", rules: [{ required: true, message: "กรุณากรอกรหัสผ่าน!" }], children: _jsx(Input.Password, { prefix: _jsx(LockOutlined, {}), placeholder: "\u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E48\u0E32\u0E19" }) }), _jsx(Form.Item, { children: _jsx(Button, { type: "primary", htmlType: "submit", loading: loading, style: {
                                    width: "100%",
                                    backgroundColor: "#722ED1",
                                    borderColor: "#722ED1"
                                }, children: "\u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E23\u0E30\u0E1A\u0E1A" }) })] }), _jsxs("div", { style: { textAlign: "center" }, children: [_jsxs(Text, { type: "secondary", children: ["\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E1A\u0E31\u0E0D\u0E0A\u0E35?", " ", _jsx(Link, { to: "/auth/register", style: { color: "#722ED1" }, children: "\u0E2A\u0E21\u0E31\u0E04\u0E23\u0E2A\u0E21\u0E32\u0E0A\u0E34\u0E01" })] }), _jsx("br", {}), _jsx(Link, { to: "/home", style: { color: "#722ED1" }, children: "\u2190 \u0E01\u0E25\u0E31\u0E1A\u0E2B\u0E19\u0E49\u0E32\u0E41\u0E23\u0E01" })] }), _jsx("div", { style: {
                        textAlign: "center",
                        marginTop: "16px",
                        padding: "12px",
                        backgroundColor: "#f0f8ff",
                        borderRadius: "4px"
                    }, children: _jsx(Text, { type: "secondary", style: { fontSize: "12px" }, children: "Demo: \u0E43\u0E0A\u0E49\u0E0A\u0E37\u0E48\u0E2D\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49\u0E41\u0E25\u0E30\u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E48\u0E32\u0E19\u0E43\u0E14\u0E01\u0E47\u0E44\u0E14\u0E49\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E17\u0E14\u0E2A\u0E2D\u0E1A" }) })] }) }));
};
export default LoginPage;
