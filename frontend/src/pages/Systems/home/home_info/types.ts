export type Person = {
  id: number;
  firstName: string;
  lastName: string;
  type: "จอง" | "วอล์คอิน";
  date: string;        // YYYY-MM-DD
  timeStart: string;   // HH:mm
  timeEnd: string;     // HH:mm
  service: string;
  doctor: string;
  room: string;
  status: "รอเช็คอิน" | "เช็คอินแล้ว" | "รอตรวจ" | "กำลังตรวจ" | "เสร็จสิ้น" | "ยกเลิก";
};

export const serviceColor = (s: string) =>
  s === "อุดฟัน" ? "gold" : s === "ถอนฟัน" ? "volcano" : "geekblue";
export const typeColor = (t: Person["type"]) => (t === "จอง" ? "processing" : "purple");
export const statusColor: Record<Person["status"], any> = {
  "รอเช็คอิน": "default",
  "เช็คอินแล้ว": "processing",
  "รอตรวจ": "geekblue",
  "กำลังตรวจ": "orange",
  "เสร็จสิ้น": "success",
  "ยกเลิก": "error",
};
