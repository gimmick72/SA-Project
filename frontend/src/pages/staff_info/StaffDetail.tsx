import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Button, Typography, Spin, Row, Col, Form, Input, Select, DatePicker, message, Popconfirm, Space } from 'antd';
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

// Re-using the Staff interface and initialStaffData from your other files
interface Staff {
  Employee_ID: number;
  Title: string;
  firstName: string;
  lastName: string;
  position: string;
  phone: string;
  gender: string;
  startDate: string;
  age: number;
  idCard: string;
  address: string;
  email: string;
  employeeType: string;
  licenseNumber: string;
}

const initialStaffData: Staff[] = [
  { Employee_ID: 1, Title: "ทพ.", firstName: "Somsak", lastName: "Thongdee", position: "ทันตแพทย์", phone: "081-234-5678", gender: "ชาย", startDate: "2010-01-15", age: 45, idCard: "1234567890123", address: "123 Moo 1, T.Nongprue, A.Muang, N.Ratchasima", email: "somsak@clinic.com", employeeType: "Full-time", licenseNumber: "D12345", },
  { Employee_ID: 2, Title: "ทพ.ญ.", firstName: "Suda", lastName: "Kanya", position: "ทันตแพทย์", phone: "089-111-2222", gender: "หญิง", startDate: "2015-03-01", age: 38, idCard: "9876543210987", address: "456 Sukhumvit Rd, BKK", email: "suda@clinic.com", employeeType: "Part-time", licenseNumber: "D54321", },
  { Employee_ID: 3, Title: "นาย", firstName: "Anan", lastName: "Chaiyos", position: "ผู้ช่วย", phone: "089-555-1111", gender: "ชาย", startDate: "2021-09-10", age: 29, idCard: "1122334455667", address: "88 Rama 2 Rd, BKK", email: "anan@clinic.com", employeeType: "Full-time", licenseNumber: "A00002", },
  { Employee_ID: 4, Title: "นางสาว", firstName: "Jiraporn", lastName: "Meechai", position: "เจ้าหน้าที่แผนกต้อนรับ", phone: "091-234-4567", gender: "หญิง", startDate: "2018-11-01", age: 32, idCard: "2233445566778", address: "12 Soi Latkrabang, BKK", email: "jiraporn@clinic.com", employeeType: "Full-time", licenseNumber: "", },
  { Employee_ID: 5, Title: "ทพ.", firstName: "Nattapong", lastName: "Preecha", position: "ทันตแพทย์", phone: "080-999-0000", gender: "ชาย", startDate: "2013-06-25", age: 40, idCard: "3344556677889", address: "567 Moo 5, Chiang Mai", email: "nattapong@clinic.com", employeeType: "Full-time", licenseNumber: "D67890", },
  { Employee_ID: 6, Title: "ทพ.ญ.", firstName: "Chanida", lastName: "Ruangroj", position: "ทันตแพทย์", phone: "083-456-7890", gender: "หญิง", startDate: "2019-04-10", age: 34, idCard: "5566778899001", address: "23 Rama 4 Rd, BKK", email: "chanida@clinic.com", employeeType: "Part-time", licenseNumber: "D09876", },
  { Employee_ID: 7, Title: "นางสาว", firstName: "Sirilak", lastName: "Thongchai", position: "ผู้ช่วยทันตแพทย์", phone: "082-888-9999", gender: "หญิง", startDate: "2022-01-05", age: 26, idCard: "6655443322110", address: "101 Ratchada Rd, BKK", email: "sirilak@clinic.com", employeeType: "Full-time", licenseNumber: "A12345", },
  { Employee_ID: 8, Title: "นาย", firstName: "Pongsak", lastName: "Dechmongkol", position: "เจ้าหน้าที่การเงิน", phone: "085-333-4444", gender: "ชาย", startDate: "2016-08-12", age: 36, idCard: "7788990011223", address: "66 Ladprao Rd, BKK", email: "pongsak@clinic.com", employeeType: "Full-time", licenseNumber: "", },
  { Employee_ID: 9, Title: "ทพ.", firstName: "Kasem", lastName: "Prasert", position: "ทันตแพทย์", phone: "086-111-2222", gender: "ชาย", startDate: "2009-12-01", age: 50, idCard: "1122446688990", address: "234 Moo 3, A.Tha Muang, Kanchanaburi", email: "kasem@clinic.com", employeeType: "Full-time", licenseNumber: "D00123", },
  { Employee_ID: 10, Title: "ทพ.ญ.", firstName: "Panida", lastName: "Srisuk", position: "ทันตแพทย์", phone: "084-777-8888", gender: "หญิง", startDate: "2023-06-10", age: 30, idCard: "9988776655443", address: "90 Huay Kwang, BKK", email: "panida@clinic.com", employeeType: "Part-time", licenseNumber: "D87654", },
  { Employee_ID: 11, Title: "นางสาว", firstName: "Kamonwan", lastName: "Chalermchai", position: "เจ้าหน้าที่แผนกต้อนรับ", phone: "087-999-1122", gender: "หญิง", startDate: "2020-02-20", age: 27, idCard: "4455667788991", address: "19 Bangna-Trad Rd, BKK", email: "kamonwan@clinic.com", employeeType: "Full-time", licenseNumber: "", },
  { Employee_ID: 12, Title: "นาย", firstName: "Arthit", lastName: "Krittayapong", position: "ช่างซ่อมบำรุง", phone: "088-123-4567", gender: "ชาย", startDate: "2017-10-15", age: 41, idCard: "3344667788992", address: "55 Moo 2, Nakhon Pathom", email: "arthit@clinic.com", employeeType: "Full-time", licenseNumber: "", },
];

