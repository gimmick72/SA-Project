import React from "react";
import { HomeOutlined } from "@ant-design/icons";
import HomePage from "./home_info";

const HomeInfoPage = () => {
  return (
    <div className="admin-page-container">
      <div className="admin-mb-24">
        <h2 className="admin-page-title">
          <HomeOutlined style={{ marginRight: '8px' }} />
          แดชบอร์ดหลัก
        </h2>
      </div>
      <HomePage/>
    </div>
  );
};

export default HomeInfoPage;
