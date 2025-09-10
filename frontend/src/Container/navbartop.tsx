import React, { useState } from "react";
import { Layout, Input, Button, Avatar, Dropdown, Space, Badge } from "antd";
import { 
  SearchOutlined, 
  VideoCameraOutlined, 
  BellOutlined, 
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MoonOutlined,
  SunOutlined
} from "@ant-design/icons";
import type { MenuProps } from 'antd';
import LogoutButton from "../components/LogoutButton";
import "./navbartop.css";

const { Header } = Layout;
const { Search } = Input;

const NavbarTop: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  
  const userEmail = localStorage.getItem('userEmail') || 'Admin';
  const userRole = localStorage.getItem('userRole') || 'staff';

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    window.location.href = '/auth/login';
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'ออกจากระบบ',
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <Header className="youtube-navbar">

      {/* Right - User Actions */}
      <div className="youtube-navbar-right">
        <Space size="middle">
          {/* User Profile Dropdown */}
          <Dropdown 
            menu={{ items: userMenuItems }} 
            placement="bottomRight"
            trigger={['click']}
          >
            <div className="youtube-user-profile">
              <Avatar 
                size={32} 
                icon={<UserOutlined />}
                className="youtube-avatar"
              />
              <span className="youtube-username">{userEmail}</span>
            </div>
          </Dropdown>
        </Space>
      </div>
    </Header>
  );
};

export default NavbarTop;

