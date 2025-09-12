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

/* ===================== Services (REAL API) ===================== */
// ทั้งสองฟังก์ชันนี้จะยิง /api/services และคืน array ของบริการจากตารางจริง
export async function getService(): Promise<IServiceItem[]> {
  try {
    const { data } = await axios.get("/api/services");
    return (data?.data ?? data ?? []) as IServiceItem[];
  } catch {
    return [];
  }
}

export async function listServices(): Promise<IServiceItem[]> {
  try {
    const { data } = await axios.get("/api/services");
    return (data?.data ?? data ?? []) as IServiceItem[];
  } catch {
    return [];
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
    lastName:  (p.lastName ?? "").trim(),
    phone_number: String(p.phone_number ?? "").replace(/\D/g, ""),
    service_id: Number((p as any).service_id ?? (p as any).serviceId),
    dateText: dayjs(p.dateText).format("YYYY-MM-DD"),
    timeSlot: p.timeSlot,
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

export async function searchBookings(
  phone?: string,
  dateStr?: string
): Promise<SummaryBooking[]> {
  const params = new URLSearchParams();
  if (phone && phone.trim()) params.set("phone", phone.trim());
  if (dateStr && dateStr.trim()) params.set("date", dateStr.trim());

  const { data } = await axios.get(`/api/bookings/search?${params.toString()}`);
  return data?.data ?? [];
}
