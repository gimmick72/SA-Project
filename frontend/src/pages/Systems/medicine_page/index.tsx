import React, { useState } from "react";
import { Tabs, Card } from "antd";
import { MedicineBoxOutlined, PlusOutlined, UnorderedListOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import AddSupplyPage from "./AddSupplyPage";
import AllSuppliesPage from "./AllSuppliesPage";
import DispensePage from "./DispensePage";

const MedicineInfoPage = () => {
  const [activeTab, setActiveTab] = useState("1");

  const tabItems = [
    {
      key: "1",
      label: (
        <span>
          <UnorderedListOutlined />
          รายการเวชภัณฑ์
        </span>
      ),
      children: <AllSuppliesPage />
    },
    {
      key: "2", 
      label: (
        <span>
          <PlusOutlined />
          เพิ่มเวชภัณฑ์
        </span>
      ),
      children: <AddSupplyPage />
    },
    {
      key: "3",
      label: (
        <span>
          <ShoppingCartOutlined />
          จ่ายเวชภัณฑ์
        </span>
      ),
      children: <DispensePage />
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
          <MedicineBoxOutlined style={{ marginRight: '8px' }} />
          ระบบจัดการยาและเวชภัณฑ์
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

export default MedicineInfoPage;
