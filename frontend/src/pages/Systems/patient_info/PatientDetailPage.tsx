import "./design/pateint.css";

import Navigate from "./component_patient/header_navigate";
import React, { useState } from "react";

const AddPatientPage = () => {
  const [formData, setFormData] = useState({});

  const fetchPatientData = async () => {
    try {

    }catch (error) {
      console.error("Error fetching patient data:", error);
    }
  }

  return (
    <div className="wrapper">
      <Navigate />

      <div style={{ paddingLeft: "3rem" }}>
        <div className="row1">
          <div>
            <div>รหัสคนไข้</div>
            <input
              className="inputbox"
              type="text"
              id="patientID"
              name="patientID"
              required
            />
          </div>

          <div>
            <div>เลขบัตรประชาชน</div>
            <input
              className="inputbox"
              type="text"
              id="citizenID"
              name="citizenID"
            />
          </div>

          <div>
            <label>เพศ</label>
            <div className="gender-options">
              <input type="radio" id="male" name="gender" value="male" />
              <label htmlFor="male">ชาย</label>
              <input type="radio" id="female" name="gender" value="female" />
              <label htmlFor="female">หญิง</label>
            </div>
          </div>
        </div>

        <div className="row2">
          <div>
            <div>คำนำหน้า</div>
            <input className="inputbox" type="text" id="prefix" name="prefix" />
          </div>

          <div>
            <div>ชื่อ</div>
            <input
              className="inputbox"
              type="text"
              id="firstname"
              name="firstname"
            />
          </div>

          <div>
            <div>นามสกุล</div>
            <input
              className="inputbox"
              type="text"
              id="lastname"
              name="lastname"
            />
          </div>

          <div>
            <div>ชื่อเล่น</div>
            <input
              className="inputbox"
              type="text"
              id="nickname"
              name="nickname"
            />
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
            <div>โรคประจำตัว</div>
            <input
              className="inputbox"
              type="text"
              id="underlyingDisease"
              name="underlyingDisease"
            />
          </div>

          <div>
            <div>หมู่เลือด</div>
            <input
              className="inputbox"
              type="text"
              id="bloodtype"
              name="bloodtype"
            />
          </div>

          <div>
            <div>เบอร์โทรศัพท์</div>
            <input
              className="inputbox"
              type="text"
              id="phone_number"
              name="phone_number"
            />
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
            <span style={{ marginLeft: "2rem", marginRight: "1rem" }}>
              ความสัมพันธ์
            </span>
            <input
              className="contact-inputbox"
              type="text"
              id="relationship"
              name="relationship"
            />

            <span style={{ marginLeft: "2rem", marginRight: "1rem" }}>
              เบอร์โทรศัพท์
            </span>
            <input
              className="contact-inputbox"
              type="text"
              id="emergency_phone"
              name="emergency_phone"
            />
          </div>
        </div>

        <div style={{ width: "80px", fontWeight: "700", fontSize: "16px" }}>
          ที่อยู่
        </div>
        <br />
        <div className="address-row1">
          <div>
            <div>เลขที่</div>
            <input
              type="text"
              id="house_number"
              name="house_number"
              className="address-box"
            />
          </div>

          <div>
            <div>หมู่</div>
            <input type="text" id="Moo" name="Moo" className="address-box" />
          </div>

          <div>
            <div>ตำบล/แขวง</div>
            <input
              type="text"
              id="subdistict"
              name="subdistict"
              className="address-box"
            />
          </div>

          <div>
            <div>อำเภอ/เขต</div>
            <input
              type="text"
              id="distict"
              name="distict"
              className="address-box"
            />
          </div>

          <div>
            <div>จังหวัด</div>
            <input
              type="text"
              id="province"
              name="province"
              className="address-box"
            />
          </div>

          <div>
            <div>รหัสไปรษณีย์</div>
            <input
              type="text"
              id="postcode"
              name="postcode"
              className="address-box"
            />
          </div>
        </div>
      </div>
      <div className="button">
        <button type="submit" className="save-button">
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
    </div>
  );
};

export default AddPatientPage;
