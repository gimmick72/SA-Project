import React, { useEffect, useState } from "react";
import { Button, Card, Input, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { getTodayInitialSymptomps, Symptomps } from "../../../../services/Dashboard/dashboardStaff"; // import service API

/** -------------------- Types -------------------- **/

export interface Person {
  id: number;
  firstName: string;
  lastName: string;
  service: string;
  status: string;
}

export const serviceColor = (service: string) => {
  switch (service) {
    case "ตรวจฟัน": return "blue";
    case "อุดฟัน": return "green";
    default: return "gray";
  }
};

export const statusColor: Record<string, string> = {
  "รอคิว": "orange",
  "กำลังทำ": "blue",
  "เสร็จแล้ว": "green",
};

/** -------------------- QueueTable Component -------------------- **/

const QueueTable: React.FC = () => {
  const [data, setData] = useState<Person[]>([]);
  const [filteredData, setFilteredData] = useState<Person[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);

  /** ฟังก์ชันดึงข้อมูลจาก API */
  const fetchData = async () => {
    try {
      const res = await getTodayInitialSymptomps();
      const persons: Person[] = res.symptomps.map((s: Symptomps) => ({
        id: s.ID,
        firstName: s.Patient?.FirstName || "",
        lastName: s.Patient?.LastName || "",
        service: s.Service?.Name || "",
        status: s.Status?.Name || "",
      }));
      setData(persons);
      setFilteredData(persons);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (value: string) => {
    const v = value.toLowerCase();
    setFilteredData(
      data.filter((p) =>
        p.firstName.toLowerCase().includes(v) ||
        p.lastName.toLowerCase().includes(v) ||
        p.service.toLowerCase().includes(v) ||
        p.status.toLowerCase().includes(v)
      )
    );
  };

  const handleSelect = (id: number) => setActiveId(id);
  const handleAddClick = () => console.log("เพิ่มรายการใหม่");

  const columns: ColumnsType<Person> = [
    { title: "No.", width: 70, align: "center", render: (_v, _r, i) => i + 1 },
    {
      title: "ชื่อ",
      dataIndex: "firstName",
      render: (_v, r) => <div>{r.firstName} {r.lastName}</div>,
    },
    { title: "บริการ", dataIndex: "service", width: 120, render: (v) => <Tag color={serviceColor(v)}>{v}</Tag> },
    { title: "สถานะ", dataIndex: "status", width: 120, render: (s) => <Tag color={statusColor[s]}>{s}</Tag> },
  ];

  return (
    <Card
      size="small"
      title={
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <span>รายการวันนี้ (จอง + วอล์คอิน)</span>
          <div style={{ display: "flex", gap: 8 }}>
            <Input.Search placeholder="ค้นหาชื่อ/บริการ" allowClear onChange={(e) => handleSearch(e.target.value)} style={{ width: 240 }} />
            <Button type="primary" onClick={handleAddClick}>เพิ่มรายการ</Button>
          </div>
        </div>
      }
      bodyStyle={{ padding: 0 }}
      style={{ borderRadius: 12 }}
    >
      <Table<Person>
        rowKey="id"
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 8, showSizeChanger: false, position: ["bottomRight"] }}
        onRow={(rec) => ({ onClick: () => handleSelect(rec.id) })}
        rowClassName={(rec) => (rec.id === activeId ? "active-row" : "")}
        size="middle"
      />
      <style>{`.active-row td{ background:#f9f0ff !important; }`}</style>
    </Card>
  );
};

export default QueueTable;
