// ManageQueue.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  Divider,
  DatePicker,
  Space,
  Button,
  Table,
  Modal,
  Typography,
  InputNumber,
  message,
  Tag, // NEW
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";

type SegKey = "morning" | "afternoon" | "evening";

type SlotRow = {
  key: string;      // "HHmm"
  time: string;     // "HH:mm"
  capacity: number; // คิว/ช่วง (จำนวนรับสูงสุดของช่องเวลา)
};

type PeriodState = {
  range: [Dayjs, Dayjs];
  capacity: number;   // default คิว/ชั่วโมง (ใน modal ตั้งค่า)
  slots: SlotRow[];   // เฉพาะที่เปิดรับ (capacity > 0)
  selectedKeys: React.Key[];
};

// NEW: โครงสร้างรายการจอง
type Booking = {
  id: number;
  patientName: string;
  patientCode?: string;
  phone?: string;
  note?: string;
  status?: "reserved" | "checked_in" | "done" | "cancelled";
};

const { Text } = Typography;

const segLabel = (v: SegKey) =>
  v === "morning" ? "ช่วงเช้า" : v === "afternoon" ? "ช่วงบ่าย" : "ช่วงเย็น";

// NEW: ช่วยสร้าง id ของช่องเวลา (ผูกกับวันที่)
const slotId = (date: Dayjs, hhmm: string) => `${date.format("YYYY-MM-DD")}-${hhmm}`;

const buildSlots = (range: [Dayjs, Dayjs], cap: number): SlotRow[] => {
  const [start, end] = range;
  const out: SlotRow[] = [];
  let t = start.minute(0).second(0);
  while (t.isBefore(end) || t.isSame(end)) {
    out.push({ key: t.format("HHmm"), time: t.format("HH:mm"), capacity: cap });
    t = t.add(1, "hour");
  }
  return out;
};

