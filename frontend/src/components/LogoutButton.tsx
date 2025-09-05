import React from 'react';
import { Button, Modal } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const LogoutButton: React.FC = () => {
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

  return (
    <Button 
      type="primary" 
      danger 
      //icon={<LogoutOutlined />} 
      onClick={handleLogout}
    >
      ออกจากระบบ
    </Button>
  );
};

export default LogoutButton;
