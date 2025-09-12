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
  Form,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";

import type {
  SegKey,
  Slottime,
  QueueSlot,
  SummaryBooking,
  UpdateSlot,
} from "../../../interface/bookingQueue";

// ใช้สองชุด API ตามที่กำหนด
import { BookingAPI, QueueSlotAPI } from "../../../services/booking/QSlot";

const { Text } = Typography;

interface SlotRow {
  key: string;       // "0900"
  time: string;      // "09:00"
  capacity: number;  // > 0 = เปิดรับ
}

export interface PeriodState {
  range: [Dayjs, Dayjs];
  capacity: number;
  slots: SlotRow[];
  selectedKeys: React.Key[];
}

interface BookingViewRow {
  id: number;
  patientName: string;
  phone?: string;
}

const segLabel = (v: SegKey) =>
  v === "morning" ? "ช่วงเช้า" : v === "afternoon" ? "ช่วงบ่าย" : "ช่วงเย็น";

const slotId = (date: Dayjs, hhmm: string) =>
  `${date.format("YYYY-MM-DD")}-${hhmm}`;

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

// ── Adapters เพื่อใช้กับ APIs ที่มีอยู่ ─────────────────────────────────

// (A) Slots by date
const listSlotsByDate = async (d: Dayjs): Promise<QueueSlot[]> => {
  const iso = d.format("YYYY-MM-DD");
  const res = await QueueSlotAPI.listByDate(iso);
  return res.data ?? res; // รองรับทั้ง {data:[]} หรือ []
};

// (B) Bookings by date
const listBookingsByDate = async (d: Dayjs): Promise<SummaryBooking[]> => {
  const iso = d.format("YYYY-MM-DD");
  const res = await BookingAPI.listByDate(iso);
  return res.data ?? res;
};

// (C) Upsert capacity
const upsertSlots = async (payload: UpdateSlot) => {
  return QueueSlotAPI.createCapacity(payload);
};


