// Services/ServicesPage.tsx
import React from "react";
import { Row, Col, Typography } from "antd";
import ServiceCard from "./ServiceCard";
import { serviceData } from "./data";
import "./ServicesPage.css";


const { Title } = Typography;

const ServicesPage: React.FC = () => {
  return (
    <div className="services-container">
      <div>
        <Title level={2} className="services-title">
          บริการทั้งหมดของเรา
        </Title>

        <Row gutter={[24, 24]} className="services-grid">
          {serviceData.map((service, index) => (
            <Col xs={24} sm={12} md={8} key={index}>
              <ServiceCard {...service} />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default ServicesPage;
