import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, message, Select } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { AuthAPI, LoginRequest } from "../../services/authApi";

const { Title, Text } = Typography;
const { Option } = Select;

interface LoginFormData {
  email: string;
  password: string;
  role: 'patient' | 'admin';
}

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: LoginFormData) => {
    setLoading(true);
    try {
      const response = await AuthAPI.login(values);
      
      message.success("เข้าสู่ระบบสำเร็จ!");
      
      // Navigate based on role
      if (response.user.role === 'admin') {
        navigate("/admin");
      } else {
        navigate("/"); // Redirect patients to home page
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่";
      message.error(errorMessage);
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
          <Text type="secondary">สำหรับผู้ดูแลระบบและผู้ป่วย</Text>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "กรุณากรอกอีเมล!" },
              { type: "email", message: "รูปแบบอีเมลไม่ถูกต้อง!" }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="อีเมล"
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

          <Form.Item
            name="role"
            rules={[{ required: true, message: "กรุณาเลือกประเภทผู้ใช้!" }]}
          >
            <Select placeholder="เลือกประเภทผู้ใช้">
              <Option value="admin">ผู้ดูแลระบบ (Admin)</Option>
              <Option value="patient">ผู้ป่วย (Patient)</Option>
            </Select>
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
          <Link to="/home" style={{ color: "#722ED1" }}>
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
            ทดสอบ: admin@clinic.com / admin123 (Admin) หรือ patient@example.com / patient123 (Patient)
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
