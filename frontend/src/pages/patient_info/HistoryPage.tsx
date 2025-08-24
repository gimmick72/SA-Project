import React from "react";
import { Card, Button, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";
import HistoryTable from "./component_patient/historyTable";
import "./design/history.css";
import { Flex } from "antd";
import Navigate from "./component_patient/header_navigate";

interface DataType {
  key: string;
  visitDate: string;
  service: string;
}

const HistoryPage: React.FC = () => {
  return (
    <div className="wrapper">
      <Navigate />
      <div className="header">
        <div className="content-box">
          <div className="table-section">
            <HistoryTable />
          </div>

          <div className="detail-section">
            <h3 style={{ marginLeft: "45%" }}>รายละเอียด</h3>
            <Card style={{ width: 400, backgroundColor: "#FCFCFF" }}>
              <div style={{ display: "flex", margin: "0" }}>
                <p style={{ marginRight: "3rem" }}>วันที่เข้ารับบริการ</p>
                <p>เวลา</p>
              </div>
              <p>ชื่อ นามสกุล</p>
              <p>บริการทันตกรรม</p>
              <p>ทันตแพทย์ผู้รักษา</p>
              <p>ผลการวินัจฉัย</p>
              <div
                style={{
                  width: "300px",
                  height: "100px",
                  margin: "2rem",
                  border: "1px solid #000",
                  borderRadius: "20px",
                  textAlign: "center",
                  alignContent: "center",
                  backgroundColor: "white",
                }}
              >
                deteail
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
