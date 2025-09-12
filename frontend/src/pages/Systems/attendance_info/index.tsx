import React from 'react';
import { Typography } from 'antd';
import StaffWorkTimeManagement from './StaffWorkTimeManagement';
import './index.css';

const { Title } = Typography;

const AttendanceInfoIndex: React.FC = () => {
  return (
    <div className="admin-page-container">
      <Title level={2} className="admin-page-title">
        การจัดการเวลาทำงานบุคลากร
      </Title>
      <StaffWorkTimeManagement />
ุ    </div>
  );
};

export default AttendanceInfoIndex;
