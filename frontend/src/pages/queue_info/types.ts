// src/pages/queue_info/types.ts

export type PatientType = "walkin" | "appointment";

export interface Patient {
  id: string;
  name: string;
  type: PatientType;
}

export interface TimeSlot {
  time: string; // เช่น "10:00", "10:30"
  patient: Patient | null;
}

export interface RoomScheduleData {
  roomId: string;
  roomName: string;
  assignedDoctor: string | null;
  timeSlots: TimeSlot[];
}
