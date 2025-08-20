import React from "react";
import { Link } from "react-router-dom";
import "./design/contact.css";

const ContactPage = () => {
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

      <div>
        <div className="contact-row">
          <div>
            <div>คำนำหน้า</div>
            <input type="text" id="prefix" name="prefix" className="inputbox" />
          </div>

          <div>
            <div>ชื่อ</div>
            <input
              type="text"
              id="firstname"
              name="firstname"
              className="inputbox"
            />
          </div>

          <div>
            <div>นามสกุล</div>
            <input
              type="text"
              id="lastname"
              name="lastname"
              className="inputbox"
            />
          </div>

          <div>
            <div>ชื่อเล่น</div>
            <input
              type="text"
              id="nickname"
              name="nickname"
              className="inputbox"
            />
          </div>

          <div>
            <div>เบอร์โทรศัพท์</div>
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              className="inputbox"
            />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "0.25rem" }}>
        <span style={{ width: "80px", fontWeight: "700", fontSize: "16px" }}>
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
      </div>

      <div className="address-row2">
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

      <div className="button-contact">
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
export default ContactPage;