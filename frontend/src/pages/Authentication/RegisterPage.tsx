import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, message, Select, DatePicker } from "antd";
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, BankOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { AuthAPI, RegisterRequest } from "../../services/authApi";

const { Title, Text } = Typography;
const { Option } = Select;

interface RegisterFormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'patient' | 'admin';
  phone_number?: string;
  date_of_birth?: string;
  department?: string;
  position?: string;
}

const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: RegisterFormData) => {
    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = values;
      
      // Convert date to proper ISO format if provided
      if (registerData.date_of_birth) {
        const date = new Date(registerData.date_of_birth);
        registerData.date_of_birth = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      }
      
      const response = await AuthAPI.register(registerData as RegisterRequest);
      
      message.success("สมัครสมาชิกสำเร็จ! เข้าสู่ระบบอัตโนมัติ");
      
      // Navigate based on role
      if (response.user.role === 'admin') {
        navigate("/admin");
      } else {
        navigate("/"); // Redirect patients to home page
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่";
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
          maxWidth: "450px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Title level={2} style={{ color: "#722ED1", marginBottom: "8px" }}>
            สมัครสมาชิก
          </Title>
          <Text type="secondary">สำหรับผู้ดูแลระบบและผู้ป่วยใหม่</Text>
        </div>

        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="role"
            rules={[{ required: true, message: "กรุณาเลือกประเภทผู้ใช้!" }]}
          >
            <Select placeholder="เลือกประเภทผู้ใช้">
              <Option value="admin">ผู้ดูแลระบบ (Admin)</Option>
              <Option value="patient">ผู้ป่วย (Patient)</Option>
            </Select>
          </Form.Item>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Form.Item
              name="first_name"
              rules={[{ required: true, message: "กรุณากรอกชื่อ!" }]}
              style={{ flex: 1 }}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="ชื่อ"
              />
            </Form.Item>

            <Form.Item
              name="last_name"
              rules={[{ required: true, message: "กรุณากรอกนามสกุล!" }]}
              style={{ flex: 1 }}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="นามสกุล"
              />
            </Form.Item>
          </div>

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
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.role !== currentValues.role}
          >
            {({ getFieldValue }) => {
              const role = getFieldValue('role');
              
              if (role === 'patient') {
                return (
                  <>
                    <Form.Item
                      name="phone_number"
                      rules={[{ required: true, message: "กรุณากรอกเบอร์โทรศัพท์!" }]}
                    >
                      <Input 
                        prefix={<PhoneOutlined />} 
                        placeholder="เบอร์โทรศัพท์"
                      />
                    </Form.Item>

                    <Form.Item
                      name="date_of_birth"
                      label="วันเกิด"
                    >
                      <DatePicker 
                        style={{ width: '100%' }}
                        placeholder="เลือกวันเกิด"
                        format="YYYY-MM-DD"
                      />
                    </Form.Item>
                  </>
                );
              } else if (role === 'admin') {
                return (
                  <>
                    <Form.Item
                      name="department"
                      rules={[{ required: true, message: "กรุณากรอกแผนก!" }]}
                    >
                      <Input 
                        prefix={<BankOutlined />} 
                        placeholder="แผนก"
                      />
                    </Form.Item>

                    <Form.Item
                      name="position"
                      rules={[{ required: true, message: "กรุณากรอกตำแหน่ง!" }]}
                    >
                      <Input 
                        prefix={<UserOutlined />} 
                        placeholder="ตำแหน่ง"
                      />
                    </Form.Item>
                  </>
                );
              }
              return null;
            }}
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
