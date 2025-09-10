import React from "react";
import { UserOutlined } from "@ant-design/icons";

const PatientInfoPage = () => {
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
      <p>ยินดีต้อนรับสู่ระบบจัดการข้อมูลผู้ป่วย!</p>
    </div>
  );
};

export default PatientInfoPage;
