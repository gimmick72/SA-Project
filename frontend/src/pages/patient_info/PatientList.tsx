import React from "react";
import { Link } from "react-router-dom";
import "./design/index.css";
import PatienTable from "./component_patient/table";
import { useNavigate } from "react-router-dom";

const PatientListPage = () => {

    const navigate = useNavigate();

  return (
    <div className="wrapper">
      <div className="header">
        <h2 style={{ fontWeight: "600" }}>รายชื่อคนไข้</h2>
      </div>
      <div>
        <input type="search" placeholder="Search" className="search-input" />
   
          <button 
          onClick={() => navigate("/patient/detail")}   
          className="add-button">เพิ่มประวัติ</button>
    
      </div>
      <br />
      <PatienTable />
    </div>
  );
};

export default PatientListPage;
