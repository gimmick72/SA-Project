import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";

const { Title, Text } = Typography;

interface LoginFormData {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: LoginFormData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any credentials
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("isLogin", "true");
      localStorage.setItem("userRole", "admin");
      localStorage.setItem("username", values.username);
      
      message.success("เข้าสู่ระบบสำเร็จ!");
      navigate("/admin");
    } catch (error) {
      message.error("เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "20px"
    }}>
      <Card 
        style={{ 
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Title level={2} style={{ color: "#722ED1", marginBottom: "8px" }}>
            เข้าสู่ระบบ
          </Title>
          <Text type="secondary">สำหรับเจ้าหน้าที่คลินิก</Text>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "กรุณากรอกชื่อผู้ใช้!" }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="ชื่อผู้ใช้"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "กรุณากรอกรหัสผ่าน!" }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="รหัสผ่าน"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{ 
                width: "100%",
                backgroundColor: "#722ED1",
                borderColor: "#722ED1"
              }}
            >
              เข้าสู่ระบบ
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center" }}>
          <Text type="secondary">
            ยังไม่มีบัญชี?{" "}
            <Link to="/auth/register" style={{ color: "#722ED1" }}>
              สมัครสมาชิก
            </Link>
          </Text>
          <br />
          <Link to="/" style={{ color: "#722ED1" }}>
            ← กลับหน้าแรก
          </Link>
        </div>

        <div style={{ 
          textAlign: "center", 
          marginTop: "16px",
          padding: "12px",
          backgroundColor: "#f0f8ff",
          borderRadius: "4px"
        }}>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Demo: ใช้ชื่อผู้ใช้และรหัสผ่านใดก็ได้เพื่อทดสอบ
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
