import React, { useState } from 'react';
import { Tabs } from 'antd';
import { ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import StaffWorkTimeManagement from './StaffWorkTimeManagement';
import AttendanceManagement from './components/AttendanceManagement';

const { TabPane } = Tabs;

const AttendanceInfoIndex: React.FC = () => {
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
              <ClockCircleOutlined />
              Attendance Management
            </span>
          } 
          key="management"
        >
          <AttendanceManagement />
        </TabPane>
        <TabPane 
          tab={
            <span>
              <UserOutlined />
              Staff Work Time Management
            </span>
          } 
          key="worktime"
        >
          <StaffWorkTimeManagement />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AttendanceInfoIndex;
