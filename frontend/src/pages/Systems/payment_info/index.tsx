import React, { useState } from 'react';
import { Tabs, Typography } from 'antd';
import { DollarOutlined, FileTextOutlined } from '@ant-design/icons';
import TreatmentPaymentFlow from './components/TreatmentPaymentFlow';
import PaymentManagement from './components/PaymentManagement';

const { Title } = Typography;

const { TabPane } = Tabs;

const PaymentInfoIndex: React.FC = () => {
  const [activeTab, setActiveTab] = useState('management');

  return (
    <div className="admin-page-container">
      <Title level={2} className="admin-page-title">
        ระบบจัดการการชำระเงิน
      </Title>
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        type="card"
        className="admin-tabs"
      >
        <TabPane 
          tab={
            <span>
              <DollarOutlined />
              การจัดการการชำระเงิน
            </span>
          } 
          key="management"
        >
          <PaymentManagement />
        </TabPane>
        <TabPane 
          tab={
            <span>
              <FileTextOutlined />
              ขั้นตอนการชำระเงินการรักษา
            </span>
          } 
          key="treatment"
        >
          <TreatmentPaymentFlow />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default PaymentInfoIndex;
