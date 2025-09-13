export type ViewMode = "day" | "week";
export type Patient = {
  id: string;
  name: string;
  type: "appointment" | "walkin";
  caseCode?: string;
  note?: string;
  durationMin?: number;
  uiType?: "appointment" | "walkin";
};

export type TimeSlot = { time: string; patient: Patient | null };
export type RoomScheduleData = { roomId: string; roomName: string; timeSlots: TimeSlot[] };

