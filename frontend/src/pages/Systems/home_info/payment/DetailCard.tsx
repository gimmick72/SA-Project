import React from "react";
import { Card, Typography, Tag, Empty, Button, Space } from "antd";
import { Person } from "../types";
import { statusColor } from "../types";

const { Paragraph, Text } = Typography;

interface DetailCardDentist {
  active: Person | null;
}

const DetailCardPayment: React.FC<DetailCardDentist> = ({ active }) => (
  <Card
    title="รายละเอียด"
    size="small"
    style={{
      border: '2px solid #000000',
      borderRadius: 12,
      height: 270,
      overflowY: 'auto',
      padding: '16px'
    }}
  >
    {active ? (
      <>
        <Paragraph><Text strong>ชื่อ:</Text> {active.firstName} {active.lastName}</Paragraph>
        <Paragraph><Text strong>บริการ:</Text> <Tag>{active.service}</Tag></Paragraph>
        <Paragraph><Text strong>สถานะ:</Text> <Tag color={statusColor[active.status] || "default"}>{active.status}</Tag></Paragraph>
        <Paragraph><Text strong>อาการเบื้องต้น:</Text> {active.symptomps}</Paragraph>
        <Paragraph><Text strong>BP:</Text> {active.systolic}/{active.diastolic} mmHg</Paragraph>
        <Paragraph><Text strong>ชีพจร:</Text> {active.heartrate}</Paragraph>
        <Paragraph><Text strong>น้ำหนัก/ส่วนสูง:</Text> {active.weight} kg / {active.height} cm</Paragraph>
        <Paragraph>วันที่เข้ารับบริการ: {active.visit ? new Date(active.visit).toLocaleDateString('th-TH') : 'ไม่ระบุ'}</Paragraph>
        <Paragraph><Text strong>ServiceID:</Text> {active.serviceID}</Paragraph>
        <Paragraph><Text strong>PatientID:</Text> {active.patientID}</Paragraph>
        <Paragraph><Text strong>รหัสผู้ป่วย:</Text> {active.id}</Paragraph>
      </>
    ) : (
      <Empty description="ยังไม่ได้เลือกผู้ป่วย" />
    )}


  </Card>
);

export default DetailCardPayment;