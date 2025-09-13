import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Button, Table, Space, message, Tabs, Typography, Input, Select, DatePicker, Tag } from 'antd';
import { ClockCircleOutlined, UserOutlined, CheckCircleOutlined, ExclamationCircleOutlined, ReloadOutlined, CalendarOutlined, SearchOutlined, PlusOutlined, TeamOutlined } from '@ant-design/icons';
import { staffAttendanceAPI } from '../../../services/api';
import { ensureAuthentication } from '../../../utils/auth';
import StaffScheduleCalendar from './components/StaffScheduleCalendar';
import './StaffWorkTimeManagement.css';

const { Title, Text } = Typography;
// const { TabPane } = Tabs; // Deprecated - using items prop instead
const { Search } = Input;
const { Option } = Select;

interface StaffData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  department: string;
  position: string;
  status: string;
}


interface StatsData {
  total_staff: number;
  present_count: number;
  late_count: number;
  absent_count: number;
  average_hours: number;
}

const StaffWorkTimeManagement: React.FC = () => {
  console.log('StaffWorkTimeManagement: Component rendering...');
  const [staffData, setStaffData] = useState<StaffData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsData>({
    total_staff: 0,
    present_count: 0,
    late_count: 0,
    absent_count: 0,
    average_hours: 0
  });

  const loadData = async () => {
    console.log('loadData: Starting data load...');
    setLoading(true);
    
    try {
      // Ensure authentication
      const isAuth = await ensureAuthentication();
      if (!isAuth) {
        console.error('loadData: Authentication failed');
        message.error('Authentication failed. Please check your connection.');
        setLoading(false);
        return;
      }
      
      console.log('loadData: Authentication successful, loading data...');
      
      // Load staff data and attendance stats in parallel
      const [staffResponse, statsResponse] = await Promise.all([
        staffAttendanceAPI.getStaffList(),
        staffAttendanceAPI.getAttendanceStats()
      ]);
      
      console.log('loadData: Staff data loaded:', staffResponse);
      console.log('loadData: Stats data loaded:', statsResponse);
      
      if (staffResponse && Array.isArray(staffResponse)) {
        setStaffData(staffResponse.map((staff: any) => ({
          id: staff.ID,
          first_name: staff.PersonalData?.FirstName || 'ไม่ระบุ',
          last_name: staff.PersonalData?.LastName || 'ไม่ระบุ',
          email: staff.PersonalData?.Email || 'ไม่ระบุ',
          department: staff.PersonalData?.Department || 'ไม่ระบุ',
          position: staff.Position || 'ไม่ระบุ',
          status: 'clocked-out' // Default status
        })));
      }
      
      // Load real stats from API
      if (statsResponse?.data) {
        setStats({
          total_staff: statsResponse.data.total_staff || 0,
          present_count: statsResponse.data.present_count || 0,
          late_count: statsResponse.data.late_count || 0,
          absent_count: statsResponse.data.absent_count || 0,
          average_hours: statsResponse.data.average_hours || 8.0
        });
      } else {
        // Fallback stats
        setStats({
          total_staff: staffResponse?.length || 0,
          present_count: 0,
          late_count: 0,
          absent_count: 0,
          average_hours: 8.0
        });
      }
      
    } catch (error) {
      console.error('loadData: Failed to load data:', error);
      message.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('StaffWorkTimeManagement: Component mounted, loading data...');
    loadData();
  }, []);

  const handleRefresh = () => {
    loadData();
  };


  return (
    <div className="staff-work-time-management" style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Simplified Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '24px',
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <div>
          <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
            <TeamOutlined /> จัดการเวลาทำงาน
          </Title>
          <Text type="secondary">ระบบจัดการตารางงานและเวลาทำงานของพนักงาน</Text>
        </div>
        <Space>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={handleRefresh}
            loading={loading}
          >
            รีเฟรช
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            size="large"
          >
            เพิ่มตารางงาน
          </Button>
        </Space>
      </div>

      {/* Improved Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              borderRadius: '12px', 
              border: '1px solid #e8f4fd',
              background: 'linear-gradient(135deg, #e8f4fd 0%, #ffffff 100%)'
            }}
          >
            <Statistic
              title={<Text strong style={{ color: '#1890ff' }}>พนักงานทั้งหมด</Text>}
              value={stats.total_staff}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              loading={loading}
              valueStyle={{ color: '#1890ff', fontSize: '28px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              borderRadius: '12px', 
              border: '1px solid #f6ffed',
              background: 'linear-gradient(135deg, #f6ffed 0%, #ffffff 100%)'
            }}
          >
            <Statistic
              title={<Text strong style={{ color: '#52c41a' }}>เข้างานแล้ว</Text>}
              value={stats.present_count + stats.late_count}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a', fontSize: '28px' }}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              borderRadius: '12px', 
              border: '1px solid #fff2e8',
              background: 'linear-gradient(135deg, #fff2e8 0%, #ffffff 100%)'
            }}
          >
            <Statistic
              title={<Text strong style={{ color: '#fa8c16' }}>มาสาย</Text>}
              value={stats.late_count}
              prefix={<ExclamationCircleOutlined style={{ color: '#fa8c16' }} />}
              valueStyle={{ color: '#fa8c16', fontSize: '28px' }}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              borderRadius: '12px', 
              border: '1px solid #f9f0ff',
              background: 'linear-gradient(135deg, #f9f0ff 0%, #ffffff 100%)'
            }}
          >
            <Statistic
              title={<Text strong style={{ color: '#722ed1' }}>ชั่วโมงเฉลี่ย</Text>}
              value={stats.average_hours.toFixed(1)}
              suffix="ชม."
              prefix={<ClockCircleOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1', fontSize: '28px' }}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content with Better UX */}
      <Card 
        style={{ 
          borderRadius: '12px', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          border: 'none'
        }}
      >
        <Tabs 
          defaultActiveKey="schedule" 
          type="card"
          size="large"
          tabBarStyle={{ 
            marginBottom: '24px',
            borderBottom: '2px solid #f0f0f0'
          }}
          items={[
            {
              key: 'schedule',
              label: (
                <span style={{ fontSize: '16px', fontWeight: 500 }}>
                  <CalendarOutlined style={{ marginRight: '8px' }} />
                  ตารางงานปฏิทิน
                </span>
              ),
              children: (
                <StaffScheduleCalendar 
                  staffData={staffData}
                  loading={loading}
                  onRefresh={handleRefresh}
                />
              )
            },
            {
              key: 'staff',
              label: (
                <span style={{ fontSize: '16px', fontWeight: 500 }}>
                  <UserOutlined style={{ marginRight: '8px' }} />
                  รายชื่อพนักงาน
                </span>
              ),
              children: (
                <div>
                  {/* Search and Filter Bar */}
                  <div style={{ 
                    marginBottom: '20px', 
                    padding: '16px', 
                    backgroundColor: '#fafafa', 
                    borderRadius: '8px'
                  }}>
                    <Row gutter={16}>
                      <Col xs={24} sm={12} md={8}>
                        <Search
                          placeholder="ค้นหาชื่อพนักงาน..."
                          prefix={<SearchOutlined />}
                          style={{ width: '100%' }}
                        />
                      </Col>
                      <Col xs={24} sm={12} md={8}>
                        <Select
                          placeholder="เลือกแผนก"
                          style={{ width: '100%' }}
                          allowClear
                        >
                          <Option value="ทันตกรรม">ทันตกรรม</Option>
                          <Option value="ผู้ช่วย">ผู้ช่วย</Option>
                          <Option value="บริหาร">บริหาร</Option>
                        </Select>
                      </Col>
                      <Col xs={24} sm={12} md={8}>
                        <Select
                          placeholder="เลือกตำแหน่ง"
                          style={{ width: '100%' }}
                          allowClear
                        >
                          <Option value="ทันตแพทย์">ทันตแพทย์</Option>
                          <Option value="ผู้ช่วย">ผู้ช่วย</Option>
                          <Option value="ผู้จัดการ">ผู้จัดการ</Option>
                        </Select>
                      </Col>
                    </Row>
                  </div>

                  <Table
                    dataSource={staffData}
                    loading={loading}
                    rowKey="id"
                    style={{ backgroundColor: '#fff' }}
                    columns={[
                      {
                        title: <Text strong>ชื่อ-นามสกุล</Text>,
                        key: 'name',
                        render: (record: StaffData) => (
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <UserOutlined style={{ 
                              marginRight: '8px', 
                              color: '#1890ff',
                              fontSize: '16px'
                            }} />
                            <Text strong>{`${record.first_name} ${record.last_name}`}</Text>
                          </div>
                        )
                      },
                      {
                        title: <Text strong>แผนก</Text>,
                        dataIndex: 'department',
                        key: 'department',
                        render: (department: string) => (
                          <Tag color="blue">{department}</Tag>
                        )
                      },
                      {
                        title: <Text strong>ตำแหน่ง</Text>,
                        dataIndex: 'position',
                        key: 'position',
                        render: (position: string) => (
                          <Tag color="green">{position}</Tag>
                        )
                      },
                      {
                        title: <Text strong>อีเมล</Text>,
                        dataIndex: 'email',
                        key: 'email',
                        render: (email: string) => (
                          <Text copyable={{ text: email }}>{email}</Text>
                        )
                      },
                      {
                        title: <Text strong>สถานะ</Text>,
                        key: 'status',
                        render: (record: StaffData) => (
                          <Tag color={record.status === 'clocked-in' ? 'green' : 'default'}>
                            {record.status === 'clocked-in' ? 'เข้างานแล้ว' : 'ยังไม่เข้างาน'}
                          </Tag>
                        )
                      }
                    ]}
                    pagination={{
                      pageSize: 8,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      showTotal: (total, range) => (
                        <Text type="secondary">{`แสดง ${range[0]}-${range[1]} จาก ${total} รายการ`}</Text>
                      ),
                      style: { marginTop: '16px' }
                    }}
                    scroll={{ x: 800 }}
                  />
                </div>
              )
            }
          ]}
        />
      </Card>
    </div>
  );
};

export default StaffWorkTimeManagement;
