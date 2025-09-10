import React from "react";
import { Card, Avatar, Typography } from "antd";

const { Title, Text } = Typography;

interface Dentist {
  id: number;
  name: string;
  specialty: string;
  image: string;
  experience?: string;
  education?: string;
}

const DentistCard: React.FC<{ dentist: Dentist }> = ({ dentist }) => {
  return (
    <Card
      hoverable
      style={{
        margin: "0 10px 20px ",
        borderRadius: 16,
        textAlign: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <Avatar src={dentist.image} size={120} style={{ marginBottom: 16 }} />
      <Title level={4} style={{ marginBottom: 8 }}>
        {dentist.name}
      </Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>
        {dentist.specialty}
      </Text>
      {dentist.experience && (
        <Text style={{ display: 'block', fontSize: '12px', color: '#666' }}>
          ประสบการณ์: {dentist.experience}
        </Text>
      )}
      {dentist.education && (
        <Text style={{ display: 'block', fontSize: '12px', color: '#666' }}>
          {dentist.education}
        </Text>
      )}
    </Card>
  );
};

export default DentistCard;
