import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, message, Select } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { AuthAPI, LoginRequest } from "../../services/authApi";
import "./LoginPage.css";

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
    <div className="login-container">
      <Card className="login-card">
        <div className="login-header">
          <Title level={2} className="login-title">
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
              className="login-button"
            >
              เข้าสู่ระบบ
            </Button>
          </Form.Item>
        </Form>

        <div className="login-footer">
          <Text type="secondary">
            ยังไม่มีบัญชี?{" "}
            <Link to="/auth/register" className="login-link">
              สมัครสมาชิก
            </Link>
          </Text>
          <br />
          <Link to="/home" className="login-link">
            ← กลับหน้าแรก
          </Link>
        </div>

        <div className="demo-credentials">
          <Text type="secondary" className="demo-text">
            ทดสอบ: admin@clinic.com / admin123 (Admin) หรือ patient@example.com / patient123 (Patient)
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
