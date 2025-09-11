import React from "react";
import { Card, Button, Typography, Space } from "antd";
import { Link } from "react-router-dom";
import { LoginOutlined, UserAddOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const Authentication = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <Card 
        style={{ 
          width: '100%',
          maxWidth: '500px',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}
      >
        <Title level={2} style={{ color: '#722ED1', marginBottom: '1rem' }}>
          TooThoot Dental Clinic
        </Title>
        <Paragraph style={{ fontSize: '16px', color: '#666', marginBottom: '2rem' }}>
          เลือกระบบที่ต้องการเข้าใช้งาน
        </Paragraph>

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Link to="/auth/login" style={{ width: '100%' }}>
            <Button 
              type="primary" 
              icon={<LoginOutlined />}
              size="large"
              style={{
                width: '100%',
                height: '50px',
                backgroundColor: '#722ED1',
                borderColor: '#722ED1'
              }}
            >
              เข้าสู่ระบบ (สำหรับเจ้าหน้าที่)
            </Button>
          </Link>

          <Link to="/auth/register" style={{ width: '100%' }}>
            <Button 
              icon={<UserAddOutlined />}
              size="large"
              style={{
                width: '100%',
                height: '50px'
              }}
            >
              สมัครสมาชิก
            </Button>
          </Link>

          <Link to="/home">
            <Button 
              type="text"
              style={{ color: '#722ED1' }}
            >
              ← กลับหน้าแรก
            </Button>
          </Link>
        </Space>
      </Card>
    </div>
  );
};

export default Authentication;
