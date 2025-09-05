// Services/ServiceCard.tsx
import React from "react";
import { Card, Typography, Button } from "antd";
import { RightOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface Props {
  icon: string;
  title: string;
  description: string;
}

const ServiceCard: React.FC<Props> = ({ icon, title, description }) => {
  return (
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
      <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>
      <Title level={4}>{title}</Title>
      <Text>{description}</Text>
      <div style={{ marginTop: 20 }}>
        <Button type="link" style={{ color: "#722ED1", fontWeight: "bold" }}>
          รายละเอียด <RightOutlined />
        </Button>
      </div>
    </Card>
  );
};

export default ServiceCard;