const ManageQueue: React.FC = () => {
  const [date, setDate] = useState<Dayjs>(dayjs());

  const [periods, setPeriods] = useState<Record<SegKey, PeriodState>>({
    morning: {
      range: [dayjs().hour(9).minute(0), dayjs().hour(12).minute(0)],
      capacity: 1,
      slots: [],
      selectedKeys: [],
    },
    afternoon: {
      range: [dayjs().hour(13).minute(0), dayjs().hour(17).minute(0)],
      capacity: 1,
      slots: [],
      selectedKeys: [],
    },
    evening: {
      range: [dayjs().hour(18).minute(0), dayjs().hour(20).minute(0)],
      capacity: 1,
      slots: [],
      selectedKeys: [],
    },
  });

  /** รีเซ็ตคิวกลับเป็น 0 แต่คงช่วงเวลาเดิมไว้ */
  const resetQueuesToZero = () =>
    setPeriods((prev) => ({
      morning: { ...prev.morning, slots: [], selectedKeys: [] },
      afternoon: { ...prev.afternoon, slots: [], selectedKeys: [] },
      evening: { ...prev.evening, slots: [], selectedKeys: [] },
    }));

  /** ตั้ง timer ให้รีเซ็ตอัตโนมัติเมื่อถึงเที่ยงคืนของวันถัดไป */
  useEffect(() => {
    const now = dayjs();
    const nextMidnight = now.add(1, "day").startOf("day");
    const ms = nextMidnight.diff(now, "millisecond");
    const id = window.setTimeout(() => {
      resetQueuesToZero();
      setDate(dayjs());
      setBookingsBySlot({}); // NEW: ล้างรายการจองของวันเก่า
      message.info("รีเซ็ตคิวสำหรับวันใหม่แล้ว");
    }, ms);
    return () => window.clearTimeout(id);
  }, [date]);

  // ตารางแสดงผลเสมอ (ถ้าไม่ตั้งไว้ให้เป็น 0)
  const getDisplaySlots = (k: SegKey): SlotRow[] => {
    const full = buildSlots(periods[k].range, 0);
    const map = new Map(periods[k].slots.map((s) => [s.key, s.capacity]));
    return full.map((s) => ({ ...s, capacity: map.get(s.key) ?? 0 }));
  };

  // ===== NEW: จัดการข้อมูล "รายการจอง" ต่อช่องเวลา =====
  // map key = `${YYYY-MM-DD}-${HHmm}` → Booking[]
  const [bookingsBySlot, setBookingsBySlot] = useState<Record<string, Booking[]>>({});

  // ตัวอย่างการดึงข้อมูลจองจาก backend (ใส่ของจริงแทนส่วน mock นี้)
  useEffect(() => {
    // TODO: เรียก API ของคุณ เช่น GET /api/appointments?date=YYYY-MM-DD
    // แล้วแปลงผลลัพธ์เป็น map ตามรูปแบบด้านล่าง จากนั้น setBookingsBySlot(map)
    // ---- MOCK DEMO: ลองใส่รายการจองสัก 2 ช่องเวลา ----
    const demo: Record<string, Booking[]> = {};
    // 09:00 มี 1 คน
    demo[slotId(date, "0900")] = [
      { id: 1, patientName: "น.ส. พิมพ์ชนก ใจดี", phone: "08x-xxx-xxxx", status: "reserved", note: "นัดตรวจ" },
    ];
    // 14:00 มี 2 คน
    demo[slotId(date, "1400")] = [
      { id: 2, patientName: "นาย ธนกฤต เก่งมาก", patientCode: "PT-0007", status: "checked_in" },
      { id: 3, patientName: "นาง สมฤดี สุขใจ", phone: "09x-xxx-xxxx", status: "reserved" },
    ];
    setBookingsBySlot(demo);
  }, [date]);

  const countBooked = (hhmm: string) => (bookingsBySlot[slotId(date, hhmm)]?.length ?? 0);

  // KPI
  const totalOpen = useMemo(
    () =>
      (["morning", "afternoon", "evening"] as SegKey[])
        .flatMap((k) => getDisplaySlots(k))
        .reduce((acc, s) => acc + (s.capacity > 0 ? s.capacity : 0), 0),
    [periods]
  );
  const totalBooked = useMemo(
    () => Object.values(bookingsBySlot).reduce((a, arr) => a + arr.length, 0),
    [bookingsBySlot]
  );

  const stats = [
    { title: "ทั้งหมด", value: totalOpen },
    { title: "ว่าง", value: Math.max(totalOpen - totalBooked, 0) },
    { title: "จองแล้ว", value: totalBooked },
    { title: "รอรับบริการ", value: 0 },
  ];

  // ===== Modal ตั้งค่า (เดิม) =====
  const [active, setActive] = useState<SegKey | null>(null);
  const open = active !== null;
  const [tmpRange, setTmpRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [tmpCap, setTmpCap] = useState<number>(1);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [capByKey, setCapByKey] = useState<Record<string, number>>({});
  const [bulkCap, setBulkCap] = useState<number>(1);

  const openModal = (k: SegKey) => {
    setActive(k);
    setTmpRange(periods[k].range);
    setTmpCap(periods[k].capacity);

    const defaultKeys =
      periods[k].selectedKeys.length > 0
        ? periods[k].selectedKeys
        : buildSlots(periods[k].range, periods[k].capacity).map(
            (s) => `${k}-${s.key}`
          );
    setSelectedKeys(defaultKeys);

    const prevMap: Record<string, number> = {};
    periods[k].slots.forEach((s) => (prevMap[`${k}-${s.key}`] = s.capacity));
    setCapByKey(prevMap);

    setBulkCap(periods[k].capacity);
  };

  const closeModal = () => setActive(null);

  type PreviewRow = SlotRow & { period: SegKey; key: string };
  const previewRows: PreviewRow[] = useMemo(() => {
    if (!active || !tmpRange) return [];
    const base = buildSlots(tmpRange, tmpCap);
    return base.map((s) => {
      const key = `${active}-${s.key}`;
      return {
        ...s,
        key,
        period: active,
        capacity: capByKey[key] ?? tmpCap,
      };
    });
  }, [active, tmpRange, tmpCap, capByKey]);

  useEffect(() => {
    if (!active) return;
    setSelectedKeys(previewRows.map((r) => r.key));
  }, [active, previewRows.length]);

  const applyModal = () => {
    if (!active || !tmpRange) return;
    setPeriods((prev) => {
      const full = buildSlots(tmpRange, tmpCap);
      const chosen = full
        .map((s) => {
          const key = `${active}-${s.key}`;
          const cap =
            capByKey[key] ??
            (selectedKeys.includes(key) ? tmpCap : 0);
          return { ...s, capacity: cap };
        })
        .filter((s) => s.capacity > 0);

      const chosenKeys = chosen.map((s) => `${active}-${s.key}`);

      return {
        ...prev,
        [active]: {
          range: tmpRange,
          capacity: tmpCap,
          slots: chosen,
          selectedKeys: chosenKeys,
        },
      };
    });
    setActive(null);
  };

  // เปลี่ยนวัน = ล้างตารางรับ & (ควร) โหลดรายการจองของวันนั้นใหม่
  const onChangeDate = (d: Dayjs | null) => {
    if (!d) return;
    setDate(d);
    resetQueuesToZero();
    setBookingsBySlot({}); // NEW
  };

  // ====== View Modal (อ่านอย่างเดียว) + แสดงผู้จอง ======
  const [viewSeg, setViewSeg] = useState<SegKey | null>(null);
  const openView = (k: SegKey) => setViewSeg(k);
  const closeView = () => setViewSeg(null);

  // คอลัมน์หลักของการดูตาราง (เพิ่ม “จองแล้ว”)
  type ViewRow = SlotRow & { booked: number };
  const viewCols: ColumnsType<ViewRow> = [
    { title: "เวลา", dataIndex: "time", width: 100 },
    { title: "คิว/ช่วง", dataIndex: "capacity", width: 110 },
    { title: "จองแล้ว", dataIndex: "booked", width: 100 },
  ];

  // คอลัมน์รายการผู้จอง (expanded)
  const bookingCols: ColumnsType<Booking> = [
    { title: "ชื่อผู้จอง", dataIndex: "patientName", width: 220 },
    {
      title: "เบอร์",
      render: (_, r) => r.patientCode ?? r.phone ?? "-",
      width: 140,
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      width: 120,
      render: (s?: Booking["status"]) => {
        const color =
          s === "checked_in" ? "processing" :
          s === "done" ? "success" :
          s === "cancelled" ? "error" : "default";
        return <Tag color={color}>{s ?? "reserved"}</Tag>;
      },
    },
    { title: "หมายเหตุ", dataIndex: "note" },
  ];

  // DataSource สำหรับ View Modal
  const viewData: ViewRow[] = useMemo(() => {
    if (!viewSeg) return [];
    return getDisplaySlots(viewSeg).map((s) => ({
      ...s,
      booked: countBooked(s.key),
    }));
  }, [viewSeg, periods, bookingsBySlot, date]);

  // คอลัมน์ตารางทั่วไปในหน้า (เดิม)
  const baseCols: ColumnsType<SlotRow> = [
    { title: "เวลา", dataIndex: "time", width: 100 },
    { title: "คิว/ช่วง", dataIndex: "capacity", width: 120 },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 16 }}>
      <Divider orientation="center">จัดการการจองคิว</Divider>

      {/* KPI */}
      <Row gutter={[16, 16]} justify="center">
        {stats.map((s, i) => (
          <Col key={i} xs={24} sm={12} md={12} lg={6}>
            <Card
              bodyStyle={{
                minHeight: 120,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Statistic title={s.title} value={s.value} />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Header / Date */}
      <Row style={{ marginTop: 16 }} align="middle" justify="space-between">
        <Col>
          <h2 style={{ margin: 0 }}>กำหนดตารางคิว</h2>
        </Col>
        <Col>
          <Space>
            <span>วันที่:</span>
            <DatePicker value={date} onChange={onChangeDate} allowClear={false} />
          </Space>
        </Col>
      </Row>

      {/* Cards */}
      <Row gutter={[16, 16]} style={{ marginTop: 12 }}>
        <Col xs={24} md={8}>
          <Card
            hoverable
            title="ช่วงเช้า"
            extra={<Text type="secondary">{date.format("YYYY-MM-DD")}</Text>}
            actions={[
              <Button key="view" type="link" onClick={() => openView("morning")}>
                ดูตาราง
              </Button>,
              <Button key="set" type="link" onClick={() => openModal("morning")}>
                เปิดรับคิว
              </Button>,
            ]}
          >
            เปิดรับแล้ว {periods.morning.slots.reduce((a, b) => a + b.capacity, 0)} คิว
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            hoverable
            title="ช่วงบ่าย"
            extra={<Text type="secondary">{date.format("YYYY-MM-DD")}</Text>}
            actions={[
              <Button key="view" type="link" onClick={() => openView("afternoon")}>
                ดูตาราง
              </Button>,
              <Button key="set" type="link" onClick={() => openModal("afternoon")}>
                เปิดรับคิว
              </Button>,
            ]}
          >
            เปิดรับแล้ว {periods.afternoon.slots.reduce((a, b) => a + b.capacity, 0)} คิว
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            hoverable
            title="ช่วงเย็น"
            extra={<Text type="secondary">{date.format("YYYY-MM-DD")}</Text>}
            actions={[
              <Button key="view" type="link" onClick={() => openView("evening")}>
                ดูตาราง
              </Button>,
              <Button key="set" type="link" onClick={() => openModal("evening")}>
                เปิดรับคิว
              </Button>,
            ]}
          >
            เปิดรับแล้ว {periods.evening.slots.reduce((a, b) => a + b.capacity, 0)} คิว
          </Card>
        </Col>
      </Row>

   

      {/* ===== View Modal: อ่าน + เห็นรายชื่อผู้จองต่อช่องเวลา ===== */}
      <Modal
        open={!!viewSeg}
        onCancel={closeView}
        footer={null}
        width={600}

        title={
          viewSeg ? (
            <div>
              {segLabel(viewSeg)}{" "}
              <Text type="secondary">วันที่ {date.format("DD-MM-YYYY")}</Text>
            </div>
          ) : (
            ""
          )
        }
      >
        <Table<ViewRow>
          rowKey="key"
          size="small"
          pagination={false}
          columns={viewCols}
          dataSource={viewData}
          expandable={{
            expandRowByClick: true,
            rowExpandable: (record) => countBooked(record.key) > 0,
            expandedRowRender: (record) => {
              const list = bookingsBySlot[slotId(date, record.key)] ?? [];
              return (
                <Table<Booking>
                  rowKey="id"
                  size="small"
                  pagination={false}
                  columns={bookingCols}
                  dataSource={list}
                />
              );
            },
          }}
        />
      </Modal>

      {/* ===== Modal ตั้งค่า (ของเดิม) ===== */}
      <Modal
        open={open}
        onCancel={closeModal}
        onOk={applyModal}
        okText="บันทึก"
        cancelText="ยกเลิก"
        width={860}
        title={
          <div>
            กำหนดจำนวนรับ{" "}
            <Text type="secondary">วันที่ {date.format("DD-MM-YYYY")}</Text>
            {active && <Text style={{ marginLeft: 8 }}>{segLabel(active)}</Text>}
          </div>
        }
      >
        {active && tmpRange && (
          <Table
            style={{ marginTop: 16 }}
            rowKey="key"
            size="small"
            pagination={{ pageSize: 8 }}
            columns={[
              {
                title: "ช่วง",
                dataIndex: "period",
                width: 90,
                render: () => (active ? segLabel(active) : "-"),
              },
              { title: "เวลา", dataIndex: "time", width: 100 },
              {
                title: "คิว/ช่วง",
                dataIndex: "capacity",
                width: 160,
                render: (_: number, record: any) => (
                  <InputNumber
                    min={0}
                    size="small"
                    value={capByKey[record.key] ?? tmpCap}
                    onChange={(v) =>
                      v !== null &&
                      setCapByKey((prev) => ({ ...prev, [record.key]: v ?? 0 }))
                    }
                    style={{ width: 120 }}
                  />
                ),
              },
            ]}
            dataSource={(() => {
              const base =
                active && tmpRange
                  ? buildSlots(tmpRange, tmpCap).map((s) => ({
                      ...s,
                      key: `${active}-${s.key}`,
                      period: active,
                      capacity: capByKey[`${active}-${s.key}`] ?? tmpCap,
                    }))
                  : [];
              return base;
            })()}
            rowSelection={{
              selectedRowKeys: selectedKeys,
              onChange: setSelectedKeys,
              selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default ManageQueue;
