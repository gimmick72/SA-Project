import React, { useState } from 'react';
import { Modal, Form, Input, Button, message, Typography, Space } from 'antd';
import { UserOutlined, LockOutlined, IdcardOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title, Text } = Typography;

interface StaffLoginModalProps {
  visible: boolean;
  onClose: () => void;
}

const StaffLoginModal: React.FC<StaffLoginModalProps> = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleStaffLogin = async (values: any) => {
    setLoading(true);
    try {
      // First, get staff details to verify credentials
      const response = await axios.get(`http://localhost:8080/api/staff/${values.staffId}`);
      const staff = response.data;

      if (!staff) {
        message.error('ไม่พบรหัสพนักงานนี้');
        return;
      }

      // Check password (assuming staff has a Password field)
      const storedPassword = staff.Password || '';
      if (String(values.password) !== String(storedPassword)) {
        message.error('รหัสผ่านไม่ถูกต้อง');
        return;
      }

      // Create staff session data
      const staffData = {
        id: staff.ID,
        staffId: values.staffId,
        name: `${staff.PersonalData?.FirstName || ''} ${staff.PersonalData?.LastName || ''}`,
        position: staff.Position,
        email: staff.PersonalData?.Email || '',
        role: 'staff'
      };

      // Store staff authentication data
      localStorage.setItem('staffAuthenticated', 'true');
      localStorage.setItem('staffData', JSON.stringify(staffData));
      localStorage.setItem('currentStaffId', values.staffId);

      message.success(`ยินดีต้อนรับ ${staffData.name}`);
      
      // Navigate to staff dashboard or admin area
      navigate('/admin/dashboard');
      onClose();
      form.resetFields();

    } catch (error: any) {
      console.error('Staff login error:', error);
      if (error.response?.status === 404) {
        message.error('ไม่พบรหัสพนักงานนี้');
      } else {
        message.error('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={
        <Space>
          <IdcardOutlined />
          <span>เข้าสู่ระบบสำหรับเจ้าหน้าที่</span>
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={400}
      centered
    >
      <div style={{ padding: '20px 0' }}>
        <Title level={4} style={{ textAlign: 'center', marginBottom: 24 }}>
          กรุณาใส่ข้อมูลเจ้าหน้าที่
        </Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleStaffLogin}
          size="large"
        >
          <Form.Item
            name="staffId"
            label="รหัสพนักงาน"
            rules={[
              { required: true, message: 'กรุณาใส่รหัสพนักงาน' },
              { pattern: /^\d+$/, message: 'รหัสพนักงานต้องเป็นตัวเลขเท่านั้น' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="รหัสพนักงาน (เช่น 1, 2, 3)"
              maxLength={10}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="รหัสผ่าน"
            rules={[{ required: true, message: 'กรุณาใส่รหัสผ่าน' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="รหัสผ่าน"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Button onClick={handleCancel}>
                ยกเลิก
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ minWidth: 100 }}
              >
                เข้าสู่ระบบ
              </Button>
            </Space>
          </Form.Item>
        </Form>

        <div style={{ marginTop: 16, padding: 12, backgroundColor: '#f6f6f6', borderRadius: 6 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            <strong>ข้อมูลทดสอบ:</strong><br />
            • พนักงาน ID: 1, รหัสผ่าน: 123456 (Somsak)<br />
            • พนักงาน ID: 2, รหัสผ่าน: 223456 (Suda)<br />
            • พนักงาน ID: 3, รหัสผ่าน: 323456 (Anan)
          </Text>
        </div>
      </div>
    </Modal>
  );
};

export default StaffLoginModal;
