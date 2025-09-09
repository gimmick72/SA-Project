import React, { useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
  Space,
  Tag,
  Popconfirm,
  message,
  Card,
  Row,
  Col,
  Badge,
  Progress,
  Typography,
  Statistic,
  Tooltip,
  Divider
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  FilterOutlined,
  TeamOutlined,
  CheckOutlined,
  CopyOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import './StaffScheduleManager.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface Schedule {
  id: string;
  staffId: string;
  staffName: string;
  position: string;
  date: string;
  startTime: string;
  endTime: string;
  breakDuration: number;
  workHours: number;
  scheduleType: 'regular' | 'overtime' | 'holiday' | 'shift';
  status: 'scheduled' | 'confirmed' | 'cancelled';
  notes?: string;
}

interface StaffMember {
  id: string;
  name: string;
  position: string;
  defaultShift: {
    startTime: string;
    endTime: string;
    workDays: string[];
  };
}

const StaffScheduleManager: React.FC = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [selectedWeek, setSelectedWeek] = useState(dayjs());
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [isBulkAddModalVisible, setIsBulkAddModalVisible] = useState(false);
  const [bulkAddVisible, setBulkAddVisible] = useState(false);

  // Mock data with proper roles
  const [staffMembers] = useState<StaffMember[]>([
    {
      id: 'ST001',
      name: 'ดร.สมชาย ใจดี',
      position: 'Dentist',
      defaultShift: {
        startTime: '08:00',
        endTime: '17:00',
        workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
      }
    },
    {
      id: 'ST002',
      name: 'ดร.วิชญา สุขใส',
      position: 'Dentist',
      defaultShift: {
        startTime: '09:00',
        endTime: '18:00',
        workDays: ['tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      }
    },
    {
      id: 'ST003',
      name: 'นางสาวมาลี สวยงาม',
      position: 'Dental Assistant',
      defaultShift: {
        startTime: '08:00',
        endTime: '17:00',
        workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      }
    },
    {
      id: 'ST004',
      name: 'นางสาวสุดา ช่วยเหลือ',
      position: 'Dental Assistant',
      defaultShift: {
        startTime: '08:30',
        endTime: '17:30',
        workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
      }
    },
    {
      id: 'ST005',
      name: 'นางสาวจิรา ต้อนรับ',
      position: 'Receptionist',
      defaultShift: {
        startTime: '07:30',
        endTime: '16:30',
        workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      }
    },
    {
      id: 'ST006',
      name: 'นางสาวปราณี บริการ',
      position: 'Receptionist',
      defaultShift: {
        startTime: '12:00',
        endTime: '21:00',
        workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
      }
    },
    {
      id: 'ST007',
      name: 'นางสมหวัง ทำความสะอาด',
      position: 'Maid',
      defaultShift: {
        startTime: '06:00',
        endTime: '15:00',
        workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      }
    },
    {
      id: 'ST008',
      name: 'นางสาวนิด สะอาด',
      position: 'Maid',
      defaultShift: {
        startTime: '14:00',
        endTime: '22:00',
        workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
      }
    }
  ]);

  const [schedules, setSchedules] = useState<Schedule[]>([
    {
      id: '1',
      staffId: 'ST001',
      staffName: 'ดร.สมชาย ใจดี',
      position: 'Dentist',
      date: '2024-09-09',
      startTime: '08:00',
      endTime: '17:00',
      breakDuration: 60,
      workHours: 8,
      scheduleType: 'regular',
      status: 'confirmed'
    },
    {
      id: '2',
      staffId: 'ST003',
      staffName: 'นางสาวมาลี สวยงาม',
      position: 'Dental Assistant',
      date: '2024-09-09',
      startTime: '08:00',
      endTime: '17:00',
      breakDuration: 60,
      workHours: 8,
      scheduleType: 'regular',
      status: 'confirmed'
    },
    {
      id: '3',
      staffId: 'ST005',
      staffName: 'นางสาวจิรา ต้อนรับ',
      position: 'Receptionist',
      date: '2024-09-09',
      startTime: '07:30',
      endTime: '16:30',
      breakDuration: 60,
      workHours: 8,
      scheduleType: 'regular',
      status: 'confirmed'
    },
    {
      id: '4',
      staffId: 'ST007',
      staffName: 'นางสมหวัง ทำความสะอาด',
      position: 'Maid',
      date: '2024-09-09',
      startTime: '06:00',
      endTime: '15:00',
      breakDuration: 60,
      workHours: 8,
      scheduleType: 'regular',
      status: 'confirmed'
    },
    {
      id: '5',
      staffId: 'ST002',
      staffName: 'ดร.วิชญา สุขใส',
      position: 'Dentist',
      date: '2024-09-10',
      startTime: '09:00',
      endTime: '20:00',
      breakDuration: 120,
      workHours: 9,
      scheduleType: 'overtime',
      status: 'scheduled',
      notes: 'ทำงานล่วงเวลาเพื่อดูแลผู้ป่วยพิเศษ'
    },
    {
      id: '6',
      staffId: 'ST006',
      staffName: 'นางสาวปราณี บริการ',
      position: 'Receptionist',
      date: '2024-09-10',
      startTime: '12:00',
      endTime: '21:00',
      breakDuration: 60,
      workHours: 8,
      scheduleType: 'regular',
      status: 'scheduled'
    }
  ]);

  const columns: ColumnsType<Schedule> = [
    {
      title: 'พนักงาน',
      key: 'staff',
      width: 200,
      render: (_, record) => (
        <div>
          <Text strong>{record.staffName}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.position}
          </Text>
        </div>
      ),
    },
    {
      title: 'วันที่',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'เวลาทำงาน',
      key: 'workTime',
      width: 150,
      render: (_, record) => (
        <div>
          <ClockCircleOutlined /> {record.startTime} - {record.endTime}
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            รวม {record.workHours} ชั่วโมง
          </Text>
        </div>
      ),
    },
    {
      title: 'พักงาน',
      dataIndex: 'breakDuration',
      key: 'breakDuration',
      width: 100,
      render: (duration) => `${duration} นาที`,
    },
    {
      title: 'ประเภท',
      dataIndex: 'scheduleType',
      key: 'scheduleType',
      width: 120,
      render: (type) => {
        const typeConfig = {
          regular: { color: 'blue', text: 'ปกติ' },
          overtime: { color: 'orange', text: 'ล่วงเวลา' },
          holiday: { color: 'red', text: 'วันหยุด' },
          shift: { color: 'purple', text: 'เปลี่ยนกะ' }
        };
        const config = typeConfig[type as keyof typeof typeConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        const statusConfig = {
          scheduled: { color: 'processing', text: 'กำหนดแล้ว' },
          confirmed: { color: 'success', text: 'ยืนยันแล้ว' },
          cancelled: { color: 'error', text: 'ยกเลิก' }
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'หมายเหตุ',
      dataIndex: 'notes',
      key: 'notes',
      render: (notes) => notes ? (
        <Tooltip title={notes}>
          <Text ellipsis style={{ maxWidth: 100 }}>
            {notes}
          </Text>
        </Tooltip>
      ) : '-',
    },
    {
      title: 'จัดการ',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            แก้ไข
          </Button>
          <Button
            type="link"
            icon={<CopyOutlined />}
            onClick={() => handleCopy(record)}
          >
            คัดลอก
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            ลบ
          </Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingSchedule(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    form.setFieldsValue({
      ...schedule,
      date: dayjs(schedule.date),
      startTime: dayjs(schedule.startTime, 'HH:mm'),
      endTime: dayjs(schedule.endTime, 'HH:mm'),
    });
    setIsModalVisible(true);
  };

  const handleCopy = (schedule: Schedule) => {
    const newSchedule = {
      ...schedule,
      id: Date.now().toString(),
      date: dayjs().format('YYYY-MM-DD'),
      status: 'scheduled' as const
    };
    setSchedules(prev => [...prev, newSchedule]);
    message.success('คัดลอกตารางงานสำเร็จ');
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'ยืนยันการลบ',
      content: 'คุณต้องการลบตารางงานนี้หรือไม่?',
      okText: 'ลบ',
      cancelText: 'ยกเลิก',
      okType: 'danger',
      onOk: () => {
        setSchedules(prev => prev.filter(item => item.id !== id));
        message.success('ลบตารางงานสำเร็จ');
      },
    });
  };

  const handleSubmit = async (values: any) => {
    const startTime = values.startTime.format('HH:mm');
    const endTime = values.endTime.format('HH:mm');
    const workHours = dayjs(endTime, 'HH:mm').diff(dayjs(startTime, 'HH:mm'), 'hour', true) - (values.breakDuration / 60);

    const newSchedule: Schedule = {
      id: editingSchedule?.id || Date.now().toString(),
      staffId: values.staffId,
      staffName: staffMembers.find(s => s.id === values.staffId)?.name || '',
      position: staffMembers.find(s => s.id === values.staffId)?.position || '',
      date: values.date.format('YYYY-MM-DD'),
      startTime,
      endTime,
      breakDuration: values.breakDuration,
      workHours: Math.max(0, workHours),
      scheduleType: values.scheduleType,
      status: values.status,
      notes: values.notes || ''
    };

    if (editingSchedule) {
      setSchedules(prev => prev.map(item => 
        item.id === editingSchedule.id ? newSchedule : item
      ));
      message.success('แก้ไขตารางงานสำเร็จ');
    } else {
      setSchedules(prev => [...prev, newSchedule]);
      message.success('เพิ่มตารางงานสำเร็จ');
    }

    setIsModalVisible(false);
    form.resetFields();
  };

  const generateWeeklySchedule = () => {
    Modal.confirm({
      title: 'สร้างตารางงานประจำสัปดาห์',
      content: 'คุณต้องการสร้างตารางงานตามเวลาปกติของพนักงานทุกคนหรือไม่?',
      okText: 'สร้าง',
      cancelText: 'ยกเลิก',
      onOk: () => {
        const newSchedules: Schedule[] = [];
        const startOfWeek = selectedWeek.startOf('week');

        staffMembers.forEach(staff => {
          staff.defaultShift.workDays.forEach(day => {
            const dayIndex = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(day);
            const scheduleDate = startOfWeek.add(dayIndex, 'day');
            
            // Check if schedule already exists
            const existingSchedule = schedules.find(s => 
              s.staffId === staff.id && s.date === scheduleDate.format('YYYY-MM-DD')
            );

            if (!existingSchedule) {
              const workHours = dayjs(staff.defaultShift.endTime, 'HH:mm')
                .diff(dayjs(staff.defaultShift.startTime, 'HH:mm'), 'hour', true) - 1; // 1 hour break

              newSchedules.push({
                id: `${staff.id}-${scheduleDate.format('YYYY-MM-DD')}`,
                staffId: staff.id,
                staffName: staff.name,
                position: staff.position,
                date: scheduleDate.format('YYYY-MM-DD'),
                startTime: staff.defaultShift.startTime,
                endTime: staff.defaultShift.endTime,
                breakDuration: 60,
                workHours,
                scheduleType: 'regular',
                status: 'scheduled'
              });
            }
          });
        });

        setSchedules(prev => [...prev, ...newSchedules]);
        message.success(`สร้างตารางงาน ${newSchedules.length} รายการสำเร็จ`);
      },
    });
  };

  const handleBulkAddByRole = () => {
    setIsBulkAddModalVisible(true);
  };

  const handleBulkAddSubmit = (values: any) => {
    const selectedStaff = staffMembers.filter(staff => 
      values.staffIds.includes(staff.id)
    );

    const newSchedules: Schedule[] = [];
    const scheduleDate = values.date.format('YYYY-MM-DD');

    selectedStaff.forEach(staff => {
      // Check if schedule already exists
      const existingSchedule = schedules.find(s => 
        s.staffId === staff.id && s.date === scheduleDate
      );

      if (!existingSchedule) {
        const startTime = values.startTime.format('HH:mm');
        const endTime = values.endTime.format('HH:mm');
        const workHours = dayjs(endTime, 'HH:mm').diff(dayjs(startTime, 'HH:mm'), 'hour', true) - (values.breakDuration / 60);

        newSchedules.push({
          id: `${staff.id}-${scheduleDate}-${Date.now()}`,
          staffId: staff.id,
          staffName: staff.name,
          position: staff.position,
          date: scheduleDate,
          startTime,
          endTime,
          breakDuration: values.breakDuration,
          workHours: Math.max(0, workHours),
          scheduleType: values.scheduleType,
          status: 'scheduled',
          notes: values.notes || ''
        });
      }
    });

    setSchedules(prev => [...prev, ...newSchedules]);
    message.success(`เพิ่มตารางงาน ${newSchedules.length} รายการสำเร็จ`);
    setIsBulkAddModalVisible(false);
  };

  // Filter schedules by role and status
  const filteredSchedules = schedules.filter(schedule => {
    const roleMatch = selectedRole === 'all' || schedule.position === selectedRole;
    const statusMatch = !selectedStatus || schedule.status === selectedStatus;
    return roleMatch && statusMatch;
  });

  const filteredStaffMembers = selectedRole === 'all' 
    ? staffMembers 
    : staffMembers.filter(staff => staff.position === selectedRole);

  // Get role statistics
  const getRoleStats = () => {
    const roles = ['Dentist', 'Dental Assistant', 'Receptionist', 'Maid'];
    return roles.map(role => ({
      role,
      count: staffMembers.filter(staff => staff.position === role).length,
      scheduled: schedules.filter(schedule => 
        schedule.position === role && 
        schedule.date === dayjs().format('YYYY-MM-DD')
      ).length
    }));
  };

  return (
    <div className="schedule-manager-container">
      <Card>
        <div className="schedule-header">
          <div>
            <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
              จัดการตารางงานพนักงาน
            </Title>
            <Text type="secondary">จัดการและติดตามตารางงานของพนักงานทุกตำแหน่ง</Text>
          </div>
          
          <div className="schedule-filters">
            <Select
              placeholder="กรองตามตำแหน่ง"
              style={{ width: 150 }}
              allowClear
              value={selectedRole}
              onChange={setSelectedRole}
              suffixIcon={<FilterOutlined />}
            >
              <Option value="dentist">ทันตแพทย์</Option>
              <Option value="assistant">ผู้ช่วยทันตแพทย์</Option>
              <Option value="receptionist">พนักงานต้อนรับ</Option>
              <Option value="maid">พนักงานทำความสะอาด</Option>
            </Select>
            
            <Select
              placeholder="กรองตามสถานะ"
              style={{ width: 120 }}
              allowClear
              value={selectedStatus}
              onChange={setSelectedStatus}
              suffixIcon={<FilterOutlined />}
            >
              <Option value="scheduled">กำหนดแล้ว</Option>
              <Option value="confirmed">ยืนยันแล้ว</Option>
              <Option value="cancelled">ยกเลิก</Option>
            </Select>
          </div>
        </div>

        <div className="schedule-actions">
          <Button
            type="default"
            icon={<CalendarOutlined />}
            onClick={generateWeeklySchedule}
          >
            สร้างตารางสัปดาห์
          </Button>
          <Button
            type="default"
            icon={<PlusOutlined />}
            onClick={() => setIsBulkAddModalVisible(true)}
          >
            เพิ่มหลายคน
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            เพิ่มตารางงาน
          </Button>
        </div>

        {/* Quick Stats */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Card size="small" className="quick-stat-card">
              <Statistic
                title="พนักงานทั้งหมด"
                value={staffMembers.length}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#1890ff', fontSize: '18px' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" className="quick-stat-card">
              <Statistic
                title="ตารางวันนี้"
                value={filteredSchedules.filter(s => s.date === dayjs().format('YYYY-MM-DD')).length}
                prefix={<CalendarOutlined />}
                valueStyle={{ color: '#52c41a', fontSize: '18px' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" className="quick-stat-card">
              <Statistic
                title="รอยืนยัน"
                value={filteredSchedules.filter(s => s.status === 'scheduled').length}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#faad14', fontSize: '18px' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" className="quick-stat-card">
              <Statistic
                title="ยืนยันแล้ว"
                value={filteredSchedules.filter(s => s.status === 'confirmed').length}
                prefix={<CheckOutlined />}
                valueStyle={{ color: '#722ed1', fontSize: '18px' }}
              />
            </Card>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredSchedules}
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
        title={editingSchedule ? 'แก้ไขตารางงาน' : 'เพิ่มตารางงาน'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={700}
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
                label="พนักงาน"
                rules={[{ required: true, message: 'กรุณาเลือกพนักงาน' }]}
              >
                <Select placeholder="เลือกพนักงาน">
                  {filteredStaffMembers.map(staff => (
                    <Option key={staff.id} value={staff.id}>
                      {staff.name} - {staff.position}
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
            <Col span={8}>
              <Form.Item
                name="startTime"
                label="เวลาเริ่มงาน"
                rules={[{ required: true, message: 'กรุณาระบุเวลาเริ่มงาน' }]}
              >
                <TimePicker format="HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="endTime"
                label="เวลาเลิกงาน"
                rules={[{ required: true, message: 'กรุณาระบุเวลาเลิกงาน' }]}
              >
                <TimePicker format="HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="breakDuration"
                label="เวลาพัก (นาที)"
                initialValue={60}
                rules={[{ required: true, message: 'กรุณาระบุเวลาพัก' }]}
              >
                <Select>
                  <Option value={30}>30 นาที</Option>
                  <Option value={60}>1 ชั่วโมง</Option>
                  <Option value={90}>1.5 ชั่วโมง</Option>
                  <Option value={120}>2 ชั่วโมง</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="scheduleType"
                label="ประเภทการทำงาน"
                initialValue="regular"
                rules={[{ required: true, message: 'กรุณาเลือกประเภทการทำงาน' }]}
              >
                <Select>
                  <Option value="regular">ปกติ</Option>
                  <Option value="overtime">ล่วงเวลา</Option>
                  <Option value="holiday">วันหยุด</Option>
                  <Option value="shift">เปลี่ยนกะ</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="สถานะ"
                initialValue="scheduled"
                rules={[{ required: true, message: 'กรุณาเลือกสถานะ' }]}
              >
                <Select>
                  <Option value="scheduled">กำหนดแล้ว</Option>
                  <Option value="confirmed">ยืนยันแล้ว</Option>
                  <Option value="cancelled">ยกเลิก</Option>
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
                {editingSchedule ? 'บันทึกการแก้ไข' : 'บันทึก'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Bulk Add Modal */}
      <Modal
        title="เพิ่มตารางงานหลายคนพร้อมกัน"
        open={isBulkAddModalVisible}
        onCancel={() => setIsBulkAddModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          layout="vertical"
          onFinish={handleBulkAddSubmit}
          initialValues={{
            scheduleType: 'regular',
            breakDuration: 60,
            startTime: dayjs('08:00', 'HH:mm'),
            endTime: dayjs('17:00', 'HH:mm'),
            date: dayjs()
          }}
        >
          <Form.Item
            name="staffIds"
            label="เลือกพนักงาน"
            rules={[{ required: true, message: 'กรุณาเลือกพนักงานอย่างน้อย 1 คน' }]}
          >
            <Select
              mode="multiple"
              placeholder="เลือกพนักงานที่ต้องการเพิ่มตารางงาน"
              style={{ width: '100%' }}
            >
              {staffMembers.map(staff => (
                <Option key={staff.id} value={staff.id}>
                  <Space>
                    <Tag color={
                      staff.position === 'Dentist' ? 'blue' :
                      staff.position === 'Dental Assistant' ? 'green' :
                      staff.position === 'Receptionist' ? 'orange' : 'purple'
                    }>
                      {staff.position}
                    </Tag>
                    {staff.name}
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Divider>รายละเอียดตารางงาน</Divider>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="date"
                label="วันที่"
                rules={[{ required: true, message: 'กรุณาเลือกวันที่' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="startTime"
                label="เวลาเริ่มงาน"
                rules={[{ required: true, message: 'กรุณาระบุเวลาเริ่มงาน' }]}
              >
                <TimePicker format="HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="endTime"
                label="เวลาเลิกงาน"
                rules={[{ required: true, message: 'กรุณาระบุเวลาเลิกงาน' }]}
              >
                <TimePicker format="HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="breakDuration"
                label="เวลาพัก (นาที)"
                rules={[{ required: true, message: 'กรุณาระบุเวลาพัก' }]}
              >
                <Select>
                  <Option value={30}>30 นาที</Option>
                  <Option value={60}>1 ชั่วโมง</Option>
                  <Option value={90}>1.5 ชั่วโมง</Option>
                  <Option value={120}>2 ชั่วโมง</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item
                name="scheduleType"
                label="ประเภทการทำงาน"
                rules={[{ required: true, message: 'กรุณาเลือกประเภทการทำงาน' }]}
              >
                <Select>
                  <Option value="regular">ปกติ</Option>
                  <Option value="overtime">ล่วงเวลา</Option>
                  <Option value="holiday">วันหยุด</Option>
                  <Option value="shift">เปลี่ยนกะ</Option>
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
              <Button onClick={() => setIsBulkAddModalVisible(false)}>
                ยกเลิก
              </Button>
              <Button type="primary" htmlType="submit">
                เพิ่มตารางงาน
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StaffScheduleManager;
