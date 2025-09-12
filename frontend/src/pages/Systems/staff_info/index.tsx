import React, { useState } from "react";
import { Tabs, Card, Typography } from "antd";
import { UserOutlined, PlusOutlined, TeamOutlined } from "@ant-design/icons";
import StaffRegistration from "./components/StaffRegistration";
import StaffDataPage from "./staffData/staffDataPage";
import RequireManager from "./components/RequireManager";

const { Title } = Typography;

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
    <RequireManager requiredPosition="ผู้จัดการ">
      <div style={{
        maxWidth: '100%',
        margin: '0 auto',
        background: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        minHeight: 'calc(100vh - 128px)'
      }}>
        <div style={{ marginBottom: '24px' }}>
          <Title level={2} style={{ margin: 0, color: '#1a1a1a' }}>
            <UserOutlined style={{ marginRight: '8px' }} />
            ระบบจัดการเจ้าหน้าที่
          </Title>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          type="card"
          size="large"
        />
      </div>
    </RequireManager>
  );
};

export default StaffInfoPage;
