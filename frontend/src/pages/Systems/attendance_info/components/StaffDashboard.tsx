import React from 'react';
import { Card, Row, Col, Statistic, Typography, Progress, List, Tag, Space } from 'antd';
import {
  TeamOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import './StaffDashboard.css';

const { Title, Text } = Typography;

interface StaffMember {
  id: string;
  name: string;
  position: string;
  status: 'present' | 'absent' | 'late';
  checkInTime?: string;
}

interface DashboardStats {
  totalStaff: number;
  presentToday: number;
  scheduledToday: number;
  lateArrivals: number;
}

const StaffDashboard: React.FC = () => {
  // Mock data for dashboard
  const dashboardStats: DashboardStats = {
    totalStaff: 8,
    presentToday: 6,
    scheduledToday: 7,
    lateArrivals: 1
  };

  const todayStaff: StaffMember[] = [
    {
      id: 'ST001',
      name: 'ดร.สมชาย ใจดี',
      position: 'Dentist',
      status: 'present',
      checkInTime: '08:00'
    },
    {
      id: 'ST003',
      name: 'นางสาวมาลี สวยงาม',
      position: 'Dental Assistant',
      status: 'present',
      checkInTime: '08:00'
    },
    {
      id: 'ST005',
      name: 'นางสาวจิรา ต้อนรับ',
      position: 'Receptionist',
      status: 'late',
      checkInTime: '08:15'
    },
    {
      id: 'ST007',
      name: 'นางสมหวัง ทำความสะอาด',
      position: 'Maid',
      status: 'present',
      checkInTime: '06:00'
    },
    {
      id: 'ST002',
      name: 'ดร.วิชญา สุขใส',
      position: 'Dentist',
      status: 'absent'
    },
    {
      id: 'ST004',
      name: 'นางสาวสุดา ช่วยเหลือ',
      position: 'Dental Assistant',
      status: 'present',
      checkInTime: '08:30'
    },
    {
      id: 'ST006',
      name: 'นางสาวปราณี บริการ',
      position: 'Receptionist',
      status: 'present',
      checkInTime: '12:00'
    }
  ];

  const roleStats = [
    { role: 'Dentist', present: 1, total: 2, color: '#1890ff' },
    { role: 'Dental Assistant', present: 2, total: 2, color: '#52c41a' },
    { role: 'Receptionist', present: 2, total: 2, color: '#faad14' },
    { role: 'Maid', present: 1, total: 2, color: '#722ed1' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'success';
      case 'late': return 'warning';
      case 'absent': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'present': return 'มาแล้ว';
      case 'late': return 'มาสาย';
      case 'absent': return 'ขาด';
      default: return 'ไม่ทราบ';
    }
  };

  const attendanceRate = Math.round((dashboardStats.presentToday / dashboardStats.scheduledToday) * 100);

  return (
    <div className="staff-dashboard">
      <Card>
        <Title level={3}>
          <TeamOutlined /> ภาพรวมพนักงานวันนี้
        </Title>

        {/* Statistics Cards */}
        <Row gutter={16} className="dashboard-stats">
          <Col xs={12} sm={6}>
            <Card size="small" className="stat-card">
              <Statistic
                title="พนักงานทั้งหมด"
                value={dashboardStats.totalStaff}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card size="small" className="stat-card present">
              <Statistic
                title="มาทำงานแล้ว"
                value={dashboardStats.presentToday}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card size="small" className="stat-card scheduled">
              <Statistic
                title="กำหนดการวันนี้"
                value={dashboardStats.scheduledToday}
                prefix={<CalendarOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card size="small" className="stat-card late">
              <Statistic
                title="มาสาย"
                value={dashboardStats.lateArrivals}
                prefix={<ExclamationCircleOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Attendance Rate */}
        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col span={24}>
            <Card size="small" title="อัตราการมาทำงาน">
              <Progress
                percent={attendanceRate}
                status={attendanceRate >= 90 ? 'success' : attendanceRate >= 70 ? 'normal' : 'exception'}
                strokeColor={attendanceRate >= 90 ? '#52c41a' : attendanceRate >= 70 ? '#1890ff' : '#ff4d4f'}
              />
              <Text type="secondary">
                {dashboardStats.presentToday} จาก {dashboardStats.scheduledToday} คน
              </Text>
            </Card>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginTop: 16 }}>
          {/* Role Statistics */}
          <Col xs={24} lg={12}>
            <Card size="small" title="สถานะตามตำแหน่ง">
              <Space direction="vertical" style={{ width: '100%' }}>
                {roleStats.map(stat => (
                  <div key={stat.role} className="role-stat-item">
                    <div className="role-info">
                      <Tag color={stat.color}>{stat.role}</Tag>
                      <Text>{stat.present}/{stat.total}</Text>
                    </div>
                    <Progress
                      percent={Math.round((stat.present / stat.total) * 100)}
                      size="small"
                      strokeColor={stat.color}
                      showInfo={false}
                    />
                  </div>
                ))}
              </Space>
            </Card>
          </Col>

          {/* Today's Staff List */}
          <Col xs={24} lg={12}>
            <Card size="small" title="รายชื่อพนักงานวันนี้">
              <List
                size="small"
                dataSource={todayStaff}
                renderItem={staff => (
                  <List.Item>
                    <div className="staff-item">
                      <div className="staff-info">
                        <Text strong>{staff.name}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {staff.position}
                        </Text>
                      </div>
                      <div className="staff-status">
                        <Tag color={getStatusColor(staff.status)}>
                          {getStatusText(staff.status)}
                        </Tag>
                        {staff.checkInTime && (
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            <ClockCircleOutlined /> {staff.checkInTime}
                          </div>
                        )}
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default StaffDashboard;
