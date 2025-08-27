import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, Button, Typography, Space } from "antd";
import { Link } from "react-router-dom";
import { LoginOutlined, UserAddOutlined } from "@ant-design/icons";
const { Title, Paragraph } = Typography;
const Authentication = () => {
    return (_jsx("div", { style: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px'
        }, children: _jsxs(Card, { style: {
                width: '100%',
                maxWidth: '500px',
                textAlign: 'center',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }, children: [_jsx(Title, { level: 2, style: { color: '#722ED1', marginBottom: '1rem' }, children: "TooThoot Dental Clinic" }), _jsx(Paragraph, { style: { fontSize: '16px', color: '#666', marginBottom: '2rem' }, children: "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E23\u0E30\u0E1A\u0E1A\u0E17\u0E35\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E40\u0E02\u0E49\u0E32\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19" }), _jsxs(Space, { direction: "vertical", size: "large", style: { width: '100%' }, children: [_jsx(Link, { to: "/auth/login", style: { width: '100%' }, children: _jsx(Button, { type: "primary", icon: _jsx(LoginOutlined, {}), size: "large", style: {
                                    width: '100%',
                                    height: '50px',
                                    backgroundColor: '#722ED1',
                                    borderColor: '#722ED1'
                                }, children: "\u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E23\u0E30\u0E1A\u0E1A (\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E40\u0E08\u0E49\u0E32\u0E2B\u0E19\u0E49\u0E32\u0E17\u0E35\u0E48)" }) }), _jsx(Link, { to: "/auth/register", style: { width: '100%' }, children: _jsx(Button, { icon: _jsx(UserAddOutlined, {}), size: "large", style: {
                                    width: '100%',
                                    height: '50px'
                                }, children: "\u0E2A\u0E21\u0E31\u0E04\u0E23\u0E2A\u0E21\u0E32\u0E0A\u0E34\u0E01" }) }), _jsx(Link, { to: "/home", children: _jsx(Button, { type: "text", style: { color: '#722ED1' }, children: "\u2190 \u0E01\u0E25\u0E31\u0E1A\u0E2B\u0E19\u0E49\u0E32\u0E41\u0E23\u0E01" }) })] })] }) }));
};
export default Authentication;
