// src/services/schedule.ts
import dayjs, { Dayjs } from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);

export const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export type ViewMode = "day" | "week";

// 👉 ถ้ามี type ของ RoomScheduleData อยู่ที่ src/pages/queue_info/types
// จะดีมากถ้าใส่ typing ให้ชัด
export type RoomScheduleData = {
  roomId: string;
  roomName: string;
  assignedDoctor: string | null;
  timeSlots: { time: string; patient: null | {
    id: string; name: string; type: "appointment" | "walkin";
    caseCode?: string; note?: string; durationMin?: number;
  }}[];
};

function makeWeekRange(d: Dayjs) {
  // ใช้ ISO week เพื่อให้ตรงกับ UX ส่วนใหญ่ (จันทร์เริ่มสัปดาห์)
  const start = d.startOf("isoWeek").format("YYYY-MM-DD");
  const end   = d.endOf("isoWeek").format("YYYY-MM-DD");
  return { start, end };
}

export async function fetchRoomsByDate(
  mode: ViewMode,
  date: Dayjs,
  signal?: AbortSignal
): Promise<RoomScheduleData[]> {
  const qs =
    mode === "day"
      ? new URLSearchParams({ mode, date: date.format("YYYY-MM-DD") })
      : new URLSearchParams({ mode, ...makeWeekRange(date) });

  const res = await fetch(`${BASE_URL}/api/schedule?${qs.toString()}`, { signal });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export type AssignPayload = {
  date: string;            // YYYY-MM-DD
  roomId: string;
  time: string;            // HH:mm
  patientId: string | null;
  fromRoomId?: string;
  fromTime?: string;

  // ใช้ให้ backend ตัดสินใจ/แสดงผล
  patientName?: string;
  type?: "appointment" | "walkin";
  caseCode?: string;
  note?: string;
  durationMin?: number;
};

export async function assignPatientApi(payload: AssignPayload) {
  const res = await fetch(`${BASE_URL}/api/schedule/assign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}
