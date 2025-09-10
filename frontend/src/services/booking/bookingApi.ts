// services/booking/bookingApi.ts
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";

/* ===================== Types ===================== */
export type TimeSlot = "morning" | "afternoon" | "evening";

export interface IServiceItem { id: number; name: string; }

export interface ICapacitySummary {
  morning: number;
  afternoon: number;
  evening: number;
}

export interface ICreateBookingPayload {
  firstName: string;
  lastName: string;
  phone: string;
  serviceId: number;
  date: Dayjs | string;     // Dayjs object หรือ YYYY-MM-DD
  timeSlot: TimeSlot;
}

/* ===================== Utils ===================== */
// ส่งวันเป็นสตริงตามปฏิทินผู้ใช้ แล้วให้ backend normalize เองเป็น UTC midnight
const toDateStr = (d: Dayjs | string) =>
  dayjs(d).startOf("day").format("YYYY-MM-DD");

/* ===================== Services (MOCK) ===================== */
// ใช้ mock 100% ให้ dropdown มีข้อมูลแน่นอน
const MOCK_SERVICES: IServiceItem[] = [
  { id: 1, name: "ตรวจสุขภาพช่องปาก" },
  { id: 2, name: "ขูดหินปูน" },
  { id: 3, name: "อุดฟัน" },
  { id: 4, name: "ถอนฟัน" },
  { id: 5, name: "เอ็กซเรย์ช่องปาก" },
];

// เรียกตัวนี้ในหน้า Booking
export async function getService(): Promise<IServiceItem[]> {
  // delay เล็กน้อยให้เหมือนเรียก API
  await new Promise((r) => setTimeout(r, 200));
  return MOCK_SERVICES;
}

// ถ้าในอนาคตมี backend จริง ๆ อยากใช้แทน mock ก็ใช้ตัวนี้ได้
export async function listServices(): Promise<IServiceItem[]> {
  try {
    const { data } = await axios.get("/api/services");
    return data?.data ?? data ?? [];
  } catch {
    return MOCK_SERVICES;
  }
}

/* ===================== Booking APIs ===================== */
export async function getCapacityByDate(d: Dayjs | string): Promise<ICapacitySummary> {
  const date = toDateStr(d);
  const { data } = await axios.get("/api/queue/capacity", { params: { date } });
  return {
    morning: data?.morning ?? 0,
    afternoon: data?.afternoon ?? 0,
    evening: data?.evening ?? 0,
  };
}

export async function createBooking(p: ICreateBookingPayload) {
  const payload = { ...p, date: toDateStr(p.date) };
  const { data } = await axios.post("/api/bookings", payload);
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
): Promise<
  Array<{
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
    status: string;
    date: string;
    hhmm: string;
    segment: TimeSlot;
  }>
> {
  const date = toDateStr(d);
  const { data } = await axios.get("/api/bookings", { params: { date } });
  return data?.data ?? [];
}
