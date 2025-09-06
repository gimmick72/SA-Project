import React, { useMemo, useState } from "react";
import { Card, Input, Space, Table, Tag, Button, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Person, serviceColor } from "./types";

type Props = {
  rows: Person[];                 // ส่งเคสทั้งหมดมา เดี๋ยวฉาบกรองเองเป็น "เสร็จสิ้น"
  onPaid?: (id: number) => void;  // callback เมื่อชำระเงิน
  onVoid?: (id: number) => void;  // callback เมื่อยกเลิก
};

const PaymentTab: React.FC<Props> = ({ rows, onPaid, onVoid }) => {
  const [q, setQ] = useState("");

  // เอาเฉพาะเคสที่เสร็จสิ้น
  const source = useMemo(() => rows.filter(r => r.status === "เสร็จสิ้น"), [rows]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return source;
    return source.filter(r =>
      `${r.firstName} ${r.lastName} ${r.service} ${r.room} ${r.doctor}`.toLowerCase().includes(s)
    );
  }, [q, source]);

  const pay = (r: Person) => {
    message.success(`รับชำระเงิน: ${r.firstName} ${r.lastName}`);
    onPaid?.(r.id);
  };
  const voidPay = (r: Person) => {
    message.warning(`ยกเลิกรายการคิดเงินของ: ${r.firstName} ${r.lastName}`);
    onVoid?.(r.id);
  };

  const columns: ColumnsType<Person> = [
    { title: "เวลา", width: 120, render: (_v, r) => `${r.timeStart}–${r.timeEnd}` },
    { title: "ชื่อ", render: (_v, r) => `${r.firstName} ${r.lastName}` },
    { title: "บริการ", dataIndex: "service", width: 140, render: (v) => <Tag color={serviceColor(v)}>{v}</Tag> },
    { title: "แพทย์/ห้อง", width: 180, render: (_v, r) => `${r.doctor} • ${r.room}` },
    {
      title: "การกระทำ",
      key: "act",
      fixed: "right",
      width: 220,
      render: (_v, r) => (
        <Space>
          <Button type="primary" onClick={() => pay(r)}>ชำระเงิน</Button>
          <Button danger onClick={() => voidPay(r)}>ยกเลิก</Button>
        </Space>
      ),
    },
  ];

  return (
    <Card bodyStyle={{ padding: 20 }} style={{ borderRadius: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontWeight: 600 }}>รอชำระเงิน (จากเคสที่เสร็จสิ้น)</span>
        <Input.Search
          placeholder="ค้นหา: ชื่อ / บริการ / ห้อง / แพทย์"
          allowClear
          style={{ width: 320 }}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <Table<Person>
        rowKey="id"
        columns={columns}
        dataSource={filtered}
        pagination={{ pageSize: 8, showSizeChanger: false, position: ["bottomRight"] }}
        scroll={{ x: 900 }}
        size="middle"
      />
    </Card>
  );
};

export default PaymentTab;
