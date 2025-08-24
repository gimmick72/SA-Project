// src/pages/queue_info/types.ts

export type Patient = {
  id: string;
  name: string;
  type: "appointment" | "walkin";
  caseCode?: string;     // ✅ ใช้แสดงใน chip/tooltip
  note?: string;         // ✅ หัตถการ/หมายเหตุ (tooltip)
  durationMin?: number;  // ✅ ระยะเวลาหัตถการ (tooltip)
};

export type TimeSlot = {
  time: string;          // "10:00"
  patient: Patient | null;
};

export type RoomScheduleData = {
  roomId: string;
  roomName: string;
  assignedDoctor?: string | null;
  timeSlots: TimeSlot[];
};


