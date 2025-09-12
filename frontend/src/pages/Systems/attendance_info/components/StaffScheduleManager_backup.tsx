import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Card,
  Typography,
  Space,
  Tag,
  message,
  Empty
} from 'antd';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import dayjs from 'dayjs';
import { attendanceAPI } from '../../../../services/api';
import './StaffScheduleManager.css';

const { Title, Text } = Typography;

interface Schedule {
  id: string;
  staffId: string;
  staffName: string;
  position: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'confirmed' | 'cancelled';
}

interface StaffMember {
  id: string;
  name: string;
  position: string;
}

const StaffScheduleManager: React.FC = () => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);

  // Load staff members from backend
  const loadStaffMembers = async () => {
    setLoading(true);
    try {
      const response = await attendanceAPI.getAttendances({ page: 1, page_size: 100 });
      const uniqueStaff = new Map();
      response.data.forEach((attendance: any) => {
        if (attendance.staff && !uniqueStaff.has(attendance.staff.id)) {
          uniqueStaff.set(attendance.staff.id, {
            id: attendance.staff.id.toString(),
            name: `${attendance.staff.first_name} ${attendance.staff.last_name}`,
            position: attendance.staff.position_info?.name || 'Staff'
          });
        }
      });
      setStaffMembers(Array.from(uniqueStaff.values()));
    } catch (error) {
      console.error('Error loading staff members:', error);
      message.error('ไม่สามารถโหลดข้อมูลพนักงานได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaffMembers();
  }, []);

  const columns: TableColumnsType<Schedule> = [
    {
      title: 'พนักงาน',
      key: 'staff',
      render: (_, record) => (
        <div>
          <Text strong>{record.staffName}</Text>
          <br />
          <Text type="secondary">{record.position}</Text>
        </div>
      ),
    },
    {
      title: 'วันที่',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'เวลา',
      key: 'time',
      render: (_, record) => `${record.startTime} - ${record.endTime}`,
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          scheduled: { color: 'processing', text: 'กำหนดแล้ว' },
          confirmed: { color: 'success', text: 'ยืนยันแล้ว' },
          cancelled: { color: 'error', text: 'ยกเลิก' }
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    }
  ];

  return (
    <div className="staff-schedule-manager">
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4}>
            <UserOutlined /> จัดการตารางงานพนักงาน
          </Title>
          <Button type="primary" icon={<PlusOutlined />}>
            เพิ่มตารางงาน
          </Button>
        </div>

        {staffMembers.length > 0 ? (
          <Table
            columns={columns}
            dataSource={schedules}
            loading={loading}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
          />
        ) : (
          <Empty description="ไม่มีข้อมูลพนักงาน" />
        )}
      </Card>
    </div>
  );
};

export default StaffScheduleManager;
