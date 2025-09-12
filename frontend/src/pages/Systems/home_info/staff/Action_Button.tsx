import React from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import { Person } from "../types";

interface AddWalkinDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (person: Person) => void;
  nextId: number;
}

const AddWalkinDrawer: React.FC<AddWalkinDrawerProps> = ({ open, onClose, onSubmit, nextId }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    const newPerson: Person = {
      id: nextId,
      firstName: values.firstName,
      lastName: values.lastName,
      service: values.service,
      status: 'รอพบแพทย์',
      type: 'Walk-in',
      amount: values.amount || 0
    };
    onSubmit(newPerson);
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="เพิ่มผู้ป่วย Walk-in"
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item name="firstName" label="ชื่อ" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="lastName" label="นามสกุล" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="service" label="บริการ" rules={[{ required: true }]}>
          <Select>
            <Select.Option value="ทันตกรรมทั่วไป">ทันตกรรมทั่วไป</Select.Option>
            <Select.Option value="ทันตกรรมเด็ก">ทันตกรรมเด็ก</Select.Option>
            <Select.Option value="ทันตกรรมจัดฟัน">ทันตกรรมจัดฟัน</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="amount" label="จำนวนเงิน">
          <Input type="number" />
        </Form.Item>
        <Form.Item>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button onClick={onClose}>ยกเลิก</Button>
            <Button type="primary" htmlType="submit">เพิ่ม</Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddWalkinDrawer;