import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Button, Typography, Spin, Row, Col, Form, Input, Select, DatePicker, message, Popconfirm, Space } from 'antd';
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { StaffController } from '../../controllers/staffController';
import type { Staff } from './index'; // import type from your list file where Staff is defined

const { Title } = Typography;
const { Option } = Select;


const StaffDetails: React.FC = () => {
  const [staff, setStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { Employee_ID } = useParams<{ Employee_ID: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  

useEffect(() => {
  if (staff && isEditing) {
    form.setFieldsValue({
      ...staff,
      startDate: staff.startDate ? dayjs(staff.startDate) : null,
    });
  }
  // intentionally omit calling setFieldsValue when not editing (avoids warning)
}, [staff, form, isEditing]);


useEffect(() => {
  setLoading(true);
  StaffController.getAllStaff()
    .then((data) => {
      if (!Employee_ID) {
        setStaff(null);
        return;
      }
      const id = Number(Employee_ID);
      const found = data.find(s => s.Employee_ID === id);
      if (found) {
        setStaff(found);
        // ถ้าอยู่ในโหมดแก้ไข ให้ set ค่าเข้า form (ป้องกัน warning)
        if (isEditing) {
          form.setFieldsValue({
            ...found,
            startDate: found.startDate ? dayjs(found.startDate) : null,
          });
        }
      } else {
        setStaff(null);
      }
    })
    .catch((err) => {
      console.error('Failed to load staff list', err);
      setStaff(null);
    })
    .finally(() => setLoading(false));
}, [Employee_ID, form, isEditing]);




  const onFinish = async (values: any) => {
    if (!staff) return;
    try {
      const updated = {
        ...staff,
        ...values,
        startDate: values.startDate ? values.startDate.format('YYYY-MM-DD') : staff.startDate,
      };

      // NOTE: backend PUT /staff/:id in your main.go expects updating PersonalData or Department?
      // Here we attempt to PUT to /staff/:id — adjust payload in backend if needed.
      const res = await fetch(`http://localhost:8080/staff/${staff.Employee_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });

      if (!res.ok) throw new Error('Update failed');

      // If backend returns updated record in the same shape as StaffController mapping, set directly.
      // Otherwise you may need to re-fetch:
      // setStaff(respMapped)
      message.success('แก้ไขข้อมูลเรียบร้อย!');
      setIsEditing(false);

      // safest: re-fetch the list + set this staff again (to keep in sync)
      const fresh = await StaffController.getAllStaff();
      const same = fresh.find(s => s.Employee_ID === staff.Employee_ID) || null;
      setStaff(same);
      if (same) form.setFieldsValue({ ...same, startDate: same.startDate ? dayjs(same.startDate) : null });
    } catch (err) {
      console.error(err);
      message.error('เกิดข้อผิดพลาดในการอัปเดต');
    }
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

    <div style={{ marginTop: '0px', padding: '0px', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'auto', }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
        <Col>
          <Title level={1}>{staff.title} {staff.firstName} {staff.lastName}</Title>
        </Col>
        <Col>
          {!isEditing && (
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
                // onConfirm={handleDeleteStaff}
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

        </Col>
      </Row>


      <Card
        // title={isEditing ? `แก้ไขข้อมูล: ${staff.Title} ${staff.firstName} ${staff.lastName}` : `${staff.Title} ${staff.firstName} ${staff.lastName}`}
        style={{
          marginTop: '0px',    // ห่างด้านบน
          marginBottom: '20px', // ห่างด้านล่าง
          padding: '1px', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'auto', maxHeight: '80vh'
        }}


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

      <Button onClick={() => navigate('/staff')}>ย้อนกลับ</Button>
    </div>
  );
};

export default StaffDetails;