import React from "react";
import { CalendarOutlined } from "@ant-design/icons";
import QueuePage from "./queuePage";

const QueueInfoPage = () => {
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
          <CalendarOutlined style={{ marginRight: '8px' }} />
          ระบบจัดการคิว
        </h2>
      </div>
      <QueuePage/>
    </div>
  );
};

export default QueueInfoPage;
