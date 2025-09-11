// import React from "react";
import { Outlet } from "react-router-dom";
import "./design/index.css";
import PatienTable from "./component_patient/table";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

const PatientListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="page">


      {/* แถบเครื่องมือ */}
      <div className="toolbar">
        <input
          type="search"
          placeholder="ค้นหาด้วยเลขบัตรประชาชน"
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => navigate("add-patient")} className="add-button">
          เพิ่มประวัติ
        </button>
      </div>

      {/* พื้นที่ตาราง */}
      <div className="table-wrap">
        {/* ส่ง searchTerm ไปที่ Table */}
        <PatienTable searchTerm={searchTerm} />
      </div>
            <Outlet />
    </div>
  );
};

export default PatientListPage;
