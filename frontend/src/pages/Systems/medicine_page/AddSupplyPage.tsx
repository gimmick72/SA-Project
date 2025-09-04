// src/pages/medicine_page/AddSupplyPage.tsx
import React from 'react';
import { Form, Input, Button, InputNumber, Select, DatePicker, message, Card, Space, Row, Col } from 'antd';
import dayjs from 'dayjs';
import { createSupply } from '@service/supply/supply';

const { Option } = Select;

const AddSupplyPage: React.FC = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = React.useState(false); // ✅ ใช้ useState

  const onFinish = async (values: any) => {
    if (submitting) return; // กันกดรัว
    try {
      setSubmitting(true);
      const payload = {
        code: values.code?.trim(),
        name: values.name?.trim(),
        category: values.category,
        quantity: Number(values.quantity),
        unit: values.unit?.trim(),
        import_date: values.importDate ? dayjs(values.importDate).format('YYYY-MM-DD') : '',
        expiry_date: values.expiryDate ? dayjs(values.expiryDate).format('YYYY-MM-DD') : '',
      };
      await createSupply(payload);
      message.success('เพิ่มเวชภัณฑ์สำเร็จ!');
      form.resetFields();
      window.dispatchEvent(new Event("suppliesUpdated"));
    } catch (e: any) {
      message.error(e?.message || 'บันทึกไม่สำเร็จ');
    } finally {
      setSubmitting(false);
    }
  };

  const onReset = () => {
    form.resetFields();
    message.info('ฟอร์มถูกล้างข้อมูลแล้ว');
  };

  const categories = ['ยาเม็ด', 'ของเหลว', 'อุปกรณ์ทำแผล'];

  return (
    <Card title="แบบฟอร์มเพิ่มเวชภัณฑ์" bordered style={{ width: '1300px', height: '475px', borderRadius: '12px' }}>
      <Form
        form={form}
        layout="vertical"
        name="add_supply_form"
        onFinish={onFinish}
        initialValues={{ importDate: dayjs() }}
        scrollToFirstError
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="code" label="รหัสเวชภัณฑ์" rules={[{ required: true, message: 'กรุณากรอกรหัสเวชภัณฑ์!' }]}>
              <Input placeholder="เช่น MED001" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="name" label="ชื่อเวชภัณฑ์" rules={[{ required: true, message: 'กรุณากรอกชื่อเวชภัณฑ์!' }]}>
              <Input placeholder="เช่น ยาแก้ปวดพาราเซตามอล" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="category" label="หมวดหมู่" rules={[{ required: true, message: 'กรุณาเลือกหมวดหมู่!' }]}>
              <Select placeholder="เลือกหมวดหมู่" allowClear>
                {categories.map((category) => (
                  <Option key={category} value={category}>
                    {category}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="quantity" label="จำนวน" rules={[{ required: true, message: 'กรุณากรอกจำนวน!' }]}>
              <InputNumber min={1} style={{ width: '100%' }} placeholder="จำนวน" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="unit" label="หน่วย" rules={[{ required: true, message: 'กรุณากรอกหน่วย!' }]}>
              <Input placeholder="เช่น เม็ด, ขวด, แผง" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="importDate" label="วันที่นำเข้า" rules={[{ required: true, message: 'กรุณาเลือกวันที่นำเข้า!' }]}>
              <DatePicker styimport { Supply } from '..';
le={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="expiryDate" label="วันหมดอายุ" rules={[{ required: true, message: 'กรุณาเลือกวันหมดอายุ!' }]}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item style={{ marginTop: 4,marginRight: 8, textAlign: 'right' }}>
          <Space>
            <Button htmlType="button" onClick={onReset} disabled={submitting}>
              ล้างข้อมูล
            </Button>
            <Button type="primary" htmlType="submit" loading={submitting}>
              เพิ่มเวชภัณฑ์
            </Button>
            
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddSupplyPage;
