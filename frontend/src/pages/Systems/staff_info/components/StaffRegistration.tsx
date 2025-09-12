// src/pages/staff_info/StaffRegistration.tsx
import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert, Space, Select, Spin } from 'antd';
import { UserOutlined, LockOutlined, TeamOutlined, PhoneOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const StaffRegistration: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleRegister = async (values: any) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Mock registration - simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock validation - just check if email already exists
      const existingUsers = ['admin@clinic.com', 'patient@example.com'];
      
      if (existingUsers.includes(values.email)) {
        setError('อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่น');
        return;
      }

      // Mock successful registration
      setSuccess(`สร้างบัญชีเจ้าหน้าที่สำเร็จ: ${values.firstName} ${values.lastName}`);
      form.resetFields();

    } catch (error) {
      setError('เกิดข้อผิดพลาดในการสร้างบัญชีเจ้าหน้าที่');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    console.log("ยกเลิกการสมัคร");
  };

  return (
    <Card 
      title="สร้างบัญชีเจ้าหน้าที่ใหม่" 
      style={{ maxWidth: "100%", margin: '0 auto' }}
    >
      {loading && (
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <Spin tip="กำลังบันทึกข้อมูล..." />
        </div>
      )}

      {error && (
        <Alert
          message="เกิดข้อผิดพลาด"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: '24px' }}
        />
      )}
      {success && (
        <Alert
          message="สำเร็จ"
          description={success}
          type="success"
          showIcon
          style={{ marginBottom: '24px' }}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleRegister}
        size="large"
      >
        <Form.Item
          name="firstName"
          label="ชื่อ"
          rules={[{ required: true, message: 'กรุณากรอกชื่อ' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="ชื่อ" />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="นามสกุล"
          rules={[{ required: true, message: 'กรุณากรอกนามสกุล' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="นามสกุล" />
        </Form.Item>

        <Form.Item
          name="email"
          label="อีเมล"
          rules={[
            { required: true, message: 'กรุณากรอกอีเมล' },
            { type: 'email', message: 'รูปแบบอีเมลไม่ถูกต้อง' }
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="อีเมล" />
        </Form.Item>

        <Form.Item
          name="password"
          label="รหัสผ่าน"
          rules={[
            { required: true, message: 'กรุณากรอกรหัสผ่าน' },
            { min: 6, message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' }
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="รหัสผ่าน" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="ยืนยันรหัสผ่าน"
          dependencies={['password']}
          rules={[
            { required: true, message: 'กรุณายืนยันรหัสผ่าน' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('รหัสผ่านไม่ตรงกัน'));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="ยืนยันรหัสผ่าน" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="เบอร์โทรศัพท์"
          rules={[{ required: true, message: 'กรุณากรอกเบอร์โทรศัพท์' }]}
        >
          <Input prefix={<PhoneOutlined />} placeholder="เบอร์โทรศัพท์" />
        </Form.Item>

        <Form.Item
          name="employeeId"
          label="รหัสพนักงาน"
          rules={[{ required: true, message: 'กรุณากรอกรหัสพนักงาน' }]}
        >
          <Input prefix={<IdcardOutlined />} placeholder="รหัสพนักงาน" />
        </Form.Item>

        <Form.Item
          name="department"
          label="แผนก"
          rules={[{ required: true, message: 'กรุณาเลือกแผนก' }]}
        >
          <Select placeholder="เลือกแผนก">
            <Option value="general">ทันตกรรมทั่วไป</Option>
            <Option value="orthodontics">จัดฟัน</Option>
            <Option value="surgery">ศัลยกรรมช่องปาก</Option>
            <Option value="pediatric">ทันตกรรมเด็ก</Option>
            <Option value="admin">บริหาร</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="position"
          label="ตำแหน่ง"
          rules={[{ required: true, message: 'กรุณาเลือกตำแหน่ง' }]}
        >
          <Select placeholder="เลือกตำแหน่ง">
            <Option value="dentist">ทันตแพทย์</Option>
            <Option value="assistant">ผู้ช่วยทันตแพทย์</Option>
            <Option value="hygienist">นักสุขภาพช่องปาก</Option>
            <Option value="receptionist">พนักงานต้อนรับ</Option>
            <Option value="manager">ผู้จัดการ</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              icon={<TeamOutlined />}
            >
              สร้างบัญชีเจ้าหน้าที่
            </Button>
            <Button onClick={handleCancel}>
              ยกเลิก
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default StaffRegistration;