const ManageQueue: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
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

  const resetQueuesToZero = () =>
    setPeriods((prev) => ({
      morning: { ...prev.morning, slots: [], selectedKeys: [] },
      afternoon: { ...prev.afternoon, slots: [], selectedKeys: [] },
      evening: { ...prev.evening, slots: [], selectedKeys: [] },
    }));

  useEffect(() => {
    void refreshForDate(date);
  }, []);

  // Reset at midnight
  useEffect(() => {
    const now = dayjs();
    const nextMidnight = now.add(1, "day").startOf("day");
    const ms = nextMidnight.diff(now, "millisecond");
    const id = window.setTimeout(async () => {
      resetQueuesToZero();
      const today = dayjs();
      setDate(today);
      await refreshForDate(today);
      message.info("รีเซ็ตคิวสำหรับวันใหม่แล้ว");
    }, ms);
    return () => window.clearTimeout(id);
  }, [date]);

  const getDisplaySlots = (k: SegKey): SlotRow[] => {
    const full = buildSlots(periods[k].range, 0);
    const map = new Map(periods[k].slots.map((s) => [s.key, s.capacity]));
    return full.map((s) => ({ ...s, capacity: map.get(s.key) ?? 0 }));
  };

  const [bookingsBySlot, setBookingsBySlot] = useState<
    Record<string, BookingViewRow[]>
  >({});
  const countBooked = (hhmm: string) =>
    bookingsBySlot[slotId(date, hhmm)]?.length ?? 0;

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
  ];

  const [active, setActive] = useState<SegKey | null>(null);
  const open = active !== null;
  const [tmpRange, setTmpRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [tmpCap, setTmpCap] = useState<number>(1);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [capByKey, setCapByKey] = useState<Record<string, number>>({});

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
  };

  const closeModal = () => setActive(null);

  const applyModal = async () => {
    if (!active || !tmpRange) return;

    const items: Slottime[] = buildSlots(tmpRange, tmpCap).map((s) => {
      const key = `${active}-${s.key}`;
      const isSelected = selectedKeys.includes(key);
      const cap = isSelected ? (capByKey[key] ?? tmpCap) : 0; // ไม่เลือก = 0
      return { hhmm: s.key, capacity: cap };
    });
    

    try {
      setLoading(true);
      const payload: UpdateSlot = {
        date: date.format("YYYY-MM-DD"),
        segment: active,
        slots: items,
      };

      await upsertSlots(payload);
      message.success("บันทึกตารางคิวเรียบร้อย");
      await refreshForDate(date);
      setActive(null);
    } catch (e: any) {
      message.error(e?.response?.data?.error ?? "บันทึกตารางคิวไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  const onChangeDate = async (d: Dayjs | null) => {
    if (!d) return;
    setDate(d);
    await refreshForDate(d);
  };

  const refreshForDate = async (d: Dayjs) => {
    try {
      setLoading(true);
      const [slots, bks]: [QueueSlot[], SummaryBooking[]] = await Promise.all([
        listSlotsByDate(d),     // GET /api/queue/slots?date=YYYY-MM-DD
        listBookingsByDate(d),  // GET /api/bookings?date=YYYY-MM-DD
      ]);

      setPeriods((prev) => {
        const toSeg = (seg: SegKey): SlotRow[] =>
          slots
            .filter((s) => s.segment === seg)
            .map(
              (s) =>
                ({
                  key: s.hhmm,
                  time: `${s.hhmm.slice(0, 2)}:${s.hhmm.slice(2, 4)}`,
                  capacity: s.capacity,
                } as SlotRow)
            );

        const m = toSeg("morning");
        const a = toSeg("afternoon");
        const e = toSeg("evening");

        return {
          morning: {
            ...prev.morning,
            slots: m,
            selectedKeys: m.map((s) => `morning-${s.key}`),
          },
          afternoon: {
            ...prev.afternoon,
            slots: a,
            selectedKeys: a.map((s) => `afternoon-${s.key}`),
          },
          evening: {
            ...prev.evening,
            slots: e,
            selectedKeys: e.map((s) => `evening-${s.key}`),
          },
        };
      });

      const bySlot: Record<string, BookingViewRow[]> = {};
      bks.forEach((b) => {
        const key = `${dayjs(b.date).format("YYYY-MM-DD")}-${b.hhmm}`;
        (bySlot[key] ??= []).push({
          id: b.id,
          patientName: `${b.firstName} ${b.lastName}`,
          phone: b.phone_number,
        });
      });
      setBookingsBySlot(bySlot);
    } catch (e) {
      console.error('Error refreshing data:', e);
      resetQueuesToZero();
      setBookingsBySlot({});
      message.error("ไม่สามารถโหลดข้อมูลได้");
    } finally {
      setLoading(false);
    }
  };

  const [viewSeg, setViewSeg] = useState<SegKey | null>(null);
  const openView = (k: SegKey) => setViewSeg(k);
  const closeView = () => setViewSeg(null);

  interface ViewRow extends SlotRow {
    booked: number;
  }
  const viewCols: ColumnsType<ViewRow> = [
    { title: "เวลา", dataIndex: "time", width: 100 },
    { title: "คิว/ช่วง", dataIndex: "capacity", width: 110 },
    { title: "จองแล้ว", dataIndex: "booked", width: 100 },
  ];

  const bookingCols: ColumnsType<BookingViewRow> = [
    { title: "ชื่อผู้จอง", dataIndex: "patientName", width: 220 },
    { title: "เบอร์", dataIndex: "phone", width: 140, render: (v?: string) => v ?? "-" },
  ];

  const viewData: ViewRow[] = useMemo(() => {
    if (!viewSeg) return [];
    return periods[viewSeg].slots.map((s) => ({
      ...s,
      booked: countBooked(s.key),
    }));
  }, [viewSeg, periods, bookingsBySlot, date]);

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
            เปิดรับแล้ว{" "}
            {periods.morning.slots.reduce((a, b) => a + b.capacity, 0)} คิว
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
            เปิดรับแล้ว{" "}
            {periods.afternoon.slots.reduce((a, b) => a + b.capacity, 0)} คิว
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
            เปิดรับแล้ว{" "}
            {periods.evening.slots.reduce((a, b) => a + b.capacity, 0)} คิว
          </Card>
        </Col>
      </Row>

      {/* View Modal */}
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
                <Table<BookingViewRow>
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

      {/* Setting Modal */}
      <Modal
        open={open}
        onCancel={closeModal}
        onOk={applyModal}
        okText="บันทึก"
        cancelText="ยกเลิก"
        confirmLoading={loading}
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
                render: (_: number, record: any) => {
                  const isSelected = selectedKeys.includes(record.key);
                  return (
                    <InputNumber
                      min={0}
                      size="small"
                      value={capByKey[record.key] ?? tmpCap}
                      onChange={(v) =>
                        v !== null &&
                        setCapByKey((prev) => ({
                          ...prev,
                          [record.key]: v ?? 0,
                        }))
                      }
                      style={{ width: 120 }}
                      disabled={!isSelected}
                    />
                  );
                },
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
              onChange: (keys) => {
                setSelectedKeys(keys);
                const ks = new Set(keys as string[]);
                setCapByKey((prev) => {
                  const next = { ...prev };
                  Object.keys(next).forEach((k) => {
                    if (!ks.has(k)) delete next[k];
                  });
                  return next;
                });
              },
              selections: [
                Table.SELECTION_ALL,
                Table.SELECTION_INVERT,
                Table.SELECTION_NONE,
              ],
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default ManageQueue;