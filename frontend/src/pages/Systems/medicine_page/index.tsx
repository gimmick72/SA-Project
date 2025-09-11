import React from "react";
import { MedicineBoxOutlined } from "@ant-design/icons";
import MedicinePage from "./medicinePage";

const MedicineInfoPage = () => {
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
      <div style={{ marginBottom: 0}}>
        <h2 style={{ margin: 0, color: '#1a1a1a' }}>
          <MedicineBoxOutlined style={{ marginRight: '8px' }} />
          ระบบจัดการยาและเวชภัณฑ์
        </h2>
      </div>
      <MedicinePage/>
    </div>
  );
};

export default MedicineInfoPage;
