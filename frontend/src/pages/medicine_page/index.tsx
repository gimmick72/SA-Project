// src/pages/medicine_page/index.tsx

import React, { useState } from 'react';
import { Tabs, Card, Typography } from 'antd';
import { MedicineBoxOutlined } from '@ant-design/icons';
import AllSuppliesPage from './AllSuppliesPage';
import AddSupplyPage from './AddSupplyPage';
import DispensePage from './DispensePage';
import FullLayout from '../../layout/FullLayout';

const { TabPane } = Tabs;
const { Title } = Typography;

const MedicinePage = () => {
  const [activeKey, setActiveKey] = useState('1');

  const onTabChange = (key) => {
    setActiveKey(key);
  };

  const renderTabTitle = (key, title) => {
    const isActive = activeKey === key;
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {isActive && (
          <MedicineBoxOutlined style={{ marginRight: '8px', color: '#5243aa' }} />
        )}
        <span style={{ color: isActive ? '#5243aa' : 'inherit' }}>
          {title}
        </span>
      </div>
    );
  };

  return (
      <FullLayout>
        <div style={{ padding: 0, width: '100%', height: '100%', boxSizing: 'border-box',overflow: 'hidden', }}>
          <div style={{ marginBottom: 24
            
            , display: 'flex', alignItems: 'center' }}>
            <Title level={2} style={{ margin: 0 }}>
              เวชภัณฑ์
            </Title>
          </div>
          <Card
            style={{ borderRadius: 12, marginTop: 24, border: '2px solid #ffffffff', width: '100%', maxWidth: 1400, marginLeft: 'auto', marginRight: 'auto', height: '20', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}
            bodyStyle={{ padding: '0 24px 24px 24px', height: '100%' }}
          >
            <Tabs
              defaultActiveKey="1"
              activeKey={activeKey}
              onChange={onTabChange}
              tabBarStyle={{ marginBottom: 0 }}
              style={{ height: '100%' }}
            >
              <TabPane
                tab={renderTabTitle('1', 'รายการเวชภัณฑ์ทั้งหมด')}
                key="1"
              >
                <AllSuppliesPage />
              </TabPane>
              <TabPane
                tab={renderTabTitle('2', 'เพิ่มเวชภัณฑ์ใหม่')}
                key="2"
              >
                <AddSupplyPage />
              </TabPane>
              <TabPane
                tab={renderTabTitle('3', 'การเบิกจ่ายเวชภัณฑ์')}
                key="3"
              >
                <DispensePage />
              </TabPane>
            </Tabs>
          </Card>
        </div>
      </FullLayout>
  );
  
};


export default MedicinePage;