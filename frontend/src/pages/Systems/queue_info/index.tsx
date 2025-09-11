import React, { useState, useEffect } from "react";
import { Tabs, Card, Row, Col, Statistic, Table, Button, Tag, Space, message, Form, Input, Select, Modal } from "antd";
import { CalendarOutlined, PlusOutlined, UnorderedListOutlined, DashboardOutlined, PhoneOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { fetchQueues, fetchQueueStats, createQueue, updateQueueStatus, callNextQueue, QueueItem, QueueStats } from "../../../services/Queue/queue";
import type { ColumnsType } from "antd/es/table";

const QueueInfoPage = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [queues, setQueues] = useState<QueueItem[]>([]);
  const [stats, setStats] = useState<QueueStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [form] = Form.useForm();

  const loadData = async () => {
    setLoading(true);
    try {
      const [queueData, statsData] = await Promise.all([
        fetchQueues(),
        fetchQueueStats()
      ]);
      setQueues(queueData.data);
      setStats(statsData);
    } catch (error: any) {
      message.error(error.message || "โหลดข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusUpdate = async (id: number, status: QueueItem['status']) => {
    try {
      await updateQueueStatus(id, status);
      message.success("อัปเดตสถานะสำเร็จ");
      loadData();
    } catch (error: any) {
      message.error(error.message || "อัปเดตสถานะไม่สำเร็จ");
    }
  };

  const handleCallNext = async (room: string) => {
    try {
      const nextQueue = await callNextQueue(room);
      if (nextQueue) {
        message.success(`เรียกคิว ${nextQueue.queue_number} - ${nextQueue.patient_name}`);
        loadData();
      } else {
        message.info(`ไม่มีคิวรอสำหรับ${room}`);
      }
    } catch (error: any) {
      message.error(error.message || "เรียกคิวไม่สำเร็จ");
    }
  };

  const handleAddQueue = async (values: any) => {
    try {
      await createQueue(values);
      message.success("เพิ่มคิวสำเร็จ");
      setAddModalOpen(false);
      form.resetFields();
      loadData();
    } catch (error: any) {
      message.error(error.message || "เพิ่มคิวไม่สำเร็จ");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'orange';
      case 'in_progress': return 'blue';
      case 'completed': return 'green';
      case 'cancelled': return 'red';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'waiting': return 'รอ';
      case 'in_progress': return 'กำลังรักษา';
      case 'completed': return 'เสร็จสิ้น';
      case 'cancelled': return 'ยกเลิก';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'red';
      case 'urgent': return 'orange';
      case 'normal': return 'default';
      default: return 'default';
    }
  };

  const columns: ColumnsType<QueueItem> = [
    {
      title: 'หมายเลขคิว',
      dataIndex: 'queue_number',
      key: 'queue_number',
      width: 120,
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <Tag color={getPriorityColor(record.priority)}>
            {record.priority === 'emergency' ? 'ฉุกเฉิน' : 
             record.priority === 'urgent' ? 'ด่วน' : 'ปกติ'}
          </Tag>
        </div>
      )
    },
    {
      title: 'ผู้ป่วย',
      dataIndex: 'patient_name',
      key: 'patient_name',
      render: (text, record) => (
        <div>
          <div>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.phone}</div>
        </div>
      )
    },
    {
      title: 'บริการ',
      dataIndex: 'service_type',
      key: 'service_type'
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
      title: 'เวลารอ (นาที)',
      dataIndex: 'estimated_wait_time',
      key: 'estimated_wait_time',
      render: (time) => time ? `${time} นาที` : '-'
    },
    {
      title: 'จัดการ',
      key: 'action',
      render: (_, record) => (
        <Space>
          {record.status === 'waiting' && (
            <Button 
              size="small" 
              type="primary"
              onClick={() => handleStatusUpdate(record.id, 'in_progress')}
            >
              เรียก
            </Button>
          )}
          {record.status === 'in_progress' && (
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
            onClick={() => handleStatusUpdate(record.id, 'cancelled')}
          >
            ยกเลิก
          </Button>
        </Space>
      )
    }
  ];

  const DashboardTab = () => (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="คิวรอ"
              value={stats?.total_waiting || 0}
              valueStyle={{ color: '#faad14' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="กำลังรักษา"
              value={stats?.total_in_progress || 0}
              valueStyle={{ color: '#1890ff' }}
              prefix={<PhoneOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="เสร็จสิ้นแล้ว"
              value={stats?.total_completed || 0}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="ห้องที่ใช้งาน"
              value={`${stats?.rooms_occupied || 0}/${stats?.total_rooms || 4}`}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="เรียกคิวถัดไป" size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              {['ห้อง 1', 'ห้อง 2', 'ห้อง 3', 'ห้อง 4'].map(room => (
                <Button 
                  key={room}
                  block
                  onClick={() => handleCallNext(room)}
                >
                  เรียกคิวถัดไป - {room}
                </Button>
              ))}
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="คิวล่าสุด" size="small">
            <Table
              dataSource={queues.slice(0, 5)}
              columns={columns.slice(0, 4)}
              pagination={false}
              size="small"
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );

  const QueueListTab = () => (
    <div>
      <div style={{ marginBottom: 16, textAlign: 'right' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddModalOpen(true)}>
          เพิ่มคิว
        </Button>
      </div>
      <Table
        dataSource={queues}
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
          <DashboardOutlined />
          แดชบอร์ด
        </span>
      ),
      children: <DashboardTab />
    },
    {
      key: "2",
      label: (
        <span>
          <UnorderedListOutlined />
          รายการคิว
        </span>
      ),
      children: <QueueListTab />
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
          ระบบจัดการคิว
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
        title="เพิ่มคิวใหม่"
        open={addModalOpen}
        onCancel={() => setAddModalOpen(false)}
        onOk={() => form.submit()}
        okText="เพิ่มคิว"
        cancelText="ยกเลิก"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddQueue}
        >
          <Form.Item
            name="patient_name"
            label="ชื่อผู้ป่วย"
            rules={[{ required: true, message: 'กรุณากรอกชื่อผู้ป่วย' }]}
          >
            <Input placeholder="ชื่อผู้ป่วย" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="เบอร์โทรศัพท์"
            rules={[{ required: true, message: 'กรุณากรอกเบอร์โทรศัพท์' }]}
          >
            <Input placeholder="เบอร์โทรศัพท์" />
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
            </Select>
          </Form.Item>
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
            </Select>
          </Form.Item>
          <Form.Item
            name="priority"
            label="ความสำคัญ"
            initialValue="normal"
          >
            <Select>
              <Select.Option value="normal">ปกติ</Select.Option>
              <Select.Option value="urgent">ด่วน</Select.Option>
              <Select.Option value="emergency">ฉุกเฉิน</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QueueInfoPage;
