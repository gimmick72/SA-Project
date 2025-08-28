import "../design/index.css";
import { useNavigate } from "react-router-dom";

const PatientHeader = () => {
  const navigate = useNavigate();
  return (
    <div className="header">
      <h2 style={{ fontWeight: "600" }}>ข้อมูลประจำตัว</h2>
      
      <h3 className="header-element">
        <span
          style={{ margin: "0.5rem", color: "black", fontWeight: "400", cursor: "pointer" }}
          onClick={() => navigate("/patient/contact")}
        >
          ข้อมูลการติดต่อ
        </span>
      </h3>

      <h3 className="header-element">
        <span
          style={{ margin: "0.5rem", color: "black", fontWeight: "400", cursor: "pointer" }}
          onClick={() => navigate("/patient/patient-history")}
        >
          ประวัติการรักษา
        </span>
      </h3>
    </div>
  );
};

export default PatientHeader;
