import { jsx as _jsx } from "react/jsx-runtime";
import { Button, Modal } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
const LogoutButton = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        Modal.confirm({
            title: 'ยืนยันการออกจากระบบ',
            content: 'คุณต้องการออกจากระบบใช่หรือไม่?',
            okText: 'ออกจากระบบ',
            cancelText: 'ยกเลิก',
            onOk: () => {
                // Clear authentication data
                localStorage.removeItem('isAuthenticated');
                localStorage.removeItem('userRole');
                localStorage.removeItem('username');
                // Force page refresh and redirect to login page
                window.location.href = '/auth/login';
            },
        });
    };
    return (_jsx(Button, { type: "primary", danger: true, icon: _jsx(LogoutOutlined, {}), onClick: handleLogout, children: "\u0E2D\u0E2D\u0E01\u0E08\u0E32\u0E01\u0E23\u0E30\u0E1A\u0E1A" }));
};
export default LogoutButton;
