import React from "react";
import { Card, Button, Typography, Space } from "antd";
import { Link } from "react-router-dom";
import { LoginOutlined, UserAddOutlined } from "@ant-design/icons";
import "./index.css";

const { Title, Paragraph } = Typography;

const Authentication = () => {
  return (
    <div className="auth-container">
      <Card className="auth-card">
        <Title level={2} className="auth-title">
          TooThoot Dental Clinic
        </Title>
        <Paragraph className="auth-description">
          เลือกระบบที่ต้องการเข้าใช้งาน
        </Paragraph>

        <Space direction="vertical" size="large" className="auth-buttons">
          <Link to="/auth/login" className="auth-link">
            <Button 
              type="primary" 
              icon={<LoginOutlined />}
              size="large"
              className="auth-login-button"
            >
              เข้าสู่ระบบ (สำหรับเจ้าหน้าที่)
            </Button>
          </Link>

          <Link to="/auth/register" className="auth-link">
            <Button 
              icon={<UserAddOutlined />}
              size="large"
              className="auth-register-button"
            >
              สมัครสมาชิก
            </Button>
          </Link>

          <Link to="/home">
            <Button 
              type="text"
              className="auth-back-button"
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
