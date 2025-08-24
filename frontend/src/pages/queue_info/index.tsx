// src/pages/queue_info/index.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Layout, Card, Segmented, DatePicker, Button, Space, Typography, message, Spin } from "antd";
import QueueSidebar from "./QueueSidebar";
import RoomSchedule from "./RoomSchedule";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Patient, RoomScheduleData as RoomDataFromTypes } from "./types";
import FullLayout from "../../layout/FullLayout";
import dayjs from "dayjs";
import { assignPatientApi, fetchRoomsByDate, ViewMode } from "../../services/schedule";

const { Content } = Layout;

// mock patients เดิมของคุณ
const initialPatients: Patient[] = [
  { id: "p1", name: "คุณสมชาย", type: "walkin" },
  { id: "p2", name: "คุณสมหญิง", type: "appointment" },
  { id: "p3", name: "คุณมานะ", type: "walkin" },
  { id: "p4", name: "คุณชาวี", type: "appointment" },
];

const QueuePage: React.FC = () => {
  const [patients] = useState(initialPatients);

  const [date, setDate] = useState(dayjs());
  const [view, setView] = useState<ViewMode>("day");

  const [rooms, setRooms] = useState<RoomDataFromTypes[]>([]); // ใช้ shape จาก types ของคุณได้
  const [loading, setLoading] = useState(false);

  // โหลดตารางจาก backend
  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchRoomsByDate(view, date);
      if (Array.isArray(data) && data.length > 0) {
        setRooms(data);
      } else {
        console.warn("[schedule] empty data, keep previous rooms");
      }
    } catch (e: any) {
      message.error(e?.message || "โหลดตารางไม่สำเร็จ");
      // คง rooms เดิมไว้
    } finally {
      setLoading(false);
    }
  };

  // โหลดตามวัน/สัปดาห์
  useEffect(() => {
    let alive = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchRoomsByDate(view, date);
        if (alive) setRooms(data);
      } catch (e: any) {
        message.error(e?.message || "โหลดตารางไม่สำเร็จ");
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    return () => {
      alive = false;
    };
  }, [date, view]);

  // อัปเดตการใส่/ลบผู้ป่วยใน slot + persist
  const handleAssignPatient = async (
  roomId: string,
  time: string,
  patient: Patient | null,
  from?: { roomId: string; time: string }
) => {
  try {
  await assignPatientApi({
    date: date.format("YYYY-MM-DD"),
    roomId,
    time,
    patientId: patient?.id ?? null,
    fromRoomId: from?.roomId,
    fromTime: from?.time,

    // ✅ สำคัญ: ส่งชนิดและชื่อ
    type: patient?.type,           // "appointment" | "walkin"
    patientName: patient?.name,
    caseCode: patient?.caseCode,
    note: patient?.note,
    durationMin: patient?.durationMin,
  });

  // ✅ ให้หน้ากระดาน sync กับฐานข้อมูล (กรณี backend ย้าย walk-in)
  await load();
  } catch (e: any) {
    message.error(e?.message || "บันทึกการจัดคิวไม่สำเร็จ");
  }
};

  return (
    <FullLayout>
      <DndProvider backend={HTML5Backend}>
        <Layout style={{ padding: 24, background: "#fff" }}>
          <Content>
            {/* Toolbar ด้านบน */}
            <Card
              style={{ marginBottom: 16, borderRadius: 12 }}
              bodyStyle={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}
            >
              <Space size="middle" wrap>
                <Segmented
                  value={view}
                  options={[
                    { label: "วัน", value: "day" },
                    { label: "สัปดาห์", value: "week" },
                  ]}
                  onChange={(val) => setView(val as ViewMode)}
                />
                <DatePicker
                  allowClear={false}
                  value={date}
                  picker={view === "week" ? "week" : "date"}
                  onChange={(d) => d && setDate(d)}
                />
                <Button onClick={() => setDate(dayjs())}>Today</Button>
              </Space>

              <Typography.Text type="secondary">
                {view === "day"
                  ? date.format("dddd, D MMM YYYY")
                  : `${date.startOf("week").format("D MMM")} - ${date.endOf("week").format("D MMM YYYY")}`}
              </Typography.Text>
            </Card>

            <Row gutter={16}>
              {/* Sidebar */}
              <Col xs={24} md={6}>
                <QueueSidebar patients={patients} />
              </Col>

              {/* กระดานห้อง */}
              <Col xs={24} md={18}>
                <div style={{ height: 560, overflowY: "auto", borderRadius: 12, background: "#fff", paddingRight: 8 }}>
                  <Spin spinning={loading}>
                    <Row gutter={[16, 16]}>
                      {rooms.map((room) => (
                        <Col key={room.roomId} xs={24} sm={12} lg={6}>
                          <RoomSchedule
                            room={room}
                            onAssignPatient={handleAssignPatient}
                            currentDate={date}
                            viewMode={view}
                            // ถ้าอยากกำหนดความสูง body:
                            // maxBodyHeight={520}
                          />
                        </Col>
                      ))}
                    </Row>
                  </Spin>
                </div>
              </Col>
            </Row>
          </Content>
        </Layout>
      </DndProvider>
    </FullLayout>
  );
};

export default QueuePage;
