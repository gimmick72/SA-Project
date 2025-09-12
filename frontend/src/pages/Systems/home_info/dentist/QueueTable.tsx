import React, { useState, useEffect } from "react";
import { Button, Card, Input, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { InitialSymtoms } from "../../../../services/Dashboard/dashboardStaff";


// Props ของ QueueTable
interface QueueTableProps {
  data: InitialSymtoms[];
  onSelect: (patient: InitialSymtoms) => void;
}

const QueueTableDentist: React.FC<QueueTableProps> = ({ data, onSelect }) => {
  const [filteredData, setFilteredData] = useState<InitialSymtoms[]>(data);
  const [activeId, setActiveId] = useState<number | null>(null);


  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleSearch = (value: string) => {
    const v = value.toLowerCase();
    setFilteredData(
      data.filter(
        (p) =>
          p.firstName.toLowerCase().includes(v) ||
          p.lastName.toLowerCase().includes(v) ||
          p.service.toLowerCase().includes(v) ||
          p.status.toLowerCase().includes(v)
      )
    );
  };

  const handleSelect = (patient: InitialSymtoms) => {
    setActiveId(patient.id);
    onSelect(patient);
  };

  const columns: ColumnsType<InitialSymtoms> = [
    { title: "No.", width: "10%", align: "center", render: (_v, _r, i) => i + 1 },
    { title: "ชื่อ - นามสกุล", width: "35%", align: "center", render: (_v, r) => <div>{r.firstName} {r.lastName}</div> },
    { title: "บริการ", dataIndex: "service", width: '20%', render: (v) => <Tag>{v}</Tag> },
    { title: "วันที่มา", dataIndex: "visit", width: '20%', render: (v) => new Date(v).toLocaleDateString("th-TH") },
  ];

  return (
    <Card
      size="small"
      title={
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div style={{display: 'flex', gap: '10px',justifyContent:'center', alignItems: 'center'}}>
          <span>รายการวันนี้ (จอง + วอล์คอิน)</span>
          <Input.Search
            placeholder="ค้นหาชื่อ/บริการ"
            allowClear
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 240 }}
          />
          </div>
        </div>
      }
      bodyStyle={{ padding: 0 }}
    >
      <Table<InitialSymtoms>
        rowKey="id"
        columns={columns}
        dataSource={filteredData}
        onRow={(rec) => ({ onClick: () => handleSelect(rec) })}
        rowClassName={(rec) => (rec.id === activeId ? "active-row" : "")}
        size="middle"
        scroll={{ y: 380, x: 500 }}
        pagination={false}
      />
    </Card>
  );
};

export default QueueTableDentist;
