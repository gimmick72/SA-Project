import dayjs from "dayjs";
import { Person } from "./types";

export const MOCK_APPOINTMENTS: Person[] = [
  { id: 1, firstName: "สมชาย", lastName: "ใจดี", type: "จอง", date: dayjs().format("YYYY-MM-DD"), timeStart: "08:00", timeEnd: "08:30", service: "ขูดหินปูน", doctor: "นพ.กิตติ", room: "X001", status: "รอเช็คอิน" },
  { id: 2, firstName: "กนกวรรณ", lastName: "รื่นรมย์", type: "จอง", date: dayjs().format("YYYY-MM-DD"), timeStart: "08:30", timeEnd: "09:00", service: "อุดฟัน", doctor: "นพ.กิตติ", room: "X001", status: "เช็คอินแล้ว" },
  { id: 3, firstName: "ธนกฤต", lastName: "ชัยพร", type: "จอง", date: dayjs().format("YYYY-MM-DD"), timeStart: "09:00", timeEnd: "09:30", service: "ถอนฟัน", doctor: "ทพญ.วริศรา", room: "X002", status: "รอตรวจ" },
  { id: 4, firstName: "วริศรา", lastName: "มากดี", type: "จอง", date: dayjs().format("YYYY-MM-DD"), timeStart: "09:30", timeEnd: "10:00", service: "ขูดหินปูน", doctor: "ทพญ.วริศรา", room: "X003", status: "กำลังตรวจ" },
  { id: 5, firstName: "พิชญา",  lastName: "สุนทร",  type: "จอง", date: dayjs().format("YYYY-MM-DD"), timeStart: "10:00", timeEnd: "10:30", service: "อุดฟัน", doctor: "นพ.กิตติ", room: "X001", status: "เสร็จสิ้น" },
];

export const MOCK_WALKINS: Person[] = [
  { id: 101, firstName: "จิรายุ",  lastName: "ทองแท้", type: "วอล์คอิน", date: dayjs().format("YYYY-MM-DD"), timeStart: "10:30", timeEnd: "11:00", service: "ขูดหินปูน", doctor: "ทพญ.วริศรา", room: "X003", status: "เช็คอินแล้ว" },
  { id: 102, firstName: "นภัสกร", lastName: "อิ่มสุข", type: "วอล์คอิน", date: dayjs().format("YYYY-MM-DD"), timeStart: "11:00", timeEnd: "11:30", service: "ขูดหินปูน", doctor: "นพ.กิตติ", room: "X001", status: "รอตรวจ" },
  { id: 103, firstName: "กิตติ",   lastName: "โสภา",  type: "วอล์คอิน", date: dayjs().format("YYYY-MM-DD"), timeStart: "13:00", timeEnd: "13:30", service: "อุดฟัน", doctor: "นพ.กิตติ", room: "X002", status: "รอเช็คอิน" },
  { id: 104, firstName: "ปาณิสรา", lastName: "จิตดี", type: "วอล์คอิน", date: dayjs().format("YYYY-MM-DD"), timeStart: "13:30", timeEnd: "14:00", service: "ถอนฟัน", doctor: "ทพญ.วริศรา", room: "X003", status: "เสร็จสิ้น" },
];
