// src/pages/medicine_page/index.tsx

import React, { useState } from 'react';
import { Tabs, Card, Typography, Table } from 'antd';
import { MedicineBoxOutlined } from '@ant-design/icons';
import AllSuppliesPage from './AllSuppliesPage';
import AddSupplyPage from './AddSupplyPage';
import DispensePage from './DispensePage';

const { TabPane } = Tabs;
const { Title } = Typography;

const MedicinePage = () => {
  const [activeKey, setActiveKey] = useState('1');

  const onTabChange = (key:string) => {
    setActiveKey(key);
  };

  const renderTabTitle = (key:string, title:string) => {
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
        <div style={{ flex: 1,padding: '16px', height: '100%', display: 'flex', flexDirection: 'column',backgroundColor: '#FFCD05' }}>
          <div style={{ marginBottom: 10 , display: 'flex',  border: '2px solid #D20103',alignItems: 'center' }}>
            <Title level={2} style={{ margin: 0 }}>
              เวชภัณฑ์
            </Title>
          </div>
          <Card
            style={{ borderRadius: 40,marginBottom: 0 , width: '100%', marginLeft: 'auto', marginRight: 'auto', flexDirection: 'column'
              ,flex: 1,minHeight: 0, border: '2px solid #4FFE0A'
             }}
           
          >
            <Tabs
              defaultActiveKey="1"
              activeKey={activeKey}
              onChange={onTabChange}
              tabBarStyle={{ marginBottom: 0 }}
              style={{ height: '100%', display: 'flex' ,flex: 1,minHeight: 0}}
            >
              <Table
          rowKey="id"
          loading={loading}
          dataSource={rows}
          columns={columns}
          bordered
          scroll={{ x: 1200, y: 300 }}
          style={{ width: "100%" ,height: 4000}}
         pagination={{
          current: query.page,
          pageSize: 4, // ⬅️ บังคับ 4
          total,
          showSizeChanger: false, // ⬅️ ปิดการเปลี่ยน pageSize
        }}
          onChange={onTableChange}
        />
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
  );
  
};


export default MedicinePage;