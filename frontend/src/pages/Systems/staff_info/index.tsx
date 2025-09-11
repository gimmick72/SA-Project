import React, { useState } from "react";
import { Tabs, Card } from "antd";
import { UserOutlined, PlusOutlined, TeamOutlined } from "@ant-design/icons";
import StaffRegistration from "./components/StaffRegistration";
import StaffDataPage from "./staffData/staffDataPage";

const { TabPane } = Tabs;

const StaffInfoPage = () => {
  const [activeTab, setActiveTab] = useState("1");

  const tabItems = [
    {
      key: "1",
      label: (
        <span>
          <TeamOutlined />
          จัดการเจ้าหน้าที่
        </span>
      ),
      children: <StaffDataPage/>
    },
    {
      key: "2",
      label: (
        <span>
          <PlusOutlined />
          เพิ่มเจ้าหน้าที่ใหม่
        </span>
      ),
      children: <StaffRegistration />
    }
  ];

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      background: '#ffffff',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      minHeight: 'calc(100vh - 128px)'
    }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0, color: '#1a1a1a' }}>
          <UserOutlined style={{ marginRight: '8px' }} />
          ระบบจัดการเจ้าหน้าที่
        </h2>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        type="card"
        style={{
          background: '#ffffff',
          borderRadius: '8px'
        }}
        size="large"
      />
    </div>
  );
};

export default StaffInfoPage;
