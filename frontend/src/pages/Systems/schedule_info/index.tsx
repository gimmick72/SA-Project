import React, { useState, useEffect } from "react";
import { Tabs, Card, Calendar, Badge, Table, Button, Tag, Space, message, Form, Input, Select, Modal, DatePicker, TimePicker } from "antd";
import { CalendarOutlined, PlusOutlined, UnorderedListOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { fetchSchedules, createSchedule, updateScheduleStatus, deleteSchedule, ScheduleEvent } from "../../../services/Schedule/schedule";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

const ScheduleInfoPage = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [schedules, setSchedules] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [form] = Form.useForm();

  const loadData = async (params?: any) => {
    setLoading(true);
    try {
      const data = await fetchSchedules(params);
      setSchedules(data.data);
    } catch (error: any) {
      message.error(error.message || "โหลดข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusUpdate = async (id: number, status: ScheduleEvent['status']) => {
    try {
      await updateScheduleStatus(id, status);
      message.success("อัปเดตสถานะสำเร็จ");
      loadData();
    } catch (error: any) {
      message.error(error.message || "อัปเดตสถานะไม่สำเร็จ");
    }
  };

  const handleAddSchedule = async (values: any) => {
    try {
      const payload = {
        ...values,
        start_date: values.date.format('YYYY-MM-DD'),
        end_date: values.date.format('YYYY-MM-DD'),
        start_time: values.start_time.format('HH:mm'),
        end_time: values.end_time.format('HH:mm')
      };
      delete payload.date;
      
      await createSchedule(payload);
      message.success("เพิ่มตารางนัดหมายสำเร็จ");
      setAddModalOpen(false);
      form.resetFields();
      loadData();
    } catch (error: any) {
      message.error(error.message || "เพิ่มตารางนัดหมายไม่สำเร็จ");
    }
  };

  const handleDeleteSchedule = async (id: number) => {
    try {
      await deleteSchedule(id);
      message.success("ลบตารางนัดหมายสำเร็จ");
      loadData();
    } catch (error: any) {
      message.error(error.message || "ลบตารางนัดหมายไม่สำเร็จ");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'orange';
      case 'confirmed': return 'blue';
      case 'completed': return 'green';
      case 'cancelled': return 'red';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'กำหนดการ';
      case 'confirmed': return 'ยืนยันแล้ว';
      case 'completed': return 'เสร็จสิ้น';
      case 'cancelled': return 'ยกเลิก';
      default: return status;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'appointment': return 'blue';
      case 'break': return 'green';
      case 'meeting': return 'purple';
      case 'other': return 'default';
      default: return 'default';
    }
  };

  const getEventTypeText = (type: string) => {
    switch (type) {
      case 'appointment': return 'นัดหมาย';
      case 'break': return 'พักเบรค';
      case 'meeting': return 'ประชุม';
      case 'other': return 'อื่นๆ';
      default: return type;
    }
  };

  const columns: ColumnsType<ScheduleEvent> = [
    {
      title: 'วันที่',
      dataIndex: 'start_date',
      key: 'start_date',
      render: (date) => dayjs(date).format('DD/MM/YYYY')
    },
    {
      title: 'เวลา',
      key: 'time',
      render: (_, record) => `${record.start_time} - ${record.end_time}`
    },
    {
      title: 'หัวข้อ',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <Tag color={getEventTypeColor(record.event_type)}>
            {getEventTypeText(record.event_type)}
          </Tag>
        </div>
      )
    },
    {
      title: 'แพทย์',
      dataIndex: 'doctor',
      key: 'doctor'
    },
    {
      title: 'ห้อง',
      dataIndex: 'room',
      key: 'room'
    },
    {
      title: 'ผู้ป่วย',
      key: 'patient',
      render: (_, record) => record.patient_name ? (
        <div>
          <div>{record.patient_name}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.patient_phone}</div>
        </div>
      ) : '-'
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      )
    },
    {
      title: 'จัดการ',
      key: 'action',
      render: (_, record) => (
        <Space>
          {record.status === 'scheduled' && (
            <Button 
              size="small" 
              type="primary"
              onClick={() => handleStatusUpdate(record.id, 'confirmed')}
            >
              ยืนยัน
            </Button>
          )}
          {record.status === 'confirmed' && (
            <Button 
              size="small" 
              type="default"
              onClick={() => handleStatusUpdate(record.id, 'completed')}
            >
              เสร็จสิ้น
            </Button>
          )}
          <Button 
            size="small" 
            danger
            onClick={() => handleDeleteSchedule(record.id)}
          >
            ลบ
          </Button>
        </Space>
      )
    }
  ];

  const CalendarTab = () => {
    const dateCellRender = (value: dayjs.Dayjs) => {
      const dateStr = value.format('YYYY-MM-DD');
      const daySchedules = schedules.filter(s => s.start_date === dateStr);
      
      return (
        <div style={{ minHeight: '60px' }}>
          {daySchedules.map(schedule => (
            <Badge
              key={schedule.id}
              status={getStatusColor(schedule.status) as any}
              text={
                <div style={{ fontSize: '11px', lineHeight: '14px' }}>
                  {schedule.start_time} {schedule.title.substring(0, 15)}
                  {schedule.title.length > 15 ? '...' : ''}
                </div>
              }
            />
          ))}
        </div>
      );
    };

    return (
      <div>
        <div style={{ marginBottom: 16, textAlign: 'right' }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddModalOpen(true)}>
            เพิ่มตารางนัดหมาย
          </Button>
        </div>
        <Calendar 
          dateCellRender={dateCellRender}
          onSelect={(date) => {
            setSelectedDate(date.format('YYYY-MM-DD'));
            setActiveTab("2");
          }}
        />
      </div>
    );
  };

  const ScheduleListTab = () => (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <DatePicker
            value={dayjs(selectedDate)}
            onChange={(date) => {
              const dateStr = date?.format('YYYY-MM-DD') || dayjs().format('YYYY-MM-DD');
              setSelectedDate(dateStr);
              loadData({ start_date: dateStr, end_date: dateStr });
            }}
          />
          <Select
            style={{ width: 200 }}
            placeholder="เลือกแพทย์"
            allowClear
            onChange={(doctor) => loadData({ doctor })}
          >
            <Select.Option value="ทพ.สมิท จันทร์เจ้า">ทพ.สมิท จันทร์เจ้า</Select.Option>
            <Select.Option value="ทพ.วิมล สีขาว">ทพ.วิมล สีขาว</Select.Option>
          </Select>
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddModalOpen(true)}>
          เพิ่มตารางนัดหมาย
        </Button>
      </div>
      <Table
        dataSource={schedules}
        columns={columns}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `ทั้งหมด ${total} รายการ`
        }}
      />
    </div>
  );

  const tabItems = [
    {
      key: "1",
      label: (
        <span>
          <CalendarOutlined />
          ปฏิทิน
        </span>
      ),
      children: <CalendarTab />
    },
    {
      key: "2",
      label: (
        <span>
          <UnorderedListOutlined />
          รายการนัดหมาย
        </span>
      ),
      children: <ScheduleListTab />
    }
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
          <CalendarOutlined style={{ marginRight: '8px' }} />
          ระบบจัดการตารางงาน
        </h2>
      </div>
      
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        type="card"
        style={{
          background: '#ffffff',
          borderRadius: '8px'
        }}
        size="large"
      />

      <Modal
        title="เพิ่มตารางนัดหมายใหม่"
        open={addModalOpen}
        onCancel={() => setAddModalOpen(false)}
        onOk={() => form.submit()}
        okText="เพิ่มตารางนัดหมาย"
        cancelText="ยกเลิก"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddSchedule}
        >
          <Form.Item
            name="title"
            label="หัวข้อ"
            rules={[{ required: true, message: 'กรุณากรอกหัวข้อ' }]}
          >
            <Input placeholder="หัวข้อการนัดหมาย" />
          </Form.Item>
          <Form.Item
            name="description"
            label="รายละเอียด"
          >
            <Input.TextArea placeholder="รายละเอียดเพิ่มเติม" rows={3} />
          </Form.Item>
          <Form.Item
            name="date"
            label="วันที่"
            rules={[{ required: true, message: 'กรุณาเลือกวันที่' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Space.Compact style={{ width: '100%' }}>
            <Form.Item
              name="start_time"
              label="เวลาเริ่ม"
              rules={[{ required: true, message: 'กรุณาเลือกเวลาเริ่ม' }]}
              style={{ width: '50%' }}
            >
              <TimePicker format="HH:mm" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="end_time"
              label="เวลาสิ้นสุด"
              rules={[{ required: true, message: 'กรุณาเลือกเวลาสิ้นสุด' }]}
              style={{ width: '50%' }}
            >
              <TimePicker format="HH:mm" style={{ width: '100%' }} />
            </Form.Item>
          </Space.Compact>
          <Form.Item
            name="doctor"
            label="แพทย์"
            rules={[{ required: true, message: 'กรุณาเลือกแพทย์' }]}
          >
            <Select placeholder="เลือกแพทย์">
              <Select.Option value="ทพ.สมิท จันทร์เจ้า">ทพ.สมิท จันทร์เจ้า</Select.Option>
              <Select.Option value="ทพ.วิมล สีขาว">ทพ.วิมล สีขาว</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="room"
            label="ห้อง"
            rules={[{ required: true, message: 'กรุณาเลือกห้อง' }]}
          >
            <Select placeholder="เลือกห้อง">
              <Select.Option value="ห้อง 1">ห้อง 1</Select.Option>
              <Select.Option value="ห้อง 2">ห้อง 2</Select.Option>
              <Select.Option value="ห้อง 3">ห้อง 3</Select.Option>
              <Select.Option value="ห้อง 4">ห้อง 4</Select.Option>
              <Select.Option value="ห้องประชุม">ห้องประชุม</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="event_type"
            label="ประเภทกิจกรรม"
            rules={[{ required: true, message: 'กรุณาเลือกประเภทกิจกรรม' }]}
          >
            <Select placeholder="เลือกประเภทกิจกรรม">
              <Select.Option value="appointment">นัดหมายผู้ป่วย</Select.Option>
              <Select.Option value="break">พักเบรค</Select.Option>
              <Select.Option value="meeting">ประชุม</Select.Option>
              <Select.Option value="other">อื่นๆ</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="service_type"
            label="ประเภทบริการ"
            rules={[{ required: true, message: 'กรุณาเลือกประเภทบริการ' }]}
          >
            <Select placeholder="เลือกประเภทบริการ">
              <Select.Option value="ตรวจฟัน">ตรวจฟัน</Select.Option>
              <Select.Option value="อุดฟัน">อุดฟัน</Select.Option>
              <Select.Option value="ขูดหินปูน">ขูดหินปูน</Select.Option>
              <Select.Option value="ถอนฟัน">ถอนฟัน</Select.Option>
              <Select.Option value="พักเบรค">พักเบรค</Select.Option>
              <Select.Option value="ประชุม">ประชุม</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="patient_name"
            label="ชื่อผู้ป่วย (ถ้ามี)"
          >
            <Input placeholder="ชื่อผู้ป่วย" />
          </Form.Item>
          <Form.Item
            name="patient_phone"
            label="เบอร์โทรศัพท์ผู้ป่วย (ถ้ามี)"
          >
            <Input placeholder="เบอร์โทรศัพท์" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ScheduleInfoPage;
