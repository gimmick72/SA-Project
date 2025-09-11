import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";

const { Title, Text } = Typography;

interface RegisterFormData {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: RegisterFormData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success("สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ");
      navigate("/auth/login");
    } catch (error) {
      message.error("สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่");
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
          maxWidth: "450px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Title level={2} style={{ color: "#722ED1", marginBottom: "8px" }}>
            สมัครสมาชิก
          </Title>
          <Text type="secondary">สำหรับเจ้าหน้าที่ใหม่</Text>
        </div>

        <Form
          name="register"
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
            name="phone"
            rules={[{ required: true, message: "กรุณากรอกเบอร์โทรศัพท์!" }]}
          >
            <Input 
              prefix={<PhoneOutlined />} 
              placeholder="เบอร์โทรศัพท์"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "กรุณากรอกรหัสผ่าน!" },
              { min: 6, message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร!" }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="รหัสผ่าน"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: "กรุณายืนยันรหัสผ่าน!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('รหัสผ่านไม่ตรงกัน!'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="ยืนยันรหัสผ่าน"
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
              สมัครสมาชิก
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center" }}>
          <Text type="secondary">
            มีบัญชีแล้ว?{" "}
            <Link to="/auth/login" style={{ color: "#722ED1" }}>
              เข้าสู่ระบบ
            </Link>
          </Text>
          <br />
          <Link to="/home" style={{ color: "#722ED1" }}>
            ← กลับหน้าแรก
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
