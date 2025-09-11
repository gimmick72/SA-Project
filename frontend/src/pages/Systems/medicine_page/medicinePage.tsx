// src/pages/medicine_page/index.tsx
import React, { useState } from 'react';
import { Tabs, Card, Typography } from 'antd';
import { MedicineBoxOutlined } from '@ant-design/icons';
import AllSuppliesPage from './AllSuppliesPage';
import AddSupplyPage from './AddSupplyPage';
import DispensePage from './DispensePage';

const { TabPane } = Tabs;
const { Title } = Typography;

const MedicinePage = () => {
  const [activeKey, setActiveKey] = useState('1');

  const onTabChange = (key: string) => setActiveKey(key);

  const renderTabTitle = (key: string, title: string) => {
    const isActive = activeKey === key;
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {isActive && (
          <MedicineBoxOutlined style={{ marginRight: 8, color: '#5243aa' }} />
        )}
        <span style={{ color: isActive ? '#5243aa' : 'inherit' }}>{title}</span>
      </div>
    );
  };



  return (
    <div
      style={{ backgroundColor: '#FFF',padding: '16px', height: '100%', display: 'flex', flexDirection: 'column'
       }}
    >
      <div
        style={{
          marginBottom: 10,
          
          alignItems: 'center',
        }}
      >      
      </div>
      <div style={{backgroundColor: '##FFF', height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto',overflowX: 'auto',}}>
        <Tabs
          defaultActiveKey="1"
          activeKey={activeKey}
          onChange={onTabChange}
          tabBarStyle={{ marginBottom: 0 }}
          style={{ height: '100%', display: 'flex', flex: 1, minHeight: 0 }}
        >
          <TabPane tab={renderTabTitle('1', 'รายการเวชภัณฑ์ทั้งหมด')} key="1">
            <AllSuppliesPage />
          </TabPane>
          <TabPane tab={renderTabTitle('2', 'เพิ่มเวชภัณฑ์ใหม่')} key="2">
            <AddSupplyPage />
          </TabPane>
          <TabPane tab={renderTabTitle('3', 'การเบิกจ่ายเวชภัณฑ์')} key="3">
            <DispensePage />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default MedicinePage;
