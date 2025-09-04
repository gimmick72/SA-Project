// /PriceGuide/PriceCategoryCard.tsx
import React from "react";
import { Card, Typography, List } from "antd";
import { RightOutlined, CheckCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface Item {
  name: string;
  price: string;
  description: string;
  style?: React.CSSProperties; // เพิ่มบรรทัดนี้
}

interface Props {
  title: string;
  subtitle: string;
  items: Item[];
}

const PriceCategoryCard: React.FC<Props> = ({ title, subtitle, items }) => {
  return (
    <Card
      hoverable
      style={{
        borderRadius: 16,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        margin: "0 10px",
        width: "95%",
        minHeight: 400,
        marginBottom: 20
      }}
      bodyStyle={{ padding: 20 }}
    >
      <Title level={4} style={{ color: "#722ED1", marginBottom: 0 }}>{title}</Title>
      <Text type="secondary">{subtitle}</Text>

      <List
        dataSource={items}
        renderItem={(item) => (
          <List.Item style={{ padding: "6px 0", border: "none" }}>
            <CheckCircleOutlined style={{ color: "#13C2C2", marginRight: 8 }} />
            <div style={{ flex: 1 }}>
              <Text strong>{item.name}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>{item.description}</Text>
            </div>
            <Text>{item.price}</Text>
          </List.Item>
        )}
      />

      <div style={{ textAlign: "right", marginTop: 12 }}>
        <Text style={{ color: "#722ED1", fontWeight: 500 }}>
          View More ...
          <RightOutlined />
        </Text>
      </div>
    </Card>
  );
};

export default PriceCategoryCard;
