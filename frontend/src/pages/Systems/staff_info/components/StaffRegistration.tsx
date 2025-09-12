import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert, Space, Select } from 'antd';
import { UserAddOutlined, UserOutlined, MailOutlined, LockOutlined, IdcardOutlined, PhoneOutlined } from '@ant-design/icons';
import { authAPI } from '../../../../services/api';

const { Title, Text } = Typography;
const { Option } = Select;

const StaffRegistration: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleRegister = async (values: any) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Real API registration
      const response = await authAPI.register({
        email: values.email,
        password: values.password,
        role: 'admin',
        first_name: values.firstName,
        last_name: values.lastName,
        phone_number: values.phoneNumber,
        department: values.department,
        position: values.position
      });
      
      setSuccess(`สร้างบัญชีเจ้าหน้าที่สำเร็จ: ${values.firstName} ${values.lastName}`);
      form.resetFields();

    } catch (error) {
      setError('เกิดข้อผิดพลาดในการสร้างบัญชีเจ้าหน้าที่');
    } finally {
      setLoading(false);
    }
  };

  const departments = [
    'ทันตกรรมทั่วไป',
    'ทันตกรรมจัดฟัน', 
    'ทันตกรรมเด็ก',
    'ศัลยกรรมช่องปาก',
    'รังสีทันตกรรม',
    'แผนกการเงิน',
    'แผนกต้อนรับ',
    'แผนกบริหาร'
  ];

  const positions = [
    'ทันตแพทย์',
    'ผู้ช่วยทันตแพทย์',
    'พยาบาล',
    'เจ้าหน้าที่การเงิน',
    'เจ้าหน้าที่ต้อนรับ',
    'ผู้จัดการ',
    'ผู้อำนวยการ'
  ];

  return (
    <Card title="สร้างบัญชีเจ้าหน้าที่ใหม่" style={{ maxWidth: 600, margin: '0 auto' }}>
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
        name="staffRegister"
        onFinish={handleRegister}
        layout="vertical"
        size="large"
      >
        <div style={{ marginBottom: '24px' }}>
          <Text strong style={{ color: '#1890ff', fontSize: '16px', display: 'block', marginBottom: '16px' }}>
            ข้อมูลส่วนตัว
          </Text>
          
          <Form.Item
            name="firstName"
            label="ชื่อ"
            rules={[{ required: true, message: 'กรุณากรอกชื่อ' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="กรอกชื่อ"
            />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="นามสกุล"
            rules={[{ required: true, message: 'กรุณากรอกนามสกุล' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="กรอกนามสกุล"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="อีเมล"
            rules={[
              { required: true, message: 'กรุณากรอกอีเมล' },
              { type: 'email', message: 'รูปแบบอีเมลไม่ถูกต้อง' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="กรอกอีเมล"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="รหัสผ่าน"
            rules={[
              { required: true, message: 'กรุณากรอกรหัสผ่าน' },
              { min: 6, message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="กรอกรหัสผ่าน"
            />
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
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="ยืนยันรหัสผ่าน"
            />
          </Form.Item>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <Text strong style={{ color: '#1890ff', fontSize: '16px', display: 'block', marginBottom: '16px' }}>
            ข้อมูลการทำงาน
          </Text>

          <Form.Item
            name="department"
            label="แผนก"
            rules={[{ required: true, message: 'กรุณาเลือกแผนก' }]}
          >
            <Select placeholder="เลือกแผนก">
              {departments.map(dept => (
                <Option key={dept} value={dept}>{dept}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="position"
            label="ตำแหน่ง"
            rules={[{ required: true, message: 'กรุณาเลือกตำแหน่ง' }]}
          >
            <Select placeholder="เลือกตำแหน่ง">
              {positions.map(pos => (
                <Option key={pos} value={pos}>{pos}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="employeeId"
            label="รหัสพนักงาน"
            rules={[{ required: true, message: 'กรุณากรอกรหัสพนักงาน' }]}
          >
            <Input 
              prefix={<IdcardOutlined />} 
              placeholder="กรอกรหัสพนักงาน"
            />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="เบอร์โทรศัพท์"
            rules={[
              { required: true, message: 'กรุณากรอกเบอร์โทรศัพท์' },
              { pattern: /^[0-9]{10}$/, message: 'เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก' }
            ]}
          >
            <Input 
              prefix={<PhoneOutlined />} 
              placeholder="กรอกเบอร์โทรศัพท์"
            />
          </Form.Item>
        </div>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            block
            style={{
              height: '48px',
              fontSize: '16px',
              fontWeight: '600',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
              border: 'none',
              boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)'
            }}
          >
            {loading ? 'กำลังสร้างบัญชี...' : 'สร้างบัญชีเจ้าหน้าที่'}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default StaffRegistration;
