import React from 'react';
import { Button, Modal } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface LogoutButtonProps {
  buttonText?: string;
  confirmTitle?: string;
  confirmContent?: string;
  okText?: string;
  cancelText?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  buttonText = 'ออกจากระบบ',
  confirmTitle = 'ยืนยันการออกจากระบบ',
  confirmContent = 'คุณต้องการออกจากระบบหรือไม่?',
  okText = 'ออกจากระบบ',
  cancelText = 'ยกเลิก'
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Modal.confirm({
      title: confirmTitle,
      content: confirmContent,
      okText: okText,
      cancelText: cancelText,
      onOk: () => {
        // Clear authentication data
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        
        // Force page refresh and redirect to login page
        window.location.href = '/auth/login';
      },
    });
  };

  return (
    <Button 
      type="primary" 
      danger 
      icon={<LogoutOutlined />} 
      onClick={handleLogout}
    >
      {buttonText}
    </Button>
  );
};

export default LogoutButton;
