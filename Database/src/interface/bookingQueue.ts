// src/interfaces/queue.ts

//กำหนดช่วงเวลา เช้า บ่าย เย็น
export type SegKey   = "morning" | "afternoon" | "evening";
export type TimeSlot = SegKey;


//แสดงสรุปในหน้า booking ว่า วันนั้นยังเหลือกี่คิว
export interface CapacitySummary {
  morning: number;
  afternoon: number;
  evening: number;
}

// รายการบริการ
export interface ServiceItem {
  id: number;
  name: string;
}

// ── Manage slots (admin) 
//ใช้บอกช่วงเวลานี้ระบได้จำนวนเท่าไร
export interface Slottime {
  hhmm: string;          // "0900"
  capacity: number;      // จำนวนที่เปิดรับ
}

//ใช้บอกเป็นช่วงใหญ่ๆ สรุปทั้งวันว่าช่วงเช้ารับกี่คิว บ่ายกี่คิว เย็นกี่คิว เป็นทั้งวัน
export interface UpdateSlot {
  date: string;          // "YYYY-MM-DD"
  segment: SegKey;
  slots: Slottime[];
}

//คิวจริงใน Database
export interface QueueSlot {
  id: number;
  date: string;          
  hhmm: string;          
  segment: SegKey;
  capacity: number;
  used: number; //จำนวนที่จองไป
}
//กันการซ้อนทับกันเวลาบันทึก

// ── Booking ─────────────────────────────────────────────────

//ส่งของคนของ
export interface CreateBooking {
  firstName: string;
  lastName: string;
  phone_number: string;
  serviceId: number;
  date: string;          // "YYYY-MM-DD"
  timeSlot: TimeSlot; //จองช่วงเช้า บ่าย หรือ เย็น
}

//แสดงรายการการจอง
export interface SummaryBooking {
  id: number;
  firstName: string;
  lastName: string;
  phone?: string;
  date: string;          // ISO
  hhmm: string;
  segment: SegKey;
}