const StaffDetails: React.FC = () => {
  const [staff, setStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { Employee_ID } = useParams<{ Employee_ID: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    if (Employee_ID) {
      setLoading(true);
      const staffId = parseInt(Employee_ID, 10);
      const foundStaff = initialStaffData.find(s => s.Employee_ID === staffId);

      if (foundStaff) {
        setStaff(foundStaff);
      }
      setLoading(false);
    }
  }, [Employee_ID]);

  // Use a second useEffect to set form values only when staff data is available and not in editing mode.
  useEffect(() => {
    if (staff && !isEditing) {
      form.setFieldsValue({
        ...staff,
        startDate: dayjs(staff.startDate),
      });
    }
  }, [staff, isEditing, form]);

  const onFinish = (values: any) => {
    // โค้ดส่วนนี้คือการจำลองการบันทึกข้อมูล
    const updatedStaff: Staff = {
      ...staff!, // ใช้ข้อมูลเดิม
      ...values, // อัปเดตด้วยค่าใหม่จาก form
      startDate: values.startDate.format('YYYY-MM-DD'), // จัด format วันที่
    };

    // อัปเดต state ของข้อมูลพนักงานในหน้าจอทันที
    setStaff(updatedStaff);

    message.success('แก้ไขข้อมูลเรียบร้อย!');
    setIsEditing(false); // สลับกลับไปที่โหมดดูข้อมูล
  };

  const handleGoBack = () => {
    navigate('/staff');
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // รีเซ็ตฟอร์มกลับไปที่ค่าปัจจุบันที่แสดงอยู่ (ไม่ใช่ค่าเริ่มต้น)
    if (staff) {
      form.setFieldsValue({
        ...staff,
        startDate: dayjs(staff.startDate),
      });
    }
  };

  // New delete function
  const handleDeleteStaff = () => {
    // โค้ดส่วนนี้เป็นการจำลองการลบข้อมูล
    // ในแอปพลิเคชันจริง คุณจะต้องเรียก API เพื่อลบข้อมูลออกจากฐานข้อมูล
    // และแจ้งให้หน้ารายชื่อบุคลากร (StaffInfoPaeg) อัปเดตข้อมูลด้วย
    message.success(`ลบข้อมูลบุคลากร รหัส ${String(staff?.Employee_ID).padStart(2, '0')} เรียบร้อยแล้ว`);
    navigate('/staff');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="Loading staff details..." />
      </div>
    );
  }

  if (!staff) {
    return (
      <div style={{ padding: '16px', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'auto', }}>
        <Title level={3}>ไม่พบข้อมูลบุคลากร</Title>
        <p>ไม่พบข้อมูลบุคลากรสำหรับรหัสที่ระบุ</p>
        <Button onClick={handleGoBack} icon={<ArrowLeftOutlined />}>
          กลับไปหน้ารายชื่อ
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'auto', }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: '20px' }}>
        <Col>
          <Title level={2} style={{ fontSize: 'clamp(1.25rem, 2vw + 1rem, 2rem)', fontWeight: 'bold', marginBottom: '20px', }}>
            ข้อมูลส่วนตัวบุคลากร
          </Title>
        </Col>
        <Col>
          <Button onClick={handleGoBack} icon={<ArrowLeftOutlined />}>
            กลับไปหน้ารายชื่อ
          </Button>
        </Col>
      </Row>

      <Card
        title={isEditing ? `แก้ไขข้อมูล: ${staff.Title} ${staff.firstName} ${staff.lastName}` : `${staff.Title} ${staff.firstName} ${staff.lastName}`}
        bordered={false}
        style={{ borderRadius: 10, boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)" }}
        bodyStyle={{ padding: 24 }}
        extra={!isEditing && (
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={handleEditClick}
              size="large"
              style={{
                backgroundColor: '#ffffffff',
                borderColor: '#B19CD9',
                color: '#B19CD9',
                borderRadius: '20px',
                padding: '8px 20px',
              }}
            >
              แก้ไขข้อมูล
            </Button>
            <Popconfirm
              title="คุณต้องการลบข้อมูลบุคลากรนี้หรือไม่?"
              onConfirm={handleDeleteStaff}
              okText="ใช่"
              cancelText="ไม่"
            >
              <Button
                type="primary"
                icon={<DeleteOutlined />}
                size="large"
                style={{
                  backgroundColor: '#ff0000ff',
                  borderColor: '#ff0000ff',
                  color: 'white',
                  borderRadius: '25px',
                  padding: '8px 20px',
                }}
              >
                ลบข้อมูล
              </Button>
            </Popconfirm>
          </Space>
        )}
      >
        {!isEditing ? (
          // VIEW MODE
          <>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="รหัสพนักงาน">{String(staff.Employee_ID).padStart(2, '0')}</Descriptions.Item>
              <Descriptions.Item label="ตำแหน่งงาน">{staff.position}</Descriptions.Item>
              <Descriptions.Item label="ประเภทพนักงาน">{staff.employeeType}</Descriptions.Item>
              <Descriptions.Item label="เพศ">{staff.gender}</Descriptions.Item>
              <Descriptions.Item label="อายุ">{staff.age}</Descriptions.Item>
              <Descriptions.Item label="วันที่เริ่มงาน">{staff.startDate}</Descriptions.Item>
              <Descriptions.Item label="เบอร์โทรศัพท์">{staff.phone}</Descriptions.Item>
              <Descriptions.Item label="อีเมล">{staff.email}</Descriptions.Item>
              <Descriptions.Item label="เลขบัตรประชาชน">{staff.idCard}</Descriptions.Item>
              <Descriptions.Item label="หมายเลขใบประกอบวิชาชีพ">
                {staff.licenseNumber || "ไม่มี"}
              </Descriptions.Item>
              <Descriptions.Item label="ที่อยู่">
                {staff.address}
              </Descriptions.Item>
            </Descriptions>
          </>
        ) : (
          // EDIT MODE
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >
            {/* ... (Form.Items are the same as before) ... */}
            <Row gutter={24}>
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="Title" label="คำนำหน้าชื่อ" rules={[{ required: true, message: 'กรุณาเลือกคำนำหน้าชื่อ' }]}>
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
                  <Input placeholder="อายุ" type="number" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="position" label="ตำแหน่งงาน" rules={[{ required: true, message: 'กรุณาเลือกตำแหน่ง' }]}>
                  <Input placeholder="ตำแหน่งงาน" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="employeeType" label="ประเภทพนักงาน" rules={[{ required: true, message: 'กรุณาเลือกประเภทพนักงาน' }]}>
                  <Select placeholder="ประเภทพนักงาน">
                    <Option value="Full-time">Full-time</Option>
                    <Option value="Part-time">Part-time</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col xs={24} sm={12}>
                <Form.Item name="idCard" label="เลขบัตรประชาชน" rules={[{ required: true, message: 'กรุณากรอกเลขบัตรประชาชน' }]}>
                  <Input placeholder="เลขบัตรประชาชน" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="licenseNumber" label="หมายเลขใบประกอบวิชาชีพ">
                  <Input placeholder="หมายเลขใบประกอบวิชาชีพ" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="address" label="ที่อยู่" rules={[{ required: true, message: 'กรุณากรอกที่อยู่' }]}>
              <Input placeholder="ที่อยู่" />
            </Form.Item>

            <Form.Item name="email" label="อีเมล" rules={[{ required: true, message: 'กรุณากรอกอีเมล', type: 'email' }]}>
              <Input placeholder="อีเมล" />
            </Form.Item>

            <Row justify="end" gutter={16}>
              <Col>
                <Button onClick={handleCancelEdit}>ยกเลิก</Button>
              </Col>
              <Col>
                <Button type="primary" htmlType="submit" style={{
                  backgroundColor: '#52c41a',
                  borderColor: '#52c41a',
                  color: 'white',
                }}>
                  บันทึกข้อมูล
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default StaffDetails;