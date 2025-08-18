import React from "react";
import { Link } from "react-router-dom";
import "./design/pateint.css";

const AddPatientPage = () => {
  return (
    <div className="wrapper">
      <div className="header">
        <h2 style={{ fontWeight: "600" }}>ข้อมูลประจำตัว</h2>
        <h3 className="header-element">
          <Link to="/patient/contact">
            <span
              style={{ margin: "0.5rem", color: "black", fontWeight: "400" }}
            >
              ข้อมูลการติดต่อ{" "}
            </span>
          </Link>
        </h3>
        <h3 className="header-element">
          <Link to="/patient/history">
            <span
              style={{ margin: "0.5rem", color: "black", fontWeight: "400" }}
            >
              ประวัติการรักษา
            </span>
          </Link>
        </h3>
      </div>

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
            <div>เชื้อชาติ</div>
            <input
              className="inputbox"
              type="text"
              id="ethnicity"
              name="ethnicity"
            />
          </div>

          <div>
            <div>สัญชาติ</div>
            <input
              className="inputbox"
              type="text"
              id="nationality"
              name="nationality"
            />
          </div>

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
        </div>

        <div className="row4">
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
      </div>
      <div className="button">
        <button type="submit" className="save-button">
          บันทึก
        </button>
        <button
          type="button"
          className="cancel-button"
          onClick={() => window.history.back()}
        >
          ยกเลิก
        </button>
      </div>
    </div>
  );
};

export default AddPatientPage;