import React from "react";
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import Typography from "antd/es/typography";
import Avatar from "antd/es/avatar";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo.png";
import SharedNavbar from "../../components/SharedNavbar";
import "./navbar.css";
import { HashLink } from 'react-router-hash-link';


const { Header } = Layout;
const { Title } = Typography;

const Items = [
  { key: "home", label: <Link to="/home">หน้าแรก</Link> },
  { key: "dentists", label: <Link to="/dentists">ทันตแพทย์ของเรา</Link> },
  { key: "services", label: <Link to="/services">บริการ</Link> },
  { key: "contact", label: <Link to="/contact">ติดต่อเรา</Link> },
  { key: "bookingPage", label: <Link to="/bookingPage">จองคิว</Link> }
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
      >

        <Menu.Item key="home">
          <HashLink smooth to="/home#home">หน้าแรก</HashLink>
        </Menu.Item>
        <Menu.Item key="dentists">
          <HashLink smooth to="/home#dentists">ทันตแพทย์ของเรา</HashLink>
        </Menu.Item>
        <Menu.Item key="services">
          <HashLink smooth to="/home#services">บริการ</HashLink>
        </Menu.Item>
        <Menu.Item key="contact">
          <HashLink smooth to="/home#contact">ติดต่อเรา</HashLink>
        </Menu.Item>
        <Menu.Item key="bookingPage">
          <Link to="/bookingPage">จองคิว</Link>
        </Menu.Item>

        </Menu>

        <SharedNavbar variant="index" />
    </Header>
  );
};

export default HomePage;
