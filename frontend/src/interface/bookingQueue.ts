// src/interfaces/bookingQueue.ts

export type SegKey = "morning" | "afternoon" | "evening";
export type TimeSlot = SegKey;

// แสดงสรุปในหน้า booking ว่า วันนั้นยังเหลือกี่คิว
export interface CapacitySummary {
  morning: number;
  afternoon: number;
  evening: number;
}

// รายการบริการ
export interface ServiceItem {
  id: number;
  name_service: string;
}

// ใช้บอกช่วงเวลานี้รับได้จำนวนเท่าไร
export interface Slottime {
  hhmm: string;          // "0900"
  capacity: number;      // จำนวนที่เปิดรับ
}

// ใช้บอกเป็นช่วงใหญ่ๆ สรุปทั้งวันว่าช่วงเช้ารับกี่คิว บ่ายกี่คิว เย็นกี่คิว เป็นทั้งวัน
export interface UpdateSlot {
  date: string;          // "YYYY-MM-DD"
  segment: SegKey;
  slots: Slottime[];
}

// คิวจริงใน Database (ตรงกับ entity.QueueSlot ใน Go)
export interface QueueSlot {
  id: number;
  date: string;          // Backend ส่งมาเป็น ISO string
  hhmm: string;          // "0900"
  segment: SegKey;
  capacity: number;
  used: number; // จำนวนที่จองไป
}

// ส่งข้อมูลคนจอง (ตรงกับ entity.Booking ใน Go)
export interface CreateBooking {
  firstName: string;
  lastName: string;
  phone_number: string;  // ใช้ underscore ตาม backend
  serviceId: number;
  dateText: string;      // "YYYY-MM-DD" - ฟิลด์เสมือนสำหรับ frontend
  timeSlot: TimeSlot;    // จองช่วงเช้า บ่าย หรือ เย็น
}

// แสดงรายการการจอง (response จาก backend)
export interface SummaryBooking {
  id: number;
  firstName: string;
  lastName: string;
  phone_number?: string;        // Backend อาจส่งมาเป็น phoneNumbe  
  date: string;          // ISO date string
  hhmm: string;          // "0900"
  segment: SegKey;
  service?: {
    id: number;
    name_service: string;
  };
}

// // src/interface/bookingQueue.ts
// export type SegKey = "morning" | "afternoon" | "evening";
// export type TimeSlot = SegKey;

// // สรุปจำนวนคิวคงเหลือรายวัน
// export interface CapacitySummary {
//   morning: number;
//   afternoon: number;
//   evening: number;
// }

// // รายการบริการ
// export interface ServiceItem {
//   id: number;
//   name: string;
// }

// // โครงสร้าง slot รายชั่วโมง
// export interface Slottime {
//   hhmm: string;     // "0900"
//   capacity: number; // เปิดรับกี่คิว
// }

// export interface UpdateSlot {
//   date: string;     // "YYYY-MM-DD"
//   segment: SegKey;
//   slots: Slottime[];
// }

// // ตารางคิวจริงในระบบ
// export interface QueueSlot {
//   id: number;
//   date: string;     // ISO string
//   hhmm: string;     // "0900"
//   segment: SegKey;
//   capacity: number;
//   used: number;
// }

// // payload สำหรับสร้างการจอง (ตรงกับ backend)
// export interface CreateBooking {
//   firstName: string;
//   lastName: string;
//   phone_number: string; // ใช้ underscore
//   serviceId: number;
//   dateText: string;     // "YYYY-MM-DD"
//   timeSlot: TimeSlot;   // "morning" | "afternoon" | "evening"
// }

// // ผลลัพธ์เวลาค้นหาหรือดึงรายการจอง
// export interface SummaryBooking {
//   id: number;
//   firstName: string;
//   lastName: string;
//   phone_number?: string;     // บาง API อาจส่งหรือไม่ส่ง
//   date: string;              // ISO
//   hhmm: string;              // "0900"
//   segment: SegKey;
//   // รองรับทั้งแบบชื่อบริการแยกฟิลด์ และแบบเป็นอ็อบเจ็กต์
//   service_name?: string;
//   service?: { id: number; name: string };
// }
