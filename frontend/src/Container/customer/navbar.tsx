import React from "react";
import { Layout, Menu, Typography, Avatar} from "antd";
import {
  UserOutlined,
} from "@ant-design/icons";    
 
import { Link } from "react-router-dom";


const { Header, Content } = Layout;
const { Title } = Typography;
const menuItems = [
  { label: "หน้าแรก", path: "/" },
  { label: "ทันตแพทย์ของเรา", path: "/dentists" },
  { label: "บริการ", path: "/services" },
  { label: "จองคิว", path: "/booking" },
  { label: "ติดต่อเรา", path: "/contact" },
];

const HomePage: React.FC = () => {
  return (
      <Header
        style={{
          backgroundColor: "#E7DDF6",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 40px",
        //   minWidth: "1000px",
        //   // position: "sticky",
        //   // top: 0,
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Avatar src="/logo.png" shape="circle" size="large" />
          <Title level={3} style={{ margin: 0, color: "#722ED1" }}>
            TooThoot
          </Title>
        </div>

        {/* Menu */}
        <Menu
          mode="horizontal"
          style={{
            backgroundColor: "#E7DDF6",
            borderBottom: "none",
            display: "flex",
            justifyContent: "center",
            flex: 1,
          }}
        >
        
          <Menu.Item key="home">
            <a href="/home">หน้าแรก</a>
          </Menu.Item>
          <Menu.Item key="dentists">
            <a href="/dentists">ทันตแพทย์ของเรา</a>
          </Menu.Item>
          <Menu.Item key="services">
            <a href="/services">บริการ</a>
          </Menu.Item>
          <Menu.Item key="contact">
            <a href="/contact">ติดต่อเรา</a>
          </Menu.Item>
          <Menu.Item key="booking">
            <a href="/booking">จองคิว</a>
          </Menu.Item>
        </Menu>

        {/* Sign In */}
        <div style={{ color: "#722ED1", fontWeight: 600, cursor: "pointer" }}>
          <UserOutlined style={{ marginRight: 6 }} />
          ลงชื่อเข้าใช้
        </div>
      </Header>

    
  );
};

export default HomePage;
