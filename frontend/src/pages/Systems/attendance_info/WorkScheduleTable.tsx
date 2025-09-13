import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Card, Typography, Modal, Form, Select, DatePicker, Row, Col, TimePicker, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { workScheduleAPI, staffAttendanceAPI } from '../../../services/api';
import { ensureAuthentication } from '../../../utils/auth';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

interface WorkSchedule {
  id: number;
  staff_id: number;
  date: string;
  start_time: string;
  end_time: string;
  shift_type: string;
  notes?: string;
  staff?: {
    first_name: string;
    last_name: string;
  };
}

interface StaffMember {
  ID: number;
  PersonalData: {
    ID: number;
    FirstName: string;
    LastName: string;
    Title: string;
    Email: string;
  };
  Position: string;
  EmpType: string;
}

const WorkScheduleTable: React.FC = () => {
  const [scheduleData, setScheduleData] = useState<WorkSchedule[]>([]);
  const [staffData, setStaffData] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<WorkSchedule | null>(null);
  const [form] = Form.useForm();

  const loadData = async () => {
    setLoading(true);
    let scheduleResponse: any = null;
    let staffResponse: any = null;
    
    try {
      const isAuth = await ensureAuthentication();
      if (!isAuth) {
        message.error('Authentication failed');
        return;
      }

      [scheduleResponse, staffResponse] = await Promise.all([
        workScheduleAPI.getWorkSchedules(),
        staffAttendanceAPI.getStaffList()
      ]);

      console.log('Schedule response:', scheduleResponse);
      console.log('Staff response:', staffResponse);

      if (scheduleResponse?.data) {
        setScheduleData(scheduleResponse.data);
      }

      if (staffResponse && Array.isArray(staffResponse)) {
        setStaffData(staffResponse);
      }

    } catch (error) {
      console.error('Failed to load data:', error);
      console.error('Schedule response:', scheduleResponse);
      console.error('Staff response:', staffResponse);
      message.error('ไม่สามารถโหลดข้อมูลได้');
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
      start_time: dayjs('08:00', 'HH:mm'),
      end_time: dayjs('17:00', 'HH:mm'),
      shift_type: 'morning'
    });
    setIsModalVisible(true);
  };

  const handleEdit = (record: WorkSchedule) => {
    setEditingRecord(record);
    form.setFieldsValue({
      staff_id: record.staff_id,
      date: dayjs(record.date),
      start_time: dayjs(record.start_time, 'HH:mm'),
      end_time: dayjs(record.end_time, 'HH:mm'),
      shift_type: record.shift_type,
      notes: record.notes
    });
    setIsModalVisible(true);
  };

  const handleDelete = (record: WorkSchedule) => {
    Modal.confirm({
      title: 'ยืนยันการลบ',
      content: 'คุณต้องการลบตารางงานนี้หรือไม่?',
      okText: 'ลบ',
      cancelText: 'ยกเลิก',
      onOk: async () => {
        try {
          await workScheduleAPI.deleteWorkSchedule(record.id);
          message.success('ลบตารางงานสำเร็จ');
          loadData();
        } catch (error) {
          message.error('ไม่สามารถลบตารางงานได้');
        }
      }
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      const scheduleData = {
        staff_id: values.staff_id,
        date: values.date.format('YYYY-MM-DD'),
        start_time: values.start_time.format('HH:mm'),
        end_time: values.end_time.format('HH:mm'),
        shift_type: values.shift_type,
        notes: values.notes || ''
      };

      if (editingRecord) {
        await workScheduleAPI.updateWorkSchedule(editingRecord.id, scheduleData);
        message.success('อัปเดตตารางงานสำเร็จ');
      } else {
        await workScheduleAPI.createWorkSchedule(scheduleData);
        message.success('เพิ่มตารางงานสำเร็จ');
      }

      setIsModalVisible(false);
      loadData();
    } catch (error) {
      message.error('ไม่สามารถบันทึกตารางงานได้');
    }
  };

  const getShiftTypeText = (shiftType: string) => {
    switch (shiftType) {
      case 'morning': return 'เช้า';
      case 'afternoon': return 'บ่าย';
      case 'evening': return 'เย็น';
      case 'night': return 'กลางคืน';
      case 'full_day': return 'เต็มวัน';
      default: return shiftType;
    }
  };

  const calculateWorkHours = (startTime: string, endTime: string) => {
    const start = dayjs(startTime, 'HH:mm');
    const end = dayjs(endTime, 'HH:mm');
    const diff = end.diff(start, 'hour', true);
    return diff > 0 ? diff : 0;
  };

  const columns = [
    {
      title: 'วันที่',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
      sorter: (a: WorkSchedule, b: WorkSchedule) => 
        dayjs(a.date).unix() - dayjs(b.date).unix()
    },
    {
      title: 'ชื่อพนักงาน',
      key: 'staff_name',
      render: (record: WorkSchedule) => {
        if (record.staff) {
          return `${record.staff.first_name} ${record.staff.last_name}`;
        }
        const staff = staffData.find(s => s.PersonalData.ID === record.staff_id);
        if (staff?.PersonalData) {
          return `${staff.PersonalData.Title} ${staff.PersonalData.FirstName} ${staff.PersonalData.LastName}`;
        }
        return `พนักงาน ID: ${record.staff_id}`;
      }
    },
    {
      title: 'เวลาเริ่มงาน',
      dataIndex: 'start_time',
      key: 'start_time',
      render: (time: string) => time || '-'
    },
    {
      title: 'เวลาเลิกงาน',
      dataIndex: 'end_time',
      key: 'end_time',
      render: (time: string) => time || '-'
    },
    {
      title: 'ชั่วโมงทำงาน',
      key: 'work_hours',
      render: (record: WorkSchedule) => {
        const hours = calculateWorkHours(record.start_time, record.end_time);
        return `${hours.toFixed(1)} ชม.`;
      }
    },
    {
      title: 'กะการทำงาน',
      dataIndex: 'shift_type',
      key: 'shift_type',
      render: (shiftType: string) => getShiftTypeText(shiftType),
      filters: [
        { text: 'เช้า', value: 'morning' },
        { text: 'บ่าย', value: 'afternoon' },
        { text: 'เย็น', value: 'evening' },
        { text: 'กลางคืน', value: 'night' },
        { text: 'เต็มวัน', value: 'full_day' }
      ],
      onFilter: (value: any, record: WorkSchedule) => record.shift_type === value
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
      width: 150,
      render: (record: WorkSchedule) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          />
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ 
          marginBottom: '20px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <Title level={3} style={{ margin: 0 }}>
            ตารางงาน - เวลาทำงาน
          </Title>
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
              เพิ่มตารางงาน
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={scheduleData}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 15,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `แสดง ${range[0]}-${range[1]} จาก ${total} รายการ`
          }}
          size="middle"
        />
      </Card>

      <Modal
        title={editingRecord ? 'แก้ไขตารางงาน' : 'เพิ่มตารางงาน'}
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
          <Form.Item
            name="staff_id"
            label="พนักงาน"
            rules={[{ required: true, message: 'กรุณาเลือกพนักงาน' }]}
          >
            <Select placeholder="เลือกพนักงาน" showSearch>
              {staffData.map(staff => (
                <Option key={staff.PersonalData.ID} value={staff.PersonalData.ID}>
                  {`${staff.PersonalData.Title} ${staff.PersonalData.FirstName} ${staff.PersonalData.LastName}`}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="date"
                label="วันที่"
                rules={[{ required: true, message: 'กรุณาเลือกวันที่' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="shift_type"
                label="กะการทำงาน"
                rules={[{ required: true, message: 'กรุณาเลือกกะการทำงาน' }]}
              >
                <Select>
                  <Option value="morning">เช้า</Option>
                  <Option value="afternoon">บ่าย</Option>
                  <Option value="evening">เย็น</Option>
                  <Option value="night">กลางคืน</Option>
                  <Option value="full_day">เต็มวัน</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="start_time"
                label="เวลาเริ่มงาน"
                rules={[{ required: true, message: 'กรุณาเลือกเวลาเริ่มงาน' }]}
              >
                <TimePicker 
                  style={{ width: '100%' }} 
                  format="HH:mm"
                  placeholder="เลือกเวลาเริ่มงาน"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="end_time"
                label="เวลาเลิกงาน"
                rules={[{ required: true, message: 'กรุณาเลือกเวลาเลิกงาน' }]}
              >
                <TimePicker 
                  style={{ width: '100%' }} 
                  format="HH:mm"
                  placeholder="เลือกเวลาเลิกงาน"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="notes"
            label="หมายเหตุ"
          >
            <Input.TextArea rows={2} placeholder="หมายเหตุ (ถ้ามี)" />
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

export default WorkScheduleTable;
