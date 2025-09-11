// src/pages/queue_info/index.tsx
import React, { useEffect, useCallback, useState } from "react";
import {
  Row, Col, Layout, Card, DatePicker, Button,
  Space, Typography, message, Spin, Empty
} from "antd";
import QueueSidebar from "./QueueSidebar";
import RoomSchedule from "./RoomSchedule";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Patient, RoomScheduleData as RoomDataFromTypes } from "./types";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/th";
import { assignPatientApi, fetchRoomsByDate } from "../../../services/queue/schedule";

dayjs.locale("th");

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

  const [patients, setPatients] = useState<Patient[]>([]);
  const [rooms, setRooms] = useState<RoomDataFromTypes[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(false);

  // ปรับเลขตามความสูง header/topbar ของโปรเจกต์จริง
  const PANEL_HEIGHT = "calc(150vh - 200px)";

  // โหลดคิวทั้งหมด (sidebar)
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
    return () => {
      alive = false;
    };
  }, []);

  // โหลดตารางห้องตามวันที่
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

  // จัดคิว (ลาก-วาง)
  const handleAssignPatient = useCallback(
    async (
      roomId: string,
      time: string,
      patient: Patient | null,
      from?: { roomId: string; time: string }
    ) => {
      const prevRooms = rooms;
      // optimistic update
      setRooms((current) => {
        const clone = current.map((r) => ({
          ...r,
          timeSlots: r.timeSlots.map((s) => ({ ...s })),
        }));
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
        setRooms(prevRooms); // rollback
        message.error(e?.message || "บันทึกการจัดคิวไม่สำเร็จ");
      }
    },
    [rooms, date, load]
  );

  return (
  <div
    style={{
      display: "flex",
      padding: '1rem',
      height: "40%",
      flexDirection: "column",
      overflowY: "auto",
      overflowX: "auto",
      border: "none 2px #000000",
      
    }}
  >
    <DndProvider backend={HTML5Backend}>
        {/* Toolbar: วันที่อยู่บนสุด */}
        <Card style={{ marginBottom: 1 }} size="small" >
          <Space size="small" wrap>
            <DatePicker
              allowClear={false}
              value={date}
              picker="date"
              onChange={(d) => d && setDate(d)}
              size="small"
              style={{ width: 150, border: "none 2px #000000" }}
            />
            <Button onClick={() => setDate(dayjs())}>Today</Button>
          </Space>
        </Card>

        {/* Panels: ใต้วันที่ = ซ้าย (คิวทั้งหมด) | ขวา (ตารางห้อง) */}
        <Row gutter={10} style={{ height: "40%", minHeight: 0, border: "none 2px #000000" }}>
          {/* ซ้าย: คิวทั้งหมด */}
          <Col xs={24} md={6} style={{ height: "40%", minHeight: 0,border: "none 2px #000000" }}>
            <Spin spinning={loadingPatients}>
              <div
                style={{
                  height: "50%",
                  minHeight: 0,
                  overflow: "hidden",
                  border: "none 2px #000000" 
                }}
              >
                <QueueSidebar patients={patients} maxHeight="100%"  />
              </div>
            </Spin>
          </Col>

          {/* ขวา: ตารางห้อง */}
          <Col xs={20} md={18} style={{ height: "40%", border: "none 2px #000000", }}>
            <div
              style={{
                height: "40%",
                marginBottom: 0,
                minHeight: 0,
                borderRadius: 5,
                background: "#fff",
                border: "none 2px #000000",
                overflow: "hidden",
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
                          currentDate={date} viewMode={"week"}                        />
                      </Col>
                    ))}
                  </Row>
                )}
              </Spin>
            </div>
          </Col>
        </Row>
      
    </DndProvider>
  </div>
);

};

export default QueuePage;
