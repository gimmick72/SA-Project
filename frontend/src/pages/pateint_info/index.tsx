import React from "react";
import { Link } from "react-router-dom";
import "./design/index.css";
import PatienTable from "./component_patient/table";

const PatientInfoPage = () => {
<<<<<<< Updated upstream
  return <div>Patient Information Page</div>;
=======
  return (
  
  <div className="wrapper">
       <div className="header">
        <h2 style={{ fontWeight: "600" }}>รายชื่อคนไข้</h2>
      </div>
      <div>
        <input type="search" placeholder="Search" className="search-input" />
        <Link to='/patient/add'> 
        <button className="add-button">เพิ่มประวัติ</button>
        </Link>
      </div>
      <br />
      <PatienTable />
  </div>
  );
>>>>>>> Stashed changes
};

export default PatientInfoPage;
