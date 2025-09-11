// src/pages/staff_info/staffAdd.tsx
import React from 'react';
import { Form, Input, Select, DatePicker, Row, Col, Button, message, InputNumber, Space } from 'antd';
import type { NewStaffData } from '../../../../interface/Staff';

const { Option } = Select;

interface AddStaffFormProps {
  onFormSubmit: (data: NewStaffData) => void;
  onFormCancel: () => void;
  initialValues?: Partial<NewStaffData>;
}

const AddStaffForm: React.FC<AddStaffFormProps> = ({ initialValues, onFormSubmit, onFormCancel }) => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Form Values:", values);
    onFormSubmit(values); // ส่งข้อมูลไป parent
    form.resetFields();
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
    message.error('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วนและถูกต้อง');
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      initialValues={initialValues}
    >
      {/* ====== ข้อมูลส่วนตัว ====== */}
      <Row gutter={24}>
        <Col xs={24} sm={12} md={6}>
          <Form.Item name="title" label="คำนำหน้าชื่อ" rules={[{ required: true, message: 'กรุณาเลือกคำนำหน้าชื่อ' }]}>
            <Select placeholder="คำนำหน้าชื่อ">
              <Option value="นาย">นาย</Option>
              <Option value="นาง">นาง</Option>
              <Option value="นางสาว">นางสาว</Option>
              <Option value="ทพ.">ทพ.</Option>
              <Option value="ทพ.ญ.">ทพ.ญ.</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Form.Item name="firstName" label="ชื่อ" rules={[{ required: true, message: 'กรุณากรอกชื่อ' }]}>
            <Input placeholder="ชื่อ" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Form.Item name="lastName" label="นามสกุล" rules={[{ required: true, message: 'กรุณากรอกนามสกุล' }]}>
            <Input placeholder="นามสกุล" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Form.Item name="startDate" label="วันที่เริ่มงาน" rules={[{ required: true, message: 'กรุณาเลือกวันที่' }]}>
            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      {/* ====== เพศ / อายุ / บัตรประชาชน / โทรศัพท์ ====== */}
      <Row gutter={24}>
        <Col xs={24} sm={12} md={6}>
          <Form.Item name="gender" label="เพศ" rules={[{ required: true, message: 'กรุณาเลือกเพศ' }]}>
            <Select placeholder="เพศ">
              <Option value="ชาย">ชาย</Option>
              <Option value="หญิง">หญิง</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Form.Item name="age" label="อายุ" rules={[{ required: true, message: 'กรุณากรอกอายุ' }]}>
            <InputNumber placeholder="ใส่อายุ" style={{ width: '100%' }} />

          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6}>
                        <Form.Item
                          name="idCard"
                          label="เลขบัตรประชาชน"
                          rules={[
                            { required: true, message: 'กรุณากรอกเลขบัตรประชาชน' },
                            { pattern: /^\d{1,13}$/, message: 'กรอกได้เฉพาะตัวเลขและไม่เกิน 13 หลัก' },
                          ]}
                        >
                          <Input
                            placeholder="ใส่เลขบัตรประชาชน"
                            maxLength={13} // จำกัด input
        
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={6}>
                        <Form.Item
                          name="phone"
                          label="เบอร์โทรศัพท์"
                          rules={[
                            { required: true, message: 'กรุณาใส่เบอร์โทรศัพท์' },
                            { pattern: /^\d+$/, message: 'กรอกได้เฉพาะตัวเลขเท่านั้น' },
                            { min: 10, max: 10, message: 'เบอร์โทรศัพท์ต้องมี 10 หลัก' },
                          ]}
                        >
                          <Input
                            placeholder="ใส่เบอร์โทรศัพท์"
                            maxLength={10}
                            inputMode="numeric"
                            onChange={(e) => {
                              const onlyNumbers = e.target.value.replace(/\D/g, ""); // ลบทุกตัวที่ไม่ใช่เลข
                              e.target.value = onlyNumbers;
                            }}
                          />
                        </Form.Item>
                      </Col>
      </Row>
      <Col xs={24} sm={12} md={24}>
        {/* ====== อีเมล / ที่อยู่ ====== */}
        <Form.Item name="email" label="อีเมล" rules={[{ required: true, message: 'กรุณากรอกอีเมล', type: 'email' }]}>
          <Input placeholder="อีเมล" />
        </Form.Item>

        <Form.Item name="address" label="ที่อยู่" rules={[{ required: true, message: 'กรุณากรอกที่อยู่' }]}>
          <Input placeholder="ใส่ที่อยู่" />
        </Form.Item>
      </Col>
      {/* ====== ตำแหน่ง / ประเภทพนักงาน ====== */}
      <Row gutter={24}>
        <Col xs={24} sm={12}>
          <Form.Item name="position" label="ตำแหน่งงาน" rules={[{ required: true, message: 'กรุณาเลือกตำแหน่ง' }]}>
            <Input placeholder="ตำแหน่งงาน" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item name="employeeType" label="ประเภทพนักงาน" rules={[{ required: true, message: 'กรุณาเลือกประเภทพนักงาน' }]}>
            <Select placeholder="ประเภทพนักงาน">
              <Option value="Full-time">Full-time</Option>
              <Option value="Part-time">Part-time</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      {/* ====== ใบประกอบวิชาชีพ / เฉพาะทาง / เงินเดือน ====== */}
      <Row gutter={24}>
        <Col xs={24} sm={12}>
          <Form.Item name="licenseNumber" label="หมายเลขใบประกอบวิชาชีพ">
            <Input placeholder="หมายเลขใบประกอบวิชาชีพ" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={6}>
          <Form.Item name="Specialization" label="เฉพาะทางด้าน">
            <Select placeholder="เฉพาะทางด้าน">
              <Option value="เด็ก">ทันตกรรมเด็ก</Option>
              <Option value="จัดฟัน">ทันตกรรมจัดฟัน</Option>
              <Option value="ปริทันต์">ทันตกรรมปริทันต์</Option>
              <Option value="ผ่าตัดช่องปาก">ทันตกรรมผ่าตัดช่องปาก/ใบหน้า</Option>
              <Option value="รากฟันเทียม">ทันตกรรมบูรณะ/ประดิษฐ์ฟัน</Option>
              <Option value="รากฟัน">ทันตกรรมรากฟัน</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={6}>

          <Form.Item
            name="CompRate"
            label="เงินเดือนสุทธิ"
            rules={[{ required: true, message: 'กรุณากรอกเงินเดือนสุทธิ' }]}
          >
            <InputNumber
              placeholder="ใส่เงินเดือนสุทธิ"
              style={{ width: "100%" }}
              min={0}
              formatter={(value) =>
                value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""
              }
              parser={((value?: string) => (value ? Number(value.replace(/,/g, "")) : 0)) as any}
            />
          </Form.Item>

        </Col>
      </Row>

      {/* ====== ปุ่ม Submit / Cancel ====== */}
      <Form.Item>

        <Row justify="end" gutter={16} >
          <Space size="middle">
            <Button htmlType="button" style={{
              width: 120,
              height: 40,
              borderRadius: '25px',
            }} onClick={() => { form.resetFields(); onFormCancel(); }}>ยกเลิก
            </Button>

            <Button type="primary" htmlType="submit" style={{
              width: 120,
              height: 40,
              backgroundColor: "#52c41a",
              borderColor: "#52c41a",
              color: "white",
              borderRadius: '25px',
            }}>
              บันทึกข้อมูล
            </Button>
          </Space>
        </Row>
      </Form.Item>
    </Form>
  );
};

export default AddStaffForm;
