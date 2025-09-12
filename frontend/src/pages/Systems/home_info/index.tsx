import React from "react";
import { HomeOutlined } from "@ant-design/icons";
import HomePage from "./dashBoard";

const HomeInfoPage = () => {
  return (
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
        <h2 style={{ margin: 0, color: '#1a1a1a' }}>
          <HomeOutlined style={{ marginRight: '8px' }} />
          แดชบอร์ดหลัก
        </h2>
      </div>
      <HomePage/>
    </div>
  );
};

export default HomeInfoPage;
