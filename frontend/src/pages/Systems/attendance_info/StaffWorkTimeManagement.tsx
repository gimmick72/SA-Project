import React, { useState } from 'react';
import { Typography, Tabs } from 'antd';
import {
  CalendarOutlined
} from '@ant-design/icons';
import StaffScheduleManager from './components/StaffScheduleManager';
import StaffDashboard from './components/StaffDashboard';
import StaffCalendarView from './components/StaffCalendarView';
import './StaffWorkTimeManagement.css';

const { Title } = Typography;

const StaffWorkTimeManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock data for calendar view
  const mockSchedules = [
    {
      id: '1',
      staffId: 'ST001',
      staffName: 'ดร.สมชาย ใจดี',
      position: 'Dentist',
      date: '2024-09-09',
      startTime: '08:00',
      endTime: '17:00',
      scheduleType: 'regular' as const,
      status: 'confirmed' as const
    },
    {
      id: '2',
      staffId: 'ST003',
      staffName: 'นางสาวมาลี สวยงาม',
      position: 'Dental Assistant',
      date: '2024-09-09',
      startTime: '08:00',
      endTime: '17:00',
      scheduleType: 'regular' as const,
      status: 'confirmed' as const
    }
  ];

  const mockStaffMembers = [
    { id: 'ST001', name: 'ดร.สมชาย ใจดี', position: 'Dentist', color: '#1890ff' },
    { id: 'ST002', name: 'ดร.วิชญา สุขใส', position: 'Dentist', color: '#1890ff' },
    { id: 'ST003', name: 'นางสาวมาลี สวยงาม', position: 'Dental Assistant', color: '#52c41a' },
    { id: 'ST004', name: 'นางสาวสุดา ช่วยเหลือ', position: 'Dental Assistant', color: '#52c41a' },
    { id: 'ST005', name: 'นางสาวจิรา ต้อนรับ', position: 'Receptionist', color: '#faad14' },
    { id: 'ST006', name: 'นางสาวปราณี บริการ', position: 'Receptionist', color: '#faad14' },
    { id: 'ST007', name: 'นางสมหวัง ทำความสะอาด', position: 'Maid', color: '#722ed1' },
    { id: 'ST008', name: 'นางสาวนิด สะอาด', position: 'Maid', color: '#722ed1' }
  ];

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      background: '#ffffff',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      minHeight: 'calc(100vh - 128px)'
    }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, color: '#1a1a1a' }}>
          <CalendarOutlined /> ระบบจัดการตารางงานพนักงาน
        </Title>
      </div>

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab} 
        type="card"
        style={{
          background: '#ffffff',
          borderRadius: '8px'
        }}
        items={[
          {
            key: 'dashboard',
            label: 'ภาพรวม',
            children: <StaffDashboard />
          },
          {
            key: 'schedule',
            label: 'จัดการตาราง',
            children: <StaffScheduleManager />
          },
          {
            key: 'calendar',
            label: 'ปฏิทินตารางงาน',
            children: (
              <StaffCalendarView 
                schedules={mockSchedules}
                staffMembers={mockStaffMembers}
                onScheduleAdd={(schedule) => console.log('Add schedule:', schedule)}
                onScheduleEdit={(schedule) => console.log('Edit schedule:', schedule)}
                onScheduleDelete={(scheduleId) => console.log('Delete schedule:', scheduleId)}
              />
            )
          }
        ]}
      />
    </div>
  );
};

export default StaffWorkTimeManagement;
