// Services/ServicesPage.tsx
import React from "react";
import { Row, Col, Typography } from "antd";
import ServiceCard from "./ServiceCard";
import { serviceData } from "./data";
import SlideInRight from "../../Motion/SlideInRight";
import SlideInBottom from "../../Motion/SlideInBottom";


const { Title } = Typography;

const ServicesPage: React.FC = () => {
  return (
    <div style={{ overflow: "hidden", marginTop: -400  }}>
      <SlideInRight> 
        <div>
          <Title level={2} style={{ textAlign: "center", color: "#1F1F1F", marginBottom: 16, marginTop: 32}}>
            บริการทั้งหมดของเรา
          </Title>

          <Row gutter={[24, 24]} justify="center">
            {serviceData.map((service, index) => (
              <Col xs={24} sm={12} md={8} key={index}>
                <ServiceCard {...service} />
              </Col>

            ))}
          </Row>
        </div>
    </SlideInRight > 
    </div >
  );
};

export default ServicesPage;
