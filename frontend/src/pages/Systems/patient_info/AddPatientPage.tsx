import "./design/pateint.css";
import Navigate from "./component_patient/header_navigate";
import React, { useEffect, useState } from "react";
import { PatientAPI } from "../../../services/patient/patientApi";
import { Patient } from "../../../interface/patient";
import { message, Form, Input, Radio, Select } from "antd";

const { Option } = Select;

const AddPatientPage: React.FC = () => {
  const [patient, setPatient] = useState<Patient>({} as Patient); //เอาไว้เก็บข้อมูลที่จะบันทึก
  const [messageApi, contextHolder] = message.useMessage(); //แสดงข้อความแจ้งเตือน
  const [submitting, setSubmitting] = useState(false); //สถานะการบันทึกข้อมูล
  const [form] = Form.useForm<Patient>(); //ฟอร์มสำหรับจัดการข้อมูล

  //send data to backend
  const handleSubmit = async (values: Patient) => {
    try {
      setSubmitting(true);
      const payload: Patient = {
        ...values,
        age: Number(values.age) || 0,
      };
      await PatientAPI.create(payload); // <<--- ใช้ payload
      messageApi.success("บันทึกสำเร็จ");
      form.resetFields();
    } catch (error) {
      console.error(error);
      messageApi.error("บันทึกไม่สำเร็จ");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="wrapper">
      {contextHolder}
      <h2 style={{ fontWeight: "600" }}>ข้อมูลประจำตัว</h2>

      <Form
        form={form}
        layout="vertical"
        style={{ paddingLeft: "3rem" }}
        onFinish={handleSubmit}
        initialValues={{
          citizenID: "",
          prefix: "",
          firstname: "",
          lastname: "",
          nickname: "",
          congenitadisease: "",
          blood_type: "",
          gender: "",
          birthday: "", // ถ้าอยากใช้ DatePicker ให้เปลี่ยน type เป็น dayjs แล้วใส่ dayjs()
          phonenumber: "",
          age: 0,
          drugallergy: "",
        }}
      >
        <div>
          <div className="row1">
            {/* <div>
            <Form.Item
              name="patientID"
              label="รหัสคนไข้"
              rules={[{ required: false, message: "กรุณากรอกรหัสคนไข้" }]}
            >
              <Input placeholder="รหัสคนไข้"></Input>
            </Form.Item>
          </div> */}

            <div>
              <Form.Item
                name="citizenID"
                label="เลขบัตรประชาชน"
                rules={[
                  { required: false, message: "กรุณากรอกเลขบัตรประชาชน" },
                ]}
              >
                <Input placeholder="เลขบัตรประชาชน"></Input>
              </Form.Item>
            </div>

            <Form.Item
              label="เพศ"
              name="gender"
              rules={[{ required: true, message: "กรุณาเลือกเพศ" }]}
            >
              <Radio.Group className="gender-options">
                <Radio value="male">ชาย</Radio>
                <Radio value="female">หญิง</Radio>
              </Radio.Group>
            </Form.Item>
          </div>

          <div className="row2">
            <div>
              <Form.Item
                name="prefix"
                label="คำนำหน้า"
                rules={[{ required: false, message: "กรุณากรอกคำนำหน้า" }]}
              >
                {/* อย่าลืมเปลี่ยน value ใน Option เป็น value ที่ตรงกับฐานข้อมูล */}

                <Select placeholder="เลือกคำนำหน้า">
                  <Option value="นาย">นาย</Option>
                  <Option value="นางสาว">นางสาว</Option>
                  <Option value="นาง">นาง</Option>
                </Select>
              </Form.Item>
            </div>

            <div>
              <Form.Item
                name="firstname"
                label="ชื่อ"
                rules={[{ required: false, message: "กรุณากรอกชื่อ" }]}
              >
                <Input placeholder="ชื่อ"></Input>
              </Form.Item>
            </div>

            <div>
              <Form.Item
                name="lastname"
                label="นามสกุล"
                rules={[{ required: false, message: "กรุณากรอกนามสกุล" }]}
              >
                <Input placeholder="นามสกุล"></Input>
              </Form.Item>
            </div>

            <div>
              <Form.Item
                name="nickname"
                label="ชื่อเล่น"
                rules={[{ required: false, message: "กรุณากรอกชื่อเล่น" }]}
              >
                <Input placeholder="ชื่อเล่น"></Input>
              </Form.Item>
            </div>
          </div>

          <div className="row3">
            <div>
              <div>วันเกิด</div>
              <input
                className="inputbox"
                type="date"
                id="birthdate"
                name="birthdate"
              />
            </div>

            <div>
              <div>อายุ (ปี)</div>
              <input className="inputbox" type="text" id="age" name="age" />
            </div>

            <div>
              <Form.Item
                name="underlying_disease"
                label="โรคประจำตัว"
                rules={[{ required: false, message: "กรุณากรอกโรคประจำตัว" }]}
              >
                <Input placeholder="โรคประจำตัว"></Input>
              </Form.Item>
            </div>

            <div>
              <div>
                <Form.Item
                  name="blood_type"
                  label="หมู่เลือด"
                  rules={[{ required: false, message: "กรุณากรอกหมู่เลือด" }]}
                >
                  <Select placeholder="เลือกหมู่เลือด">
                    <Option value="A">A</Option>
                    <Option value="B">B</Option>
                    <Option value="AB">AB</Option>
                    <Option value="O">O</Option>
                    <Option value="none">ไม่ทราบ</Option>
                  </Select>
                </Form.Item>
              </div>
            </div>

            <div>
              <Form.Item
                name="phonenumber"
                label="หมายเลขโทรศัพท์"
                rules={[{ required: false }]}
              >
                <Input placeholder="หมายเลขโทรศัพท์"></Input>
              </Form.Item>
            </div>
          </div>

          <div className="row5">
            <div>
              <span
                style={{
                  fontWeight: "700",
                  width: "100px",
                  marginRight: "3rem",
                  fontSize: "16px",
                }}
              >
                แพ้ยา
              </span>
              <input type="radio" id="drug_allergy" name="drug_allergy" />
              <span className="drug-allergy-text">แพ้ยา</span>
              <input
                className="drug-allergy-input"
                type="text"
                id="drug_allergy"
                name="drug_allergy"
              />
              <input type="radio" id="no_drug_allergy" name="no_drug_allergy" />
              <label>ปฏิเสธการแพ้ยา</label>
            </div>
          </div>

          <div className="row7">
            <div>
              <span
                style={{ width: "80px", fontWeight: "700", fontSize: "16px" }}
              >
                ผู้ที่ติดต่อได้
              </span>
              <div style={{ display: "flex", gap: "1rem" }}>
                <Form.Item
                  name="relationship"
                  label="ความสัมพันธ์"
                  rules={[{ required: false }]}
                  style={{ flex: 1 }}
                >
                  <Input placeholder="ความสัมพันธ์" />
                </Form.Item>

                <Form.Item
                  name="phonenumber_emergency"
                  label="หมายเลขโทรศัพท์"
                  rules={[{ required: false }]}
                  style={{ flex: 1 }}
                >
                  <Input placeholder="หมายเลขโทรศัพท์" />
                </Form.Item>
              </div>
            </div>
          </div>

          <div style={{ width: "80px", fontWeight: "700", fontSize: "16px" }}>
            ที่อยู่
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <Form.Item
              name="housenumber"
              label="เลขที่"
              rules={[{ required: false }]}
            >
              <Input placeholder="เลขที่"></Input>
            </Form.Item>

            <Form.Item name="moo" label="หมู่ที่" rules={[{ required: false }]}>
              <Input placeholder="หมู่ที่"></Input>
            </Form.Item>

            <div>
              <Form.Item
                name="subdistrict"
                label="ตำบล/แขวง"
                rules={[{ required: false }]}
              >
                <Input placeholder="ตำบล/แขวง"></Input>
              </Form.Item>
            </div>

            <div>
              <Form.Item
                name="district"
                label="อำเภอ/เขต"
                rules={[{ required: false }]}
              >
                <Input placeholder="อำเภอ/เขต"></Input>
              </Form.Item>
            </div>

            <div>
              <Form.Item
                name="province"
                label="จังหวัด"
                rules={[{ required: false }]}
              >
                <Input placeholder="จังหวัด"></Input>
              </Form.Item>
            </div>

            <div>
              <Form.Item
                name="postalcode"
                label="รหัสไปรษณีย์"
                rules={[{ required: false }]}
              >
                <Input placeholder="รหัสไปรษณีย์"></Input>
              </Form.Item>
            </div>
          </div>
        </div>
        <div className="button">
          <button
            type="button"
            className="save-button"
            onClick={() => form.submit()}
          >
            บันทึก
          </button>

          <button
            type="button"
            className="cancel-button"
            onClick={() => {
              window.location.href = "/admin/patient";
            }}
          >
            ยกเลิก
          </button>
        </div>
      </Form>
    </div>
  );
};

export default AddPatientPage;
