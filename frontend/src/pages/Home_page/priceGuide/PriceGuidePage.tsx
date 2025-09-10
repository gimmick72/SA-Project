import React from "react";
import { Typography, Carousel } from "antd";
import PriceCategoryCard from "./PriceCategoryCard";
import { priceCategories } from "./priceData";
import PromotionCard from "./PromotionCard";
import { promotions } from "./promotionData";
import SlideInBottom from "../Motion/SlideInBottom";
import "./PriceGuidePage.css";

const { Title, Paragraph } = Typography;

const PriceGuidePage: React.FC = () => {
  return (
    <SlideInBottom>
      <div className="price-guide-content">
        {/* หัวข้อ */}
        <div className="price-guide-header">
          <Title level={2} className="price-guide-title">Price Guide</Title>
          <Paragraph className="price-guide-description">
            ในการรักษาทุกครั้งทันตแพทย์จะชี้แจงค่าใช้จ่ายให้ท่านทราบก่อนการรักษา หากท่านมีข้อสงสัยกรุณาสอบถาม
          </Paragraph>
        </div>

        {/* สไลด์หมวดราคา */}
        <Carousel
          autoplay={false}
          dots={true}
          infinite={true}
          slidesToShow={3}
          slidesToScroll={1}
          responsive={[
            { breakpoint: 1200, settings: { slidesToShow: 2 } },
            { breakpoint: 768, settings: { slidesToShow: 1 } },
          ]}
          style={{ marginBottom: 40 }}
        >
          {priceCategories.map((category, idx) => (
            <div key={`cat-${idx}`}>
              <PriceCategoryCard {...category} />
            </div>
          ))}
        </Carousel>

        {/* หัวข้อโปรโมชัน */}
        <div className="promotion-header">
          <Title level={3} className="promotion-title">
            โปรโมชั่นพิเศษ
          </Title>
          <Paragraph className="promotion-description">
            โปรที่คัดมาให้คุ้มที่สุด จองล่วงหน้าได้เลย
          </Paragraph>
        </div>

        {/* สไลด์โปรโมชัน (การ์ดทีละใบ) */}
        <Carousel
          autoplay={false}
          dots={true}
          infinite={true}
          slidesToShow={3}
          slidesToScroll={1}
          responsive={[
            { breakpoint: 1200, settings: { slidesToShow: 2 } },
            { breakpoint: 768, settings: { slidesToShow: 1 } },
          ]}
        >
          {promotions.map((promo, idx) => (
            <div key={`promo-${idx}`}>
              <PromotionCard {...promo} />
            </div>
          ))}
        </Carousel>
      </div>
    </SlideInBottom>
  );
};

export default PriceGuidePage;
