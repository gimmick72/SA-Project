import React from "react";
import { MedicineBoxOutlined } from "@ant-design/icons";
import TreatmentPage from "./treatmentPage";

const TreatmentInfoPage = () => {
  return (
    <div className="admin-page-container">
      <div className="admin-mb-24">
        <h2 className="admin-page-title">
          <MedicineBoxOutlined style={{ marginRight: '8px' }} />
          ข้อมูลการรักษา
        </h2>
      </div>
      <TreatmentPage/>
    </div>
  );
};

export default TreatmentInfoPage;
