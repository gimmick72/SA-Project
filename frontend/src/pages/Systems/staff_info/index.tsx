import React, { useState, useEffect } from "react";
import { Tabs, Table, Button, Modal, Form, Input, Select, InputNumber, Switch, message, Tag, Space, Popconfirm, DatePicker } from "antd";
import { UserOutlined, PlusOutlined, TeamOutlined, EditOutlined, DeleteOutlined, ClockCircleOutlined } from "@ant-design/icons";
import {
  fetchStaff,
  createStaff,
  updateStaff,
  toggleStaffStatus,
  deleteStaff,
  fetchAttendance,
  createAttendance,
  Staff,
  StaffAttendance,
  CreateStaffPayload,
  AttendancePayload
} from "../../../services/Staff/staff";

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const StaffInfoPage = () => {
  // Staff state
  const [staff, setStaff] = useState<Staff[]>([]);
  const [staffLoading, setStaffLoading] = useState(false);
  const [staffModalVisible, setStaffModalVisible] = useState(false);
  const [staffForm] = Form.useForm();
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  // Attendance state
  const [attendance, setAttendance] = useState<StaffAttendance[]>([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceModalVisible, setAttendanceModalVisible] = useState(false);
  const [attendanceForm] = Form.useForm();

  // Load staff
  const loadStaff = async () => {
    setStaffLoading(true);
    try {
      const response = await fetchStaff();
      setStaff(response.data);
    } catch (error: any) {
      message.error(error.message || 'ไม่สามารถโหลดข้อมูลพนักงานได้');
    } finally {
      setStaffLoading(false);
    }
  };

  // Load attendance
  const loadAttendance = async () => {
    setAttendanceLoading(true);
    try {
      const response = await fetchAttendance();
      setAttendance(response.data);
    } catch (error: any) {
      message.error(error.message || 'ไม่สามารถโหลดข้อมูลการเข้างานได้');
    } finally {
      setAttendanceLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
    loadAttendance();
  }, []);

  // Staff handlers
  const handleAddStaff = () => {
    setEditingStaff(null);
    staffForm.resetFields();
    setStaffModalVisible(true);
  };

  const handleEditStaff = (staffMember: Staff) => {
    setEditingStaff(staffMember);
    staffForm.setFieldsValue({
      ...staffMember,
      qualifications: staffMember.qualifications?.join(', '),
      specializations: staffMember.specializations?.join(', ')
    });
    setStaffModalVisible(true);
  };

  const handleStaffSubmit = async (values: any) => {
    try {
      const payload: CreateStaffPayload = {
        ...values,
        qualifications: values.qualifications ? values.qualifications.split(',').map((item: string) => item.trim()) : [],
        specializations: values.specializations ? values.specializations.split(',').map((item: string) => item.trim()) : []
      };

      if (editingStaff) {
        const updated = await updateStaff(editingStaff.id, payload);
        setStaff(prev => prev.map(s => s.id === editingStaff.id ? updated : s));
        message.success('อัปเดตข้อมูลพนักงานสำเร็จ');
      } else {
        const newStaff = await createStaff(payload);
        setStaff(prev => [...prev, newStaff]);
        message.success('เพิ่มพนักงานสำเร็จ');
      }
      
      setStaffModalVisible(false);
      staffForm.resetFields();
    } catch (error: any) {
      message.error(error.message || 'บันทึกข้อมูลไม่สำเร็จ');
    }
  };

  const handleToggleStaffStatus = async (staffMember: Staff) => {
    try {
      const updated = await toggleStaffStatus(staffMember.id);
      setStaff(prev => prev.map(s => s.id === staffMember.id ? updated : s));
      message.success(`${updated.is_active ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}พนักงานสำเร็จ`);
    } catch (error: any) {
      message.error(error.message || 'อัปเดตสถานะไม่สำเร็จ');
    }
  };

  const handleDeleteStaff = async (id: number) => {
    try {
      await deleteStaff(id);
      setStaff(prev => prev.filter(s => s.id !== id));
      message.success('ลบพนักงานสำเร็จ');
    } catch (error: any) {
      message.error(error.message || 'ลบพนักงานไม่สำเร็จ');
    }
  };

  // Attendance handlers
  const handleAddAttendance = () => {
    attendanceForm.resetFields();
    setAttendanceModalVisible(true);
  };

  const handleAttendanceSubmit = async (values: any) => {
    try {
      const payload: AttendancePayload = {
        ...values,
        date: values.date.format('YYYY-MM-DD')
      };

      const newAttendance = await createAttendance(payload);
      setAttendance(prev => [...prev, newAttendance]);
      message.success('บันทึกการเข้างานสำเร็จ');
      
      setAttendanceModalVisible(false);
      attendanceForm.resetFields();
    } catch (error: any) {
      message.error(error.message || 'บันทึกข้อมูลไม่สำเร็จ');
    }
  };

  // Staff columns
  const staffColumns = [
    {
      title: 'รหัสพนักงาน',
      dataIndex: 'staff_code',
      key: 'staff_code',
      width: 120,
    },
    {
      title: 'ชื่อ-นามสกุล',
      key: 'full_name',
      width: 200,
      render: (_: any, record: Staff) => `${record.first_name} ${record.last_name}`,
    },
    {
      title: 'ตำแหน่ง',
      dataIndex: 'position',
      key: 'position',
      width: 150,
    },
    {
      title: 'แผนก',
      dataIndex: 'department',
      key: 'department',
      width: 150,
    },
    {
      title: 'เงินเดือน',
      dataIndex: 'salary',
      key: 'salary',
      width: 120,
      align: 'right' as const,
      render: (salary: number) => `${salary.toLocaleString()} บาท`,
    },
    {
      title: 'สถานะ',
      dataIndex: 'is_active',
      key: 'is_active',
      width: 100,
      align: 'center' as const,
      render: (is_active: boolean, record: Staff) => (
        <Switch
          checked={is_active}
          onChange={() => handleToggleStaffStatus(record)}
          checkedChildren="ทำงาน"
          unCheckedChildren="หยุด"
        />
      ),
    },
    {
      title: 'การจัดการ',
      key: 'actions',
      width: 150,
      align: 'center' as const,
      render: (_: any, record: Staff) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditStaff(record)}
          />
          <Popconfirm
            title="ยืนยันการลบ"
            description="คุณต้องการลบพนักงานคนนี้หรือไม่?"
            onConfirm={() => handleDeleteStaff(record.id)}
            okText="ยืนยัน"
            cancelText="ยกเลิก"
          >
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Attendance columns
  const attendanceColumns = [
    {
      title: 'พนักงาน',
      dataIndex: 'staff_id',
      key: 'staff_id',
      width: 200,
      render: (staff_id: number) => {
        const staffMember = staff.find(s => s.id === staff_id);
        return staffMember ? `${staffMember.first_name} ${staffMember.last_name}` : '-';
      },
    },
    {
      title: 'วันที่',
      dataIndex: 'date',
      key: 'date',
      width: 120,
    },
    {
      title: 'เวลาเข้า',
      dataIndex: 'check_in_time',
      key: 'check_in_time',
      width: 100,
      align: 'center' as const,
    },
    {
      title: 'เวลาออก',
      dataIndex: 'check_out_time',
      key: 'check_out_time',
      width: 100,
      align: 'center' as const,
    },
    {
      title: 'ชั่วโมงทำงาน',
      dataIndex: 'work_hours',
      key: 'work_hours',
      width: 120,
      align: 'center' as const,
      render: (hours: number) => `${hours} ชม.`,
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      align: 'center' as const,
      render: (status: string) => {
        const statusConfig = {
          present: { color: 'green', text: 'มาทำงาน' },
          absent: { color: 'red', text: 'ขาดงาน' },
          late: { color: 'orange', text: 'มาสาย' },
          half_day: { color: 'blue', text: 'ครึ่งวัน' },
          overtime: { color: 'purple', text: 'ทำงานล่วงเวลา' }
        };
        const config = statusConfig[status as keyof typeof statusConfig] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'หมายเหตุ',
      dataIndex: 'notes',
      key: 'notes',
      width: 200,
    },
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
        <h2 style={{ margin: 0, color: '#1a1a1a' }}>
          <UserOutlined style={{ marginRight: '8px' }} />
          ระบบจัดการเจ้าหน้าที่
        </h2>
      </div>

      <Tabs defaultActiveKey="staff" type="card">
        <TabPane 
          tab={
            <span>
              <TeamOutlined />
              จัดการพนักงาน
            </span>
          } 
          key="staff"
        >
          <div style={{ marginBottom: '16px' }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddStaff}
            >
              เพิ่มพนักงานใหม่
            </Button>
          </div>

          <Table
            columns={staffColumns}
            dataSource={staff}
            rowKey="id"
            loading={staffLoading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} จาก ${total} รายการ`,
            }}
            scroll={{ x: 1000 }}
          />
        </TabPane>

        <TabPane 
          tab={
            <span>
              <ClockCircleOutlined />
              การเข้างาน
            </span>
          } 
          key="attendance"
        >
          <div style={{ marginBottom: '16px' }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddAttendance}
            >
              บันทึกการเข้างาน
            </Button>
          </div>

          <Table
            columns={attendanceColumns}
            dataSource={attendance}
            rowKey="id"
            loading={attendanceLoading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} จาก ${total} รายการ`,
            }}
            scroll={{ x: 1000 }}
          />
        </TabPane>
      </Tabs>

      {/* Staff Modal */}
      <Modal
        title={editingStaff ? 'แก้ไขข้อมูลพนักงาน' : 'เพิ่มพนักงานใหม่'}
        open={staffModalVisible}
        onCancel={() => {
          setStaffModalVisible(false);
          staffForm.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={staffForm}
          layout="vertical"
          onFinish={handleStaffSubmit}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              name="staff_code"
              label="รหัสพนักงาน"
              rules={[{ required: true, message: 'กรุณากรอกรหัสพนักงาน' }]}
            >
              <Input placeholder="เช่น STF001" />
            </Form.Item>

            <Form.Item
              name="email"
              label="อีเมล"
              rules={[
                { required: true, message: 'กรุณากรอกอีเมล' },
                { type: 'email', message: 'รูปแบบอีเมลไม่ถูกต้อง' }
              ]}
            >
              <Input placeholder="example@clinic.com" />
            </Form.Item>

            <Form.Item
              name="first_name"
              label="ชื่อ"
              rules={[{ required: true, message: 'กรุณากรอกชื่อ' }]}
            >
              <Input placeholder="ชื่อ" />
            </Form.Item>

            <Form.Item
              name="last_name"
              label="นามสกุล"
              rules={[{ required: true, message: 'กรุณากรอกนามสกุล' }]}
            >
              <Input placeholder="นามสกุล" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="เบอร์โทรศัพท์"
              rules={[{ required: true, message: 'กรุณากรอกเบอร์โทรศัพท์' }]}
            >
              <Input placeholder="081-234-5678" />
            </Form.Item>

            <Form.Item
              name="position"
              label="ตำแหน่ง"
              rules={[{ required: true, message: 'กรุณากรอกตำแหน่ง' }]}
            >
              <Input placeholder="เช่น ทันตแพทย์" />
            </Form.Item>

            <Form.Item
              name="department"
              label="แผนก"
              rules={[{ required: true, message: 'กรุณากรอกแผนก' }]}
            >
              <Input placeholder="เช่น แผนกทันตกรรม" />
            </Form.Item>

            <Form.Item
              name="salary"
              label="เงินเดือน (บาท)"
              rules={[{ required: true, message: 'กรุณากรอกเงินเดือน' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} placeholder="25000" />
            </Form.Item>

            <Form.Item
              name="hire_date"
              label="วันที่เริ่มงาน"
              rules={[{ required: true, message: 'กรุณาเลือกวันที่เริ่มงาน' }]}
            >
              <Input type="date" />
            </Form.Item>

            <Form.Item
              name="work_schedule"
              label="ตารางงาน"
            >
              <Input placeholder="เช่น จันทร์-ศุกร์ 08:00-17:00" />
            </Form.Item>
          </div>

          <Form.Item
            name="address"
            label="ที่อยู่"
          >
            <TextArea rows={2} placeholder="ที่อยู่" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              name="emergency_contact"
              label="ผู้ติดต่อฉุกเฉิน"
            >
              <Input placeholder="ชื่อผู้ติดต่อฉุกเฉิน" />
            </Form.Item>

            <Form.Item
              name="emergency_phone"
              label="เบอร์ติดต่อฉุกเฉิน"
            >
              <Input placeholder="081-234-5679" />
            </Form.Item>
          </div>

          <Form.Item
            name="qualifications"
            label="คุณวุฒิ"
          >
            <Input placeholder="คั่นด้วยเครื่องหมายจุลภาค เช่น ปริญญาตรี, ใบประกอบวิชาชีพ" />
          </Form.Item>

          <Form.Item
            name="specializations"
            label="ความเชี่ยวชาญ"
          >
            <Input placeholder="คั่นด้วยเครื่องหมายจุลภาค เช่น ทันตกรรมทั่วไป, การถอนฟัน" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setStaffModalVisible(false)}>
                ยกเลิก
              </Button>
              <Button type="primary" htmlType="submit">
                {editingStaff ? 'อัปเดต' : 'เพิ่ม'}พนักงาน
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Attendance Modal */}
      <Modal
        title="บันทึกการเข้างาน"
        open={attendanceModalVisible}
        onCancel={() => {
          setAttendanceModalVisible(false);
          attendanceForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={attendanceForm}
          layout="vertical"
          onFinish={handleAttendanceSubmit}
        >
          <Form.Item
            name="staff_id"
            label="พนักงาน"
            rules={[{ required: true, message: 'กรุณาเลือกพนักงาน' }]}
          >
            <Select placeholder="เลือกพนักงาน">
              {staff.map(staffMember => (
                <Option key={staffMember.id} value={staffMember.id}>
                  {staffMember.first_name} {staffMember.last_name} ({staffMember.staff_code})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="date"
            label="วันที่"
            rules={[{ required: true, message: 'กรุณาเลือกวันที่' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              name="check_in_time"
              label="เวลาเข้างาน"
            >
              <Input type="time" />
            </Form.Item>

            <Form.Item
              name="check_out_time"
              label="เวลาออกงาน"
            >
              <Input type="time" />
            </Form.Item>
          </div>

          <Form.Item
            name="status"
            label="สถานะ"
            rules={[{ required: true, message: 'กรุณาเลือกสถานะ' }]}
          >
            <Select placeholder="เลือกสถานะ">
              <Option value="present">มาทำงาน</Option>
              <Option value="absent">ขาดงาน</Option>
              <Option value="late">มาสาย</Option>
              <Option value="half_day">ครึ่งวัน</Option>
              <Option value="overtime">ทำงานล่วงเวลา</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="notes"
            label="หมายเหตุ"
          >
            <TextArea rows={3} placeholder="หมายเหตุเพิ่มเติม" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setAttendanceModalVisible(false)}>
                ยกเลิก
              </Button>
              <Button type="primary" htmlType="submit">
                บันทึก
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StaffInfoPage;
