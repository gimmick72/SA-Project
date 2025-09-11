import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Card, DatePicker, Space, Table, Tag, Typography, message, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";

import {
  fetchVisitsByDate,
  type VisitRow,
  type VisitStatus,
} from "../../../../services/visit/visit";

const { Title, Text } = Typography;

const STATUS_LABEL: Record<VisitStatus, string> = {
  queued: "รอคิว",
  in_treatment: "กำลังตรวจ",
  payment: "ชำระเงิน",
  done: "เสร็จสิ้น",
};

const STATUS_COLOR: Record<VisitStatus, string> = {
  queued: "default",
  in_treatment: "processing",
  payment: "warning",
  done: "success",
};

const timeFmt = (iso?: string) => {
  if (!iso) return "-";
  const d = dayjs(iso);
  if (!d.isValid()) return "-";
  return `${d.format("YYYY-MM-DD")} · ${d.format("HH:mm")}`;
};

const fullName = (p?: VisitRow["patient"]) =>
  p ? `${p.prefix ? p.prefix + "" : ""}${p.firstname || ""} ${p.lastname || ""}`.trim() : "-";

const HomePage: React.FC = () => {
  const [date, setDate] = useState<Dayjs>(dayjs()); // default วันนี้
  const [rows, setRows] = useState<VisitRow[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (d: Dayjs | string) => {
    try {
      setLoading(true);
      const data = await fetchVisitsByDate(d);
      setRows(data);
    } catch (e: any) {
      console.error(e);
      message.error(e?.message || "ดึงข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }, []);

  // โหลดรอบแรก
  useEffect(() => {
    load(date);
  }, [date, load]);

  // ✅ เตรียมให้หน้าอื่นยิง event เพื่อรีเฟรชได้อัตโนมัติ
  useEffect(() => {
    const handler = () => load(date);
    window.addEventListener("visit:changed", handler);
    window.addEventListener("patient:updated", handler);
    window.addEventListener("queue:updated", handler);
    window.addEventListener("attend:updated", handler);
    return () => {
      window.removeEventListener("visit:changed", handler);
      window.removeEventListener("patient:updated", handler);
      window.removeEventListener("queue:updated", handler);
      window.removeEventListener("attend:updated", handler);
    };
  }, [date, load]);

  const columns: ColumnsType<VisitRow> = useMemo(
    () => [
      {
        title: "#",
        width: 64,
        render: (_v, _r, idx) => idx + 1,
        align: "center",
      },
      {
        title: "ชื่อ - นามสกุล",
        dataIndex: ["patient", "firstname"],
        render: (_, r) => (
          <Space direction="vertical" size={0}>
            <Text strong>{fullName(r.patient)}</Text>
            {r.patient?.nickname ? (
              <Text type="secondary" style={{ fontSize: 12 }}>
                ชื่อเล่น: {r.patient.nickname}
              </Text>
            ) : null}
          </Space>
        ),
      },
      {
        title: "บริการ",
        dataIndex: ["service", "name"],
        render: (v) => v || "-",
        width: 220,
      },
      {
        title: "วันที่ / เวลาเข้ารับบริการ",
        dataIndex: "visit",
        render: (v) => timeFmt(v),
        width: 220,
      },
      {
        title: "สถานะ",
        dataIndex: "status",
        width: 160,
        filters: [
          { text: STATUS_LABEL.queued, value: "queued" },
          { text: STATUS_LABEL.in_treatment, value: "in_treatment" },
          { text: STATUS_LABEL.payment, value: "payment" },
          { text: STATUS_LABEL.done, value: "done" },
        ],
        onFilter: (val, rec) => (rec.status || "queued") === val,
        render: (val: VisitStatus | undefined) => {
          const s = (val || "queued") as VisitStatus;
          return <Tag color={STATUS_COLOR[s]}>{STATUS_LABEL[s]}</Tag>;
        },
      },
      // (เผื่อปุ่ม action ภายหลัง เช่น ดูประวัติ/เปลี่ยนสถานะ ฯลฯ)
      // {
      //   title: "จัดการ",
      //   key: "actions",
      //   width: 140,
      //   render: (_, r) => <Button size="small">ดูรายละเอียด</Button>,
      // },
    ],
    []
  );

  return (
    <div style={{ padding: 16 }}>
      <Card
        style={{ borderRadius: 12 }}
        bodyStyle={{ display: "flex", flexDirection: "column", gap: 12 }}
        title={<Title level={4} style={{ margin: 0 }}>ตารางแสดงคนไข้</Title>}
        extra={
          <Space>
            <Text type="secondary">กรองตามวัน:</Text>
            <DatePicker
              allowClear={false}
              value={date}
              onChange={(d) => d && setDate(d)}
              style={{ minWidth: 160 }}
              format="YYYY-MM-DD"
            />
            <Button onClick={() => load(date)} disabled={loading}>
              รีเฟรช
            </Button>
          </Space>
        }
      >
        <Table<VisitRow>
          rowKey="id"
          loading={loading}
          dataSource={rows}
          columns={columns}
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </Card>
    </div>
  );
};

export default HomePage;
