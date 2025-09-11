import React, { useState } from "react";
import { Tabs, Card } from "antd";
import { UserOutlined, PlusOutlined, UnorderedListOutlined, HistoryOutlined, FileTextOutlined } from "@ant-design/icons";
import PatientList from "./PatientList";
import AddPatientPage from "./AddPatientPage";
import HistoryPage from "./HistoryPage";

const PatientInfoPage = () => {
  const [activeTab, setActiveTab] = useState("1");

  const tabItems = [
    {
      key: "1",
      label: (
        <span>
          <UnorderedListOutlined />
          รายชื่อผู้ป่วย
        </span>
      ),
      children: <PatientList />
    },
    {
      key: "2", 
      label: (
        <span>
          <PlusOutlined />
          เพิ่มผู้ป่วยใหม่
        </span>
      ),
      children: <AddPatientPage />
    },
    {
      key: "3",
      label: (
        <span>
          <HistoryOutlined />
          ประวัติการรักษา
        </span>
      ),
      children: <HistoryPage />
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
          ระบบจัดการข้อมูลผู้ป่วย
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

export default PatientInfoPage;
