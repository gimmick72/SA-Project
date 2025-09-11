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
import PromoPage from "../PromoPage/PromoPage";9

const { Header, Content } = Layout;
const { Title } = Typography;
const menuItems = [
  { label: "หน้าแรก", path: "/" },
  { label: "ทันตแพทย์ของเรา", path: "/dentists" },
  { label: "บริการ", path: "/services" },
  { label: "จองคิว", path: "/allbooking" },
  { label: "ติดต่อเรา", path: "/contact" },
];

const HomePage: React.FC = () => {
  return (
    <Layout style={{ minHeight: "100vh", fontFamily: "sans-serif", backgroundColor: "#F5F2F9" }}>
      
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
