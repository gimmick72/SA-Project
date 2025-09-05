import React from "react";
import { Card, Button } from "antd";
import HistoryTable from "./component_patient/historyTable";
import "./design/history.css";
import Navigate from "./component_patient/header_navigate";

const HistoryPage: React.FC = () => {
  return (
    <div className="wrapper">
      <Navigate />
      <div className="header">
        <div className="content-box">
          <div className="table-section">
            <HistoryTable />
          </div>
          {/* ขวาเป็นรายละเอียด ถ้ายังไม่ใช้ก็ซ่อนไว้ได้ */}
          {/* <div className="detail-section"> ... </div> */}
        </div>
      </div>
    </div>
  );
};
export default HistoryPage;
