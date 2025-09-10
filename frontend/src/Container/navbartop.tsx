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
import SharedNavbar from "../components/SharedNavbar";
import "./navbartop.css";

const { Header } = Layout;
const { Search } = Input;

const NavbarTop: React.FC = () => {
  return (
    <Header className="youtube-navbar">
      {/* Right - User Actions */}
      <div className="youtube-navbar-right">
        <SharedNavbar variant="admin" className="youtube-user-section" />
      </div>
    </Header>
  );
};

export default NavbarTop;

