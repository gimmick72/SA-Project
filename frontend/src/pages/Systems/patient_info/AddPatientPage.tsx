import "../patient_info/design/pateint.css";
import React, { useState } from "react";
import { PatientAPI } from "../../../services/patient/patientApi";
import { Patient } from "../../../interface/patient";
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
} from "antd";
import dayjs from "dayjs";

const { Option } = Select;

const AddPatientPage: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm<Patient>();

  const handleSubmit = async (values: Patient) => {
    console.log("[onFinish] raw values:", values);
    try {
      setSubmitting(true);

      const payload: Patient = {
        ...values,
        age: Number(values.age) || 0,
        birthday: values.birthday
          ? dayjs(values.birthday as any).format("YYYY-MM-DD")
          : "",
      };

      // ถ้า PatientAPI.create() คืน data เฉย ๆ ไม่ต้องเช็ค res.status
      await PatientAPI.create(payload);

      messageApi.success("บันทึกสำเร็จ");
      form.resetFields();
    } catch (err: any) {
      // รองรับ AxiosError และเคสอื่น ๆ
      const msg =
        err?.response?.data?.message || err?.message || "บันทึกไม่สำเร็จ";
      console.error(err);
      messageApi.error(msg);
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
                const d = changed.birthday as any; // Dayjs | null
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
              birthday: null, // ใช้ null สำหรับ DatePicker (ไม่ใช่ "")
              phonenumber: "",
              age: 0,
              drugallergy: "",
              relationship: "",
              phonenumber_emergency: "",
              housenumber: "",
              moo: "",
              subdistrict: "",
              district: "",
              province: "",
              postalcode: "",
            }}
          >
            {/* แถวชื่อ-สกุล-เลขบัตร */}
            <Row gutter={[16, 8]}>
              <Col xs={18} sm={12} md={8} lg={6} xl={4}>
                <Form.Item name="citizenID" label="เลขบัตรประชาชน">
                  <Input placeholder="เลขบัตรประชาชน" />
                </Form.Item>
              </Col>

              <Col xs={18} sm={8} md={6} lg={4} xl={3}>
                <Form.Item name="prefix" label="คำนำหน้า">
                  <Select placeholder="เลือกคำนำหน้า">
                    <Option value="นาย">นาย</Option>
                    <Option value="นางสาว">นางสาว</Option>
                    <Option value="นาง">นาง</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={18} sm={12} md={8} lg={6} xl={4}>
                <Form.Item name="firstname" label="ชื่อ">
                  <Input placeholder="ชื่อ" />
                </Form.Item>
              </Col>

              <Col xs={18} sm={12} md={8} lg={6} xl={4}>
                <Form.Item name="lastname" label="นามสกุล">
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
                {/* ใช้ aria-labelledby กับ Radio.Group เพื่อเลี่ยง label-for เตือน */}
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
                <Form.Item name="birthday" label="วันเกิด">
                  <DatePicker
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
                <Form.Item name="phonenumber" label="หมายเลขโทรศัพท์">
                  <Input placeholder="หมายเลขโทรศัพท์" />
                </Form.Item>
              </Col>
            </Row>

            {/* แถบแพ้ยา */}
            <Row gutter={[16, 8]}>
              <Col span={24}>
                <Row gutter={[8, 8]} align="middle" wrap>
                  <Col flex="none">
                    <div
                      id="drugAllergyType_label"
                      style={{ marginBottom: 4, fontWeight: 500 }}
                    >
                      แพ้ยา
                    </div>
                    <Form.Item
                      name="drugAllergyType"
                      initialValue="noAllergy"
                      style={{ marginBottom: 0 }}
                    >
                      <Radio.Group
                        aria-labelledby="drugAllergyType_label"
                        onChange={({ target }) => {
                          if (target.value === "noAllergy") {
                            form.setFieldsValue({ drugallergy: "" });
                          }
                        }}
                      >
                        <Radio value="noAllergy" style={{ marginRight: 16 }}>
                          ปฏิเสธการแพ้ยา
                        </Radio>
                        <Radio value="hasAllergy">แพ้ยา</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>

                  <Col xs={16} sm={10} md={7} lg={5} xl={3}>
                    <Form.Item noStyle dependencies={["drugAllergyType"]}>
                      {({ getFieldValue }) => {
                        const disabled =
                          getFieldValue("drugAllergyType") !== "hasAllergy";
                        return (
                          <Form.Item
                            name="drugallergy"
                            label="ชื่อยาที่แพ้"
                            style={{ marginBottom: 0 }}
                            rules={[
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  if (
                                    getFieldValue("drugAllergyType") ===
                                      "hasAllergy" &&
                                    !value
                                  ) {
                                    return Promise.reject(
                                      "กรุณากรอกชื่อยาที่แพ้"
                                    );
                                  }
                                  return Promise.resolve();
                                },
                              }),
                            ]}
                          >
                            <Input
                              placeholder="เช่น เพนิซิลลิน"
                              disabled={disabled}
                            />
                          </Form.Item>
                        );
                      }}
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>

            {/* ผู้ติดต่อได้ */}
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
              ผู้ที่ติดต่อได้
            </div>
            <Row gutter={[16, 8]}>
              <Col xs={18} sm={12} md={8} lg={6} xl={4}>
                <Form.Item name="relationship" label="ความสัมพันธ์">
                  <Input placeholder="ความสัมพันธ์" />
                </Form.Item>
              </Col>
              <Col xs={18} sm={12} md={8} lg={6} xl={4}>
                <Form.Item name="phonenumber_emergency" label="หมายเลขโทรศัพท์">
                  <Input placeholder="หมายเลขโทรศัพท์" />
                </Form.Item>
              </Col>
            </Row>

            {/* ที่อยู่ */}
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
              ที่อยู่
            </div>
            <Row gutter={[16, 8]}>
              <Col xs={16} sm={10} md={6} lg={4} xl={2}>
                <Form.Item name="housenumber" label="เลขที่">
                  <Input placeholder="เลขที่" />
                </Form.Item>
              </Col>
              <Col xs={16} sm={10} md={6} lg={4} xl={2}>
                <Form.Item name="moo" label="หมู่ที่">
                  <Input placeholder="หมู่ที่" />
                </Form.Item>
              </Col>
              <Col xs={18} sm={12} md={8} lg={6} xl={4}>
                <Form.Item name="subdistrict" label="ตำบล/แขวง">
                  <Input placeholder="ตำบล/แขวง" />
                </Form.Item>
              </Col>
              <Col xs={18} sm={12} md={8} lg={6} xl={4}>
                <Form.Item name="district" label="อำเภอ/เขต">
                  <Input placeholder="อำเภอ/เขต" />
                </Form.Item>
              </Col>
              <Col xs={18} sm={12} md={8} lg={6} xl={4}>
                <Form.Item name="province" label="จังหวัด">
                  <Input placeholder="จังหวัด" />
                </Form.Item>
              </Col>
              <Col xs={18} sm={12} md={8} lg={6} xl={4}>
                <Form.Item name="postalcode" label="รหัสไปรษณีย์">
                  <Input placeholder="รหัสไปรษณีย์" />
                </Form.Item>
              </Col>
            </Row>

            {/* ปุ่ม */}
            <div className="buttons">
              <button
                type="button"
                className="save-button"
                disabled={submitting}
                onClick={() => form.submit()}
              >
                บันทึก
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
