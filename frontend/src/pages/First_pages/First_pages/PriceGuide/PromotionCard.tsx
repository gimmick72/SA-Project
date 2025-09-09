import React from "react";
import { Card, Typography, Tag, Button, Space } from "antd";
import { GiftOutlined, CalendarOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

export interface Promotion {
  title: string;
  subtitle?: string;
  highlight?: string;      // เช่น "4,990.-"
  description?: string;
  perks?: string[];        // bullet สั้น ๆ
  validity?: string;       // เช่น "ถึง 30 ก.ย. 2568"
  ribbon?: string;         // เช่น "HOT", "-20%"
  ctaText?: string;        // ปุ่ม
}

const PromotionCard: React.FC<Promotion> = ({
  title,
  subtitle,
  highlight,
  description,
  perks = [],
  validity,
  ribbon,
  ctaText = "รับโปรนี้",
}) => {
  return (
    <Card
      hoverable
      style={{
        borderRadius: 16,
        width: "95%",
        margin: "0 10px",
        minHeight: 260,
        boxShadow: "0 6px 18px rgba(114,46,209,0.08)",
        background:
          "linear-gradient(135deg, rgba(249,246,255,1) 0%, rgba(242,236,255,1) 100%)",
        border: "1px solid #E6DAFF",
      }}
      bodyStyle={{ padding: 16 }}
      title={
        <Space align="center" size={8}>
          <GiftOutlined style={{ color: "#722ED1" }} />
          <span style={{ color: "#722ED1" }}>Promotion</span>
          {ribbon && <Tag color="purple">{ribbon}</Tag>}
        </Space>
      }
    >
      <Title level={4} style={{ marginBottom: 4, color: "#5B2EC6" }}>
        {title}
      </Title>
      {subtitle && (
        <Text type="secondary" style={{ display: "block", marginBottom: 8 }}>
          {subtitle}
        </Text>
      )}

      {highlight && (
        <Title level={3} style={{ margin: 0, color: "#2F54EB" }}>
          {highlight}
        </Title>
      )}

      {description && (
        <Paragraph style={{ marginTop: 8, marginBottom: 8 }}>
          {description}
        </Paragraph>
      )}

      {perks.length > 0 && (
        <ul style={{ paddingLeft: 18, margin: "4px 0 8px" }}>
          {perks.map((p, i) => (
            <li key={i} style={{ fontSize: 13 }}>{p}</li>
          ))}
        </ul>
      )}

      {validity && (
        <Text type="secondary">
          <CalendarOutlined /> {validity}
        </Text>
      )}

      <div style={{ textAlign: "right", marginTop: 12 }}>
        <Button type="primary">{ctaText}</Button>
      </div>
    </Card>
  );
};

export default PromotionCard;
