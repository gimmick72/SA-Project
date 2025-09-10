import type { Promotion } from "./PromotionCard";

export const promotions: Promotion[] = [
  {
    title: "ฟอกสีฟันในคลินิก",
    subtitle: "In-Office Whitening",
    highlight: "พิเศษ 4,990.-",
    description: "ยิ้มสว่างใส ปลอดภัยโดยทันตแพทย์",
    perks: ["ใช้เวลา ~60-90 นาที", "ประเมินเฉดสีฟันก่อน-หลัง"],
    validity: "ถึงสิ้นเดือนนี้",
    ribbon: "HOT",
  },
  {
    title: "ขูดหินปูน + ตรวจสุขภาพช่องปาก",
    subtitle: "Scaling & Checkup",
    highlight: "เพียง 999.-",
    perks: ["ตรวจ X-ray เบื้องต้น (ถ้ามีข้อบ่งชี้)", "ให้คำแนะนำดูแลช่องปาก"],
    validity: "ถึง 30 ก.ย. 2568",
    ribbon: "-40%",
  },
  {
    title: "อุดฟันสีเหมือนฟัน (2 ซี่)",
    subtitle: "Tooth-Coloured Filling",
    highlight: "เริ่ม 1,500.-",
    description: "วัสดุคุณภาพ พร้อมรับประกันงานอุด 6 เดือน",
    validity: "ถึง 31 ต.ค. 2568",
  },
  {
    title: "รากฟันเทียม",
    subtitle: "Dental Implant",
    highlight: "ลดเพิ่ม 5,000.-/ซี่",
    perks: ["ผ่อน 0% สูงสุด 10 เดือน", "ฟรีประเมินแผนรักษา"],
    validity: "ถึง 31 ธ.ค. 2568",
    ribbon: "0% Installment",
  },
  {
    title: "จัดฟันใส ปรึกษาฟรี",
    subtitle: "Clear Aligner",
    highlight: "FREE Consultation",
    description: "สแกนฟันดิจิทัลและแผนรักษาเบื้องต้น",
    validity: "จองล่วงหน้าเท่านั้น",
  },
];
