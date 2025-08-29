// src/pages/staff_info/addstaff.tsx
import React from 'react';
import { Form, Input, Select, DatePicker, Button, Row, Col, message } from 'antd';
import dayjs from 'dayjs';


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const { Option } = Select;
// Interface for new staff data (adapt as per your backend/data model)
interface NewStaffData {
  title: string;
  firstName: string;
  lastName: string;
  gender: string;
  startDate: string;
  employeeId: string;
  age: number;
  idCard: string;
  phone: string;
  addressHouseNo: string;
  addressMoo: string;
  addressSubDistrict: string;
  addressDistrict: string;
  email: string;
  position: string;
  employeeType: string;
  branch: string; // This will now be a string from the Input field
  licenseNumber?: string;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Props interface for the AddStaffForm component
interface AddStaffFormProps {
  onFormSubmit: (data: NewStaffData) => void;
  onFormCancel: () => void;
  initialValues?: Partial<NewStaffData>;
}

const AddStaffForm: React.FC<AddStaffFormProps> = ({ onFormSubmit, onFormCancel, initialValues }) => {
  const [form] = Form.useForm();

  // Dummy options for Select components
  const titleOptions = [
    { value: 'นาย', label: 'นาย' },
    { value: 'นางสาว', label: 'นางสาว' },
    { value: 'นาง', label: 'นาง' },
    { value: 'ทพ.', label: 'ทพ.' },
    { value: 'ทพ.ญ.', label: 'ทพ.ญ.' },
  ];

  const genderOptions = [
    { value: 'ชาย', label: 'ชาย' },
    { value: 'หญิง', label: 'หญิง' },
  ];

  const districtOptions = [
    { value: 'เมืองนครราชสีมา', label: 'เมืองนครราชสีมา' },
    { value: 'ปากช่อง', label: 'ปากช่อง' },
    { value: 'ขามทะเลสอ', label: 'ขามทะเลสอ' },
  ];

  const employeeTypeOptions = [
    { value: 'Full-time', label: 'Full-time' },
    { value: 'Part-time', label: 'Part-time' },
    { value: 'Contract', label: 'Contract' },
  ];

  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        startDate: initialValues.startDate ? dayjs(initialValues.startDate) : undefined,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);


