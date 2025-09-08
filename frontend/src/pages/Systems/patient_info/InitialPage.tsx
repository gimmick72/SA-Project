import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./design/initial.css";

import { Typography, Form, Input, DatePicker, InputNumber, Button, Row, Col, message } from "antd";
import type { InitialSymtoms} from "../../../interface/initailPatient/initailSym";
import { PatientAPI } from "../../../services/patient/patientApi";
import { set } from "date-fns";

const { Title } = Typography;

const InitialPage: React.FC = () => {
  const [symptomsForm] = Form.useForm<InitialSymtoms>();
  const [messageApi, contextHolder] = message.useMessage();
  const [submitting, setSubmitting] = React.useState(false);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    fetchPatient();
  }, []);

  const fetchPatient = async () => {
    try {
      setLoading(true);
      const response = await PatientAPI.getByID(Number(id));
      symptomsForm.setFieldsValue(response.data || response);
    } catch {
      console.error();
      messageApi.error("ไม่สามารถแสดงคนไข้ได้");
    } finally {
      setLoading(false);
    }
  }

 
  const onFinish = (values: any) => {
    // TODO: ส่งค่าไป API ตามที่ต้องการ
    console.log("FORM VALUES:", values);
  };

  return (
    <div className="wrapper">
      <div className="header">
        <Title level={3}>อาการเบื้องต้น</Title>
      </div>

      <div style={{ paddingLeft: "3rem", paddingRight: "3rem" }}>
     
        <Form form={symptomsForm} layout="vertical" onFinish={onFinish}>
          {/* แถวที่ 1 */}
          <Row gutter={[24, 12]}>
            <Col xs={20} sm={10} md={6}>
              <Form.Item name="patientID" label="รหัสคนไข้">
                <Input disabled></Input>
              </Form.Item>
            </Col>
            <Col xs={20} sm={10} md={6}>
              <Form.Item
                name="citizenID"
                label="เลขบัตรประชาชน"
              >
                <Input disabled></Input>
              </Form.Item>
            </Col>
          </Row>

          {/* ข้อมูลส่วนตัว */}
          <Row gutter={[24, 12]}>
            <Col xs={24} sm={6} md={4}>
              <Form.Item name="prefix" label="คำนำหน้า">
                <Input disabled></Input>
              </Form.Item>
            </Col>
            <Col xs={20} sm={10} md={6}>
              <Form.Item name="firstname" label="ชื่อ" >
                <Input disabled></Input>
              </Form.Item>
            </Col>
            <Col xs={20} sm={10} md={6}>
              <Form.Item name="lastname" label="นามสกุล">
                <Input disabled></Input>
              </Form.Item>
            </Col>
            <Col xs={24} sm={6} md={4}>
              <Form.Item name="nickname" label="ชื่อเล่น">
                <Input disabled></Input>
              </Form.Item>
            </Col>
          </Row>

          {/* บริการและชีพจร */}
          <Row gutter={[24, 12]}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="service" label="บริการทันตกรรม">
                <Input placeholder="เช่น อุดฟัน ขูดหินปูน ถอนฟัน" allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="heartRate"
                label="อัตราการเต้นหัวใจ (ครั้ง/นาที)"
                rules={[
                  { type: "number", min: 30, max: 220, transform: (v) => (v === "" ? undefined : Number(v)) },
                ]}
              >
                <InputNumber style={{ width: "100%" }} placeholder="เช่น 72" />
              </Form.Item>
            </Col>
          </Row>

          {/* วันที่และความดัน */}
          <Row gutter={[24, 12]}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="visitDate" label="วันที่เข้ารับบริการ" rules={[{ required: true, message: "เลือกวันและเวลา" }]}>
                <DatePicker showTime style={{ width: "100%" }} placeholder="เลือกวันและเวลา" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="bloodPressure" label="ความดัน (mmHg) เช่น 120/80">
                <Input placeholder="เช่น 120/80" allowClear />
              </Form.Item>
            </Col>
          </Row>

          {/* อาการเบื้องต้น */}
          <Row gutter={[24, 12]}>
            <Col xs={24} md={16}>
              <Form.Item name="initialSymptoms" label="อาการ">
                <Input.TextArea rows={3} placeholder="เช่น ปวดฟันซี่ล่างขวา เสียวฟัน เวลาทานของเย็น" />
              </Form.Item>
            </Col>
          </Row>

          {/* ปุ่มบันทึก/ยกเลิก */}
          <Form.Item>
            <div className="button-contact" style={{ display: "flex", gap: 12 }}>
              <Button type="primary" htmlType="submit" className="save-button">
                บันทึก
              </Button>
              <Button htmlType="button" className="cancel-button" onClick={() => window.history.back()}>
                ยกเลิก
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default InitialPage;

