// เก็บ type ที่ใช้ใน QueueTable

/** -------------------- API Response Type -------------------- **/
export interface Symptomps {
  ID: number;
  Symptomps: string;
  Systolic: number;
  Diastolic: number;
  HeartRate: string;
  Visit: string;   // API ส่งเป็น string
  Weight: number;
  Height: number;
  ServiceID: number;
  PatientID: number;
  Patient?: {
    FirstName: string;
    LastName: string;
  };
  Service?: {
    Name: string;
  };
  Status?: {
    Name: string;
  };
}

/** -------------------- แปลงมาใช้ในตาราง -------------------- **/
export interface InitialSymtoms {
  id: number;          // rowKey
  firstName: string;
  lastName: string;
  service: string;
  status: string;
  symptomps: string;
  systolic: number;
  diastolic: number;
  heartrate: string;
  visit: Date;         // แปลง string → Date เวลา map
  weight: number;
  height: number;
  serviceID: number;
  patientID: number;
}

/** -------------------- Service & Category -------------------- **/
export interface Service {
  id?: number;
  name_service: string;
  detail_service: string;
  cost: number;
  category_id: number;
}

export interface Category {
  id?: number;
  name_category: string;
}

/** -------------------- Utilities -------------------- **/

export const statusColor: Record<string, string> = {
  "รอพบแพทย์": "orange",
  "กำลังตรวจ": "blue",
  "รอชำละเงิน": "ัyellow",
  "เสร็จสิ้น": "green",
};
