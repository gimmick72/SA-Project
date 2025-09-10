import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Radio, Alert, Space, Divider } from 'antd';
import { UserOutlined, LockOutlined, MedicineBoxOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
// Removed authService import - using mock authentication
import './AuthPages.css';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<'patient' | 'staff'>('patient');
  const navigate = useNavigate();

  const handleLogin = async (values: any) => {
    setLoading(true);
    setError('');

    try {
      // Mock authentication - simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock validation
      const { email, password } = values;
      
      // Demo credentials validation
      const validCredentials = [
        { email: 'admin@clinic.com', password: 'admin123', role: 'staff' },
        { email: 'patient@example.com', password: 'patient123', role: 'patient' }
      ];

      const isValid = validCredentials.some(cred => 
        cred.email === email && cred.password === password && cred.role === selectedRole
      );

      if (isValid) {
        // Mock storing auth data
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', selectedRole);
        localStorage.setItem('userEmail', email);

        // Redirect based on role
        if (selectedRole === 'staff') {
          navigate('/admin/dashboard');
        } else {
          navigate('/home');
        }
      } else {
        setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง หรือเลือกประเภทผู้ใช้ไม่ตรงกัน');
      }
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (e: any) => {
    setSelectedRole(e.target.value);
    setError(''); // Clear any previous errors when role changes
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-overlay"></div>
      </div>
      
      <Card className="auth-card" bordered={false}>
        <div className="auth-header">
          <div className="clinic-logo">
            <MedicineBoxOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
          </div>
          <Title level={2} className="auth-title">
            ระบบจัดการคลินิกทันตกรรม
          </Title>
          <Text className="auth-subtitle">
            เข้าสู่ระบบเพื่อใช้งานบริการ
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
            message="เข้าสู่ระบบไม่สำเร็จ"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: '24px' }}
          />
        )}

        <Form
          form={form}
          name="login"
          onFinish={handleLogin}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            label="อีเมล"
            rules={[
              { required: true, message: 'กรุณากรอกอีเมล' },
              { type: 'email', message: 'รูปแบบอีเมลไม่ถูกต้อง' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="กรอกอีเมลของคุณ"
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
              placeholder="กรอกรหัสผ่านของคุณ"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block
              className="login-button"
            >
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </Button>
          </Form.Item>
        </Form>

        <div className="auth-footer">
          <Space direction="vertical" align="center" style={{ width: '100%' }}>
            <Text>
              ยังไม่มีบัญชี? 
              <Link to="/auth/register" className="auth-link">
                {' '}สมัครสมาชิก
              </Link>
            </Text>
            
            <Divider style={{ margin: '16px 0' }}>หรือ</Divider>
            
            <div className="demo-credentials">
              <Text type="secondary" style={{ fontSize: '12px' }}>
                ข้อมูลทดสอบ:
              </Text>
              <div style={{ fontSize: '11px', color: '#666' }}>
                <div>เจ้าหน้าที่: admin@clinic.com / admin123</div>
                <div>ผู้ป่วย: patient@example.com / patient123</div>
              </div>
            </div>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
