import React, { useState } from 'react';
import { Tabs, Typography } from 'antd';
import { ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import StaffWorkTimeManagement from './StaffWorkTimeManagement';
import AttendanceManagement from './components/AttendanceManagement';

const { Title } = Typography;

const { TabPane } = Tabs;

const AttendanceInfoIndex: React.FC = () => {
  const [activeTab, setActiveTab] = useState('management');

  return (
    <div className="admin-page-container">
      <Title level={2} className="admin-page-title">
        ระบบจัดการเวลาเข้างาน
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
              <ClockCircleOutlined />
              การจัดการเวลาเข้างาน
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
              การจัดการเวลาทำงานพนักงาน
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
