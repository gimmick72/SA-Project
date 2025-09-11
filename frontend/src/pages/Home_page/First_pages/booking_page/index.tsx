import React from "react";
import { Layout, Menu, Typography, Avatar, Row, Col, Card } from "antd";
import {  UserOutlined,} from "@ant-design/icons";
import { Link } from "react-router-dom";
import Booking from "../booking_page/Booking";

const { Header, Content } = Layout;
const { Title } = Typography;
const menuItems = [
  { label: "หน้าแรก", path: "/" },
  { label: "ทันตแพทย์ของเรา", path: "/dentists" },
  { label: "บริการ", path: "/services" },
  { label: "จองคิว", path: "/Allbooking" },
  { label: "ติดต่อเรา", path: "/contact" },
];

const AllBooking : React.FC = () => {
  return (
    <Layout style={{ minHeight: "100vh", fontFamily: "sans-serif", backgroundColor: "#F5F2F9" }}>
      <Header
        style={{
          backgroundColor: "#E7DDF6",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 40px",
          minWidth: "1000px",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Avatar src="src\assets\logo.png" shape="circle" size="large" style={{ border: "solid 2px #8E55D9" }} />
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
          <Menu.Item>
            <Link to="/#home">หน้าแรก</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/#dentists">ทันตแพทย์ของเรา</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/#services">บริการ</Link>
          </Menu.Item>
          <Menu.Item >
            <Link to="/#contact">ติดต่อเรา</Link>
          </Menu.Item>
          <Menu.Item key="allbooking">
            <a href="allbooking">จองคิว</a>
          </Menu.Item>
        </Menu>

        {/* Sign In */}
        <div style={{ color: "#722ED1", fontWeight: 600, cursor: "pointer" }}>
          <Link to="/auth/login" style={{ width: '100%' }}>
          <UserOutlined style={{ marginRight: 6 }} />
          ลงชื่อเข้าใช้
          </Link>
        </div>
      </Header>

      {/* Content */}
      <Content
        style={{
          padding: "60px 20px",
          height: "calc(100vh - 64px)", // 64px is default AntD Header height
          overflowY: "auto",
        }}
      >

        <div>
          <Booking/>
        </div>
        

      </Content>
    </Layout>
  );
};

export default AllBooking;
