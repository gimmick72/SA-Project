// src/interfaces/queue.ts

// ใช้ type สำหรับ literal union
export type SegKey   = "morning" | "afternoon" | "evening";
export type TimeSlot = SegKey;

// ── API Generic ─────────────────────────────────────────────
export interface IApiList<T> { data: T[] }
export interface IApiOk { ok: boolean }
export interface IApiError { error: string; details?: string }

// ── Services / Capacity ─────────────────────────────────────
export interface ICapacitySummary {
  morning: number;
  afternoon: number;
  evening: number;
}

export interface IServiceItem {
  id: number;
  name: string;
  durationMin?: number;
  price?: number;
}

// ── Manage slots (admin) ────────────────────────────────────
export interface IUpsertSlotItem {
  hhmm: string;          // "0900"
  capacity: number;      // 0 = ปิดรับ
}

export interface IUpsertSlotsPayload {
  date: string;          // "YYYY-MM-DD"
  segment: SegKey;
  slots: IUpsertSlotItem[];
}

export interface IQueueSlot {
  id: number;
  date: string;          // ISO string
  hhmm: string;          // "0900"
  segment: SegKey;
  capacity: number;
  used: number;
}

// ── Booking ─────────────────────────────────────────────────
export interface ICreateBookingPayload {
  firstName: string;
  lastName: string;
  phone: string;
  serviceId: number;
  date: string;          // "YYYY-MM-DD"
  timeSlot: TimeSlot;
}

export interface ICreateBookingResponse {
  id: number;
  date: string;          // "YYYY-MM-DD"
  hhmm: string;          // "0900"
  segment: SegKey;
}

export interface IBookingLite {
  id: number;
  firstName: string;
  lastName: string;
  phone?: string;
  date: string;          // ISO
  hhmm: string;
  segment: SegKey;
  status: "reserved" | "checked_in" | "done" | "cancelled";
}
