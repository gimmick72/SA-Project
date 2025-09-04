// src/pages/queue_info/index.tsx
import React, { useEffect, useCallback, useState } from "react";
import {
  Row, Col, Layout, Card, Segmented, DatePicker, Button,
  Space, Typography, message, Spin, Empty
} from "antd";
import QueueSidebar from "./QueueSidebar";
import RoomSchedule from "./RoomSchedule";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Patient, RoomScheduleData as RoomDataFromTypes, ViewMode } from "./types";
import FullLayout from "../../layout/FullLayout";
import dayjs, { Dayjs } from "dayjs";
import { assignPatientApi, fetchRoomsByDate } from "../../services/schedule";

const { Content } = Layout;

const API_BASE = "http://localhost:8080";
async function fetchPatients(): Promise<Patient[]> {
  const res = await fetch(`${API_BASE}/api/patients`);
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

const QueuePage: React.FC = () => {
  const [date, setDate] = useState<Dayjs>(dayjs());
  const [view, setView] = useState<ViewMode>("day");

  const [patients, setPatients] = useState<Patient[]>([]);
  const [rooms, setRooms] = useState<RoomDataFromTypes[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(false);

  // ใช้ความสูง panel แบบยืดหยุ่น (ลดเลขได้ตาม header จริงของคุณ)
  const PANEL_HEIGHT = "calc(100vh - 220px)";

  useEffect(() => {
    let alive = true;
    const run = async () => {
      setLoadingPatients(true);
      try {
        const data = await fetchPatients();
        if (alive) setPatients(data);
      } catch {
        message.warning("โหลดรายชื่อผู้ป่วยไม่สำเร็จ");
        if (alive) setPatients([]);
      } finally {
        if (alive) setLoadingPatients(false);
      }
    };
    run();
    return () => { alive = false; };
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchRoomsByDate(date);
      setRooms(Array.isArray(data) ? data : []);
    } catch (e: any) {
      message.error(e?.message || "โหลดตารางไม่สำเร็จ");
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAssignPatient = useCallback(
    async (roomId: string, time: string, patient: Patient | null, from?: { roomId: string; time: string }) => {
      const prevRooms = rooms;
      setRooms((current) => {
        const clone = current.map((r) => ({ ...r, timeSlots: r.timeSlots.map((s) => ({ ...s })) }));
        if (from) {
          const rf = clone.find((r) => r.roomId === from.roomId);
          const sf = rf?.timeSlots.find((t) => t.time === from.time);
          if (sf) sf.patient = null;
        }
        const rt = clone.find((r) => r.roomId === roomId);
        const st = rt?.timeSlots.find((t) => t.time === time);
        if (st) st.patient = patient ? { ...patient } : null;
        return clone;
      });

      try {
        await assignPatientApi({
          date: date.format("YYYY-MM-DD"),
          roomId,
          time,
          patientId: patient?.id ?? null,
          fromRoomId: from?.roomId,
          fromTime: from?.time,
          type: patient?.type,
          patientName: patient?.name,
          caseCode: patient?.caseCode,
          note: patient?.note,
          durationMin: patient?.durationMin,
        });
        await load();
      } catch (e: any) {
        setRooms(prevRooms);
        message.error(e?.message || "บันทึกการจัดคิวไม่สำเร็จ");
      }
    },
    [rooms, date, load]
  );

  return (
      <DndProvider backend={HTML5Backend}>
        <Layout style={{ padding: 24, background: "#fff", height: "100%", minHeight: 0 }}>
          <Content style={{ height: "100%", minHeight: 0 }}>
            {/* Toolbar */}
            <Card
              style={{ marginBottom: 12, borderRadius: 12 }}
              bodyStyle={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                flexWrap: "wrap",
              }}
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

            {/* Panels */}
            <Row gutter={16} style={{ height: PANEL_HEIGHT, minHeight: 0 }}>
              {/* Sidebar: คิวทั้งหมด (เลื่อนซ้ายได้) */}
              <Col xs={24} md={6} style={{ height: "100%", minHeight: 0 }}>
                <Spin spinning={loadingPatients}>
                  <div style={{ height: "100%", minHeight: 0, overflow: "hidden" }}>
                    <QueueSidebar /* ให้การ์ดภายในสูงเต็ม แล้วใช้การ scroll ของมันเอง */
                      patients={patients}
                      maxHeight="100%"
                    />
                  </div>
                </Spin>
              </Col>

              {/* ตารางห้อง (เลื่อนขวาได้) */}
              <Col xs={24} md={18} style={{ height: "100%", minHeight: 0 }}>
                <div
                  style={{
                    height: "500px",
                    overflowY: "auto",
                    borderRadius: 12,
                    background: "#ffffffff",
                    paddingRight: 8,
                    border: "1px solid #ffffffff",
                  }}
                >
                  <Spin spinning={loading}>
                    {rooms.length === 0 ? (
                      <div style={{ padding: 32 }}>
                        <Empty description="ยังไม่มีข้อมูลห้องในวันนี้" />
                      </div>
                    ) : (
                      <Row gutter={[16, 16]}>
                        {rooms.map((room) => (
                          <Col key={room.roomId} xs={24} sm={12} lg={6}>
                            <RoomSchedule
                              room={room}
                              onAssignPatient={handleAssignPatient}
                              currentDate={date}
                              viewMode={view}
                            />
                          </Col>
                        ))}
                      </Row>
                    )}
                  </Spin>
                </div>
              </Col>
            </Row>
          </Content>
        </Layout>
      </DndProvider>
  );
};

export default QueuePage;
