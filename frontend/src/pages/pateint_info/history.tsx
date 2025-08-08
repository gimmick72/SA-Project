import React from "react";
import { Card, Button, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";
import HistoryTable from "./component_patient/historyTable";
import "./design/history.css";
import { Flex } from "antd";

interface DataType {
  key: string;
  visitDate: string;
  service: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: "วันที่เข้ารับบริการ",
    dataIndex: "visitDate",
    key: "visitDate",
  },
  {
    title: "บริการ",
    dataIndex: "service",
    key: "service",
  },
];

const data: DataType[] = [
  {
    key: "1",
    visitDate: "01/08/2025",
    service: "ขูดหินปูน",
  },
  {
    key: "2",
    visitDate: "05/07/2025",
    service: "อุดฟัน",
  },
  {
    key: "3",
    visitDate: "05/07/2025",
    service: "อุดฟัน",
  },
  
];


const HistoryPage: React.FC = () => {
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
  );
};

export default HistoryPage;
