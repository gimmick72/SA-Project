import React, { useState } from "react";
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import { Button, Tooltip } from "antd";
import logo from "../assets/logo.png";
import { menuItems } from "../components/menuItems";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  HomeOutlined,
  VideoCameraOutlined,
  HistoryOutlined,
  PlaySquareOutlined,
  ClockCircleOutlined,
  LikeOutlined,
  SettingOutlined
} from "@ant-design/icons";
import "./sidebar.css";

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = (e: any) => {
    const item = menuItems.find((i) => i.key === e.key);
    if (item) {
      navigate(item.path);
    }
  };

  // YouTube-style menu sections
  const mainMenuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: 'หน้าหลัก',
      path: '/'
    }
  ];

  const systemMenuItems = menuItems.map(({ key, icon, label, path }) => ({ 
    key, 
    icon, 
    label,
    path 
  }));

  const selectedKey = menuItems.find((item) => item.path === location.pathname)?.key || 
                    mainMenuItems.find((item) => item.path === location.pathname)?.key;

  return (
    <Sider 
      className="youtube-sidebar"
      collapsed={false}
      collapsedWidth={72}
      width={240}
      theme="light"
    >
      {/* YouTube-style Header */}
      <div className="youtube-sidebar-header">
        <div className="youtube-logo-section" onClick={() => navigate("/")}>
          <img src={logo} alt="Logo" className="youtube-logo" />
          <span className="youtube-title">TooThoot</span>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="youtube-nav-section">
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={selectedKey ? [selectedKey] : []}
          className="youtube-menu"
          inlineCollapsed={false}
        >
          {mainMenuItems.map(item => (
            <Menu.Item 
              key={item.key} 
              icon={item.icon}
              onClick={() => navigate(item.path)}
              className="youtube-menu-item"
            >
              {item.label}
            </Menu.Item>
          ))}
        </Menu>

        <div className="youtube-divider" />

        {/* System Management Section */}
        <div className="youtube-section-title">
          ระบบจัดการ
        </div>
        
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={selectedKey ? [selectedKey] : []}
          className="youtube-menu"
          inlineCollapsed={false}
          onClick={handleMenuClick}
          items={systemMenuItems}
        />

      </div>
    </Sider>
  );
};

export default Sidebar;
