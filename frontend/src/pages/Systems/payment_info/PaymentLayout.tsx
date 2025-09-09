import React from 'react';
import { Layout, Menu, Typography, Card } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { 
  DollarOutlined, 
  MobileOutlined, 
  CreditCardOutlined, 
  FileTextOutlined, 
  FileDoneOutlined, 
  HistoryOutlined, 
  FormOutlined,
  HomeOutlined 
} from '@ant-design/icons';
import './index.css';

const { Content, Sider } = Layout;
const { Title } = Typography;

const PaymentLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: MenuProps['items'] = [
    {
      key: '/admin/payment',
      icon: <HomeOutlined />,
      label: 'หน้าหลัก',
    },
    {
      type: 'divider',
    },
    {
      key: '/admin/payment/cash',
      icon: <DollarOutlined />,
      label: 'ชำระเงินสด',
    },
    {
      key: '/admin/payment/online',
      icon: <MobileOutlined />,
      label: 'ชำระออนไลน์',
    },
    {
      key: '/admin/payment/credit-card',
      icon: <CreditCardOutlined />,
      label: 'บัตรเครดิต',
    },
    {
      type: 'divider',
    },
    {
      key: '/admin/payment/treatment-entry',
      icon: <FormOutlined />,
      label: 'บันทึกการรักษา',
    },
    {
      key: '/admin/payment/receipt',
      icon: <FileDoneOutlined />,
      label: 'ระบบใบเสร็จ',
    },
    {
      key: '/admin/payment/transactions',
      icon: <HistoryOutlined />,
      label: 'บันทึกการทำรายการ',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key.startsWith('/admin/payment')) {
      navigate(key);
    }
  };

  const getSelectedKey = () => {
    const path = location.pathname;
    const menuItem = menuItems?.find(item => item && 'key' in item && item.key === path);
    return menuItem ? [path] : ['/admin/payment'];
  };

  return (
    <div className="payment-container">
      <Layout style={{ minHeight: '100vh', background: '#ffffff' }}>
        <Sider 
          width={280} 
          style={{ 
            background: '#ffffff',
            borderRight: '1px solid #e0e0e0'
          }}
        >
          <div style={{ padding: '24px 16px' }}>
            <Title level={4} style={{ margin: 0, color: '#333' }}>
              ระบบชำระเงิน
            </Title>
          </div>
          
          <Menu
            mode="inline"
            selectedKeys={getSelectedKey()}
            onClick={handleMenuClick}
            style={{ 
              border: 'none',
              background: 'transparent'
            }}
            items={menuItems}
          />
        </Sider>
        
        <Layout>
          <Content style={{ padding: '24px', background: '#ffffff' }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default PaymentLayout;
