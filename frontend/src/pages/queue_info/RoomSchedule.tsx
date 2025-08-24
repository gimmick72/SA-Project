// src/pages/queue_info/RoomSchedule.tsx
import React from "react";
import { Select, Card, Button, Tooltip, Typography } from "antd";
import { useDrop, useDrag } from "react-dnd";
import dayjs, { Dayjs } from "dayjs";
import { Patient, RoomScheduleData, TimeSlot } from "./types";

type ViewMode = "day" | "week";

interface Props {
  room: RoomScheduleData;
  doctorOptions?: { value: string; label: string }[];
  onAssignDoctor?: (roomId: string, doctorId: string | null) => void;
  onAssignPatient: (
  roomId: string,
  time: string,
  patient: Patient | null,
  from?: { roomId: string; time: string }
) => void;
  onSlotClick?: (roomId: string, slot: TimeSlot) => void;
  maxBodyHeight?: number;

  // ✅ รับจากหน้า parent เพื่อแสดง/ใช้กรองในอนาคต
  currentDate?: Dayjs;     // ex. dayjs()
  viewMode?: ViewMode;     // "day" | "week"
}

const RoomSchedule: React.FC<Props> = ({
  room,
  doctorOptions = [
    { value: "dr-a", label: "ทันตแพทย์ A" },
    { value: "dr-b", label: "ทันตแพทย์ B" },
  ],
  onAssignDoctor,
  onAssignPatient,
  onSlotClick,
  maxBodyHeight = 520,
  currentDate,
  viewMode = "day",
}) => {
  const queueCount = room.timeSlots.filter((s) => !!s.patient).length;

  // แสดง label วันที่/สัปดาห์ใต้ชื่อห้อง (pure UI)
  const dateLabel = (() => {
    if (!currentDate) return undefined;
    if (viewMode === "day") return currentDate.format("dddd, D MMM YYYY");
    const start = currentDate.startOf("week");
    const end = currentDate.endOf("week");
    return `${start.format("D MMM")} - ${end.format("D MMM YYYY")}`;
  })();

  const findNextFreeTime = (currentTime: string): string | null => {
    const idx = room.timeSlots.findIndex((s) => s.time === currentTime);
    if (idx < 0) return null;
    for (let i = idx + 1; i < room.timeSlots.length; i++) {
      if (!room.timeSlots[i].patient) return room.timeSlots[i].time;
    }
    return null;
  };

  const handleDropToSlot = (
  slot: TimeSlot,
  dragItem: { patient: Patient; fromRoomId?: string; fromTime?: string }
) => {
  const incoming = dragItem.patient;
  if (!incoming) return;

  // ✅ สร้าง object 'from' ให้ถูกต้อง
  const from =
    dragItem.fromRoomId && dragItem.fromTime
      ? { roomId: dragItem.fromRoomId, time: dragItem.fromTime }
      : undefined;

  // ✅ ส่งอาร์กิวเมนต์ตรง signature: (roomId, time, patient, from?)
  onAssignPatient(room.roomId, slot.time, incoming, from);
};

  const renderSlot = (slot: TimeSlot) => {
    const [{ isDragging }, drag] = useDrag({
      type: "PATIENT",
      item: { patient: slot.patient, fromRoomId: room.roomId, fromTime: slot.time },
      canDrag: !!slot.patient,
      collect: (m) => ({ isDragging: m.isDragging() }),
    });

    const [{ isOver }, drop] = useDrop({
      accept: "PATIENT",
      drop: (item: { patient: Patient; fromRoomId?: string; fromTime?: string }) =>
        handleDropToSlot(slot, item),
      collect: (m) => ({ isOver: m.isOver() }),
    });

    const occupied = !!slot.patient;
    const pillColor = slot.patient?.type === "appointment" ? "#FAAD14" : "#722ED1";

    const content = (
      <div
        key={slot.time}
        ref={(n) => drag(drop(n))}
        onDoubleClick={() => onSlotClick?.(room.roomId, slot)}
        style={{
          height: 64,
          border: "1px solid #e5e7eb",
          marginBottom: 6,
          padding: 10,
          backgroundColor: isOver ? "#e6f7ff" : "#fff",
          borderRadius: 8,
          opacity: isDragging ? 0.55 : 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: occupied ? "grab" : "pointer",
        }}
        onClick={() => onSlotClick?.(room.roomId, slot)}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12, color: "#8c8c8c", marginBottom: 6 }}>{slot.time}</div>
          {occupied ? (
            <div
              style={{
                background: pillColor,
                color: "#fff",
                padding: "2px 8px",
                borderRadius: 6,
                fontWeight: 600,
                fontSize: 14,
                maxWidth: 220,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {slot.patient!.name}
              {slot.patient!.caseCode ? `  #${slot.patient!.caseCode}` : ""}
            </div>
          ) : (
            <div style={{ color: "#bfbfbf" }}>ว่าง</div>
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

    return occupied ? (
      <Tooltip
        key={slot.time}
        placement="right"
        title={
          <div style={{ maxWidth: 280 }}>
            <div>
              <b>เวลา:</b> {slot.time}
              {slot.patient?.durationMin ? ` (${slot.patient?.durationMin} นาที)` : ""}
            </div>
            <div>
              <b>ผู้ป่วย:</b> {slot.patient?.name}
            </div>
            {slot.patient?.caseCode && (
              <div>
                <b>รหัสเคส:</b> {slot.patient?.caseCode}
              </div>
            )}
            {slot.patient?.note && (
              <div>
                <b>หัตถการ:</b> {slot.patient?.note}
              </div>
            )}
            <div>
              <b>ประเภท:</b> {slot.patient?.type === "appointment" ? "นัดหมาย" : "Walk-in"}
            </div>
          </div>
        }
      >
        {content}
      </Tooltip>
    ) : (
      content
    );
  };

  return (
    <Card
      title={
        <div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            {room.roomName} ({queueCount} คิว)
          </div>

          {/* แสดงช่วงวันที่ที่เลือกจากแถบด้านบน */}
          {dateLabel && (
            <Typography.Text type="secondary" style={{ display: "block", marginBottom: 8 }}>
              {dateLabel}
            </Typography.Text>
          )}

          {/* เลือกทันตแพทย์ประจำห้อง */}
          <Select
            allowClear
            value={room.assignedDoctor || undefined}
            placeholder="เลือกทันตแพทย์"
            style={{ width: "100%" }}
            onChange={(v) => onAssignDoctor?.(room.roomId, v ?? null)}
            options={doctorOptions}
          />
        </div>
      }
      style={{ marginBottom: 24, borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
      bodyStyle={{ padding: 12, maxHeight: maxBodyHeight, overflowY: "auto" }}
    >
      {room.timeSlots.map(renderSlot)}
    </Card>
  );
};

export default RoomSchedule;
