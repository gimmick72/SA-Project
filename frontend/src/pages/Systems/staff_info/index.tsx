import React, { useState } from "react";
import { Tabs, Card, Typography } from "antd";
import { UserOutlined, PlusOutlined, TeamOutlined } from "@ant-design/icons";
import StaffRegistration from "./components/StaffRegistration";
import StaffDataPage from "./staffData/staffDataPage";

const { Title } = Typography;

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
    <div className="admin-page-container">
      <div className="admin-mb-24">
        <Title level={2} className="admin-page-title">
          <UserOutlined style={{ marginRight: '8px' }} />
          ระบบจัดการเจ้าหน้าที่
        </Title>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        type="card"
        className="admin-tabs"
        size="large"
      />
    </div>
  );
};

export default StaffInfoPage;
