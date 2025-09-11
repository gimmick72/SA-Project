import React from "react";
import { Card, Typography, Tag, Empty, Button, Space } from "antd";
import { Person, serviceColor, typeColor } from "./types";

const { Paragraph, Text } = Typography;

type Props = { active: Person | null };

const DetailCard: React.FC<Props> = ({ active }) => (
  <Card title="รายละเอียด" size="small" style={{ borderRadius: 12, marginBottom: 16 }}>
    {active ? (
      <>
        <Paragraph style={{ marginBottom: 6 }}><Text strong>เวลา:</Text> {active.timeStart}–{active.timeEnd}</Paragraph>
        <Paragraph style={{ marginBottom: 6 }}><Text strong>ชื่อ:</Text> {active.firstName} {active.lastName}</Paragraph>
        <Paragraph style={{ marginBottom: 6 }}><Text strong>ประเภท:</Text> <Tag color={typeColor(active.type)}>{active.type}</Tag></Paragraph>
        <Paragraph style={{ marginBottom: 6 }}><Text strong>บริการ:</Text> <Tag color={serviceColor(active.service)}>{active.service}</Tag></Paragraph>
        <Paragraph style={{ marginBottom: 0 }}><Text strong>แพทย์/ห้อง:</Text> {active.doctor} • {active.room}</Paragraph>
      </>
    ) : <Empty description="ยังไม่ได้เลือกผู้ป่วย" />}

    <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
      <Button>เวชระเบียน</Button>
      <Button>ประวัติเบื้องต้น</Button>
      <Button>จองห้องและคิว</Button>
      <Space>
        <Button type="primary" style={{ height: 40, flex: 1 }}>เพิ่ม</Button>
        <Button danger style={{ height: 40, flex: 1 }}>ยกเลิก</Button>
      </Space>
    </div>
  </Card>
);

export default DetailCard;
