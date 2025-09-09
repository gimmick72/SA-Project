// src/components/SiteHeader.tsx
import React, { useMemo } from "react";
import { Layout, Menu, Avatar, Typography } from "antd";
import { Link, useLocation } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import logo from "../../../../../src/assets/logo.png"; // ✅ แทน "src\assets\logo.png" ด้วย import

const { Header } = Layout;
const { Title } = Typography;

const SiteHeader: React.FC = () => {
  const location = useLocation();

  // ให้เมนู active ตาม path ปัจจุบัน (ถ้าไม่ต้องการก็ลบส่วน useMemo + selectedKeys ออกได้)
  const selectedKeys = useMemo(() => {
    const p = location.pathname;
    if (p.startsWith("/booking")) return ["booking"];
    if (p.startsWith("/dentists")) return ["dentists"];
    if (p.startsWith("/services")) return ["services"];
    if (p.startsWith("/contact")) return ["contact"];
    return ["home"];
  }, [location.pathname]);

  return (
    <Header
      style={{
        backgroundColor: "#E7DDF6",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 40px",
        minWidth: "1000px",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Avatar src={logo} shape="circle" size="large" style={{ border: "solid 2px #8E55D9" }} />
        <Title level={3} style={{ margin: 0, color: "#722ED1" }}>
          TooThoot
        </Title>
      </div>

      {/* Menu — คงโครงสร้างเดิมไว้ แต่เปลี่ยนเป็น Link ข้ามหน้า */}
      <Menu
        mode="horizontal"
        selectedKeys={selectedKeys}
        style={{
          backgroundColor: "#E7DDF6",
          borderBottom: "none",
          display: "flex",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <Menu.Item key="home">
          <Link to="/">หน้าแรก</Link>
        </Menu.Item>

        {/* ถ้าหน้าแรกมี section (#dentists/#services/#contact) ให้ใช้ hash กลับไปหน้าแรก */}
        <Menu.Item key="dentists">
          <Link to={{ pathname: "/", hash: "#dentists" }}>ทันตแพทย์ของเรา</Link>
        </Menu.Item>
        <Menu.Item key="services">
          <Link to={{ pathname: "/", hash: "#services" }}>บริการ</Link>
        </Menu.Item>
        <Menu.Item key="contact">
          <Link to={{ pathname: "/", hash: "#contact" }}>ติดต่อเรา</Link>
        </Menu.Item>

        <Menu.Item key="booking">
          <Link to="/booking">จองคิว</Link> {/* ✅ เดิมเป็น "booking" -> ใช้เส้นทาง absolute */}
        </Menu.Item>
      </Menu>

      {/* Sign In */}
      <div style={{ color: "#722ED1", fontWeight: 600, cursor: "pointer" }}>
        <Link to="/auth/login" style={{ width: "100%" }}>
          <UserOutlined style={{ marginRight: 6 }} />
          ลงชื่อเข้าใช้
        </Link>
      </div>
    </Header>
  );
};

export default SiteHeader;
