import React from 'react';
import { Layout, Button, Typography } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  HomeOutlined, 
  PlusOutlined, 
  ClockCircleOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import './ModernPaymentLayout.css';

const { Content, Sider } = Layout;
const { Text } = Typography;

const ModernPaymentLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/admin/payment/add',
      icon: <PlusOutlined />,
      label: 'บันทึกการชำระเงิน',
      path: '/admin/payment/add'
    },
    {
      key: '/admin/payment/transactions',
      icon: <ClockCircleOutlined />,
      label: 'ประวัติการชำระ',
      path: '/admin/payment/transactions'
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="modern-payment-layout">
      {/* Modern Sidebar */}
      <div className="modern-payment-sidebar">
        {/* Header */}
        <div className="modern-payment-header">
          <Text className="modern-payment-title">
            ระบบการชำระเงิน
          </Text>
        </div>

        {/* Payment Actions */}
        <div className="modern-payment-actions">

          {/* Navigation Buttons */}
          <div className="modern-payment-nav">
            {menuItems.map((item) => (
              <Button
                key={item.key}
                type={isActive(item.path) ? 'primary' : 'default'}
                icon={item.icon}
                onClick={() => navigate(item.path)}
                className={`modern-payment-nav-button ${isActive(item.path) ? 'active' : ''}`}
                style={{
                  width: '100%',
                  height: '44px',
                  marginBottom: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: isActive(item.path) ? 500 : 400,
                  color: isActive(item.path) ? '#1890ff' : '#666',
                  background: isActive(item.path) ? '#f0f8ff' : 'transparent',
                  border: isActive(item.path) ? '1px solid #d6e4ff' : '1px solid transparent'
                }}
              >
                <span style={{ marginLeft: '8px' }}>{item.label}</span>
              </Button>
            ))}
          </div>
        </div>

      </div>

      {/* Main Content */}
      <div className="modern-payment-content">
        <Content className="modern-payment-main">
          <div className="modern-payment-container">
            <Outlet />
          </div>
        </Content>
      </div>
    </div>
  );
};

export default ModernPaymentLayout;
