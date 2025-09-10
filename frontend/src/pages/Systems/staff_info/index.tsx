import React, { useState } from "react";
import { Tabs, Card } from "antd";
import { UserOutlined, PlusOutlined, TeamOutlined } from "@ant-design/icons";
import StaffRegistration from "./components/StaffRegistration";

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
      children: (
        <Card>
          <h2>รายการเจ้าหน้าที่</h2>
          <p>ระบบจัดการข้อมูลเจ้าหน้าที่ทั้งหมด</p>
        </Card>
      )
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
    <div style={{ padding: '24px' }}>
      <Card 
        title={
          <span>
            <UserOutlined style={{ marginRight: '8px' }} />
            ระบบจัดการเจ้าหน้าที่
          </span>
        }
        style={{ minHeight: '600px' }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          size="large"
        />
      </Card>
    </div>
  );
};

export default StaffInfoPage;
