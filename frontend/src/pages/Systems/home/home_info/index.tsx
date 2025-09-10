import React, { useMemo, useState } from "react";
import { Card, Col, Row, Tabs, message } from "antd";
import QueueTable from "./QueueTable";
import DetailCard from "./DetailCard";
import AddWalkinDrawer from "./AddWalkinDrawer";
import PaymentTab from "./PaymentTab";
import { Person } from "./types";
import { MOCK_APPOINTMENTS, MOCK_WALKINS } from "./mock";

const HomeInfoPage: React.FC = () => {
  const [list, setList] = useState<Person[]>([...MOCK_APPOINTMENTS, ...MOCK_WALKINS]);
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<number | null>(list[0]?.id ?? null);
  const [openAdd, setOpenAdd] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((r) =>
      `${r.firstName} ${r.lastName} ${r.service} ${r.room} ${r.doctor} ${r.type}`.toLowerCase().includes(q)
    );
  }, [list, search]);

  const active = useMemo(() => filtered.find((x) => x.id === activeId) || filtered[0] || null, [filtered, activeId]);

  const addWalkin = (p: Person) => {
    setList((prev) => [p, ...prev]);
    setActiveId(p.id);
    message.success("เพิ่มวอล์คอินสำเร็จ");
  };
  const nextId = useMemo(() => (list.length ? Math.max(...list.map((x) => x.id)) + 1 : 1), [list]);

  // เมื่อชำระเงินสำเร็จ: (ตัวอย่าง) เปลี่ยนสถานะเป็น "ยกเลิก" หรือจะย้ายออกจากคิวก็ได้
  const markPaid = (id: number) => {
    setList(prev => prev.filter(r => r.id !== id)); // สมมติจ่ายแล้วเอาออกจากรายการรอชำระ
  };
  const markVoid = (id: number) => {
    setList(prev => prev.map(r => (r.id === id ? { ...r, status: "ยกเลิก" } : r)));
  };

  return (
    <div className="container" style={{ padding: 10 }}>
      <Tabs
        defaultActiveKey="list"
        items={[
          {
            key: "list",
            label: "รายการ",
            children: (
              <Card bodyStyle={{ padding: 20 }} style={{ borderRadius: 16 }}>
                <Row gutter={[24, 24]}>
                  <Col xs={24} md={10}>
                    <QueueTable
                      data={filtered}
                      activeId={activeId}
                      onSelect={(id) => setActiveId(id)}
                      onSearch={setSearch}
                      onAddClick={() => setOpenAdd(true)}
                    />
                  </Col>
                  <Col xs={24} md={14}>
                    <DetailCard active={active} />
                  </Col>
                </Row>
              </Card>
            ),
          },
          {
            key: "pay",
            label: "ชำระเงิน",
            children: (
              <PaymentTab
                rows={list}
                onPaid={markPaid}
                onVoid={markVoid}
              />
            ),
          },
        ]}
      />

      <AddWalkinDrawer
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSubmit={addWalkin}
        nextId={nextId}
      />
    </div>
  );
};

export default HomeInfoPage;
