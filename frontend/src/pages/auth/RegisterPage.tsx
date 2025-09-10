import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Radio, Alert, Space, Divider, DatePicker, Select } from 'antd';
import { UserOutlined, LockOutlined, MedicineBoxOutlined, TeamOutlined, PhoneOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
// Removed RegisterRequest import - using inline types
import './AuthPages.css';

const { Title, Text } = Typography;
const { Option } = Select;

const RegisterPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<'patient' | 'staff'>('patient');
  const navigate = useNavigate();

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
      setSuccess('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
      form.resetFields();
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);

    } catch (error) {
      setError('เกิดข้อผิดพลาดในการสมัครสมาชิก');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (e: any) => {
    setSelectedRole(e.target.value);
    setError('');
    setSuccess('');
    // Clear role-specific fields when switching roles
    form.setFieldsValue({
      phoneNumber: undefined,
      dateOfBirth: undefined,
      department: undefined,
      position: undefined
    });
  };

  const departments = [
    'General Dentistry',
    'Orthodontics',
    'Oral Surgery',
    'Pediatric Dentistry',
    'Periodontics',
    'Endodontics',
    'Administration',
    'Reception',
    'Cleaning'
  ];

  const positions = [
    'Dentist',
    'Dental Assistant',
    'Dental Hygienist',
    'Receptionist',
    'Office Manager',
    'Cleaning Staff',
    'Administrator'
  ];

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-overlay"></div>
      </div>
      
      <Card className="auth-card register-card" bordered={false}>
        <div className="auth-header">
          <div className="clinic-logo">
            <MedicineBoxOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
          </div>
          <Title level={2} className="auth-title">
            สมัครสมาชิก
          </Title>
          <Text className="auth-subtitle">
            สร้างบัญชีใหม่เพื่อใช้งานระบบ
          </Text>
        </div>

        <Divider />

        {/* Role Selection */}
        <div className="role-selection">
          <Text strong style={{ marginBottom: '12px', display: 'block' }}>
            เลือกประเภทผู้ใช้งาน:
          </Text>
          <Radio.Group 
            value={selectedRole} 
            onChange={handleRoleChange}
            className="role-radio-group"
          >
            <Radio.Button value="patient" className="role-button">
              <UserOutlined /> ผู้ป่วย
            </Radio.Button>
            <Radio.Button value="staff" className="role-button">
              <TeamOutlined /> เจ้าหน้าที่
            </Radio.Button>
          </Radio.Group>
        </div>

        {error && (
          <Alert
            message="สมัครสมาชิกไม่สำเร็จ"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: '24px' }}
          />
        )}

        {success && (
          <Alert
            message="สมัครสมาชิกสำเร็จ"
            description={success}
            type="success"
            showIcon
            style={{ marginBottom: '24px' }}
          />
        )}

        <Form
          form={form}
          name="register"
          onFinish={handleRegister}
          layout="vertical"
          size="large"
        >
          {/* Basic Information */}
          <div className="form-section">
            <Text strong className="section-title">ข้อมูลพื้นฐาน</Text>
            
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
                placeholder="กรอกอีเมลของคุณ"
              />
            </Form.Item>

            <div style={{ display: 'flex', gap: '16px' }}>
              <Form.Item
                name="firstName"
                label="ชื่อ"
                style={{ flex: 1 }}
                rules={[
                  { required: true, message: 'กรุณากรอกชื่อ' },
                  { min: 2, message: 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร' }
                ]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="กรอกชื่อของคุณ"
                />
              </Form.Item>

              <Form.Item
                name="lastName"
                label="นามสกุล"
                style={{ flex: 1 }}
                rules={[
                  { required: true, message: 'กรุณากรอกนามสกุล' },
                  { min: 2, message: 'นามสกุลต้องมีอย่างน้อย 2 ตัวอักษร' }
                ]}
              >
                <Input 
                  placeholder="กรอกนามสกุลของคุณ"
                />
              </Form.Item>
            </div>

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
                placeholder="กรอกรหัสผ่านของคุณ"
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
                placeholder="ยืนยันรหัสผ่านของคุณ"
              />
            </Form.Item>
          </div>

          {/* Role-specific fields */}
          {selectedRole === 'patient' && (
            <div className="form-section">
              <Text strong className="section-title">ข้อมูลผู้ป่วย</Text>
              
              <Form.Item
                name="phoneNumber"
                label="หมายเลขโทรศัพท์"
                rules={[
                  { required: true, message: 'กรุณากรอกหมายเลขโทรศัพท์' },
                  { pattern: /^[0-9]{10}$/, message: 'หมายเลขโทรศัพท์ต้องเป็นตัวเลข 10 หลัก' }
                ]}
              >
                <Input 
                  prefix={<PhoneOutlined />} 
                  placeholder="กรอกหมายเลขโทรศัพท์ (10 หลัก)"
                />
              </Form.Item>

              <Form.Item
                name="dateOfBirth"
                label="วันเกิด"
                rules={[
                  { required: true, message: 'กรุณาเลือกวันเกิด' }
                ]}
              >
                <DatePicker 
                  placeholder="เลือกวันเกิดของคุณ"
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </div>
          )}

          {selectedRole === 'staff' && (
            <div className="form-section">
              <Text strong className="section-title">ข้อมูลเจ้าหน้าที่</Text>
              
              <Form.Item
                name="department"
                label="แผนก"
                rules={[
                  { required: true, message: 'กรุณาเลือกแผนก' }
                ]}
              >
                <Select placeholder="เลือกแผนกของคุณ">
                  {departments.map(dept => (
                    <Option key={dept} value={dept}>{dept}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="position"
                label="ตำแหน่ง"
                rules={[
                  { required: true, message: 'กรุณาเลือกตำแหน่ง' }
                ]}
              >
                <Select placeholder="เลือกตำแหน่งของคุณ">
                  {positions.map(pos => (
                    <Option key={pos} value={pos}>{pos}</Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          )}

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block
              className="register-button"
            >
              {loading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
            </Button>
          </Form.Item>
        </Form>

        <div className="auth-footer">
          <Space direction="vertical" align="center" style={{ width: '100%' }}>
            <Text>
              มีบัญชีอยู่แล้ว? 
              <Link to="/auth/login" className="auth-link">
                {' '}เข้าสู่ระบบ
              </Link>
            </Text>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
