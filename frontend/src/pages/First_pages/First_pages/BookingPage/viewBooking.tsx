// src/pages/BookedQueuePage.tsx
import React, { useEffect, useState } from "react";
import { Layout, Card, Table, Tag, Space, Button, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import SiteHeader from "./siteHeader";
import axios from "axios";

type TimeSlot = "morning" | "afternoon" | "evening";

type BookingRow = {
  id: number;
  name: string;
  phone: string;
  serviceName: string;
  date: string;       // ISO date
  timeSlot: TimeSlot;
  status: "pending" | "confirmed" | "done" | "canceled";
};

const slotText: Record<TimeSlot, string> = {
  morning: "ช่วงเช้า (09:00–12:00)",
  afternoon: "ช่วงบ่าย (13:00–17:00)",
  evening: "ช่วงเย็น (18:00–20:00)",
};

// const statusTag = (s: BookingRow["status"]) => {
//   const map: Record<BookingRow["status"], { color: string; text: string }> = {
//     pending:   { color: "gold",   text: "รอยืนยัน" },
//     confirmed: { color: "blue",   text: "ยืนยันแล้ว" },
//     done:      { color: "green",  text: "เสร็จสิ้น" },
//     canceled:  { color: "red",    text: "ยกเลิก" },
//   };
//   const t = map[s];
//   return <Tag color={t.color}>{t.text}</Tag>;
// };

const BookedQueuePage: React.FC = () => {
  const [data, setData] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/bookings/me");
      setData(data?.data ?? []);
    } catch {
      message.error("โหลดข้อมูลคิวที่จองไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id: number) => {
    try {
      await axios.post(`/api/bookings/${id}/cancel`);
      message.success("ยกเลิกคิวเรียบร้อย");
      fetchData();
    } catch {
      message.error("ยกเลิกคิวไม่สำเร็จ");
    }
  };

  useEffect(() => { fetchData(); }, []);

  const columns: ColumnsType<BookingRow> = [
    { title: "ชื่อ-สกุล", dataIndex: "name" },
    { title: "เบอร์โทร", dataIndex: "phone" },
    { title: "บริการ", dataIndex: "serviceName" },
    {
      title: "วันที่",
      dataIndex: "date",
      render: (v: string) => dayjs(v).format("DD MMM YYYY"),
    },
    {
      title: "ช่วงเวลา",
      dataIndex: "timeSlot",
      render: (s: TimeSlot) => slotText[s],
    },
    {
      title: "สถานะ",
      dataIndex: "status",
    //   render: (s) => statusTag(s),
    },
    {
      title: "การจัดการ",
      key: "action",
      render: (_, row) => (
        <Space>
          <Button
            danger
            disabled={row.status !== "pending"}
            onClick={() => cancelBooking(row.id)}
          >
            ยกเลิกคิว
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", background: "#F3EDF9" }}>
      <SiteHeader />
      <Layout.Content style={{ padding: 24 }}>
        <Card title="คิวที่คุณจองไว้" bordered={false} style={{ borderRadius: 20 }}>
          <Table
            rowKey="id"
            loading={loading}
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 8 }}
          />
        </Card>
      </Layout.Content>
    </Layout>
  );
};

export default BookedQueuePage;
