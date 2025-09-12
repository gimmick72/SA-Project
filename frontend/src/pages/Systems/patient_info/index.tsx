import React from "react";
import { UserOutlined } from "@ant-design/icons";
import PatientListPage from "./patientPage";

const PatientInfoPage = () => {
  return (
    <div className="admin-page-container">
      <div className="admin-mb-24">
        <h2 className="admin-page-title">
          <UserOutlined style={{ marginRight: '8px' }} />
          ระบบจัดการข้อมูลผู้ป่วย
        </h2>
      </div>
      <PatientListPage />
    </div>
  );
};

export default PatientInfoPage;
