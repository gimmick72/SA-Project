// src/services/schedule.ts
import { Dayjs } from "dayjs";
import { RoomScheduleData } from "../../pages/Systems/queue_info/types";

// ถ้าตั้ง Vite proxy ไว้ให้ /api วิ่งไป 8080 แล้ว ให้ตั้งเป็น "" ได้
const BASE = "http://localhost:8080";

function buildUrl(path: string, q?: Record<string, string>) {
  const url = new URL(`${BASE}${path}`);
  if (q) Object.entries(q).forEach(([k, v]) => url.searchParams.set(k, v));
  return url.toString();
}

export async function fetchRoomsByDate(date: Dayjs): Promise<RoomScheduleData[]> {
  const d = date.format("YYYY-MM-DD");
  const url = buildUrl("/api/schedule", { mode: "day", date: d }); // ชัดเจนตาม backend
  console.debug("[fetchRoomsByDate] GET", url);

  const res = await fetch(url);
  const text = await res.text();

  if (!res.ok) {
    console.error("[fetchRoomsByDate] error", res.status, text);
    throw new Error(text || `HTTP ${res.status}`);
  }

  try {
    const data = JSON.parse(text);
    console.debug("[fetchRoomsByDate] rooms:", Array.isArray(data) ? data.length : 0);
    return data;
  } catch {
    console.error("[fetchRoomsByDate] invalid JSON:", text);
    throw new Error("Invalid JSON from /api/schedule");
  }
}

export async function assignPatientApi(payload: any) {
  const url = `${BASE}/api/schedule/assign`;
  console.debug("[assignPatientApi] POST", url, payload);

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  if (!res.ok) {
    console.error("[assignPatientApi] error", res.status, text);
    throw new Error(text || `HTTP ${res.status}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    console.error("[assignPatientApi] invalid JSON:", text);
    throw new Error("Invalid JSON from /api/schedule/assign");
  }
}

/** โหลดรายชื่อคนไข้ให้ Sidebar (ถ้ายังไม่มีที่อื่น) */
export async function fetchPatients(date: Dayjs) {
  const d = date.format("YYYY-MM-DD");
  const url = buildUrl("/api/queue/patients", { date: d });
  console.debug("[fetchPatients] GET", url);

  const res = await fetch(url);
  const text = await res.text();

  if (!res.ok) {
    console.error("[fetchPatients] error", res.status, text);
    throw new Error(text || `HTTP ${res.status}`);
  }

  try {
    const data = JSON.parse(text);
    console.debug("[fetchPatients] patients:", Array.isArray(data) ? data.length : 0);
    // caseCode/durationMin เผื่อไว้ (optional) ตามที่ backend ส่งมา
    return data as Array<{
      id: string;
      name: string;
      type: "appointment" | "walkin";
      caseCode?: string;
      durationMin?: number;
    }>;
  } catch {
    console.error("[fetchPatients] invalid JSON:", text);
    throw new Error("Invalid JSON from /api/queue/patients");
  }
}
