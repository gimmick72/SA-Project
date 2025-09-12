import React, { useState } from 'react';
import { Tabs } from 'antd';
import { DollarOutlined, FileTextOutlined } from '@ant-design/icons';
import TreatmentPaymentFlow from './components/TreatmentPaymentFlow';
import PaymentManagement from './components/PaymentManagement';

const { TabPane } = Tabs;

const PaymentInfoIndex: React.FC = () => {
  const [activeTab, setActiveTab] = useState('management');

  return (
    <div style={{ padding: '24px' }}>
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        type="card"
      >
        <TabPane 
          tab={
            <span>
              <DollarOutlined />
              Payment Management
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
              Treatment Payment Flow
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
