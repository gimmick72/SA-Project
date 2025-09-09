// src/pages/queue_info/RoomSchedule.tsx
import React, { useMemo } from "react";
import { Card, Button } from "antd";
import { useDrop, useDrag } from "react-dnd";
import { Patient, RoomScheduleData, TimeSlot,ViewMode } from "./types";
import { Dayjs } from "dayjs";

interface Props {
  room: RoomScheduleData;
  onAssignPatient: (
    roomId: string,
    time: string,
    patient: Patient | null,
    from?: { roomId: string; time: string }
  ) => void;
  /** ความสูงของเนื้อในการ์ด รับได้ทั้ง px (number) หรือ "100%" เพื่อให้เต็มพื้นที่ */
  maxBodyHeight?: number | string;
  currentDate?: Dayjs; 
  viewMode:ViewMode;
}

export default function RoomSchedule({
  room,
  onAssignPatient,
  maxBodyHeight = 520,
}: Props) {
  // นับจำนวนคิวในห้อง
  const queueCount = useMemo(
    () => room.timeSlots.filter((s) => !!s.patient).length,
    [room.timeSlots]
  );

  const renderSlot = (slot: TimeSlot) => {
    const [{ isDragging }, drag] = useDrag(
      () => ({
        type: "PATIENT",
        item: { patient: slot.patient, fromRoomId: room.roomId, fromTime: slot.time },
        canDrag: !!slot.patient,
        collect: (m) => ({ isDragging: m.isDragging() }),
      }),
      [slot, room.roomId]
    );

    const [{ isOver }, drop] = useDrop(
      () => ({
        accept: "PATIENT",
        drop: (it: { patient: Patient; fromRoomId?: string; fromTime?: string }) => {
          onAssignPatient(
            room.roomId,
            slot.time,
            it.patient,
            it.fromRoomId && it.fromTime ? { roomId: it.fromRoomId, time: it.fromTime } : undefined
          );
        },
        collect: (m) => ({ isOver: m.isOver() }),
      }),
      [slot, room.roomId]
    );

    const occupied = !!slot.patient;
    const bg = isOver ? "#e6f7ff" : "#fff";
    const pill = slot.patient?.type === "appointment" ? "#FAAD14" : "#722ED1";

    return (
      <div
        key={slot.time}
        ref={(n) => drag(drop(n))}
        style={{
          height: 64,
          padding: 10,
          marginBottom: 8,
          border: "1px solid #eee",
          borderRadius: 8,
          background: bg,
          opacity: isDragging ? 0.6 : 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12, color: "#8c8c8c", marginBottom: 6 }}>{slot.time}</div>
          {occupied ? (
            <span
              style={{
                background: pill,
                color: "#fff",
                padding: "2px 8px",
                borderRadius: 6,
                fontWeight: 600,
                display: "inline-block",
                maxWidth: 240,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={slot.patient!.name}
            >
              {slot.patient!.name}
            </span>
          ) : (
            <span style={{ color: "#bbb" }}>ว่าง</span>
          )}
        </div>

        {occupied && (
          <Button
            size="small"
            danger
            onClick={(e) => {
              e.stopPropagation();
              onAssignPatient(room.roomId, slot.time, null);
            }}
          >
            ลบ
          </Button>
        )}
      </div>
    );
  };

  // จัดการความสูงภายในการ์ดให้เลื่อน (scroll) ได้
  const bodyStyle =
    typeof maxBodyHeight === "number"
      ? { padding: 12, maxHeight: maxBodyHeight, overflowY: "auto" as const }
      : { padding: 12, height: maxBodyHeight, overflowY: "auto" as const };

  return (
    <Card
      title={`${room.roomName} (${queueCount} คิว)`}
      style={{ borderRadius: 12 }}
      bodyStyle={bodyStyle}
    >
      {room.timeSlots.map(renderSlot)}
    </Card>
  );
}
