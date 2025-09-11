import React from "react";
import { Layout, Typography, Carousel } from "antd";
import PriceCategoryCard from "./PriceCategoryCard";
import { priceCategories } from "./priceData";
import PromotionCard from "./PromotionCard";
import { promotions } from "./promotionData";
import SlideInBottom from "../../Motion/SlideInBottom";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const PriceGuidePage: React.FC = () => {
  return (
    <SlideInBottom>
      <Layout style={{ backgroundColor: "#F5F2F9", padding: "60px 20px" }}>
        <Content>
          {/* หัวข้อ */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <Title level={2}>Price Guide</Title>
            <Paragraph type="secondary">
              ในการรักษาทุกครั้งทันตแพทย์จะชี้แจงค่าใช้จ่ายให้ท่านทราบก่อนการรักษา หากท่านมีข้อสงสัยกรุณาสอบถาม
            </Paragraph>
          </div>

          {/* สไลด์หมวดราคา */}
          <Carousel
            autoplay
            dots
            infinite
            slidesToShow={3}
            slidesToScroll={1}
            responsive={[
              { breakpoint: 1200, settings: { slidesToShow: 2 } },
              { breakpoint: 768, settings: { slidesToShow: 1 } },
            ]}
            style={{ marginBottom: 40 }}
          >
            {priceCategories.map((category, idx) => (
              <div
                key={`cat-${idx}`}
                style={{ padding: "0 12px", display: "flex", justifyContent: "center" }}
              >
                <PriceCategoryCard {...category} />
              </div>
            ))}
          </Carousel>

          {/* หัวข้อโปรโมชัน */}
          <div style={{ textAlign: "center", margin: "8px 0 20px" }}>
            <Title level={3} style={{ color: "#722ED1", marginBottom: 0 }}>
              โปรโมชั่นพิเศษ
            </Title>
            <Paragraph type="secondary" style={{ marginTop: 6 }}>
              โปรที่คัดมาให้คุ้มที่สุด จองล่วงหน้าได้เลย
            </Paragraph>
          </div>

          {/* สไลด์โปรโมชัน (การ์ดทีละใบ) */}
          <Carousel
            autoplay
            dots
            infinite
            slidesToShow={3}
            slidesToScroll={1}
            responsive={[
              { breakpoint: 1200, settings: { slidesToShow: 2 } },
              { breakpoint: 768, settings: { slidesToShow: 1 } },
            ]}
          >
            {promotions.map((promo, idx) => (
              <div
                key={`promo-${idx}`}
                style={{ padding: "0 12px", display: "flex", justifyContent: "center" }}
              >
                <PromotionCard {...promo} />
              </div>
            ))}
          </Carousel>
        </Content>
      </Layout>
    </SlideInBottom>
  );
};

export default PriceGuidePage;
