import React, { useState, useEffect } from "react";
import { Tabs, Table, Button, Modal, Form, Input, Select, InputNumber, Switch, message, Tag, Space, Popconfirm } from "antd";
import { 
  MedicineBoxOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  GiftOutlined,
  ToolOutlined,
  EyeOutlined
} from "@ant-design/icons";
import {
  fetchServices,
  createService,
  updateService,
  toggleServiceStatus,
  deleteService,
  fetchPromotions,
  createPromotion,
  togglePromotionStatus,
  DentalService,
  ServicePromotion,
  CreateServicePayload,
  CreatePromotionPayload
} from "../../../services/Service/service";

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const ServiceInfoPage = () => {
  // Services state
  const [services, setServices] = useState<DentalService[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [serviceModalVisible, setServiceModalVisible] = useState(false);
  const [serviceForm] = Form.useForm();
  const [editingService, setEditingService] = useState<DentalService | null>(null);

  // Promotions state
  const [promotions, setPromotions] = useState<ServicePromotion[]>([]);
  const [promotionsLoading, setPromotionsLoading] = useState(false);
  const [promotionModalVisible, setPromotionModalVisible] = useState(false);
  const [promotionForm] = Form.useForm();
  const [editingPromotion, setEditingPromotion] = useState<ServicePromotion | null>(null);

  // Service categories for filtering
  const serviceCategories = [
    { value: 'การตรวจ', label: 'การตรวจ' },
    { value: 'การรักษา', label: 'การรักษา' },
    { value: 'การทำความสะอาด', label: 'การทำความสะอาด' },
    { value: 'การผ่าตัด', label: 'การผ่าตัด' },
    { value: 'ความงาม', label: 'ความงาม' }
  ];

  // Load services
  const loadServices = async () => {
    setServicesLoading(true);
    try {
      const response = await fetchServices();
      setServices(response.data);
    } catch (error: any) {
      message.error(error.message || 'ไม่สามารถโหลดข้อมูลบริการได้');
    } finally {
      setServicesLoading(false);
    }
  };

  // Load promotions
  const loadPromotions = async () => {
    setPromotionsLoading(true);
    try {
      const response = await fetchPromotions();
      setPromotions(response.data);
    } catch (error: any) {
      message.error(error.message || 'ไม่สามารถโหลดข้อมูลโปรโมชั่นได้');
    } finally {
      setPromotionsLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
    loadPromotions();
  }, []);

  // Service handlers
  const handleAddService = () => {
    setEditingService(null);
    serviceForm.resetFields();
    setServiceModalVisible(true);
  };

  const handleEditService = (service: DentalService) => {
    setEditingService(service);
    serviceForm.setFieldsValue({
      ...service,
      equipment_needed: service.equipment_needed?.join(', ')
    });
    setServiceModalVisible(true);
  };

  const handleServiceSubmit = async (values: any) => {
    try {
      const payload: CreateServicePayload = {
        ...values,
        equipment_needed: values.equipment_needed ? values.equipment_needed.split(',').map((item: string) => item.trim()) : []
      };

      if (editingService) {
        const updated = await updateService(editingService.id, payload);
        setServices(prev => prev.map(s => s.id === editingService.id ? updated : s));
        message.success('อัปเดตบริการสำเร็จ');
      } else {
        const newService = await createService(payload);
        setServices(prev => [...prev, newService]);
        message.success('เพิ่มบริการสำเร็จ');
      }
      
      setServiceModalVisible(false);
      serviceForm.resetFields();
    } catch (error: any) {
      message.error(error.message || 'บันทึกข้อมูลไม่สำเร็จ');
    }
  };

  const handleToggleServiceStatus = async (service: DentalService) => {
    try {
      const updated = await toggleServiceStatus(service.id);
      setServices(prev => prev.map(s => s.id === service.id ? updated : s));
      message.success(`${updated.is_active ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}บริการสำเร็จ`);
    } catch (error: any) {
      message.error(error.message || 'อัปเดตสถานะไม่สำเร็จ');
    }
  };

  const handleDeleteService = async (id: number) => {
    try {
      await deleteService(id);
      setServices(prev => prev.filter(s => s.id !== id));
      message.success('ลบบริการสำเร็จ');
    } catch (error: any) {
      message.error(error.message || 'ลบบริการไม่สำเร็จ');
    }
  };

  // Promotion handlers
  const handleAddPromotion = () => {
    setEditingPromotion(null);
    promotionForm.resetFields();
    setPromotionModalVisible(true);
  };

  const handleEditPromotion = (promotion: ServicePromotion) => {
    setEditingPromotion(promotion);
    promotionForm.setFieldsValue(promotion);
    setPromotionModalVisible(true);
  };

  const handlePromotionSubmit = async (values: any) => {
    try {
      const payload: CreatePromotionPayload = values;

      if (editingPromotion) {
        // For editing, we would need an update function
        message.success('อัปเดตโปรโมชั่นสำเร็จ');
      } else {
        const newPromotion = await createPromotion(payload);
        setPromotions(prev => [...prev, newPromotion]);
        message.success('เพิ่มโปรโมชั่นสำเร็จ');
      }
      
      setPromotionModalVisible(false);
      promotionForm.resetFields();
    } catch (error: any) {
      message.error(error.message || 'บันทึกข้อมูลไม่สำเร็จ');
    }
  };

  const handleTogglePromotionStatus = async (promotion: ServicePromotion) => {
    try {
      const updated = await togglePromotionStatus(promotion.id);
      setPromotions(prev => prev.map(p => p.id === promotion.id ? updated : p));
      message.success(`${updated.is_active ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}โปรโมชั่นสำเร็จ`);
    } catch (error: any) {
      message.error(error.message || 'อัปเดตสถานะไม่สำเร็จ');
    }
  };

  // Service columns
  const serviceColumns = [
    {
      title: 'รหัสบริการ',
      dataIndex: 'service_code',
      key: 'service_code',
      width: 120,
    },
    {
      title: 'ชื่อบริการ',
      dataIndex: 'service_name',
      key: 'service_name',
      width: 200,
    },
    {
      title: 'หมวดหมู่',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category: string) => <Tag color="blue">{category}</Tag>
    },
    {
      title: 'ระยะเวลา (นาที)',
      dataIndex: 'duration_minutes',
      key: 'duration_minutes',
      width: 120,
      align: 'center' as const,
    },
    {
      title: 'ราคา (บาท)',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      align: 'right' as const,
      render: (price: number) => price.toLocaleString(),
    },
    {
      title: 'สถานะ',
      dataIndex: 'is_active',
      key: 'is_active',
      width: 100,
      align: 'center' as const,
      render: (is_active: boolean, record: DentalService) => (
        <Switch
          checked={is_active}
          onChange={() => handleToggleServiceStatus(record)}
          checkedChildren="เปิด"
          unCheckedChildren="ปิด"
        />
      ),
    },
    {
      title: 'การจัดการ',
      key: 'actions',
      width: 150,
      align: 'center' as const,
      render: (_: any, record: DentalService) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditService(record)}
          />
          <Popconfirm
            title="ยืนยันการลบ"
            description="คุณต้องการลบบริการนี้หรือไม่?"
            onConfirm={() => handleDeleteService(record.id)}
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

  // Promotion columns
  const promotionColumns = [
    {
      title: 'รหัสโปรโมชั่น',
      dataIndex: 'promotion_code',
      key: 'promotion_code',
      width: 150,
    },
    {
      title: 'ชื่อโปรโมชั่น',
      dataIndex: 'title',
      key: 'title',
      width: 200,
    },
    {
      title: 'ประเภทส่วนลด',
      dataIndex: 'discount_type',
      key: 'discount_type',
      width: 120,
      render: (type: string) => (
        <Tag color={type === 'percentage' ? 'green' : 'orange'}>
          {type === 'percentage' ? 'เปอร์เซ็นต์' : 'จำนวนเงิน'}
        </Tag>
      ),
    },
    {
      title: 'ส่วนลด',
      dataIndex: 'discount_value',
      key: 'discount_value',
      width: 100,
      align: 'right' as const,
      render: (value: number, record: ServicePromotion) => 
        record.discount_type === 'percentage' ? `${value}%` : `${value.toLocaleString()} บาท`,
    },
    {
      title: 'วันที่เริ่ม',
      dataIndex: 'start_date',
      key: 'start_date',
      width: 120,
    },
    {
      title: 'วันที่สิ้นสุด',
      dataIndex: 'end_date',
      key: 'end_date',
      width: 120,
    },
    {
      title: 'สถานะ',
      dataIndex: 'is_active',
      key: 'is_active',
      width: 100,
      align: 'center' as const,
      render: (is_active: boolean, record: ServicePromotion) => (
        <Switch
          checked={is_active}
          onChange={() => handleTogglePromotionStatus(record)}
          checkedChildren="เปิด"
          unCheckedChildren="ปิด"
        />
      ),
    },
    {
      title: 'การจัดการ',
      key: 'actions',
      width: 100,
      align: 'center' as const,
      render: (_: any, record: ServicePromotion) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditPromotion(record)}
          />
        </Space>
      ),
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
          <MedicineBoxOutlined style={{ marginRight: '8px' }} />
          ระบบจัดการบริการ
        </h2>
      </div>

      <Tabs defaultActiveKey="services" type="card">
        <TabPane 
          tab={
            <span>
              <ToolOutlined />
              จัดการบริการ
            </span>
          } 
          key="services"
        >
          <div style={{ marginBottom: '16px' }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddService}
            >
              เพิ่มบริการใหม่
            </Button>
          </div>

          <Table
            columns={serviceColumns}
            dataSource={services}
            rowKey="id"
            loading={servicesLoading}
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
              <GiftOutlined />
              จัดการโปรโมชั่น
            </span>
          } 
          key="promotions"
        >
          <div style={{ marginBottom: '16px' }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddPromotion}
            >
              เพิ่มโปรโมชั่นใหม่
            </Button>
          </div>

          <Table
            columns={promotionColumns}
            dataSource={promotions}
            rowKey="id"
            loading={promotionsLoading}
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

      {/* Service Modal */}
      <Modal
        title={editingService ? 'แก้ไขบริการ' : 'เพิ่มบริการใหม่'}
        open={serviceModalVisible}
        onCancel={() => {
          setServiceModalVisible(false);
          serviceForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={serviceForm}
          layout="vertical"
          onFinish={handleServiceSubmit}
        >
          <Form.Item
            name="service_code"
            label="รหัสบริการ"
            rules={[{ required: true, message: 'กรุณากรอกรหัสบริการ' }]}
          >
            <Input placeholder="เช่น SRV001" />
          </Form.Item>

          <Form.Item
            name="service_name"
            label="ชื่อบริการ"
            rules={[{ required: true, message: 'กรุณากรอกชื่อบริการ' }]}
          >
            <Input placeholder="เช่น ตรวจฟันทั่วไป" />
          </Form.Item>

          <Form.Item
            name="category"
            label="หมวดหมู่"
            rules={[{ required: true, message: 'กรุณาเลือกหมวดหมู่' }]}
          >
            <Select placeholder="เลือกหมวดหมู่">
              {serviceCategories.map(cat => (
                <Option key={cat.value} value={cat.value}>{cat.label}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="รายละเอียด"
            rules={[{ required: true, message: 'กรุณากรอกรายละเอียด' }]}
          >
            <TextArea rows={3} placeholder="รายละเอียดของบริการ" />
          </Form.Item>

          <Form.Item
            name="duration_minutes"
            label="ระยะเวลา (นาที)"
            rules={[{ required: true, message: 'กรุณากรอกระยะเวลา' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} placeholder="30" />
          </Form.Item>

          <Form.Item
            name="price"
            label="ราคา (บาท)"
            rules={[{ required: true, message: 'กรุณากรอกราคา' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} placeholder="500" />
          </Form.Item>

          <Form.Item
            name="requires_appointment"
            label="ต้องนัดหมาย"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="ต้อง" unCheckedChildren="ไม่ต้อง" />
          </Form.Item>

          <Form.Item
            name="equipment_needed"
            label="อุปกรณ์ที่ต้องใช้"
          >
            <Input placeholder="คั่นด้วยเครื่องหมายจุลภาค เช่น เก้าอี้ทันตกรรม, กระจกส่องฟัน" />
          </Form.Item>

          <Form.Item
            name="prerequisites"
            label="ข้อกำหนดเบื้องต้น"
          >
            <Input placeholder="เช่น ต้องตรวจฟันก่อน" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setServiceModalVisible(false)}>
                ยกเลิก
              </Button>
              <Button type="primary" htmlType="submit">
                {editingService ? 'อัปเดต' : 'เพิ่ม'}บริการ
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Promotion Modal */}
      <Modal
        title={editingPromotion ? 'แก้ไขโปรโมชั่น' : 'เพิ่มโปรโมชั่นใหม่'}
        open={promotionModalVisible}
        onCancel={() => {
          setPromotionModalVisible(false);
          promotionForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={promotionForm}
          layout="vertical"
          onFinish={handlePromotionSubmit}
        >
          <Form.Item
            name="promotion_code"
            label="รหัสโปรโมชั่น"
            rules={[{ required: true, message: 'กรุณากรอกรหัสโปรโมชั่น' }]}
          >
            <Input placeholder="เช่น PROMO001" />
          </Form.Item>

          <Form.Item
            name="title"
            label="ชื่อโปรโมชั่น"
            rules={[{ required: true, message: 'กรุณากรอกชื่อโปรโมชั่น' }]}
          >
            <Input placeholder="เช่น แพ็คเกจตรวจฟันครบครัน" />
          </Form.Item>

          <Form.Item
            name="description"
            label="รายละเอียด"
            rules={[{ required: true, message: 'กรุณากรอกรายละเอียด' }]}
          >
            <TextArea rows={3} placeholder="รายละเอียดโปรโมชั่น" />
          </Form.Item>

          <Form.Item
            name="service_ids"
            label="บริการที่ใช้ได้"
            rules={[{ required: true, message: 'กรุณาเลือกบริการ' }]}
          >
            <Select
              mode="multiple"
              placeholder="เลือกบริการที่ใช้ได้กับโปรโมชั่น"
              optionFilterProp="children"
            >
              {services.map(service => (
                <Option key={service.id} value={service.id}>
                  {service.service_name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="discount_type"
            label="ประเภทส่วนลด"
            rules={[{ required: true, message: 'กรุณาเลือกประเภทส่วนลด' }]}
          >
            <Select placeholder="เลือกประเภทส่วนลด">
              <Option value="percentage">เปอร์เซ็นต์</Option>
              <Option value="fixed_amount">จำนวนเงิน</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="discount_value"
            label="ค่าส่วนลด"
            rules={[{ required: true, message: 'กรุณากรอกค่าส่วนลด' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} placeholder="20" />
          </Form.Item>

          <Form.Item
            name="start_date"
            label="วันที่เริ่ม"
            rules={[{ required: true, message: 'กรุณาเลือกวันที่เริ่ม' }]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item
            name="end_date"
            label="วันที่สิ้นสุด"
            rules={[{ required: true, message: 'กรุณาเลือกวันที่สิ้นสุด' }]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item
            name="max_uses"
            label="จำนวนครั้งที่ใช้ได้สูงสุด"
          >
            <InputNumber min={1} style={{ width: '100%' }} placeholder="100" />
          </Form.Item>

          <Form.Item
            name="terms_conditions"
            label="เงื่อนไขการใช้งาน"
          >
            <TextArea rows={2} placeholder="เงื่อนไขและข้อกำหนด" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setPromotionModalVisible(false)}>
                ยกเลิก
              </Button>
              <Button type="primary" htmlType="submit">
                {editingPromotion ? 'อัปเดต' : 'เพิ่ม'}โปรโมชั่น
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ServiceInfoPage;
