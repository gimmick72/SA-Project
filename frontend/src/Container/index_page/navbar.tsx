import React from "react";
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import Typography from "antd/es/typography";
import Avatar from "antd/es/avatar";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo.png";
import "./navbar.css";

const { Header } = Layout;
const { Title } = Typography;

const items = [
  { key: "home", label: <Link to="/home">หน้าแรก</Link> },
  { key: "dentists", label: <Link to="/dentists">ทันตแพทย์ของเรา</Link> },
  { key: "services", label: <Link to="/services">บริการ</Link> },
  { key: "contact", label: <Link to="/contact">ติดต่อเรา</Link> },
  { key: "booking", label: <Link to="/booking">จองคิว</Link> }
];

const HomePage: React.FC = () => {
  return (
    <Header className="navbar-header">
      <div className="navbar-logo-section">
        <Avatar 
          src={Logo} 
          shape="circle" 
          size="large" 
          className="navbar-avatar"
        />
        <Title level={3} className="navbar-title">
          TooThoot
        </Title>
      </div>

      <Menu
        mode="horizontal"
        className="navbar-menu"
        items={items}
      />

      <Link to="/admin" className="navbar-login-link">
        <UserOutlined className="navbar-login-icon" />
        {" "}เข้าสู่ระบบ
      </Link>
    </Header>
  );
};

export default HomePage;
