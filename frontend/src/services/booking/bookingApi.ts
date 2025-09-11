// services/booking/bookingApi.ts
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";

// ---- ใช้ type กลางจาก interfaces ----
import type {
  TimeSlot,
  CapacitySummary,
  CreateBooking as CreateBookingPayload,
  SummaryBooking,
  ServiceItem as _ServiceItem,
} from "../../interface/bookingQueue";

// re-export ให้หน้าอื่น import จาก services ได้เหมือนเดิม
export type { TimeSlot } from "../../interface/bookingQueue";
export type IServiceItem = _ServiceItem;

/* ===================== Utils ===================== */
const toDateStr = (d: Dayjs | string) =>
  dayjs(d).startOf("day").format("YYYY-MM-DD");

/* ===================== Services (MOCK) ===================== */
const MOCK_SERVICES: IServiceItem[] = [
  { id: 1, name: "ตรวจสุขภาพช่องปาก" },
  { id: 2, name: "ขูดหินปูน" },
  { id: 3, name: "อุดฟัน" },
  { id: 4, name: "ถอนฟัน" },
  { id: 5, name: "เอ็กซเรย์ช่องปาก" },
];

export async function getService(): Promise<IServiceItem[]> {
  await new Promise((r) => setTimeout(r, 200));
  return MOCK_SERVICES;
}

export async function listServices(): Promise<IServiceItem[]> {
  try {
    const { data } = await axios.get("/api/services");
    return data?.data ?? data ?? [];
  } catch {
    return MOCK_SERVICES;
  }
}

/* ===================== Booking APIs ===================== */
export async function getCapacityByDate(d: Dayjs | string): Promise<CapacitySummary> {
  const date = toDateStr(d);
  const { data } = await axios.get("/api/queue/capacity", { params: { date } });
  return {
    morning: data?.morning ?? 0,
    afternoon: data?.afternoon ?? 0,
    evening: data?.evening ?? 0,
  };
}

// ⬇️ รับ CreateBooking จาก interfaces (มี dateText / phone_number)
export async function createBooking(p: CreateBookingPayload) {
  const body = {
    firstName: (p.firstName ?? "").trim(),
    lastName: (p.lastName ?? "").trim(),
    phone_number: String(p.phone_number ?? "").replace(/\D/g, ""),        // ให้เป็นตัวเลขล้วน
    service_id: Number((p as any).service_id ?? p.serviceId),             // << map ไปเป็น service_id
    dateText: dayjs(p.dateText).format("YYYY-MM-DD"),
    timeSlot: p.timeSlot,                                                 // "morning" | "afternoon" | "evening"
  };

  const { data } = await axios.post("/api/bookings", body, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
}

/* ===================== Admin (ManageQueue) ===================== */
export async function upsertSlots(
  d: Dayjs | string,
  segment: TimeSlot,
  slots: { hhmm: string; capacity: number }[]
) {
  const date = toDateStr(d);
  const { data } = await axios.post("/api/queue/slots", { date, segment, slots });
  return data;
}

export async function listSlotsByDate(
  d: Dayjs | string
): Promise<Array<{ hhmm: string; capacity: number; segment: TimeSlot }>> {
  const date = toDateStr(d);
  const { data } = await axios.get("/api/queue/slots", { params: { date } });
  return data?.data ?? [];
}

export async function listBookingsByDate(
  d: Dayjs | string
): Promise<SummaryBooking[]> {
  const date = toDateStr(d);
  const { data } = await axios.get("/api/bookings", { params: { date } });
  return (data?.data ?? []) as SummaryBooking[];
}

export async function searchBookingsByPhone(
  phone: string,
  date?: string | Dayjs
): Promise<SummaryBooking[]> {
  const params: Record<string, string> = {};
  if (phone) params.phone = phone.trim();
  if (date) params.date = typeof date === "string" ? date : dayjs(date).format("YYYY-MM-DD");

  const { data } = await axios.get("/api/bookings/search-by-phone", { params });
  return (data?.data ?? []) as SummaryBooking[];
}
