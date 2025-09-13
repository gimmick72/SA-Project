import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Card, Typography, Tag, Modal, Form, Input, Select, DatePicker, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { attendanceAPI, staffAttendanceAPI } from '../../../services/api';
import { ensureAuthentication } from '../../../utils/auth';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

interface AttendanceRecord {
  id: number;
  staff_id: number;
  date: string;
  check_in_time?: string;
  check_out_time?: string;
  work_hours: number;
  status: 'present' | 'late' | 'absent' | 'half_day';
  notes: string;
  location: string;
  is_late: boolean;
  late_minutes: number;
  staff?: {
    first_name: string;
    last_name: string;
  };
}

interface StaffMember {
  ID: number;
  PersonalData?: {
    FirstName: string;
    LastName: string;
    Email: string;
  };
}

const BasicAttendanceManagement: React.FC = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [staffData, setStaffData] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [form] = Form.useForm();

  const loadData = async () => {
    setLoading(true);
    try {
      const isAuth = await ensureAuthentication();
      if (!isAuth) {
        message.error('Authentication failed');
        return;
      }

      // Load attendance records and staff data
      const [attendanceResponse, staffResponse] = await Promise.all([
        attendanceAPI.getAttendances(),
        staffAttendanceAPI.getStaffList()
      ]);

      if (attendanceResponse?.data) {
        setAttendanceData(attendanceResponse.data);
      }

      if (staffResponse && Array.isArray(staffResponse)) {
        setStaffData(staffResponse);
      }

    } catch (error) {
      console.error('Failed to load data:', error);
      message.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    form.setFieldsValue({
      date: dayjs(),
      status: 'present',
      location: 'Office'
    });
    setIsModalVisible(true);
  };

  const handleEdit = (record: AttendanceRecord) => {
    setEditingRecord(record);
    form.setFieldsValue({
      staff_id: record.staff_id,
      date: dayjs(record.date),
      status: record.status,
      notes: record.notes,
      location: record.location
    });
    setIsModalVisible(true);
  };

  const handleDelete = (record: AttendanceRecord) => {
    Modal.confirm({
      title: 'ยืนยันการลบ',
      content: 'คุณต้องการลบข้อมูลการเข้างานนี้หรือไม่?',
      okText: 'ลบ',
      cancelText: 'ยกเลิก',
      onOk: async () => {
        try {
          await attendanceAPI.deleteAttendance(record.id);
          message.success('ลบข้อมูลสำเร็จ');
          loadData();
        } catch (error) {
          console.error('Delete failed:', error);
          message.error('เกิดข้อผิดพลาดในการลบข้อมูล');
        }
      }
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      const attendanceData = {
        staff_id: values.staff_id,
        date: values.date.format('YYYY-MM-DD'),
        status: values.status,
        notes: values.notes || '',
        location: values.location || 'Office'
      };

      if (editingRecord) {
        await attendanceAPI.updateAttendance(editingRecord.id, attendanceData);
        message.success('อัปเดตข้อมูลสำเร็จ');
      } else {
        await attendanceAPI.createAttendance(attendanceData);
        message.success('เพิ่มข้อมูลสำเร็จ');
      }

      setIsModalVisible(false);
      loadData();
    } catch (error) {
      console.error('Submit failed:', error);
      message.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'green';
      case 'late': return 'orange';
      case 'absent': return 'red';
      case 'half_day': return 'blue';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'present': return 'เข้างาน';
      case 'late': return 'มาสาย';
      case 'absent': return 'ขาดงาน';
      case 'half_day': return 'ครึ่งวัน';
      default: return status;
    }
  };

  const columns = [
    {
      title: 'วันที่',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY')
    },
    {
      title: 'พนักงาน',
      key: 'staff_name',
      render: (record: AttendanceRecord) => {
        if (record.staff) {
          return `${record.staff.first_name} ${record.staff.last_name}`;
        }
        // Fallback to staff data
        const staff = staffData.find(s => s.ID === record.staff_id);
        if (staff?.PersonalData) {
          return `${staff.PersonalData.FirstName} ${staff.PersonalData.LastName}`;
        }
        return `Staff ID: ${record.staff_id}`;
      }
    },
    {
      title: 'เวลาเข้า',
      dataIndex: 'check_in_time',
      key: 'check_in_time',
      render: (time: string) => time || '-'
    },
    {
      title: 'เวลาออก',
      dataIndex: 'check_out_time',
      key: 'check_out_time',
      render: (time: string) => time || '-'
    },
    {
      title: 'ชั่วโมงทำงาน',
      dataIndex: 'work_hours',
      key: 'work_hours',
      render: (hours: number) => `${hours.toFixed(1)} ชม.`
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: AttendanceRecord) => (
        <Space>
          <Tag color={getStatusColor(status)}>
            {getStatusText(status)}
          </Tag>
          {record.is_late && (
            <Tag color="orange">สาย {record.late_minutes} นาที</Tag>
          )}
        </Space>
      )
    },
    {
      title: 'สถานที่',
      dataIndex: 'location',
      key: 'location'
    },
    {
      title: 'หมายเหตุ',
      dataIndex: 'notes',
      key: 'notes',
      render: (notes: string) => notes || '-'
    },
    {
      title: 'จัดการ',
      key: 'actions',
      render: (record: AttendanceRecord) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            แก้ไข
          </Button>
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            ลบ
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={3}>จัดการข้อมูลการเข้างาน</Title>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={loadData}
              loading={loading}
            >
              รีเฟรช
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              เพิ่มข้อมูล
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={attendanceData}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `แสดง ${range[0]}-${range[1]} จาก ${total} รายการ`
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      <Modal
        title={editingRecord ? 'แก้ไขข้อมูลการเข้างาน' : 'เพิ่มข้อมูลการเข้างาน'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
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
                name="staff_id"
                label="พนักงาน"
                rules={[{ required: true, message: 'กรุณาเลือกพนักงาน' }]}
              >
                <Select placeholder="เลือกพนักงาน">
                  {staffData.map(staff => (
                    <Option key={staff.ID} value={staff.ID}>
                      {staff.PersonalData ? 
                        `${staff.PersonalData.FirstName} ${staff.PersonalData.LastName}` : 
                        `Staff ID: ${staff.ID}`
                      }
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="date"
                label="วันที่"
                rules={[{ required: true, message: 'กรุณาเลือกวันที่' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="สถานะ"
                rules={[{ required: true, message: 'กรุณาเลือกสถานะ' }]}
              >
                <Select>
                  <Option value="present">เข้างาน</Option>
                  <Option value="late">มาสาย</Option>
                  <Option value="absent">ขาดงาน</Option>
                  <Option value="half_day">ครึ่งวัน</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="location"
                label="สถานที่"
              >
                <Input placeholder="สถานที่ทำงาน" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="notes"
            label="หมายเหตุ"
          >
            <Input.TextArea rows={3} placeholder="หมายเหตุเพิ่มเติม" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>
                ยกเลิก
              </Button>
              <Button type="primary" htmlType="submit">
                {editingRecord ? 'อัปเดต' : 'เพิ่ม'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BasicAttendanceManagement;
