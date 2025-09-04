// /PriceGuide/PriceGuidePage.tsx
import React from "react";
import { Layout, Typography, Carousel, Row, Col } from "antd";
import { priceCategories } from "./priceData";
import PriceCategoryCard from "./PriceCategoryCard";
import SlideInBottom from "../../Motion/SlideInBottom";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const PriceGuidePage: React.FC = () => {
  return (
    <SlideInBottom>
    <Layout style={{ backgroundColor: "#F5F2F9", padding: "60px 20px" }}>
      <Content>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Title level={2}>Price Guide</Title>
          <Paragraph type="secondary">
            ในการรักษาทุกครั้งทันตแพทย์จะชี้แจงค่าใช้จ่ายให้ท่านทราบก่อนการรักษา หากท่านมีข้อสงสัยกรุณาสอบถาม
          </Paragraph>
        </div>

        <Carousel
          autoplay
          dots
          infinite
          slidesToShow={3} // แสดง 3 การ์ดต่อ slide
          slidesToScroll={1} // เลื่อนไปทีละ 1 การ์ด
          responsive={[
            { breakpoint: 1024, settings: { slidesToShow: 2 } }, // tablet
            { breakpoint: 768, settings: { slidesToShow: 1 } },  // mobile
          ]}
        >
          {priceCategories.map((category, index) => (
            <div
              key={index}
              style={{
                padding: "0 12px",       // gap ระหว่างการ์ด
                display: "flex",
                justifyContent: "center",
              }}
            >
              <PriceCategoryCard {...category}/>
            </div>
          ))}
        </Carousel>
      </Content>
    </Layout>
    </SlideInBottom>
  );
};

export default PriceGuidePage;
