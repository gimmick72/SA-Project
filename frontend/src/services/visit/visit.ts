// src/services/visit/visitApi.ts
import dayjs, { Dayjs } from "dayjs";

export const API_BASE =
  (import.meta as any)?.env?.VITE_API_BASE || "http://localhost:8080";

export type VisitStatus = "queued" | "in_treatment" | "payment" | "done";

export interface VisitRow {
  id: number;
  visit: string; // ISO string e.g. "2025-09-12T10:30:00Z"
  patientID: number;
  serviceID: number;

  patient: {
    prefix?: string;
    firstname: string;
    lastname: string;
    nickname?: string;
    citizenID?: string;
  };

  service: {
    name: string; // แสดงชื่อบริการ
  };

  // ตอนนี้ยังไม่มีฟิลด์สถานะใน DB ก็ให้ default เป็น "queued" ไปก่อน
  status?: VisitStatus;
}

// GET /api/visits?date=YYYY-MM-DD
export async function fetchVisitsByDate(date: Dayjs | string): Promise<VisitRow[]> {
  const d = typeof date === "string" ? date : dayjs(date).format("YYYY-MM-DD");
  const res = await fetch(`${API_BASE}/api/visits?date=${d}`, {
    headers: { "Accept": "application/json" },
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(t || `Fetch visits failed (${res.status})`);
  }
  const data = await res.json();
  // เติมสถานะ default ถ้า backend ยังไม่ส่งมา
  return (Array.isArray(data) ? data : data?.data || []).map((row: any) => ({
    id: Number(row.id ?? row.ID),
    visit: row.visit ?? row.Visit,
    patientID: Number(row.patientID ?? row.PatientID),
    serviceID: Number(row.serviceID ?? row.ServiceID),
    patient: {
      prefix: row?.patient?.prefix ?? row?.Patient?.prefix,
      firstname: row?.patient?.firstname ?? row?.Patient?.firstname ?? row?.firstname,
      lastname: row?.patient?.lastname ?? row?.Patient?.lastname ?? row?.lastname,
      nickname: row?.patient?.nickname ?? row?.Patient?.nickname,
      citizenID: row?.patient?.citizenID ?? row?.Patient?.citizenID,
    },
    service: {
      name:
        row?.service?.name ??
        row?.Service?.name ??
        row?.Service?.NameService ??
        row?.nameService ??
        "",
    },
    status:
      (row?.status ??
        row?.Status ??
        "queued") as VisitStatus,
  }));
}

// (เผื่อไว้อนาคต) เปลี่ยนสถานะ
export async function updateVisitStatus(id: number, status: VisitStatus) {
  const res = await fetch(`${API_BASE}/api/visits/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(t || `Update status failed (${res.status})`);
  }
  return res.json().catch(() => ({}));
}
