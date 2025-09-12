import React from "react";
import { MedicineBoxOutlined } from "@ant-design/icons";
import SwitchPage from "./SwitchPage/switchpage";

const ServiceInfoPage = () => {
  return (
    <div className="admin-page-container">
      <div className="admin-mb-24">
        <h2 className="admin-page-title">
          <MedicineBoxOutlined style={{ marginRight: '8px' }} />
          ระบบจัดการบริการ
        </h2>
      </div>
      <SwitchPage />
    </div>
  );
};

export default ServiceInfoPage;
