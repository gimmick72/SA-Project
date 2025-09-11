import React from "react";
import { MedicineBoxOutlined } from "@ant-design/icons";
import TreatmentPage from "./treatmentPage";

const TreatmentInfoPage = () => {
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
          <MedicineBoxOutlined style={{ marginRight: '8px' }} />
          ข้อมูลการรักษา
        </h2>
      </div>
      <TreatmentPage/>
    </div>
  );
};

export default TreatmentInfoPage;
