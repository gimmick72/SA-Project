//Okay but ยังไม่ได้จตรวจสอบดีๆ

import "../patient_info/design/pateint.css";
import React, { useState } from "react";
import { createPatient, CreatePatientPayload } from "../../../services/Patient/patient";
import type { Patient } from "../../../services/Patient/patient";
import {
  message,
  Form,
  Input,
  Radio,
  Select,
  DatePicker,
  InputNumber,
  Col,
  Row,
  Space,
  Card,
} from "antd";
import dayjs from "dayjs";
import type { DateOnly } from "../../../utils/calDate";

const { Option } = Select;

const AddPatientPage: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm<Patient>();

  const handleSubmit = async (
    patient: Patient & { drugAllergyType?: "hasAllergy" | "noAllergy" }
  ) => {
    try {
      setSubmitting(true);

      const DataOnly = patient.birthday
        ? dayjs(patient.birthday).startOf("day").format("YYYY-MM-DDTHH:mm:ssZ")
        : "";

      if (patient.drugAllergyType === "noAllergy") {
        patient.drug_allergy = "none";
      }
      delete (patient as any).drugAllergyType;

      console.log("[handleSubmit] values:", patient);

      await PatientAPI.createPatient(patient);
      messageApi.success("บันทึกข้อมูลสำเร็จ");
      form.resetFields();
    } catch (error: any) {
      console.error("Error submitting form:", error);
      messageApi.error(
        error?.response?.data?.error ||
          error?.response?.data?.details ||
          error?.message ||
          "เกิดข้อผิดพลาดในการบันทึกข้อมูล"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-shell">
      <div className="form-scroll">
        <div className="wrapper">
          {contextHolder}
          <h2 style={{ fontWeight: 600 }}>ข้อมูลประจำตัว</h2>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            onValuesChange={(changed) => {
              if ("birthday" in changed) {
                const d = changed.birthday as any;
                form.setFieldsValue({
                  age: d ? dayjs().diff(d, "year") : undefined,
                });
              }
            }}
            initialValues={{
              citizenID: "",
              prefix: "",
              firstname: "",
              lastname: "",
              nickname: "",
              congenitadisease: "",
              blood_type: "",
              gender: "",
              birthday: null,
              phone_number: "",
              age: 0,
              drug_allergy: "",
              drugAllergyType: "noAllergy",
              contactperson: {
                relationship: "",
                emergency_phone: "",
              },
              address: {
                house_number: "", // ✅ ใช้ house_number
                moo: "",
                subdistrict: "",
                district: "",
                province: "",
                postcode: "",
              },
            }}
          >
            {/* แถวชื่อ-สกุล-เลขบัตร */}
            <Row gutter={[16, 8]}>
              <Col xs={18} sm={12} md={8} lg={6} xl={4}>
                <Form.Item
                  name="citizenID"
                  label="เลขบัตรประชาชน"
                  rules={[
                    { required: true, message: "กรุณากรอกเลขบัตรประชาชน" },
                    { len: 13, message: "เลขบัตรประชาชนต้องมี 13 หลัก" },
                  ]}
                >
                  <Input
                    placeholder="เลขบัตรประชาชน"
                    maxLength={13}
                    onChange={(e) => {
                      // รับเฉพาะตัวเลข
                      const value = e.target.value.replace(/\D/g, "");
                      form.setFieldsValue({ citizenID: value });
                    }}
                  />
                </Form.Item>
              </Col>

              <Col xs={18} sm={8} md={6} lg={4} xl={3}>
                <Form.Item
                  name="prefix"
                  label="คำนำหน้า"
                  rules={[{ required: true, message: "กรุณาเลือกคำนำหน้า" }]}
                >
                  <Select placeholder="เลือกคำนำหน้า">
                    <Option value="นาย">นาย</Option>
                    <Option value="นางสาว">นางสาว</Option>
                    <Option value="นาง">นาง</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={18} sm={12} md={8} lg={6} xl={4}>
                <Form.Item
                  name="firstname"
                  label="ชื่อ"
                  rules={[{ required: true, message: "กรุณากรอกชื่อ" }]}
                >
                  <Input placeholder="ชื่อ" />
                </Form.Item>
              </Col>

              <Col xs={18} sm={12} md={8} lg={6} xl={4}>
                <Form.Item
                  name="lastname"
                  label="นามสกุล"
                  rules={[{ required: true, message: "กรุณากรอกนามสกุล" }]}
                >
                  <Input placeholder="นามสกุล" />
                </Form.Item>
              </Col>

              <Col xs={18} sm={12} md={8} lg={6} xl={4}>
                <Form.Item name="nickname" label="ชื่อเล่น">
                  <Input placeholder="ชื่อเล่น" />
                </Form.Item>
              </Col>
            </Row>

            {/* แถว เพศ / วันเกิด / อายุ / โรคประจำตัว / หมู่เลือด / โทรศัพท์ */}
            <Row gutter={[16, 8]}>
              <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                <div
                  id="gender_label"
                  style={{ marginBottom: 4, fontWeight: 500 }}
                >
                  เพศ
                </div>
                <Form.Item
                  name="gender"
                  rules={[{ required: true, message: "กรุณาเลือกเพศ" }]}
                >
                  <Radio.Group aria-labelledby="gender_label">
                    <Radio value="male">ชาย</Radio>
                    <Radio value="female">หญิง</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>

              <Col xs={18} sm={12} md={8} lg={6} xl={4}>
                <Form.Item
                  name="birthday"
                  label="วันเกิด"
                  rules={[{ required: true, message: "กรุณาเลือกวันเกิด" }]}
                >
                  <DatePicker
                    //data อาจจะต้องแก้ ดูก่อน
                    format="YYYY-MM-DD"
                    style={{ width: "100%" }}
                    disabledDate={(current) =>
                      current && current > dayjs().endOf("day")
                    }
                  />
                </Form.Item>
              </Col>

              <Col xs={16} sm={6} md={4} lg={3} xl={2}>
                <Form.Item
                  name="age"
                  label="อายุ (ปี)"
                  rules={[
                    {
                      type: "number",
                      min: 0,
                      message: "อายุต้องเป็นตัวเลขไม่ติดลบ",
                    },
                  ]}
                >
                  <InputNumber style={{ width: "100%" }} disabled />
                </Form.Item>
              </Col>

              <Col xs={18} sm={12} md={8} lg={6} xl={4}>
                <Form.Item name="congenitadisease" label="โรคประจำตัว">
                  <Input placeholder="โรคประจำตัว" />
                </Form.Item>
              </Col>

              <Col xs={16} sm={10} md={7} lg={5} xl={3}>
                <Form.Item name="blood_type" label="หมู่เลือด">
                  <Select placeholder="เลือกหมู่เลือด">
                    <Option value="A">A</Option>
                    <Option value="B">B</Option>
                    <Option value="AB">AB</Option>
                    <Option value="O">O</Option>
                    <Option value="none">ไม่ทราบ</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={18} sm={12} md={8} lg={6} xl={4}>
                <Form.Item
                  name="phone_number"
                  label="หมายเลขโทรศัพท์"
                  rules={[
                    { required: true, message: "กรุณากรอกหมายเลขโทรศัพท์" },
                    {
                      pattern: /^[0-9]{10}$/,
                      message: "หมายเลขโทรศัพท์ต้องมี 10 หลัก",
                    },
                  ]}
                >
                  <Input
                    placeholder="หมายเลขโทรศัพท์"
                    maxLength={10}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      form.setFieldsValue({ phone_number: value });
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* แถบแพ้ยา */}
            <Form.Item label="แพ้ยา" colon={false} style={{ marginBottom: 8 }}>
              <Space align="center" wrap>
                {/* เลือกแพ้/ไม่แพ้ */}
                <Form.Item name="drugAllergyType" noStyle>
                  <Radio.Group
                    onChange={({ target }) => {
                      if (target.value === "noAllergy") {
                        form.setFieldsValue({ drug_allergy: "" });
                      }
                    }}
                  >
                    <Radio value="noAllergy" style={{ marginRight: 16 }}>
                      ปฏิเสธการแพ้ยา
                    </Radio>
                    <Radio value="hasAllergy">แพ้ยา</Radio>
                  </Radio.Group>
                </Form.Item>

                {/* ช่องกรอกชื่อยาอยู่ชิดต่อท้าย Radio */}
                <Form.Item
                  noStyle
                  shouldUpdate={(prev, cur) =>
                    prev.drugAllergyType !== cur.drugAllergyType
                  }
                >
                  {({ getFieldValue }) => {
                    const disabled =
                      getFieldValue("drugAllergyType") !== "hasAllergy";
                    return (
                      <Form.Item
                        name="drug_allergy"
                        noStyle
                        rules={[
                          () => ({
                            validator(_, value) {
                              if (
                                getFieldValue("drugAllergyType") ===
                                  "hasAllergy" &&
                                !value
                              ) {
                                return Promise.reject("กรุณากรอกชื่อยาที่แพ้");
                              }
                              return Promise.resolve();
                            },
                          }),
                        ]}
                      >
                        <Input
                          placeholder="ชื่อยาที่แพ้ (เช่น เพนิซิลลิน)"
                          disabled={disabled}
                          style={{ width: 260 }} // ปรับความกว้างตามใจ
                        />
                      </Form.Item>
                    );
                  }}
                </Form.Item>
              </Space>
            </Form.Item>

            {/* ผู้ที่ติดต่อได้ */}
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
              ผู้ที่ติดต่อได้
            </div>
            <Row gutter={[16, 8]}>
              <Col xs={10} sm={5}>
                <Form.Item
                  name={["contactperson", "relationship"]}
                  label="ความสัมพันธ์"
                >
                  <Input placeholder="ความสัมพันธ์" />
                </Form.Item>
              </Col>
              <Col xs={10} sm={5}>
                <Form.Item
                  name={["contactperson", "emergency_phone"]}
                  label="หมายเลขโทรศัพท์"
                >
                  <Input
                    placeholder="หมายเลขโทรศัพท์"
                    maxLength={10}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      form.setFieldsValue({
                        contactperson: {
                          ...form.getFieldValue("contactperson"),
                          emergency_phone: value, // merge ไม่ทับ field อื่น
                        },
                      });
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* ที่อยู่ */}
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
              ที่อยู่
            </div>
            <Row gutter={[16, 8]} align="top" wrap>
              <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                <Form.Item name={["address", "house_number"]} label="เลขที่">
                  <Input placeholder="เลขที่" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8} lg={6} xl={3}>
                <Form.Item name={["address", "moo"]} label="หมู่ที่">
                  <Input placeholder="หมู่ที่" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                <Form.Item name={["address", "subdistrict"]} label="ตำบล/แขวง">
                  <Input placeholder="ตำบล/แขวง" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                <Form.Item name={["address", "district"]} label="อำเภอ/เขต">
                  <Input placeholder="อำเภอ/เขต" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                <Form.Item name={["address", "province"]} label="จังหวัด">
                  <Input placeholder="จังหวัด" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8} lg={6} xl={3}>
                <Form.Item
                  name={["address", "postcode"]}
                  label="รหัสไปรษณีย์"
                  rules={[
                    {
                      pattern: /^[0-9]{5}$/,
                      message: "รหัสไปรษณีย์ต้องมี 5 หลัก",
                    },
                  ]}
                >
                  <Input
                    placeholder="รหัสไปรษณีย์"
                    maxLength={5}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      form.setFieldsValue({
                        address: {
                          ...form.getFieldValue("address"),
                          postcode: value, // merge ไม่ทับ field อื่น
                        },
                      });
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* ปุ่ม */}
            <div className="buttons">
              <button
                type="submit"
                className="save-button"
                disabled={submitting}
              >
                {submitting ? "กำลังบันทึก..." : "บันทึก"}
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => (window.location.href = "/admin/patient")}
              >
                ยกเลิก
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AddPatientPage;
