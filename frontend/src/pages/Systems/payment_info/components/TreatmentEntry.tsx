import React, { useState } from 'react';
import { Form, Input, Select, Button, Table, Card, Row, Col, InputNumber, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import './TreatmentEntry.css';

const { Option } = Select;

interface TreatmentItem {
  id: string;
  treatmentName: string;
  treatmentCode: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  description?: string;
}

const TreatmentEntry: React.FC = () => {
  const [form] = Form.useForm();
  const [treatments, setTreatments] = useState<TreatmentItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Mock treatment options
  const treatmentOptions = [
    { code: 'T001', name: 'ขูดหินปูน', price: 800 },
    { code: 'T002', name: 'อุดฟัน', price: 1200 },
    { code: 'T003', name: 'ถอนฟัน', price: 500 },
    { code: 'T004', name: 'รักษารากฟัน', price: 3000 },
    { code: 'T005', name: 'จัดฟัน', price: 25000 },
    { code: 'T006', name: 'ฟอกสีฟัน', price: 8000 },
    { code: 'T007', name: 'ใส่ฟันปลอม', price: 15000 },
  ];

  const onFinish = (values: any) => {
    const selectedTreatment = treatmentOptions.find(t => t.code === values.treatmentCode);
    if (!selectedTreatment) return;

    const newTreatment: TreatmentItem = {
      id: editingId || Date.now().toString(),
      treatmentName: selectedTreatment.name,
      treatmentCode: values.treatmentCode,
      quantity: values.quantity || 1,
      unitPrice: values.unitPrice || selectedTreatment.price,
      totalPrice: (values.quantity || 1) * (values.unitPrice || selectedTreatment.price),
      description: values.description,
    };

    if (editingId) {
      setTreatments(prev => prev.map(t => t.id === editingId ? newTreatment : t));
      setEditingId(null);
      message.success('แก้ไขรายการรักษาเรียบร้อย');
    } else {
      setTreatments(prev => [...prev, newTreatment]);
      message.success('เพิ่มรายการรักษาเรียบร้อย');
    }

    form.resetFields();
  };

  const handleEdit = (record: TreatmentItem) => {
    form.setFieldsValue({
      treatmentCode: record.treatmentCode,
      quantity: record.quantity,
      unitPrice: record.unitPrice,
      description: record.description,
    });
    setEditingId(record.id);
  };

  const handleDelete = (id: string) => {
    setTreatments(prev => prev.filter(t => t.id !== id));
    message.success('ลบรายการรักษาเรียบร้อย');
  };

  const handleTreatmentChange = (treatmentCode: string) => {
    const selectedTreatment = treatmentOptions.find(t => t.code === treatmentCode);
    if (selectedTreatment) {
      form.setFieldsValue({
        unitPrice: selectedTreatment.price,
      });
    }
  };

  const totalAmount = treatments.reduce((sum, item) => sum + item.totalPrice, 0);

  const columns = [
    {
      title: 'รหัส',
      dataIndex: 'treatmentCode',
      key: 'treatmentCode',
      width: 80,
    },
    {
      title: 'รายการรักษา',
      dataIndex: 'treatmentName',
      key: 'treatmentName',
    },
    {
      title: 'จำนวน',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80,
      align: 'center' as const,
    },
    {
      title: 'ราคาต่อหน่วย',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 120,
      align: 'right' as const,
      render: (price: number) => `฿${price.toLocaleString()}`,
    },
    {
      title: 'รวม',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      width: 120,
      align: 'right' as const,
      render: (price: number) => `฿${price.toLocaleString()}`,
    },
    {
      title: 'หมายเหตุ',
      dataIndex: 'description',
      key: 'description',
      width: 150,
    },
    {
      title: 'จัดการ',
      key: 'actions',
      width: 120,
      render: (_: any, record: TreatmentItem) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          />
          <Popconfirm
            title="ต้องการลบรายการนี้?"
            onConfirm={() => handleDelete(record.id)}
            okText="ลบ"
            cancelText="ยกเลิก"
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="treatment-entry-container">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card title="เพิ่มรายการรักษา" size="small" className="treatment-entry-card">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
            >
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label="รายการรักษา"
                    name="treatmentCode"
                    rules={[{ required: true, message: 'กรุณาเลือกรายการรักษา' }]}
                  >
                    <Select
                      placeholder="เลือกรายการรักษา"
                      onChange={handleTreatmentChange}
                      showSearch
                      optionFilterProp="children"
                    >
                      {treatmentOptions.map(treatment => (
                        <Option key={treatment.code} value={treatment.code}>
                          {treatment.code} - {treatment.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item
                    label="จำนวน"
                    name="quantity"
                    initialValue={1}
                    rules={[{ required: true, message: 'กรุณาระบุจำนวน' }]}
                  >
                    <InputNumber min={1} className="quantity-input" />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item
                    label="ราคาต่อหน่วย"
                    name="unitPrice"
                    rules={[{ required: true, message: 'กรุณาระบุราคา' }]}
                  >
                    <InputNumber
                      min={0}
                      formatter={value => `฿ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => {
                        const parsed = parseFloat(value!.replace(/฿\s?|(,*)/g, ''));
                        return isNaN(parsed) ? 0 : parsed;
                      }}
                      className="unit-price-input"
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="หมายเหตุ"
                    name="description"
                  >
                    <Input placeholder="หมายเหตุเพิ่มเติม" />
                  </Form.Item>
                </Col>
                <Col span={2}>
                  <Form.Item label=" ">
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<PlusOutlined />}
                      className="add-button"
                    >
                      {editingId ? 'แก้ไข' : 'เพิ่ม'}
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>

        <Col span={24}>
          <Card 
            title="รายการรักษาทั้งหมด" 
            size="small"
            extra={
              <div className="total-amount-display">
                รวมทั้งสิ้น: ฿{totalAmount.toLocaleString()}
              </div>
            }
          >
            <Table
              columns={columns}
              dataSource={treatments}
              rowKey="id"
              pagination={false}
              size="small"
              locale={{ emptyText: 'ยังไม่มีรายการรักษา' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TreatmentEntry;
