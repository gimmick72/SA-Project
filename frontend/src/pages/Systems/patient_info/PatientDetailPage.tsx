// src/pages/admin/patient/PatientDetail.tsx
import "./design/pateint.css";
import NavigateHeader from "./component_patient/header_navigate";
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  DatePicker,
  Radio,
  Row,
  Col,
  Button,
  Card,
  message,
  Space,
  Select,
  Divider,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import th from "dayjs/locale/th";
import { PatientAPI } from "../../../services/patient/patientApi";
import { Patient } from "../../../interface/initailPatient/patient";

dayjs.locale(th);

/* ---------- helpers ---------- */
function toDateInputValue(v?: string | Date) {
  if (!v) return "";
  const d = new Date(v);
  if (isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const mapPatientToForm = (p: any) =>
  !p
    ? {}
    : {
        patientID: p.id ?? p.ID ?? "",
        citizenID: p.citizenID ?? "",
        gender: p.gender ?? "",
        prefix: p.prefix ?? "",
        firstname: p.firstname ?? p.firstName ?? "",
        lastname: p.lastname ?? p.lastName ?? "",
        nickname: p.nickname ?? p.nickName ?? "",
        birthdate: toDateInputValue(p.birthday),
        age: p.age ?? "",
        congenitaldisease: p.congenitaldisease ?? "",
        bloodtype: p.blood_type ?? "",
        phone_number: p.phonenumber ?? p.phone_number ?? "",
        drug_allergy: p.drugallergy ?? p.drug_allergy ?? "",
        relationship: p?.contactperson?.relationship ?? "",
        emergency_phone:
          p?.contactperson?.phoneNumber ??
          p?.contactperson?.phone ??
          p?.contactperson?.emergency_phone ??
          "",
        house_number: p?.address?.house_number ?? p?.address?.houseNumber ?? "",
        Moo: p?.address?.moo ?? "",
        subdistict: p?.address?.subdistrict ?? p?.address?.subdistict ?? "",
        distict: p?.address?.district ?? p?.address?.distict ?? "",
        province: p?.address?.province ?? "",
        postcode: p?.address?.postcode ?? p?.address?.postalCode ?? "",
      };

const calcAgeFromBirth = (yyyy_mm_dd: string): string => {
  const dob = new Date(yyyy_mm_dd);
  if (isNaN(dob.getTime())) return "";
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const hasntBirthday =
    now < new Date(now.getFullYear(), dob.getMonth(), dob.getDate());
  return String(hasntBirthday ? age - 1 : age);
};

/* ---------- Component ---------- */
const PatientDetail: React.FC = () => {
  const [form] = Form.useForm();
  const { id: idFromPath } = useParams();
  const [search, setSearch] = useSearchParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<Patient>();

  const patientId = idFromPath ?? search.get("id");
  const idNum = useMemo(() => Number(patientId), [patientId]);

  // mode: view(default) | edit
  const mode = (search.get("mode") ?? "view").toLowerCase();
  const READONLY = mode !== "edit";

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // allergy UI state: "none" | "has"
  const [allergyMode, setAllergyMode] = useState<"none" | "has">("none");

  const fetchPatientData = async (id: number) => {
    if (!Number.isFinite(id)) return;
    setLoading(true);
    try {
      const resp = await PatientAPI.getByID(id);
      const patient = resp?.data ?? resp;
      const f = mapPatientToForm(patient);
      const initial = {
        ...f,
        birthdate: f.birthdate ? dayjs(f.birthdate) : undefined,
      };

      // อัพเดทค่าในฟอร์ม
      form.setFieldsValue(initial);
      setInitialValues(patient);

      // ตั้งค่า mode แพ้ยา
      setAllergyMode(initial.drug_allergy ? "has" : "none");
    } catch (e) {
      console.error("Error fetching patient:", e);
      message.error("โหลดข้อมูลผู้ป่วยไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  // เปิดโหมดแก้ไข
  const handleEdit = () => {
    setSearch({ ...Object.fromEntries(search.entries()), mode: "edit" });
  };

  // ยกเลิกการแก้ไข
  const handleCancel = () => {
    setSearch({ ...Object.fromEntries(search.entries()), mode: "view" });
    // รีเซ็ตฟอร์มกลับเป็นค่าเดิม
    if (initialValues) {
      const f = mapPatientToForm(initialValues);
      const resetValues = {
        ...f,
        birthdate: f.birthdate ? dayjs(f.birthdate) : undefined,
      };
      form.setFieldsValue(resetValues);
      setAllergyMode(resetValues.drug_allergy ? "has" : "none");
    }
  };

  useEffect(() => {
    if (Number.isFinite(idNum)) fetchPatientData(idNum);
  }, [idNum]);

  // คำนวณอายุอัตโนมัติเมื่อเปลี่ยนวันเกิด
  const onBirthChange = (d: Dayjs | null) => {
    form.setFieldsValue({
      birthdate: d,
      age: d ? calcAgeFromBirth(d.format("YYYY-MM-DD")) : "",
    });
  };

  const onFinish = async (values: any) => {
    if (READONLY || !Number.isFinite(idNum)) return;

    // สร้าง payload โดยตรง
    const payload: Patient = {
      citizenID: values.citizenID,
      prefix: values.prefix,
      firstname: values.firstname,
      lastname: values.lastname,
      nickname: values.nickname,
      congenitaldisease: values.underlyingDisease,
      blood_type: values.bloodtype,
      gender: values.gender,
      birthday: values.birthdate
        ? (values.birthdate as Dayjs).startOf("day").toDate().toISOString()
        : undefined,
      phone_number: values.phone_number,
      age: values.age ? Number(values.age) : undefined,
      drug_allergy:
        allergyMode === "has" ? (values.drug_allergy || "").trim() : "",
      contactperson: {
        relationship: values.relationship,
        emergency_phone: values.emergency_phone,
      },
      address: {
        house_number: values.house_number,
        moo: values.Moo,
        subdistrict: values.subdistict,
        district: values.distict,
        province: values.province,
        postcode: values.postcode,
      },
    };

    try {
      setSaving(true);
      console.log("Updating patient with payload:", payload);

      const response = await PatientAPI.update(idNum, payload);
      console.log("Update response:", response);

      message.success("บันทึกสำเร็จ");

      // รีเฟรชข้อมูลหลังอัพเดท
      await fetchPatientData(idNum);

      // เปลี่ยนกลับเป็น view mode
      setSearch({ ...Object.fromEntries(search.entries()), mode: "view" });
    } catch (e: any) {
      console.error("Update error:", e);
      const errorMessage =
        e?.response?.data?.error ||
        e?.response?.data?.message ||
        e?.message ||
        "บันทึกไม่สำเร็จ";
      message.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="wrapper">
      <NavigateHeader />

      <Card
        loading={loading}
        style={{ margin: 16 }}
        bodyStyle={{ paddingTop: 8 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h2 style={{ margin: 0 }}>ข้อมูลประจำตัว</h2>
          {READONLY && (
            <Button type="primary" onClick={handleEdit}>
              แก้ไขข้อมูล
            </Button>
          )}
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          disabled={READONLY}
          requiredMark="optional"
        >
          {/* แถว 1 */}
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                label="เลขบัตรประชาชน"
                name="citizenID"
                rules={[{ required: true, message: "กรุณากรอกเลขบัตรประชาชน" }]}
              >
                <Input placeholder="เลขบัตรประชาชน" maxLength={13} />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="คำนำหน้า"
                name="prefix"
                rules={[{ required: true, message: "กรุณากรอกคำนำหน้า" }]}
              >
                <Input placeholder="คำนำหน้า" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item label="รหัสคนไข้" name="patientID">
                <Input readOnly />
              </Form.Item>
            </Col>
          </Row>

          {/* แถว 2 */}
          <Row gutter={16}>
            <Col xs={24} md={6}>
              <Form.Item
                label="ชื่อ"
                name="firstname"
                rules={[{ required: true, message: "กรุณากรอกชื่อ" }]}
              >
                <Input placeholder="ชื่อ" />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="นามสกุล"
                name="lastname"
                rules={[{ required: true, message: "กรุณากรอกนามสกุล" }]}
              >
                <Input placeholder="นามสกุล" />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item label="ชื่อเล่น" name="nickname">
                <Input placeholder="ชื่อเล่น" />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="หมายเลขโทรศัพท์"
                name="phone_number"
                rules={[
                  { required: true, message: "กรุณากรอกหมายเลขโทรศัพท์" },
                ]}
              >
                <Input placeholder="หมายเลขโทรศัพท์" />
              </Form.Item>
            </Col>
          </Row>

          {/* แถว 3 */}
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                label="เพศ"
                name="gender"
                rules={[{ required: true, message: "กรุณาเลือกเพศ" }]}
              >
                <Radio.Group>
                  <Radio value="male">ชาย</Radio>
                  <Radio value="female">หญิง</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="วันเกิด"
                name="birthdate"
                rules={[{ required: true, message: "กรุณาเลือกวันเกิด" }]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="Select date"
                  format="YYYY-MM-DD"
                  onChange={onBirthChange}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item label="อายุ (ปี)" name="age" initialValue={0}>
                <Input placeholder="0" />
              </Form.Item>
            </Col>
          </Row>

          {/* แถว 4 */}
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item label="โรคประจำตัว" name="congenitadisease">
                <Input placeholder="โรคประจำตัว" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item label="หมู่เลือด" name="bloodtype">
                <Select
                  placeholder="หมู่เลือด"
                  allowClear
                  options={[
                    { value: "A", label: "A" },
                    { value: "B", label: "B" },
                    { value: "AB", label: "AB" },
                    { value: "O", label: "O" },
                    { value: "none", label: "ไม่ทราบ" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider />
          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item label="แพ้ยา" required>
                <Space wrap>
                  <Radio.Group
                    value={allergyMode}
                    onChange={(e) => {
                      const v = e.target.value as "none" | "has";
                      setAllergyMode(v);
                      if (v === "none") {
                        // ล้างค่าที่เคยพิมพ์ไว้เมื่อสลับมา "ไม่แพ้ยา"
                        form.setFieldsValue({ drug_allergy: undefined });
                      }
                    }}
                    disabled={READONLY}
                  >
                    <Radio value="none">ไม่แพ้ยา</Radio>
                    <Radio value="has">แพ้ยา</Radio>
                  </Radio.Group>

                  {allergyMode === "none" ? (
                    // แสดง "ช่อง" แต่ปิดแก้ไขและไม่ผูกกับ name เพื่อไม่ส่งค่า
                    <Input
                      value="ไม่แพ้ยา"
                      style={{ width: 320 }}
                      disabled
                      readOnly
                    />
                  ) : (
                    // โหมดแพ้ยา: ต้องกรอกชื่อยา
                    <Form.Item
                      name="drug_allergy"
                      rules={[
                        { required: true, message: "กรุณาระบุชื่อยาที่แพ้" },
                      ]}
                      noStyle
                    >
                      <Input
                        placeholder="ชื่อยาที่แพ้ (เช่น เพนิซิลลิน)"
                        style={{ width: 320 }}
                        disabled={READONLY}
                      />
                    </Form.Item>
                  )}
                </Space>
              </Form.Item>
            </Col>
          </Row>

          {/* ผู้ติดต่อได้ */}
          <Divider />
          <h4 style={{ marginTop: 0 }}>ผู้ที่ติดต่อได้</h4>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="ความสัมพันธ์" name="relationship">
                <Input placeholder="ความสัมพันธ์" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="หมายเลขโทรศัพท์" name="emergency_phone">
                <Input placeholder="หมายเลขโทรศัพท์" />
              </Form.Item>
            </Col>
          </Row>

          {/* ที่อยู่ */}
          <Divider />
          <h4 style={{ marginTop: 0 }}>ที่อยู่</h4>
          <Row gutter={16}>
            <Col xs={24} md={6}>
              <Form.Item label="เลขที่" name="house_number">
                <Input placeholder="เลขที่" />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item label="หมู่ที่" name="Moo">
                <Input placeholder="หมู่ที่" />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item label="ตำบล/แขวง" name="subdistict">
                <Input placeholder="ตำบล/แขวง" />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item label="อำเภอ/เขต" name="distict">
                <Input placeholder="อำเภอ/เขต" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item label="จังหวัด" name="province">
                <Input placeholder="จังหวัด" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="รหัสไปรษณีย์" name="postcode">
                <Input placeholder="รหัสไปรษณีย์" />
              </Form.Item>
            </Col>
          </Row>

          {/* ปุ่ม */}
        </Form>
        {/* ปุ่ม */}
        <Space style={{ width: "100%", justifyContent: "flex-end" }}>
          {READONLY ? (
            // โหมดดูอย่างเดียว → มีเฉพาะปุ่มกลับ
            <Button
              type="default"
              htmlType="button"
              onClick={() => navigate("/admin/patient")} // หรือ navigate(-1)
              style={{ backgroundColor: "#f0f0f0", borderColor: "#d9d9d9" }}
            >
              กลับ
            </Button>
          ) : (
            // โหมดแก้ไข → ซ่อนปุ่มกลับ, แสดงยกเลิก/บันทึกเท่านั้น
            <>
              <Button onClick={handleCancel}>ยกเลิกการแก้ไข</Button>
              <Button type="primary" htmlType="submit" loading={saving}>
                บันทึก
              </Button>
            </>
          )}
        </Space> 
      </Card>
    </div>
  );
};

export default PatientDetail;
