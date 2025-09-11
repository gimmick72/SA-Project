// InitialPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Spin,
} from "antd";
import dayjs from "dayjs";

import type { InitialSymtoms } from "../../../interface/initailPatient/initailSym";
import {
  PatientAPI,
  ServiceToSymtomsAPI,
  PatientSymptomsAPI,
} from "../../../services/patient/patientApi";
import { splitToDateAndTime } from "./utils/dateTime";
import { useSyncDateTime } from "../../../hooks/syncDateTime";

const { Title } = Typography;

// ✅ sleep ฟังก์ชันทำงานจริง
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const InitialPage: React.FC = () => {
  const [symptomsForm] = Form.useForm<InitialSymtoms>();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [serviceOptions, setServiceOptions] = useState<
    { label: string; value: number }[]
  >([]);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // ✅ รวม date+time → visit (local RFC3339) อัตโนมัติ
  useSyncDateTime(symptomsForm, "visitDateOnly", "visitTimeOnly", "visit");

  useEffect(() => {
    if (!id) return;

    const run = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchPatient(), fetchService()]);
      } finally {
        setLoading(false);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchPatient = async () => {
    try {
      const resp = await PatientAPI.getByID(Number(id));
      const data = resp?.data ?? resp ?? {};

      // แตก visit เดิมให้ช่องวันที่/เวลาแยกแสดง
      const v = data.visit ?? data.visitDate ?? data.Visit ?? data.visit_date;
      const { dateOnly, timeOnly } = splitToDateAndTime(v);

      symptomsForm.setFieldsValue({
        ...data,
        visitDateOnly: dateOnly,
        visitTimeOnly: timeOnly,
      });
    } catch (e) {
      console.error(e);
      messageApi.error("ไม่มีข้อมูลคนไข้");
    }
  };

  const fetchService = async () => {
    try {
      const res = await ServiceToSymtomsAPI.getService(); // GET /api/services
      const rows =
        (Array.isArray(res) && res) || (Array.isArray(res?.data) && res.data) || [];
      setServiceOptions(
        rows.map((s: any) => ({
          value: Number(s.ID ?? s.id),
          label: s.NameService ?? s.name ?? "",
        }))
      );
    } catch (e) {
      console.error(e);
      messageApi.error("ไม่มีบริการ");
    }
  };

  const onFinish = async (values: any) => {
    const key = "saving-symptom";
    try {
      setSubmitting(true);

      // แสดงกำลังบันทึก (ผูกกับ contextHolder ได้)
      messageApi.open({
        key,
        type: "loading",
        content: "กำลังบันทึกข้อมูลอาการ...",
        duration: 0,
      });

      await PatientSymptomsAPI.createSymtom(id!, values);

      // ปิด/ทำลาย loading เดิมก่อน
      messageApi.destroy(key);

      // ✅ แสดง "บันทึกสำเร็จ" ด้วย global message (ไม่ผูกกับเพจนี้)
      message.success({
        content: "บันทึกข้อมูลเรียบร้อย",
        duration: 1.5,
      });

      // 🔔 แจ้งให้หน้า HomePage รีเฟรชข้อมูล
      window.dispatchEvent(new Event("visit:changed"));

      // 👉 เปลี่ยนหน้า “ทันที” หลังเฟรมถัดไป (ไม่หน่วงให้ผู้ใช้รู้สึก)
      requestAnimationFrame(() => {
        navigate("/admin/patient");
        // หรือ navigate(`/admin/patient/patient-history/${id}`);
      });
    } catch (e: any) {
      console.error(e);
      const msg = e?.response?.data?.error || e?.message || "บันทึกไม่สำเร็จ";
      // ใช้ instance เดิมก็ได้เพราะเรายังอยู่หน้านี้
      messageApi.open({
        key,
        type: "error",
        content: msg,
        duration: 2,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="wrapper">
      {contextHolder}

      <Spin fullscreen spinning={submitting} />

      <div className="header">
        <Title level={3}>อาการเบื้องต้น</Title>
      </div>

      <div style={{ paddingLeft: "3rem", paddingRight: "3rem" }}>
        <Spin spinning={loading}>
          <Form
            form={symptomsForm}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{}}
            disabled={submitting}
          >
            {/* ----------------------- */}
            {/* แถวที่ 1: ข้อมูลคนไข้ */}
            <Row gutter={[24, 12]}>
              <Col md={4}>
                <Form.Item label="รหัสคนไข้">
                  <Input value={id} readOnly />
                </Form.Item>
              </Col>
              <Col md={5}>
                <Form.Item name="citizenID" label="เลขบัตรประชาชน">
                  <Input readOnly />
                </Form.Item>
              </Col>
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

            {/* ----------------------- */}
            {/* บริการและชีพจร / ความดัน */}
            <Row gutter={[24, 12]}>
              <Col xs={14} sm={8} md={6}>
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

            {/* ----------------------- */}
            {/* วันที่ + เวลา */}
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
                <Form.Item
                  name="height"
                  label="ส่วนสูง"
                  rules={[{ required: true, message: "กรุณากรอกส่วนสูง" }]}
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

            {/* ----------------------- */}
            {/* อาการ */}
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

            {/* ----------------------- */}
            {/* ปุ่ม */}
            <Form.Item>
              <div style={{ display: "flex", gap: 12 }}>
                <Button type="primary" htmlType="submit" loading={submitting}>
                  บันทึก
                </Button>
                <Button htmlType="button" onClick={() => window.history.back()}>
                  ยกเลิก
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Spin>
      </div>
    </div>
  );
};

export default InitialPage;
