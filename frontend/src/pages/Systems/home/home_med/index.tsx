import React, { useMemo, useState } from "react";
import {
  Card, Row, Col, Table, Typography, Button, Input, Tag, Empty, Pagination, // ⬅️ เพิ่ม Pagination
} from "antd";

const { Paragraph, Text } = Typography;

type QItem = {
  id: number; firstName: string; lastName: string;
  timeStart: string; timeEnd: string; service: string; room: string;
};

const QUEUE: QItem[] = [
  { id: 1,  firstName: "สมชาย",   lastName: "ใจดี",     timeStart: "08:00", timeEnd: "08:30", service: "ขูดหินปูน", room: "X001" },
  { id: 2,  firstName: "กนกวรรณ", lastName: "รื่นรมย์", timeStart: "08:30", timeEnd: "09:00", service: "อุดฟัน",     room: "X001" },
  { id: 3,  firstName: "ธนกฤต",   lastName: "ชัยพร",    timeStart: "09:00", timeEnd: "09:30", service: "ถอนฟัน",     room: "X002" },
  { id: 4,  firstName: "วริศรา",   lastName: "มากดี",    timeStart: "09:30", timeEnd: "10:00", service: "ขูดหินปูน", room: "X003" },
  { id: 5,  firstName: "พิชญา",    lastName: "สุนทร",    timeStart: "10:00", timeEnd: "10:30", service: "อุดฟัน",     room: "X001" },
  { id: 6,  firstName: "จิรายุ",    lastName: "ทองแท้",   timeStart: "10:30", timeEnd: "11:00", service: "ขูดหินปูน", room: "X003" },
  { id: 7,  firstName: "นภัสกร",   lastName: "อิ่มสุข",   timeStart: "11:00", timeEnd: "11:30", service: "ขูดหินปูน", room: "X001" },
  { id: 8,  firstName: "กิตติ",     lastName: "โสภา",     timeStart: "13:00", timeEnd: "13:30", service: "อุดฟัน",     room: "X002" },
  { id: 9,  firstName: "ปาณิสรา",  lastName: "จิตดี",     timeStart: "13:30", timeEnd: "14:00", service: "ถอนฟัน",     room: "X003" },
  { id: 10, firstName: "ศุภชัย",   lastName: "อารมณ์ดี", timeStart: "14:00", timeEnd: "14:30", service: "ขูดหินปูน", room: "X001" },
  { id: 11, firstName: "ณัฐชา",    lastName: "ทวีสุข",    timeStart: "14:30", timeEnd: "15:00", service: "อุดฟัน",     room: "X002" },
  { id: 12, firstName: "อริสา",     lastName: "สกุลไทย",  timeStart: "15:00", timeEnd: "15:30", service: "ขูดหินปูน", room: "X001" },
];

const serviceColor = (s: string) =>
  s === "อุดฟัน" ? "gold" : s === "ถอนฟัน" ? "volcano" : "geekblue";

