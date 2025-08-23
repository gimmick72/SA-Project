import React from "react";
import { Card, Typography, Button, Row, Col } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { SmileOutlined, HeartOutlined, TeamOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const services = [
  {
    id: 1,
    icon: <SmileOutlined style={{ fontSize: 48, color: "#722ED1" }} />,
    title: "จัดฟัน",
    description: "บริการจัดฟันโดยทันตแพทย์ผู้เชี่ยวชาญ",
  },
  {
    id: 2,
    icon: <HeartOutlined style={{ fontSize: 48, color: "#EB2F96" }} />,
    title: "รักษารากฟัน",
    description: "รักษารากฟันเพื่อยืดอายุการใช้งานฟัน",
  },
  {
    id: 3,
    icon: <TeamOutlined style={{ fontSize: 48, color: "#13C2C2" }} />,
    title: "ตรวจสุขภาพฟัน",
    description: "ตรวจสุขภาพช่องปากและฟันเบื้องต้น",
  },
];

const ServicePage: React.FC = () => {
  return (
    <div style={{ padding: "40px" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
        บริการของเรา
      </Title>
      <Row gutter={[24, 24]} justify="center">
        {services.map((service) => (
          <Col xs={24} sm={12} md={8} key={service.id}>
            <Card
              hoverable
              style={{
                borderRadius: 20,
                textAlign: "center",
                padding: "24px",
                background: "#fff",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                height: "100%",
              }}
            >
              <div style={{ marginBottom: 16 }}>{service.icon}</div>
              <Title level={4}>{service.title}</Title>
              <Text>{service.description}</Text>
              <div style={{ marginTop: 20 }}>
                <Button type="link" style={{ color: "#722ED1", fontWeight: "bold" }}>
                  รายละเอียด <RightOutlined />
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ServicePage;
