import React from 'react';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import { 
  DollarOutlined, 
  CreditCardOutlined, 
  MobileOutlined,
  TrophyOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const PaymentDashboard: React.FC = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'ชำระเงินสด',
      icon: <DollarOutlined />,
      path: '/admin/payment/cash',
      color: '#52c41a'
    },
    {
      title: 'ชำระออนไลน์',
      icon: <MobileOutlined />,
      path: '/admin/payment/online',
      color: '#1890ff'
    },
    {
      title: 'บัตรเครดิต',
      icon: <CreditCardOutlined />,
      path: '/admin/payment/credit-card',
      color: '#722ed1'
    }
  ];

  const managementActions = [
    {
      title: 'บันทึกการรักษา',
      path: '/admin/payment/treatment-entry',
      description: 'เพิ่มข้อมูลการรักษาและค่าใช้จ่าย'
    },
    {
      title: 'ระบบใบเสร็จ',
      path: '/admin/payment/receipt',
      description: 'จัดการและพิมพ์ใบเสร็จ'
    },
    {
      title: 'บันทึกการทำรายการ',
      path: '/admin/payment/transactions',
      description: 'ดูประวัติการทำรายการทั้งหมด'
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>ระบบชำระเงิน</Title>
      
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="ยอดขายวันนี้"
              value={45680}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<DollarOutlined />}
              suffix="บาท"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="จำนวนการทำรายการ"
              value={28}
              valueStyle={{ color: '#1890ff' }}
              prefix={<TrophyOutlined />}
              suffix="รายการ"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="ลูกค้าวันนี้"
              value={15}
              valueStyle={{ color: '#722ed1' }}
              prefix={<UserOutlined />}
              suffix="คน"
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Payment Actions */}
      <Card title="การชำระเงิน" style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          {quickActions.map((action, index) => (
            <Col xs={24} sm={8} key={index}>
              <Card 
                hoverable
                onClick={() => navigate(action.path)}
                style={{ 
                  textAlign: 'center',
                  borderColor: action.color,
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontSize: '48px', color: action.color, marginBottom: '16px' }}>
                  {action.icon}
                </div>
                <Title level={4} style={{ margin: 0 }}>
                  {action.title}
                </Title>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Management Section */}
      <Card title="จัดการระบบ">
        <Row gutter={[16, 16]}>
          {managementActions.map((action, index) => (
            <Col xs={24} sm={8} key={index}>
              <Card 
                hoverable
                onClick={() => navigate(action.path)}
                style={{ cursor: 'pointer' }}
              >
                <Title level={5} style={{ marginBottom: '8px' }}>
                  {action.title}
                </Title>
                <Text type="secondary">
                  {action.description}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};

export default PaymentDashboard;