  const onFinish = (values: any) => {
    const newStaff: NewStaffData = {
      title: values.title,
      firstName: values.fullName.split(' ')[0] || '',
      lastName: values.fullName.split(' ').slice(1).join(' ') || '',
      gender: values.gender,
      startDate: values.startDate ? values.startDate.format('YYYY-MM-DD') : '',
      employeeId: values.employeeId,
      age: parseInt(values.age, 10),
      idCard: values.idCard,
      phone: values.phone,
      addressHouseNo: values.addressHouseNo,
      addressMoo: values.addressMoo,
      addressSubDistrict: values.addressSubDistrict,
      addressDistrict: values.addressDistrict,
      email: values.email,
      position: values.position,
      employeeType: values.employeeType,
      branch: values.branch,
      licenseNumber: values.licenseNumber,
    };
    onFormSubmit(newStaff);
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
      <Row gutter={16}>
        <Col xs={24} sm={8}>
            <Form.Item name="title" label="คำนำหน้าชื่อ" rules={[{ required: true, message: 'กรุณาเลือกคำนำหน้าชื่อ!' }]}>
                <Select placeholder="เลือกคำนำหน้าชื่อ">{titleOptions.map(option => (                
                    <Option key={option.value} value={option.value}>{option.label}</Option>))}
                </Select>
            </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
            <Form.Item name="gender" label="เพศ" rules={[{ required: true, message: 'กรุณาเลือกเพศ!' }]}>
                <Select placeholder="เลือกเพศ">{genderOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>))}
                </Select>
            </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
            <Form.Item name="startDate" label="วันที่เริ่มงาน" rules={[{ required: true, message: 'กรุณาเลือกวันที่เริ่มงาน!' }]}>
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="เลือกวันที่" />
            </Form.Item>
        </Col>
      </Row>


      <Row gutter={16}>
        <Col xs={24} sm={8}>
            <Form.Item name="fullName" label="ชื่อ-นามสกุล" rules={[{ required: true, message: 'กรุณากรอกชื่อ-นามสกุล!' }]}>
                <Input placeholder="ชื่อ นามสกุล" />
            </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
            <Form.Item name="age" label="อายุ" rules={[{ required: true, message: 'กรุณากรอกอายุ!' },{ pattern: /^[0-9]+$/, message: 'อายุต้องเป็นตัวเลข!' },{ min: 1, max: 120, type: 'number', transform: (value) => Number(value), message: 'อายุต้องอยู่ระหว่าง 1-120 ปี' },]}>
                <Input placeholder="อายุ" />
            </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
            <Form.Item name="employeeId" label="รหัสพนักงาน" rules={[{ required: true, message: 'กรุณากรอกรหัสพนักงาน!' }]}>
                <Input placeholder="รหัสพนักงาน" />
                </Form.Item>
                </Col>
      </Row>


      <Row gutter={16}>
        <Col xs={24} sm={12}>
            <Form.Item name="idCard" label="เลขบัตรประชาชน" rules={[{ required: true, message: 'กรุณากรอกเลขบัตรประชาชน!' },{ pattern: /^[0-9]{13}$/, message: 'เลขบัตรประชาชนต้องมี 13 หลัก!' },]}>
                <Input placeholder="เลขบัตรประชาชน" maxLength={13} />
            </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
            <Form.Item name="phone" label="เบอร์โทรศัพท์" rules={[{ required: true, message: 'กรุณากรอกเบอร์โทรศัพท์!' },{ pattern: /^[0-9]{10}$/, message: 'เบอร์โทรศัพท์ต้องมี 10 หลัก!' },]}>
                <Input placeholder="เบอร์โทรศัพท์" maxLength={10} />
            </Form.Item>
        </Col>
      </Row>


      <Row gutter={16}>
    <Col xs={24} sm={6}>
      <Form.Item
        name="addressHouseNo"
        label="บ้านเลขที่"
        rules={[{ required: true, message: 'กรุณากรอกบ้านเลขที่!' }]}
      >
        <Input placeholder="บ้านเลขที่" />
      </Form.Item>
    </Col>
    <Col xs={24} sm={6}>
      <Form.Item name="addressMoo" label="หมู่ที่">
        <Input placeholder="หมู่ที่" />
      </Form.Item>
    </Col>
    <Col xs={24} sm={6}>
      <Form.Item
        name="addressSubDistrict"
        label="ตำบล / แขวง"
        rules={[{ required: true, message: 'กรุณากรอกตำบล / แขวง!' }]}
      >
        <Input placeholder="ตำบล / แขวง" />
      </Form.Item>
    </Col>
    <Col xs={24} sm={6}>
      <Form.Item
        name="addressDistrict"
        label="อำเภอ / เขต"
        rules={[{ required: true, message: 'กรุณาเลือกอำเภอ / เขต!' }]}
      >
        <Select placeholder="เลือกอำเภอ / เขต">
          {districtOptions.map(option => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Col>
  </Row>

  <Row gutter={16}>
    <Col xs={24}>
      <Form.Item
        name="email"
        label="อีเมล"
        rules={[
          { required: true, message: 'กรุณากรอกอีเมล!' },
          { type: 'email', message: 'รูปแบบอีเมลไม่ถูกต้อง!' },
        ]}
      >
        <Input placeholder="อีเมล" />
      </Form.Item>
    </Col>
  </Row>

  <Row gutter={16}>
    <Col xs={24} sm={12}>
      <Form.Item
        name="position"
        label="ตำแหน่งงาน"
        rules={[{ required: true, message: 'กรุณากรอกตำแหน่งงาน!' }]}
      >
        <Input placeholder="ตำแหน่งงาน" />
      </Form.Item>
    </Col>
    <Col xs={24} sm={12}>
      <Form.Item
        name="employeeType"
        label="ประเภทพนักงาน"
        rules={[{ required: true, message: 'กรุณาเลือกประเภทพนักงาน!' }]}
      >
        <Select placeholder="เลือกประเภทพนักงาน">
          {employeeTypeOptions.map(option => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Col>
  </Row>

  <Row gutter={16}>
    <Col xs={24} sm={12}>
      <Form.Item name="branch" label="สาขาที่ประจำวัน (ถ้ามี)">
        <Input placeholder="สาขาที่ประจำวัน" />
      </Form.Item>
    </Col>
    <Col xs={24} sm={12}>
      <Form.Item name="licenseNumber" label="หมายเลขใบประกอบวิชาชีพ (ถ้ามี)">
        <Input placeholder="หมายเลขใบประกอบวิชาชีพ" />
      </Form.Item>
    </Col>
  </Row>

  <Row gutter={16} justify="end" style={{ marginTop: '24px' }}>
    <Col>
      <Button onClick={onFormCancel} style={{ marginRight: '8px' }}>
        ย้อนกลับ
      </Button>
    </Col>
    <Col>
      <Button
        type="primary"
        htmlType="submit"
        style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
      >
        บันทึกข้อมูล
      </Button>
    </Col>
  </Row>
</Form>
  );
};

export default AddStaffForm;


