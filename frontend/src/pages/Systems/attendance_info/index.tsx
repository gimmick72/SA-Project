import React, { useState } from "react";
import { Card, Table, Button, Modal, Form, Input, DatePicker, TimePicker, Select, Space, Tag, Typography, Row, Col, Statistic } from "antd";
import { PlusOutlined, ClockCircleOutlined, CalendarOutlined, UserOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface AttendanceRecord {
  id: string;
  staffId: string;
  staffName: string;
  position: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  workHours?: number;
  status: 'present' | 'late' | 'absent' | 'half-day';
  notes?: string;
}

const AttendanceInfoPage = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);

  // Mock data
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([
    {
      id: '1',
      staffId: 'ST001',
      staffName: 'นายสมชาย ใจดี',
      position: 'ทันตแพทย์',
      date: '2024-08-26',
      checkIn: '08:00',
      checkOut: '17:00',
      workHours: 9,
      status: 'present',
      notes: ''
    },
    {
      id: '2',
      staffId: 'ST002',
      staffName: 'นางสาวมาลี สวยงาม',
      position: 'พยาบาล',
      date: '2024-08-26',
      checkIn: '08:15',
      checkOut: '17:00',
      workHours: 8.75,
      status: 'late',
      notes: 'สาย 15 นาที'
    },
    {
      id: '3',
      staffId: 'ST003',
      staffName: 'นายวิชัย ขยันทำงาน',
      position: 'เจ้าหน้าที่',
      date: '2024-08-26',
      checkIn: '08:00',
      checkOut: '',
      workHours: 0,
      status: 'present',
      notes: 'ยังไม่ออกงาน'
    }
  ]);

  const columns: ColumnsType<AttendanceRecord> = [
    {
      title: 'รหัสพนักงาน',
      dataIndex: 'staffId',
      key: 'staffId',
      width: 120,
    },
    {
      title: 'ชื่อ-นามสกุล',
      dataIndex: 'staffName',
      key: 'staffName',
      width: 180,
    },
    {
      title: 'ตำแหน่ง',
      dataIndex: 'position',
      key: 'position',
      width: 120,
    },
    {
      title: 'วันที่',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'เวลาเข้างาน',
      dataIndex: 'checkIn',
      key: 'checkIn',
      width: 100,
    },
    {
      title: 'เวลาออกงาน',
      dataIndex: 'checkOut',
      key: 'checkOut',
      width: 100,
      render: (checkOut) => checkOut || '-',
    },
    {
      title: 'ชั่วโมงทำงาน',
      dataIndex: 'workHours',
      key: 'workHours',
      width: 120,
      render: (hours) => hours ? `${hours} ชม.` : '-',
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: 'present' | 'late' | 'absent' | 'half-day') => {
        const statusConfig = {
          present: { color: 'green', text: 'มาทำงาน' },
          late: { color: 'orange', text: 'มาสาย' },
          absent: { color: 'red', text: 'ขาดงาน' },
          'half-day': { color: 'blue', text: 'ครึ่งวัน' }
        };
        const config = statusConfig[status];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'หมายเหตุ',
      dataIndex: 'notes',
      key: 'notes',
      render: (notes) => notes || '-',
    },
    {
      title: 'จัดการ',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button 
          type="link" 
          onClick={() => handleEdit(record)}
        >
          แก้ไข
        </Button>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: AttendanceRecord) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      date: dayjs(record.date),
      checkIn: record.checkIn ? dayjs(record.checkIn, 'HH:mm') : null,
      checkOut: record.checkOut ? dayjs(record.checkOut, 'HH:mm') : null,
    });
    setIsModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    const newRecord: AttendanceRecord = {
      id: editingRecord?.id || Date.now().toString(),
      staffId: values.staffId,
      staffName: values.staffName,
      position: values.position,
      date: values.date.format('YYYY-MM-DD'),
      checkIn: values.checkIn?.format('HH:mm') || '',
      checkOut: values.checkOut?.format('HH:mm') || '',
      workHours: values.checkIn && values.checkOut ? 
        dayjs(values.checkOut.format('HH:mm'), 'HH:mm').diff(dayjs(values.checkIn.format('HH:mm'), 'HH:mm'), 'hour', true) : 0,
      status: values.status,
      notes: values.notes || ''
    };

    if (editingRecord) {
      setAttendanceData(prev => prev.map(item => 
        item.id === editingRecord.id ? newRecord : item
      ));
    } else {
      setAttendanceData(prev => [...prev, newRecord]);
    }

    setIsModalVisible(false);
    form.resetFields();
  };

  // Calculate statistics
  const totalStaff = attendanceData.length;
  const presentStaff = attendanceData.filter(record => record.status === 'present' || record.status === 'late').length;
  const lateStaff = attendanceData.filter(record => record.status === 'late').length;
  const absentStaff = attendanceData.filter(record => record.status === 'absent').length;

  return (
    <div style={{ padding: '24px' }}>
        <Title level={2}>
          <ClockCircleOutlined /> บันทึกการเข้างาน
        </Title>

        {/* Statistics Cards */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="พนักงานทั้งหมด"
                value={totalStaff}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="มาทำงาน"
                value={presentStaff}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="มาสาย"
                value={lateStaff}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="ขาดงาน"
                value={absentStaff}
                valueStyle={{ color: '#f5222d' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Main Content */}
        <Card>
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space>
              <RangePicker placeholder={['วันที่เริ่มต้น', 'วันที่สิ้นสุด']} />
              <Select placeholder="เลือกสถานะ" style={{ width: 120 }} allowClear>
                <Option value="present">มาทำงาน</Option>
                <Option value="late">มาสาย</Option>
                <Option value="absent">ขาดงาน</Option>
                <Option value="half-day">ครึ่งวัน</Option>
              </Select>
            </Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleAdd}
            >
              บันทึกการเข้างาน
            </Button>
          </div>

          <Table
            columns={columns}
            dataSource={attendanceData}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} จาก ${total} รายการ`,
            }}
            scroll={{ x: 1200 }}
          />
        </Card>

        {/* Add/Edit Modal */}
        <Modal
          title={editingRecord ? 'แก้ไขการเข้างาน' : 'บันทึกการเข้างาน'}
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
                  name="staffId"
                  label="รหัสพนักงาน"
                  rules={[{ required: true, message: 'กรุณาระบุรหัสพนักงาน' }]}
                >
                  <Input placeholder="ST001" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="staffName"
                  label="ชื่อ-นามสกุล"
                  rules={[{ required: true, message: 'กรุณาระบุชื่อ-นามสกุล' }]}
                >
                  <Input placeholder="นายสมชาย ใจดี" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="position"
                  label="ตำแหน่ง"
                  rules={[{ required: true, message: 'กรุณาระบุตำแหน่ง' }]}
                >
                  <Select placeholder="เลือกตำแหน่ง">
                    <Option value="ทันตแพทย์">ทันตแพทย์</Option>
                    <Option value="พยาบาล">พยาบาล</Option>
                    <Option value="เจ้าหน้าที่">เจ้าหน้าที่</Option>
                    <Option value="แม่บ้าน">แม่บ้าน</Option>
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
              <Col span={8}>
                <Form.Item
                  name="checkIn"
                  label="เวลาเข้างาน"
                  rules={[{ required: true, message: 'กรุณาระบุเวลาเข้างาน' }]}
                >
                  <TimePicker format="HH:mm" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="checkOut"
                  label="เวลาออกงาน"
                >
                  <TimePicker format="HH:mm" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="status"
                  label="สถานะ"
                  rules={[{ required: true, message: 'กรุณาเลือกสถานะ' }]}
                >
                  <Select placeholder="เลือกสถานะ">
                    <Option value="present">มาทำงาน</Option>
                    <Option value="late">มาสาย</Option>
                    <Option value="absent">ขาดงาน</Option>
                    <Option value="half-day">ครึ่งวัน</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="notes"
              label="หมายเหตุ"
            >
              <Input.TextArea rows={3} placeholder="หมายเหตุเพิ่มเติม..." />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Space>
                <Button onClick={() => setIsModalVisible(false)}>
                  ยกเลิก
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingRecord ? 'บันทึกการแก้ไข' : 'บันทึก'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
    </div>
  );
};

export default AttendanceInfoPage;
