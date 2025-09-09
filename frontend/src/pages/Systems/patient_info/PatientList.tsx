import "./design/index.css";
import PatienTable from "./component_patient/table";
import { useNavigate } from "react-router-dom";


const PatientListPage = () => {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="page-header">
        <h2>รายชื่อคนไข้</h2>
      </div>

      {/* แถบเครื่องมือ */}
      <div className="toolbar">
        <input type="search" placeholder="Search" className="search-input" />
        <button onClick={() => navigate("add-patient")} className="add-button">
          เพิ่มประวัติ
        </button>
      </div>

      {/* พื้นที่ตาราง */}
      <div className="table-wrap">
      <PatienTable />
   
      </div>
    </div>
    
  );
};

export default PatientListPage;
