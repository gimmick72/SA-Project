import React from "react";
import { Layout, Menu, Typography, Avatar, Row, Col, Card } from "antd";
import {
  UserOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

import OurDentistsPage from "../OurDentistsPage/OurDentistsPage";
import ServicesPage from "../Services/ServicesPage";
import ContactPage from "../ContactUs/ContactUs";
import PriceGuidePage from "../PriceGuide/PriceGuidePage";
import SlideInTop from "../../Motion/SlideInTop";
import PromoPage from "../PromoPage/PromoPage";




const { Header, Content } = Layout;
const { Title } = Typography;

//Router
const menuItems = [
  { label: "หน้าแรก", path: "/" },
  { label: "ทันตแพทย์ของเรา", path: "/dentists" },
  { label: "บริการ", path: "/services" },
  { label: "จองคิว", path: "/booking" },
  { label: "ติดต่อเรา", path: "/contact" },

];

const HomePage: React.FC = () => {
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
          <Menu.Item key="home">
            <a href="#home">หน้าแรก</a>
          </Menu.Item>
          {/* <Menu.Item key="Promo">
            <a href="#Promo">หน้าแรก</a>
          </Menu.Item> */}
          <Menu.Item key="dentists">
            <a href="#dentists">ทันตแพทย์ของเรา</a>
          </Menu.Item>
          <Menu.Item key="services">
            <a href="#services">บริการ</a>
          </Menu.Item>
          <Menu.Item key="contact">
            <a href="#contact">ติดต่อเรา</a>
          </Menu.Item>
          <Menu.Item key="booking">
            <Link to="booking">จองคิว</Link>
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
        <SlideInTop>
          <div id="home" style={{ marginTop: "0px" }}>
          <PromoPage />
        </div>
        </SlideInTop>
        <div id="dentists" style={{ marginTop: "80px" }}>
          <OurDentistsPage />
        </div>
        <div id="services" style={{ marginTop: "80px" }}>
          <ServicesPage />
        </div>
        <div id="priceguide">
          <PriceGuidePage />
        </div>
        <div id="contact" style={{ marginTop: "80px" }}>
          <ContactPage />
        </div>

      </Content>

    </Layout>
  );
};

export default HomePage;
