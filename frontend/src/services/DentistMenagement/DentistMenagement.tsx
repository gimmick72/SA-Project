import axios from "axios";

// interface สำหรับข้อมูล DentistManagement
export interface DentistManagement {
  id?: number;
  room: string;
  time_in: string;   // ตรงกับ Go struct
  time_out: string;  // ตรงกับ Go struct
  dentist: string;
}

// baseURL ของ API (แก้ตาม backend จริง เช่น http://localhost:8080)
const API_URL = "http://localhost:8080";

// ---------------- API Functions ----------------

// ดึงข้อมูลทั้งหมด
export const getAllDentists = async (): Promise<DentistManagement[]> => {
  const res = await axios.get(`${API_URL}/api/dentistmanagement_controller`);
  return res.data;
};

// ดึงข้อมูลตาม ID
export const getDentistById = async (id: number): Promise<DentistManagement> => {
  const res = await axios.get(`${API_URL}/api/dentistmanagement_controller/${id}`);
  return res.data;
};

// สร้างข้อมูลใหม่
export const createDentist = async (data: DentistManagement): Promise<DentistManagement> => {
  const res = await axios.post(`${API_URL}/api/dentistmanagement_controller`, data);
  return res.data;
};


// อัปเดตข้อมูล
export const updateDentist = async (id: number, data: DentistManagement): Promise<DentistManagement> => {
  const res = await axios.put(`${API_URL}/api/dentistmanagement_controller/${id}`, data);
  return res.data;
};

// ลบข้อมูล
export const deleteDentist = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/api/dentistmanagement_controller/${id}`);
};
