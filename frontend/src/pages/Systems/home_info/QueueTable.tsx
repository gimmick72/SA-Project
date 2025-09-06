import React from "react";
import { Button, Card, Input, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Person, serviceColor, statusColor, typeColor } from "./types";

type Props = {
  data: Person[];
  onSelect: (id: number) => void;
  activeId: number | null;
  onSearch: (v: string) => void;
  onAddClick: () => void;
};

const QueueTable: React.FC<Props> = ({ data, onSelect, activeId, onSearch, onAddClick }) => {
  const columns: ColumnsType<Person> = [
    { title: "No.", width: 70, align: "center", render: (_v, _r, i) => i + 1 },
    {
      title: "ชื่อ",
      dataIndex: "firstName",
      render: (_v, r) => (
        <>
          <div>{r.firstName} {r.lastName}</div>
          <div style={{ fontSize: 12, color: "#8c8c8c" }}>{r.timeStart}–{r.timeEnd} • ห้อง {r.room}</div>
        </>
      ),
    },
    { title: "ประเภท", dataIndex: "type", width: 110, render: (t) => <Tag color={typeColor(t)}>{t}</Tag> },
    { title: "บริการ", dataIndex: "service", width: 120, render: (v) => <Tag color={serviceColor(v)}>{v}</Tag>, responsive: ["md"] },
    { title: "สถานะ", dataIndex: "status", width: 120, render: (s) => <Tag color={statusColor[s]}>{s}</Tag> },
  ];

  return (
    <Card
      size="small"
      title={
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <span>รายการวันนี้ (จอง + วอล์คอิน)</span>
          <div style={{ display: "flex", gap: 8 }}>
            <Input.Search placeholder="ค้นหาชื่อ/บริการ/ห้อง/แพทย์" allowClear onChange={(e) => onSearch(e.target.value)} style={{ width: 240 }} />
            <Button type="primary" onClick={onAddClick}>เพิ่มรายการ</Button>
          </div>
        </div>
      }
      bodyStyle={{ padding: 0 }}
      style={{ borderRadius: 12 }}
    >
      <Table<Person>
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 8, showSizeChanger: false, position: ["bottomRight"] }}
        onRow={(rec) => ({ onClick: () => onSelect(rec.id) })}
        rowClassName={(rec) => (rec.id === activeId ? "active-row" : "")}
        size="middle"
      />
      <style>{`.active-row td{ background:#f9f0ff !important; }`}</style>
    </Card>
  );
};

export default QueueTable;
