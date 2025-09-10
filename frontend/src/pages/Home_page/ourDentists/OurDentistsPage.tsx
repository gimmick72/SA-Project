import React from "react";
import { Typography, Carousel } from "antd";
import DentistCard from "./DentistCard";
import { dentists } from "./dentistsData";
import "./OurDentistsPage.css";

const { Title } = Typography;

const OurDentistsPage: React.FC = () => {
  return (
    <div className="dentists-content">
      <Title level={2} className="dentists-title">
        ทันตแพทย์ของเรา
      </Title>

      <Carousel
        autoplay
        dots
        slidesToShow={3}
        responsive={[
          { breakpoint: 1024, settings: { slidesToShow: 2 } },
          { breakpoint: 768, settings: { slidesToShow: 1 } },
        ]}
      >
        {dentists.map((dentist) => (
          <div key={dentist.id}>
            <DentistCard dentist={dentist} />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default OurDentistsPage;
