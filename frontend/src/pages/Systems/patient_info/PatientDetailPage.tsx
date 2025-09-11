//Show OK
//PUT not OK

import "./design/pateint.css";
import NavigateHeader  from "./component_patient/header_navigate";
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { message } from "antd";
import { PatientAPI } from "../../../services/Patient/patientApi";
import { Patient } from "../../../interface/initailPatient/patient";

/** yyyy-mm-dd from string | Date | ISO */
const toDateInputValue = (v?: string | Date) => {
  if (!v) return "";
  const d = new Date(v);
  if (isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

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
        underlyingDisease: p.congenitadisease ?? "",
        bloodtype: p.blood_type ?? "",
        phone_number: p.phonenumber ?? "",
        drug_allergy: p.drugallergy ?? "",
        relationship: p?.contactperson?.relationship ?? "",
        emergency_phone:
          p?.contactperson?.phoneNumber ?? p?.contactperson?.phone ?? "",
        house_number: p?.address?.house_number ?? p?.address?.houseNumber ?? "",
        Moo: p?.address?.moo ?? "",
        subdistict: p?.address?.subdistrict ?? p?.address?.subdistict ?? "",
        distict: p?.address?.district ?? p?.address?.distict ?? "",
        province: p?.address?.province ?? "",
        postcode: p?.address?.postcode ?? p?.address?.postalCode ?? "",
      };

/** optional: คำนวนอายุจาก yyyy-mm-dd */
const calcAgeFromBirth = (yyyy_mm_dd: string): string => {
  const dob = new Date(yyyy_mm_dd);
  if (isNaN(dob.getTime())) return "";
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const hasntBirthday =
    now < new Date(now.getFullYear(), dob.getMonth(), dob.getDate());
  return String(hasntBirthday ? age - 1 : age);
};

const PatientDetail: React.FC = () => {
  const { id: idFromPath } = useParams();
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const patientId = idFromPath ?? search.get("id");

  // mode: view(default) | edit
  const mode = (search.get("mode") ?? "view").toLowerCase();
  const READONLY = mode !== "edit";

  const [formData, setFormData] = useState<any>({});
  const idNum = useMemo(() => Number(patientId), [patientId]);

  const fetchPatientData = async (id: number) => {
    if (!Number.isFinite(id)) return;
    const resp = await PatientAPI.getByID(id);
    const patient = resp?.data ?? resp;
    setFormData(mapPatientToForm(patient));
  };

  useEffect(() => {
    if (Number.isFinite(idNum)) fetchPatientData(idNum);
  }, [idNum]);

  // ---------- Change handlers ----------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (READONLY) return;
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (READONLY) return;
    setFormData((prev: any) => ({ ...prev, gender: e.target.value }));
  };

  const handleBirthdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (READONLY) return;
    const v = e.target.value; // yyyy-mm-dd
    const age = calcAgeFromBirth(v);
    setFormData((prev: any) => ({ ...prev, birthdate: v, age }));
  };

  // ---------- Save (ตัวอย่าง) ----------
  const handleSave = async () => {
    if (READONLY || !Number.isFinite(idNum)) return;
  
    const payload = buildPayload(formData);
  
    try {
      await PatientAPI.update(idNum, payload);
      message.success("บันทึกสำเร็จ");
      navigate(`/admin/patient/detail/${idNum}?mode=view`);
    } catch (e: any) {
      console.error(e);
      message.error(e?.response?.data?.error || e?.message || "บันทึกไม่สำเร็จ");
    }
  };
  

  return (
    <div className="wrapper">
      <NavigateHeader /> 
      <div style={{ paddingLeft: "3rem" }}>
        {/* --- row1 --- */}
        <div className="row1">
          <div>
            <div>รหัสคนไข้</div>
            <input
              className="inputbox"
              type="text"
              id="patientID"
              name="patientID"
              value={formData.patientID ?? ""}
              readOnly
              autoComplete="off"
            />
          </div>

          <div>
            <div>เลขบัตรประชาชน</div>
            <input
              className="inputbox"
              type="text"
              id="citizenID"
              name="citizenID"
              value={formData.citizenID ?? ""}
              readOnly={READONLY}
              onChange={READONLY ? undefined : handleChange}
              autoComplete="off"
            />
          </div>

          <div>
            <label>เพศ</label>
            <div className="gender-options">
              <input
                type="radio"
                id="male"
                name="gender"
                value="male"
                checked={formData.gender === "male"}
                disabled={READONLY}
                onChange={READONLY ? undefined : handleGenderChange}
              />
              <label htmlFor="male">ชาย</label>
              <input
                type="radio"
                id="female"
                name="gender"
                value="female"
                checked={formData.gender === "female"}
                disabled={READONLY}
                onChange={READONLY ? undefined : handleGenderChange}
              />
              <label htmlFor="female">หญิง</label>
            </div>
          </div>
        </div>

        {/* --- row2 --- */}
        <div className="row2">
          <div>
            <div>คำนำหน้า</div>
            <input
              className="inputbox"
              id="prefix"
              name="prefix"
              value={formData.prefix ?? ""}
              readOnly={READONLY}
              onChange={READONLY ? undefined : handleChange}
              autoComplete="off"
            />
          </div>
          <div>
            <div>ชื่อ</div>
            <input
              className="inputbox"
              id="firstname"
              name="firstname"
              value={formData.firstname ?? ""}
              readOnly={READONLY}
              onChange={READONLY ? undefined : handleChange}
              autoComplete="off"
            />
          </div>
          <div>
            <div>นามสกุล</div>
            <input
              className="inputbox"
              id="lastname"
              name="lastname"
              value={formData.lastname ?? ""}
              readOnly={READONLY}
              onChange={READONLY ? undefined : handleChange}
              autoComplete="off"
            />
          </div>
          <div>
            <div>ชื่อเล่น</div>
            <input
              className="inputbox"
              id="nickname"
              name="nickname"
              value={formData.nickname ?? ""}
              readOnly={READONLY}
              onChange={READONLY ? undefined : handleChange}
              autoComplete="off"
            />
          </div>
        </div>

        {/* --- row3 --- */}
        <div className="row3">
          <div>
            <div>วันเกิด</div>
            <input
              className="inputbox"
              type="date"
              id="birthdate"
              name="birthdate"
              value={formData.birthdate ?? ""}
              disabled={READONLY}
              onChange={READONLY ? undefined : handleBirthdateChange}
              autoComplete="off"
            />
          </div>
          <div>
            <div>อายุ (ปี)</div>
            <input
              className="inputbox"
              id="age"
              name="age"
              value={formData.age ?? ""}
              readOnly={READONLY}
              onChange={READONLY ? undefined : handleChange}
              autoComplete="off"
            />
          </div>
          <div>
            <div>โรคประจำตัว</div>
            <input
              className="inputbox"
              id="underlyingDisease"
              name="underlyingDisease"
              value={formData.underlyingDisease ?? ""}
              readOnly={READONLY}
              onChange={READONLY ? undefined : handleChange}
              autoComplete="off"
            />
          </div>
          <div>
            <div>หมู่เลือด</div>
            <input
              className="inputbox"
              id="bloodtype"
              name="bloodtype"
              value={formData.bloodtype ?? ""}
              readOnly={READONLY}
              onChange={READONLY ? undefined : handleChange}
              autoComplete="off"
            />
          </div>
          <div>
            <div>เบอร์โทรศัพท์</div>
            <input
              className="inputbox"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number ?? ""}
              readOnly={READONLY}
              onChange={READONLY ? undefined : handleChange}
              autoComplete="off"
            />
          </div>
        </div>

        {/* --- row5 --- */}
        <div className="row5">
          <div>
            <span
              style={{
                fontWeight: 700,
                width: "100px",
                marginRight: "3rem",
                fontSize: "16px",
              }}
            >
              แพ้ยา
            </span>
            <input
              className="drug-allergy-input"
              id="drug_allergy"
              name="drug_allergy"
              placeholder="เช่น เพนิซิลลิน"
              value={formData.drug_allergy ?? ""}
              readOnly={READONLY}
              onChange={READONLY ? undefined : handleChange}
              autoComplete="off"
            />
          </div>
        </div>

        {/* --- row7 --- */}
        <div className="row7">
          <div>
            <span style={{ width: "80px", fontWeight: 700, fontSize: "16px" }}>
              ผู้ที่ติดต่อได้
            </span>
            <span style={{ marginLeft: "2rem", marginRight: "1rem" }}>
              ความสัมพันธ์
            </span>
            <input
              className="contact-inputbox"
              id="relationship"
              name="relationship"
              value={formData.relationship ?? ""}
              readOnly={READONLY}
              onChange={READONLY ? undefined : handleChange}
              autoComplete="off"
            />
            <span style={{ marginLeft: "2rem", marginRight: "1rem" }}>
              เบอร์โทรศัพท์
            </span>
            <input
              className="contact-inputbox"
              id="emergency_phone"
              name="emergency_phone"
              value={formData.emergency_phone ?? ""}
              readOnly={READONLY}
              onChange={READONLY ? undefined : handleChange}
              autoComplete="off"
            />
          </div>
        </div>

        {/* --- address --- */}
        <div style={{ width: "80px", fontWeight: 700, fontSize: "16px" }}>
          ที่อยู่
        </div>
        <br />
        <div className="address-row1">
          <div>
            <div>เลขที่</div>
            <input
              className="address-box"
              id="house_number"
              name="house_number"
              value={formData.house_number ?? ""}
              readOnly={READONLY}
              onChange={READONLY ? undefined : handleChange}
              autoComplete="off"
            />
          </div>
          <div>
            <div>หมู่</div>
            <input
              className="address-box"
              id="Moo"
              name="Moo"
              value={formData.Moo ?? ""}
              readOnly={READONLY}
              onChange={READONLY ? undefined : handleChange}
              autoComplete="off"
            />
          </div>
          <div>
            <div>ตำบล/แขวง</div>
            <input
              className="address-box"
              id="subdistict"
              name="subdistict"
              value={formData.subdistict ?? ""}
              readOnly={READONLY}
              onChange={READONLY ? undefined : handleChange}
              autoComplete="off"
            />
          </div>
          <div>
            <div>อำเภอ/เขต</div>
            <input
              className="address-box"
              id="distict"
              name="distict"
              value={formData.distict ?? ""}
              readOnly={READONLY}
              onChange={READONLY ? undefined : handleChange}
              autoComplete="off"
            />
          </div>
          <div>
            <div>จังหวัด</div>
            <input
              className="address-box"
              id="province"
              name="province"
              value={formData.province ?? ""}
              readOnly={READONLY}
              onChange={READONLY ? undefined : handleChange}
              autoComplete="off"
            />
          </div>
          <div>
            <div>รหัสไปรษณีย์</div>
            <input
              className="address-box"
              id="postcode"
              name="postcode"
              value={formData.postcode ?? ""}
              readOnly={READONLY}
              onChange={READONLY ? undefined : handleChange}
              autoComplete="off"
            />
          </div>
        </div>
      </div>

      <div className="button">
        <button
          type="button"
          className="save-button"
          disabled={READONLY}
          onClick={handleSave}
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
          กลับ
        </button>
      </div>
    </div>
  );
};

export default PatientDetail;
function buildPayload(formData: any): Patient {
  return {
    citizenID: formData.citizenID,
    prefix: formData.prefix,
    firstname: formData.firstname,
    lastname: formData.lastname,
    nickname: formData.nickname,
    congenitadisease: formData.underlyingDisease,
    blood_type: formData.bloodtype,
    gender: formData.gender,
    birthday: formData.birthdate,
    phone_number: formData.phone_number,
    age: formData.age ? Number(formData.age) : undefined,
    drug_allergy: formData.drug_allergy,
    contactperson: {
      relationship: formData.relationship,
      emergency_phone: formData.emergency_phone,
    },
    address: {
      house_number: formData.house_number,
      moo: formData.Moo,
      subdistrict: formData.subdistict,
      district: formData.distict,
      province: formData.province,
      postcode: formData.postcode,
    },
  };
}

