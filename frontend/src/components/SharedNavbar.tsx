import React from "react";
import { Avatar, Dropdown, Space } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import type { MenuProps } from 'antd';
import LogoutButton from "./LogoutButton";

interface SharedNavbarProps {
  variant?: 'index' | 'admin';
  className?: string;
}

const SharedNavbar: React.FC<SharedNavbarProps> = ({ variant = 'index', className = '' }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole');
  const userEmail = localStorage.getItem('userEmail');

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    window.location.href = '/auth/login';
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'โปรไฟล์',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'ออกจากระบบ',
      danger: true,
      onClick: handleLogout,
    },
  ];

  if (!isAuthenticated) {
    return (
      <Link to="/auth/login" className={`navbar-login-link ${className}`}>
        <UserOutlined className="navbar-login-icon" />
        {" "}เข้าสู่ระบบ
      </Link>
    );
  }

  if (variant === 'admin') {
    return (
      <div className={`navbar-user-section ${className}`}>
        <Space size="middle">
          <Dropdown 
            menu={{ items: userMenuItems }} 
            placement="bottomRight"
            trigger={['click']}
          >
            <div className="navbar-user-profile">
              <Avatar 
                size={32} 
                icon={<UserOutlined />}
                className="navbar-user-avatar"
              />
              <span className="navbar-user-info">{userEmail}</span>
            </div>
          </Dropdown>
        </Space>
      </div>
    );
  }

  // Index variant
  return (
    <div className={`navbar-user-section ${className}`}>
      <Avatar 
        size={32} 
        icon={<UserOutlined />}
        className="navbar-user-avatar"
      />
      <span className="navbar-user-info">
        {userEmail}
      </span>
      {userRole === 'staff' && (
        <Link to="/admin" className="navbar-admin-link">
          จัดการระบบ
        </Link>
      )}
      <LogoutButton />
    </div>
  );
};

export default SharedNavbar;
