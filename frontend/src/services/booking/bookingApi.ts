// src/services/bookingApi.ts
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";

export type TimeSlot = "morning" | "afternoon" | "evening";

export type ServiceItem = {
  id: number;
  name: string;
  durationMin?: number;
  price?: number;
};

export async function listServices(): Promise<ServiceItem[]> {
  // TODO: ผูกกับ backend จริง
  const { data } = await axios.get("/api/services"); // <-- ถ้า backend ยังไม่มี ให้ mock ด้านล่างแทน
  return data?.data ?? [];
  // ถ้าอยาก mock ชั่วคราว ให้ return [
  //   { id: 1, name: "ตรวจสุขภาพช่องปาก" },
  //   { id: 2, name: "ขูดหินปูน" },
  //   { id: 3, name: "อุดฟัน" },
  // ];
}

export async function getCapacityByDate(d: Dayjs | null): Promise<Record<TimeSlot, number>> {
  if (!d) return { morning: 0, afternoon: 0, evening: 0 };
  const dateStr = d.format("YYYY-MM-DD");
  // TODO: ผูกกับ backend จริง
  const { data } = await axios.get(`/api/queue/capacity`, { params: { date: dateStr } });
  // รูปแบบที่คาดหวัง: { morning: number, afternoon: number, evening: number }
  return data ?? { morning: 0, afternoon: 0, evening: 0 };
  // ถ้าจะ mock: return d.day() === 0 ? { morning: 0, afternoon: 0, evening: 0 } : { morning: 5, afternoon: 5, evening: 5 };
}

export async function createBooking(payload: {
  firstName: string;
  lastName: string;
  phone: string;
  serviceId: number;
  date: string;         // YYYY-MM-DD
  timeSlot: TimeSlot;   // "morning" | "afternoon" | "evening"
}) {
  // TODO: ผูกกับ backend จริง
  const { data } = await axios.post("/api/bookings", payload);
  return data;
}
