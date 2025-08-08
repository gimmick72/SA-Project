import React from "react";
import { Card, Button, Table } from "antd";
import type { ColumnsType } from "antd/es/table";


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
];

const HistoryPage: React.FC = () => {
  return (
    <div className="history-container">
      <div className="header">
        <h2>ข้อมูลประจำตัว</h2>
        <div className="tabs">
          <span>ข้อมูลการติดต่อ</span>
          <span className="active-tab">ประวัติการรักษา</span>
        </div>
      </div>

      <div className="content-box">
        <div className="table-section">
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            bordered
          />
        </div>

        <div className="detail-section">
          <h3>รายละเอียด</h3>
          <Card className="detail-card">
            <p>วันที่เข้ารับบริการ: </p>
            <p>เวลา: </p>
            <p>ชื่อ นามสกุล: </p>
            <p>บริการทันตกรรม: </p>
            <p>ทันตแพทย์ผู้รักษา: </p>
            <p>ผลการวินิจฉัย:</p>
            <textarea rows={3} style={{ width: "100%", marginBottom: "10px" }} />
            <Button type="primary" style={{ background: "#F6E8C4", color: "#000" }}>
              เพิ่มเติม
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
