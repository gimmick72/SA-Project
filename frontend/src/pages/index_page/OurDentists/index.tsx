import React from "react";
import { Card, Avatar, Typography, Row, Col } from "antd";

const { Title, Text } = Typography;

const dentists = [
  {
    id: 1,
    name: "นพ. สมชาย ใจดี",
    specialty: "ทันตกรรมจัดฟัน",
    image: "https://i.pravatar.cc/150?img=11",
  },
  {
    id: 2,
    name: "ทพญ. สมหญิง เก่งมาก",
    specialty: "ทันตกรรมทั่วไป",
    image: "https://i.pravatar.cc/150?img=12",
  },
];

const OurDentists: React.FC = () => {
  return (
    <div>
      <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
        ทันตแพทย์ของเรา
      </Title>
      <Text type="secondary" style={{ textAlign: "center", display: "block", marginBottom: 24 }}>
        ทันตแพทย์ผู้เชี่ยวชาญพร้อมให้บริการคุณ
      </Text>
    <Row gutter={[32, 32]} justify="center">
      {dentists.map((dentist) => (
        <Col xs={24} sm={12} md={9} key={dentist.id}>
          <Card
            hoverable
            style={{
              margin: "0 10px",
              borderRadius: 16,
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <Avatar src={dentist.image} size={120} style={{ marginBottom: 16 }} />
            <Title level={4} style={{ marginBottom: 0 }}>
              {dentist.name}
            </Title>
            <Text type="secondary">{dentist.specialty}</Text>
          </Card>
        </Col>
      ))}
    </Row>
    </div>
  );
};

export default OurDentists;
