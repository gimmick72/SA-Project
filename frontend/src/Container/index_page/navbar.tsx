import React from "react";
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import Typography from "antd/es/typography";
import Avatar from "antd/es/avatar";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo.png";

const { Header } = Layout;
const { Title } = Typography;

const items = [
  { key: "home", label: <Link to="/">หน้าแรก</Link> },
  { key: "dentists", label: <Link to="/dentists">ทันตแพทย์ของเรา</Link> },
  { key: "services", label: <Link to="/services">บริการ</Link> },
  { key: "contact", label: <Link to="/contact">ติดต่อเรา</Link> },
  { key: "booking", label: <Link to="/booking">จองคิว</Link> }

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
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Avatar src={Logo} shape="circle" size="large" 
          style={{ border: "2px solid #8E55D9",}}
/>
        <Title level={3} style={{ margin: 0, color: "#722ED1" }}>
          TooThoot
        </Title>
      </div>

      <Menu
        mode="horizontal"
        style={{
          backgroundColor: "#E7DDF6",
          borderBottom: "none",
          display: "flex",
          justifyContent: "center",
          flex: 1,
        }}
        items={items}
      />

      <div style={{ color: "#722ED1", fontWeight: 600, cursor: "pointer" }}>
        <UserOutlined style={{ marginRight: 6 }} />
        ลงชื่อเข้าใช้
      </div>
    </Header>
  );
};

export default HomePage;