const HomeMed: React.FC = () => {
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<number | null>(QUEUE[0]?.id ?? null);

  // จัดการหน้าเอง เพื่อแสดง Pagination ภายนอกและตรึงขวาล่าง
  const [pagination, setPagination] = useState<{ current: number; pageSize: number }>({
    current: 1,
    pageSize: 7,
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return QUEUE;
    return QUEUE.filter((x) =>
      `${x.firstName} ${x.lastName} ${x.service} ${x.room}`.toLowerCase().includes(q)
    );
  }, [search]);

  // ตัดหน้าเอง (slice) สำหรับ Table
  const paged = useMemo(() => {
    const start = (pagination.current - 1) * pagination.pageSize;
    return filtered.slice(start, start + pagination.pageSize);
  }, [filtered, pagination]);

  const active = useMemo(
    () => filtered.find((x) => x.id === activeId) ?? filtered[0] ?? null,
    [filtered, activeId]
  );

  const columns = [
    {
      title: "No.",
      width: 70,
      align: "center" as const,
      render: (_: any, __: any, i: number) =>
        (pagination.current - 1) * pagination.pageSize + (i + 1), // ⬅️ เลขคิวต่อเนื่องข้ามหน้า
    },
    {
      title: "ชื่อ",
      dataIndex: "firstName",
      render: (_: any, row: QItem) => (
        <>
          <div>{row.firstName} {row.lastName}</div>
          <div style={{ fontSize: 12, color: "#8c8c8c" }}>
            {row.timeStart}–{row.timeEnd} • ห้อง {row.room}
          </div>
        </>
      ),
    },
    {
      title: "บริการ",
      dataIndex: "service",
      width: 120,
      render: (v: string) => <Tag color={serviceColor(v)}>{v}</Tag>,
      responsive: ["md"] as const,
    },
  ];

  return (
    <div className="container" style={{ padding: 16 }}>
      <Card
        bodyStyle={{ padding: 20 }}
        style={{
          borderRadius: 20,
          boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
          backgroundColor: "#FFF",
        }}
      >
        <Row gutter={[24, 24]} align="top">
          {/* ซ้าย: รายการ + ค้นหา */}
          <Col xs={24} md={10}>
            <Card
              size="small"
              title={
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <span>รายการคิววันนี้</span>
                  <Input.Search
                    placeholder="ค้นหาชื่อ/บริการ/ห้อง"
                    allowClear
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPagination((p) => ({ ...p, current: 1 })); // ⬅️ ค้นหาใหม่กลับหน้า 1
                    }}
                    style={{ width: 220 }}
                    size="middle"
                  />
                </div>
              }
              style={{ borderRadius: 16, border: "1px solid #e6e6e6" }}
              bodyStyle={{
                padding: 0,
                height: "calc(100vh - 250px)",
                position: "relative",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* พื้นที่ตาราง (กันทับด้วย paddingBottom) */}
              <div style={{ paddingBottom: 10 }}>
                <Table<QItem>
                  rowKey="id"
                  columns={columns}
                  dataSource={paged}
                  pagination={false}                           // ⬅️ ปิด pagination ใน Table
                  scroll={{ y: "calc(100vh - 360px - 10px)" }} // ⬅️ เว้นที่ให้ footer 56px
                  onRow={(rec) => ({ onClick: () => setActiveId(rec.id) })}
                  rowClassName={(rec) => (rec.id === active?.id ? "active-row" : "")}
                  size="middle"
                />
              </div>

              {/* Pagination ตรึงขวาล่างตลอด */}
              <div
                style={{
                  position: "absolute",
                  right: 16,
                  bottom: 12,
                  background: "rgba(255,255,255,0.9)",
                  borderRadius: 8,
                  padding: "4px 8px",
                }}
              >
                <Pagination
                  current={pagination.current}
                  pageSize={pagination.pageSize}
                  total={filtered.length}
                  showSizeChanger={false}
                  onChange={(page, pageSize) => setPagination({ current: page, pageSize })}
                />
              </div>
            </Card>
          </Col>

          {/* ขวา: รายละเอียด + ปุ่ม (2x3) */}
          <Col xs={24} md={14}>
            <Card title="รายละเอียดคิว" size="small" style={{ borderRadius: 16, marginBottom: 16 }} bodyStyle={{ padding: 16 }}>
              {active ? (
                <>
                  <Paragraph style={{ marginBottom: 8 }}>
                    <Text strong>คิวที่:</Text>{" "}
                    {filtered.findIndex((x) => x.id === active.id) + 1}
                  </Paragraph>
                  <Paragraph style={{ marginBottom: 6 }}>
                    <Text strong>เวลา:</Text> {active.timeStart} น. ถึง {active.timeEnd} น.
                  </Paragraph>
                  <Paragraph style={{ marginBottom: 6 }}>
                    <Text strong>ชื่อ:</Text> {active.firstName} {active.lastName}
                  </Paragraph>
                  <Paragraph style={{ marginBottom: 6 }}>
                    <Text strong>ทันตกรรม:</Text>{" "}
                    <Tag color={serviceColor(active.service)}>{active.service}</Tag>
                  </Paragraph>
                  <Paragraph style={{ marginBottom: 0 }}>
                    <Text strong>ห้อง:</Text> {active.room}
                  </Paragraph>
                </>
              ) : (
                <Empty description="ไม่มีคิวที่เลือก" />
              )}
            </Card>

            <div className="action-grid">
              <Button className="action-btn" onClick={() => console.log("เวชระเบียน:", active)}>เวชระเบียน</Button>
              <Button className="action-btn" onClick={() => console.log("ประวัติเบื้องต้น:", active)}>ประวัติเบื้องต้น</Button>
              <Button className="action-btn" onClick={() => console.log("การรักษา:", active)}>การรักษา</Button>
              <Button className="action-btn" onClick={() => console.log("เวชภัณฑ์:", active)}>เวชภัณฑ์</Button>
              <Button className="action-btn" type="primary" onClick={() => console.log("สำเร็จ:", active)}>สำเร็จ</Button>
              <Button className="action-btn" danger onClick={() => console.log("ยกเลิก:", active)}>ยกเลิก</Button>
            </div>
          </Col>
        </Row>
      </Card>

      <style>{`
        .active-row td { background: #f9f0ff !important; }
        .action-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        .action-btn { width: 100%; height: 40px; font-size: 14px; }
      `}</style>
    </div>
  );
};

export default HomeMed;
