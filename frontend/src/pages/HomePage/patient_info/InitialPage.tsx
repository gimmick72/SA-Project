import React from "react";
import { Link } from "react-router-dom";
import "./design/contact.css";
import FullLayout from "../../layout/FullLayout";

const InitialPage = () => {
  return (
    <FullLayout>

    <div className="wrapper">
      <div className="header">
        <h2 style={{ fontWeight: "600" }}>อาการเบื้องต้น</h2>
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
              บริการทันตกรรม
            </span>
            <input
              className="service"
              type="text"
              id="service"
              name="service"
              style={{ width: "200px", height:"30px", marginRight: "3rem" , fontSize: "16px" ,border:"0.5px solid #000",borderRadius:"7px" }}
            />
          </div>

          <div>
            <span
              style={{
                fontWeight: "700",
                width: "100px",
                marginRight: "3rem",
                fontSize: "16px",
              }}
            >
             อัตราการเต้นหัวใจ
            </span>
            <input
              className="heart-rate"
              type="text"
              id="heart-rate"
              name="heart-rate"
              style={{ width: "200px", height:"30px", marginRight: "3rem" , fontSize: "16px" ,border:"0.5px solid #000",borderRadius:"7px" }}
            />
          </div>
        </div>
        <br />

      <div className="row6">
          <div>
            <span
              style={{
                fontWeight: "700",
                width: "100px",
                marginRight: "3rem",
                fontSize: "16px",
              }}
            >
              วันที่เข้ารับบริการ
            </span>
            <input
              className="visit-date"
              type="datetime-local"
              id="date"
              name="date"
              style={{ width: "200px", height:"30px", marginRight: "3rem" , fontSize: "16px" ,border:"0.5px solid #000",borderRadius:"7px" }}
            />
          </div>

          <div>
            <span
              style={{
                fontWeight: "700",
                width: "100px",
                marginRight: "3rem",
                fontSize: "16px",
              }}
            >
             ความดัน
            </span>
            <input
              className="blood-pressure"
              type="text"
              id="blood-pressure"
              name="blood-pressure"
              style={{ width: "200px", height:"30px", marginRight: "3rem" , fontSize: "16px" ,border:"0.5px solid #000",borderRadius:"7px" }}
            />
          </div>
        </div>
        <br />
        
      <div className="row7">
          <div>
            <span
              style={{
                fontWeight: "700",
                width: "100px",
                marginRight: "3rem",
                fontSize: "16px",
              }}
            >
              อาการ
            </span>
            <input
              className="initial-symptoms"
              type="text"
              id="initial-symptoms"
              name="initial-symptoms"
              style={{ width: "250px", height:"50px", marginRight: "3rem" , fontSize: "16px" ,border:"0.5px solid #000",borderRadius:"7px" }}
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
    </div>
    </FullLayout>
  );
};
export default InitialPage;