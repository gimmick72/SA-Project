import React from "react";
import { Layout, Typography, Carousel } from "antd";
import DentistCard from "./DentistCard";
import { dentists } from "./dentistsData";
import SlideInLeft from "../../Motion/SlideInLeft";

const { Title } = Typography;
const { Content } = Layout;

const OurDentistsPage: React.FC = () => {
  return (
    <SlideInLeft>
    <Layout style={{ backgroundColor: "#F5F2F9", minHeight: "100vh", padding: "0px" }}>
      <Content >
        <Title level={2} style={{ textAlign: "center", color: "#000000", marginBottom: "40px"}}>
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
      </Content>
    </Layout>
    </SlideInLeft>
  );
};

export default OurDentistsPage;
