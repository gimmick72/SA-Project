import React from "react";
import { MedicineBoxOutlined } from "@ant-design/icons";
import MedicinePage from "./medicinePage";

const MedicineInfoPage = () => {
  return (
    <div className="admin-page-container">
      <div className="admin-mb-24">
        <h2 className="admin-page-title">
          <MedicineBoxOutlined style={{ marginRight: '8px' }} />
          ระบบจัดการยาและเวชภัณฑ์
        </h2>
      </div>
      <MedicinePage/>
    </div>
  );
};

export default MedicineInfoPage;
