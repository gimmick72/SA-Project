import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  message,
  Popconfirm,
  Typography,
  Row,
  Col,
  Statistic,
  TimePicker
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { attendanceAPI, Attendance, AttendanceStats } from '../../../../services/api';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

const AttendanceManagement: React.FC = () => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState<Attendance | null>(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Load attendances
  const loadAttendances = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await attendanceAPI.getAttendances({
        page,
        page_size: pageSize,
      });
      setAttendances(response.data);
      setPagination({
        current: page,
        pageSize,
        total: response.pagination?.total || 0,
      });
    } catch (error) {
      message.error('Failed to load attendance records');
      console.error('Error loading attendances:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load statistics
  const loadStats = async () => {
    try {
      const response = await attendanceAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  useEffect(() => {
    loadAttendances();
    loadStats();
  }, []);

  // Handle create/update attendance
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const attendanceData = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
        staff_id: 1, // Default staff ID for now
      };

      if (editingAttendance) {
        await attendanceAPI.updateAttendance(editingAttendance.id, attendanceData);
        message.success('Attendance updated successfully');
      } else {
        await attendanceAPI.createAttendance(attendanceData);
        message.success('Attendance created successfully');
      }
      setModalVisible(false);
      setEditingAttendance(null);
      form.resetFields();
      loadAttendances();
      loadStats();
    } catch (error) {
      message.error(editingAttendance ? 'Failed to update attendance' : 'Failed to create attendance');
      console.error('Error saving attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete attendance
  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await attendanceAPI.deleteAttendance(id);
      message.success('Attendance deleted successfully');
      loadAttendances();
      loadStats();
    } catch (error) {
      message.error('Failed to delete attendance');
      console.error('Error deleting attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle check-in
  const handleCheckIn = async () => {
    try {
      const response = await attendanceAPI.checkIn(1, 'Main Clinic', 'Check-in via system');
      message.success(`Checked in successfully at ${dayjs(response.data.check_in_time).format('HH:mm')}`);
      if (response.data.is_late) {
        message.warning(`You are ${response.data.late_minutes} minutes late`);
      }
      loadAttendances();
      loadStats();
    } catch (error) {
      message.error('Failed to check in');
      console.error('Error checking in:', error);
    }
  };

  // Handle check-out
  const handleCheckOut = async () => {
    try {
      const response = await attendanceAPI.checkOut(1, 'Check-out via system');
      message.success(`Checked out successfully. Work hours: ${response.data.work_hours} hours`);
      loadAttendances();
      loadStats();
    } catch (error) {
      message.error('Failed to check out');
      console.error('Error checking out:', error);
    }
  };

  // Open modal for create/edit
  const openModal = (attendance?: Attendance) => {
    if (attendance) {
      setEditingAttendance(attendance);
      form.setFieldsValue({
        ...attendance,
        date: attendance.date ? dayjs(attendance.date) : null,
      });
    } else {
      setEditingAttendance(null);
      form.resetFields();
    }
    setModalVisible(true);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'success';
      case 'late':
        return 'warning';
      case 'absent':
        return 'error';
      case 'half_day':
        return 'processing';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: 'Staff ID',
      dataIndex: 'staff_id',
      key: 'staff_id',
      render: (id: number) => `Staff ${id}`,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
      sorter: (a: Attendance, b: Attendance) => 
        dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
    {
      title: 'Check In',
      dataIndex: 'check_in_time',
      key: 'check_in_time',
      render: (time: string) => time ? dayjs(time).format('HH:mm') : '-',
    },
    {
      title: 'Check Out',
      dataIndex: 'check_out_time',
      key: 'check_out_time',
      render: (time: string) => time ? dayjs(time).format('HH:mm') : '-',
    },
    {
      title: 'Work Hours',
      dataIndex: 'work_hours',
      key: 'work_hours',
      render: (hours: number) => `${hours.toFixed(1)}h`,
      sorter: (a: Attendance, b: Attendance) => a.work_hours - b.work_hours,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: Attendance) => (
        <Space>
          <Tag color={getStatusColor(status)}>
            {status.toUpperCase()}
          </Tag>
          {record.is_late && (
            <Tag color="orange">
              Late {record.late_minutes}min
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (text: string) => text || '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Attendance) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => {
              Modal.info({
                title: 'Attendance Details',
                content: (
                  <div>
                    <p><strong>Staff ID:</strong> {record.staff_id}</p>
                    <p><strong>Date:</strong> {dayjs(record.date).format('DD/MM/YYYY')}</p>
                    <p><strong>Check In:</strong> {record.check_in_time ? dayjs(record.check_in_time).format('HH:mm') : 'Not checked in'}</p>
                    <p><strong>Check Out:</strong> {record.check_out_time ? dayjs(record.check_out_time).format('HH:mm') : 'Not checked out'}</p>
                    <p><strong>Work Hours:</strong> {record.work_hours.toFixed(1)} hours</p>
                    <p><strong>Status:</strong> {record.status}</p>
                    <p><strong>Location:</strong> {record.location || 'N/A'}</p>
                    <p><strong>Notes:</strong> {record.notes || 'N/A'}</p>
                    {record.is_late && (
                      <p><strong>Late:</strong> {record.late_minutes} minutes</p>
                    )}
                  </div>
                ),
              });
            }}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this attendance record?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Quick Actions */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Title level={5}>Quick Check-in/out</Title>
              <Space>
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={handleCheckIn}
                >
                  Check In
                </Button>
                <Button
                  icon={<ExclamationCircleOutlined />}
                  onClick={handleCheckOut}
                >
                  Check Out
                </Button>
              </Space>
            </Space>
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Title level={5}>Today's Status</Title>
            <Space>
              <Tag color="success">Present: {stats?.present_count || 0}</Tag>
              <Tag color="warning">Late: {stats?.late_count || 0}</Tag>
              <Tag color="error">Absent: {stats?.absent_count || 0}</Tag>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Statistics Cards */}
      {stats && (
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Staff"
                value={stats.total_staff}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Present Today"
                value={stats.present_count}
                valueStyle={{ color: '#3f8600' }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Average Hours"
                value={stats.average_hours}
                precision={1}
                suffix="h"
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Hours"
                value={stats.total_hours}
                precision={1}
                suffix="h"
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Main Table */}
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Title level={4}>Attendance Management</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openModal()}
          >
            Add Attendance
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={attendances}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} records`,
            onChange: (page, pageSize) => {
              loadAttendances(page, pageSize);
            },
          }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingAttendance ? 'Edit Attendance' : 'Create Attendance'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingAttendance(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="date"
                label="Date"
                rules={[{ required: true, message: 'Please select date' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select placeholder="Select status">
                  <Option value="present">Present</Option>
                  <Option value="late">Late</Option>
                  <Option value="absent">Absent</Option>
                  <Option value="half_day">Half Day</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="location"
            label="Location"
          >
            <Input placeholder="Enter location" />
          </Form.Item>

          <Form.Item
            name="notes"
            label="Notes"
          >
            <Input.TextArea
              rows={3}
              placeholder="Enter notes"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingAttendance ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AttendanceManagement;
