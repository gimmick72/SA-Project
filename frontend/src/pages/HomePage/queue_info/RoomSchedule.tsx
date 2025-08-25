import React from "react";
import { Select, Card, Button } from "antd";
import { useDrop, useDrag } from "react-dnd";
import { Patient, RoomScheduleData, TimeSlot } from "./types";

interface Props {
  room: RoomScheduleData;
  onAssignPatient: (roomId: string, time: string, patient: Patient | null) => void;
}

const RoomSchedule: React.FC<Props> = ({ room, onAssignPatient }) => {
  const queueCount = room.timeSlots.filter((slot) => slot.patient !== null).length;


  const findNextAvailableSlot = (currentTime: string): string | null => {
    const index = room.timeSlots.findIndex(slot => slot.time === currentTime);
    if (index >= 0 && index < room.timeSlots.length - 1) {
      return room.timeSlots[index + 1].time;
    }
    return null;
  };

  const renderSlot = (slot: TimeSlot) => {
    // ทำให้ slot เป็น draggable ถ้ามีผู้ป่วย
    const [{ isDragging }, drag] = useDrag({
      type: "PATIENT",
      item: {
        patient: slot.patient,
        fromRoomId: room.roomId,
        fromTime: slot.time
      },
      canDrag: !!slot.patient, // ลากได้เฉพาะถ้ามีผู้ป่วย
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    // ทำให้ slot เป็น drop target
    const [{ isOver }, drop] = useDrop({
      accept: "PATIENT",
      drop: (item: { patient: Patient; fromRoomId?: string; fromTime?: string }) => {
        if (!item.patient) return;

        // ถ้าเป็นการ์ดนัด + ช่องนี้มี walk-in → เลื่อน walk-in
        if (
          item.patient.type === "appointment" &&
          slot.patient &&
          slot.patient.type === "walkin"
        ) {
          const nextTime = findNextAvailableSlot(slot.time);
          if (nextTime) {
            onAssignPatient(room.roomId, nextTime, slot.patient);
          }
        }

        // ถ้ามาจาก slot อื่น → ลบจาก slot เดิม
        if (item.fromRoomId && item.fromTime) {
          onAssignPatient(item.fromRoomId, item.fromTime, null);
        }

        // ใส่ลง slot ปัจจุบัน
        onAssignPatient(room.roomId, slot.time, item.patient);
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    });

    return (
      <div
        key={slot.time}
        ref={(node) => drag(drop(node))}
        style={{
          height: 60,
          border: "1px solid #ccc",
          marginBottom: 4,
          padding: 8,
          backgroundColor: isOver ? "#e6f7ff" : "#fff",
          borderRadius: 6,
          opacity: isDragging ? 0.5 : 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontSize: 12, marginBottom: 4 }}>{slot.time}</div>
          {slot.patient && (
            <div
              style={{
                backgroundColor:
                  slot.patient.type === "appointment" ? "#FAAD14" : "#722ED1",
                color: "#fff",
                padding: "2px 6px",
                borderRadius: 4,
                fontWeight: 500,
                fontSize: 14,
              }}
            >
              {slot.patient.name}
            </div>
          )}
        </div>

        {slot.patient && (
          <Button
            size="small"
            danger
            onClick={() => onAssignPatient(room.roomId, slot.time, null)}
          >
            ลบ
          </Button>
        )}
      </div>
    );
  };

  return (
    <Card
      title={
        <div>
          <div style={{ fontWeight: 600, marginBottom: 8}}>
            {room.roomName} ({queueCount} คิว)
          </div>
          <Select
            defaultValue={room.assignedDoctor || undefined}
            placeholder="เลือกทันตแพทย์"
            style={{ width: "100%" }}
          >
            <Select.Option value="dr-a">ทันตแพทย์ A</Select.Option>
            <Select.Option value="dr-b">ทันตแพทย์ B</Select.Option>
            <Select.Option value="dr-c">ทันตแพทย์ C</Select.Option>
            <Select.Option value="dr-d">ทันตแพทย์ D</Select.Option>
          </Select>
        </div>
      }
      style={{
        marginBottom: 24,
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
      bodyStyle={{ padding: 12 }}
    >
      {room.timeSlots.map(renderSlot)}
    </Card>
  );
};

export default RoomSchedule;
