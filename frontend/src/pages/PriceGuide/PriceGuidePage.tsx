// /PriceGuide/PriceGuidePage.tsx
import React from "react";
import { Layout, Typography, Carousel, Row, Col } from "antd";
import { priceCategories } from "./priceData";
import PriceCategoryCard from "./PriceCategoryCard";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const PriceGuidePage: React.FC = () => {
  return (
    <Layout style={{ backgroundColor: "#F5F2F9", padding: "60px 20px" }}>
      <Content>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Title level={2}>Price Guide</Title>
          <Paragraph type="secondary">
            ในการรักษาทุกครั้งทันตแพทย์จะชี้แจงค่าใช้จ่ายให้ท่านทราบก่อนการรักษา หากท่านมีข้อสงสัยกรุณาสอบถาม
          </Paragraph>
        </div>

        <Carousel arrows dots={true}>
          <Row gutter={24} justify="center">
            {priceCategories.map((category, index) => (
              <Col xs={24} sm={12} md={8} key={index}>
                <PriceCategoryCard {...category} />
              </Col>
            ))}
          </Row>
        </Carousel>
      </Content>
    </Layout>
  );
};

export default PriceGuidePage;
