import React from "react";
import { CalendarOutlined } from "@ant-design/icons";
import QueuePage from "./queuePage";

const QueueInfoPage = () => {
  return (
    <div className="admin-page-container">
      <div className="admin-mb-24">
        <h2 className="admin-page-title">
          <CalendarOutlined style={{ marginRight: '8px' }} />
          ระบบจัดการคิว
        </h2>
      </div>
      <QueuePage/>
    </div>
  );
};

export default QueueInfoPage;
