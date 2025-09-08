//Send Ok โหลด ข้อมูล OK

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./design/initial.css";

import {
  Typography,
  Form,
  Input,
  DatePicker,
  TimePicker,
  InputNumber,
  Button,
  Row,
  Col,
  message,
  Select,
} from "antd";
import dayjs from "dayjs";

import type { InitialSymtoms } from "../../../interface/initailPatient/initailSym";
import {
  PatientAPI,
  ServiceToSymtomsAPI,
  PatientSymptomsAPI,
} from "../../../services/patient/patientApi";
import { splitToDateAndTime } from "../../../utils/dateTime";
import { useSyncDateTime } from "../../hooks/syncDateTime";

const { Title } = Typography;

const InitialPage: React.FC = () => {
  const [symptomsForm] = Form.useForm<InitialSymtoms>();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(true);
  const [serviceOptions, setServiceOptions] = useState<
    { label: string; value: number }[]
  >([]);
  const { id } = useParams<{ id: string }>();

  // ✅ รวม date+time → visit (local RFC3339) อัตโนมัติ
  useSyncDateTime(symptomsForm, "visitDateOnly", "visitTimeOnly", "visit");

  useEffect(() => {
    if (!id) return;
    fetchPatient();
    fetchService();
  }, [id]);

  const fetchPatient = async () => {
    try {
      setLoading(true);
      const resp = await PatientAPI.getByID(Number(id));
      const data = resp?.data ?? resp ?? {};

      // แตก visit เดิมให้ช่องวันที่/เวลาแยกแสดง
      const v = data.visit ?? data.visitDate ?? data.Visit ?? data.visit_date;
      const { dateOnly, timeOnly } = splitToDateAndTime(v);

      symptomsForm.setFieldsValue({
        ...data,
        patientID: Number(id), // ✅ ให้ส่งไปกับฟอร์มด้วย
        visitDateOnly: dateOnly,
        visitTimeOnly: timeOnly,
        // visit: ให้ hook คำนวณเองเมื่อมี date/time
      });
    } catch (e) {
      console.error(e);
      messageApi.error("ไม่มีข้อมูลคนไข้");
    } finally {
      setLoading(false);
    }
  };

  const fetchService = async () => {
    try {
      setLoading(true);
      const res = await ServiceToSymtomsAPI.getService(); // GET /api/services
      const rows = Array.isArray(res) ? res : res?.data ?? [];
      setServiceOptions(
        rows.map((s: any) => ({
          value: Number(s.ID),
          label: s.NameService ?? "",
        }))
      );
    } catch (e) {
      console.error(e);
      messageApi.error("ไม่มีบริการ");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    try {
      // ✅ ส่งค่าตรง ๆ ได้เลย เพราะชื่อฟิลด์ตรงกับ BE แล้ว
      await PatientSymptomsAPI.createSymtom(id!, values);
      messageApi.success("บันทึกอาการแล้ว");
    } catch (e) {
      console.error(e);
      messageApi.error("บันทึกไม่สำเร็จ");
    }
  };

  return (
    <div className="wrapper">
      {contextHolder}
      <div className="header">
        <Title level={3}>อาการเบื้องต้น</Title>
      </div>

      <div style={{ paddingLeft: "3rem", paddingRight: "3rem" }}>
        <Form
          form={symptomsForm}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            ID: id ? Number(id) : undefined,
            patientID: id ? Number(id) : undefined,
          }}
        >
          {/* แถวที่ 1: แสดงข้อมูลคนไข้ */}
          <Row gutter={[24, 12]}>
            <Col md={4}>
              <Form.Item name="ID" label="รหัสคนไข้">
                <Input readOnly />
              </Form.Item>
            </Col>
            <Col md={5}>
              <Form.Item name="citizenID" label="เลขบัตรประชาชน">
                <Input readOnly />
              </Form.Item>
            </Col>

            {/* ข้อมูลประจำตัว */}
            <Col md={3}>
              <Form.Item name="prefix" label="คำนำหน้า">
                <Input readOnly />
              </Form.Item>
            </Col>
            <Col md={4}>
              <Form.Item name="firstname" label="ชื่อ">
                <Input readOnly />
              </Form.Item>
            </Col>
            <Col md={4}>
              <Form.Item name="lastname" label="นามสกุล">
                <Input readOnly />
              </Form.Item>
            </Col>
            <Col md={4}>
              <Form.Item name="nickname" label="ชื่อเล่น">
                <Input readOnly />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="patientID" hidden>
            <Input type="hidden" />
          </Form.Item>

          {/* บริการและชีพจร / ความดัน */}
          <Row gutter={[24, 12]}>
            <Col xs={14} sm={8} md={6}>
              {/* ✅ ชื่อฟิลด์ให้ตรง BE: serviceID */}
              <Form.Item
                name="serviceID"
                label="บริการทันตกรรม"
                rules={[{ required: true, message: "กรุณาเลือกบริการ" }]}
              >
                <Select
                  placeholder="เลือกบริการทันตกรรม"
                  options={serviceOptions}
                  optionFilterProp="label"
                  showSearch
                />
              </Form.Item>
            </Col>

            <Col xs={14} sm={8} md={5}>
              {/* ✅ ชื่อฟิลด์ให้ตรง BE: heartrate (เป็น string) */}
              <Form.Item name="heartrate" label="Heart Rate">
                <Input placeholder="ครั้ง/นาที" />
              </Form.Item>
            </Col>

            <Col xs={14} sm={8} md={5}>
              <Form.Item name="systolic" label="Systolic">
                <InputNumber style={{ width: "100%" }} placeholder="mmHg" />
              </Form.Item>
            </Col>

            <Col xs={14} sm={8} md={5}>
              <Form.Item name="diastolic" label="Diastolic">
                <InputNumber style={{ width: "100%" }} placeholder="mmHg" />
              </Form.Item>
            </Col>
          </Row>

          {/* วันที่ + เวลา (แยกช่อง) */}
          <Row gutter={[24, 12]}>
            <Col md={3}>
              <Form.Item
                name="weight"
                label="น้ำหนัก"
                rules={[{ required: true, message: "กรุณากรอกน้ำหนัก" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="kg"
                  min={0}
                />
              </Form.Item>
            </Col>

            <Col md={3}>
              {/* ✅ hight -> height */}
              <Form.Item
                name="height"
                label="ส่วนสูง"
                rules={[{ required: true }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="เซนติเมตร"
                  min={0}
                />
              </Form.Item>
            </Col>

            <Col xs={14} sm={8} md={5}>
              <Form.Item
                name="visitDateOnly"
                label="วันที่เข้ารับบริการ"
                rules={[{ required: true, message: "เลือกวันที่" }]}
                getValueProps={(v) => ({ value: v ? dayjs(v) : v })}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="เลือกวันที่"
                />
              </Form.Item>
            </Col>

            <Col xs={14} sm={8} md={5}>
              <Form.Item
                name="visitTimeOnly"
                label="เวลาเข้ารับบริการ"
                rules={[{ required: true, message: "เลือกเวลา" }]}
                getValueProps={(v) => ({ value: v ? dayjs(v) : v })}
              >
                <TimePicker
                  style={{ width: "100%" }}
                  placeholder="เลือกเวลา"
                  format="HH:mm"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="visit" hidden>
            <Input type="hidden" />
          </Form.Item>

          {/* อาการเบื้องต้น (ชื่อตรง BE: symptomps) */}
          <Row gutter={[24, 12]}>
            <Col xs={24} md={16}>
              <Form.Item name="symptomps" label="อาการ">
                <Input.TextArea
                  rows={3}
                  placeholder="เช่น ปวดฟันซี่ล่างขวา เสียวฟัน เวลาทานของเย็น"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <div style={{ display: "flex", gap: 12 }}>
              <Button type="primary" htmlType="submit">
                บันทึก
              </Button>
              <Button htmlType="button" onClick={() => window.history.back()}>
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
