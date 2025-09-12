import React from 'react';
import { Layout, Row, Col, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import SharedNavbar from '../../../../components/SharedNavbar';
import ServicesPage from '../Services/ServicesPage';
import PriceGuidePage from '../PriceGuide/PriceGuidePage';
import OurDentistsPage from '../OurDentistsPage/OurDentistsPage';
import ContactUs from '../ContactUs/ContactUs';
import SlideInTop from "../../Motion/SlideInTop";
import PromoPage from "../PromoPage/PromoPage";
import ClinicPromo from './ClinicPromo';
import PhotoPromo from './PhotoPromo';

const { Header, Content } = Layout;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  const handleLoginClick = () => {
    navigate('/auth/login');
  };

  return (
    <Layout style={{ minHeight: "100vh", fontFamily: "sans-serif", backgroundColor: "#F5F2F9", marginTop: '-15px'
     }}>
      
      {/* Content */}
      <Content
        style={{
          padding: "60px 20px",
          height: "calc(100vh - 64px)", // 64px is default AntD Header height
          overflowY: "auto",
          marginTop: 80,
        }}
      >
        <SlideInTop>
          <div id="home" style={{ marginTop: "0px"}}>
            <SharedNavbar />
            
            {/* Login Button - Only show if not authenticated */}
            {!isAuthenticated && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                marginTop: '20px',
                marginBottom: '20px'
              }}>
                <Button 
                  type="primary" 
                  size="large"
                  icon={<UserOutlined />}
                  onClick={handleLoginClick}
                  style={{
                    backgroundColor: '#1890ff',
                    borderColor: '#1890ff',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '500',
                    padding: '12px 32px',
                    height: 'auto',
                    boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(24, 144, 255, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(24, 144, 255, 0.3)';
                  }}
                >
                  เข้าสู่ระบบ
                </Button>
              </div>
            )}

            {/* Hero Section with Promo Cards */}
            <Row gutter={[32, 32]} justify="center" style={{ marginTop: "40px", padding: "0 20px" }}>
              <Col xs={24} md={12} lg={10} style={{ display: "flex", justifyContent: "center" }}>
                <ClinicPromo />
              </Col>
              <Col xs={24} md={12} lg={10} style={{ display: "flex", justifyContent: "center" }}>
                <PhotoPromo />
              </Col>
            </Row>
          </div>
        </SlideInTop>
        <div id="dentists" style={{ marginTop: "80px",}}>
          <OurDentistsPage />
        </div>
        <div id="services" style={{ marginTop: "80px",}}>
          <ServicesPage />
        </div>
        <div id="priceguide" style={{ marginTop: "80px",}}>
          <PriceGuidePage />
        </div>
        <div id="contact" style={{ marginTop: "80px"}}>
          <ContactUs />
        </div>


      </Content>
    </Layout>
  );
};

export default HomePage;
