//frontend/src/services/https/Staff.tsx 
import axios from 'axios';
const API_BASE = 'http://localhost:8080';
import type { Department, PersonalData, Staff } from '../../interface/types';


export const StaffController = {
  getAllStaff: async (): Promise<Staff[]> => {
    const response = await axios.get(`${API_BASE}/staff`);
    const data = response.data as any;
    // backend คืนค่าเป็น Department + PersonalData
    // map เป็น interface Staff
    return data.map((dept: any) => ({
      Employee_ID: dept.PersonalData.ID,
      title: dept.PersonalData.Title,
      firstName: dept.PersonalData.FirstName,
      lastName: dept.PersonalData.LastName,
      position: dept.Position,

    }));
  },

  getStaffByID: async (id: number): Promise<Staff> => {
    const response = await axios.get(`${API_BASE}/staff/${id}`);
    const data = response.data as any;
    const dept = data.Department || {};
    // map เป็น interface Staff
    return {
      Employee_ID: data.ID,
      title: data.Title,
      firstName: data.FirstName,
      lastName: data.LastName,
      position: dept.Position || '', // ต้องเรียก Department เพิ่มถ้าต้องการ
      phone: data.Tel,
      gender: data.Gender,
      startDate: dept.StartDate ? new Date(dept.StartDate).toLocaleDateString() : '',  // ต้องเรียก Department
      age: data.Age,
      idCard: data.EmpNationalID,
      address: [
        data.HouseNumber,
        data.Subdistrict,
        data.District,
        data.VillageNumber
      ].filter(Boolean).join(', '),
      email: data.Email,
      employeeType: dept.EmpType || '',
      licenseNumber: dept.License || '',
      Specialization: dept.Specialization || '',
      HouseNumber: dept.PersonalData.HouseNumber,
      Subdistrict: dept.PersonalData.Subdistrict,
      District: dept.PersonalData.District,
      VillageNumber: dept.PersonalData.VillageNumber,
      CompRate: dept.CompRate ?? 0,
      Department: dept,
      ID: dept.PersonalData.ID,
    };
  },


  updateStaff: async (

    id: number,
    personalData: PersonalData,
    department: Department
    // staff:Staff
  ): Promise<Staff> => {

    const payload = { personalData, department };
    const response = await axios.put<Staff>(`${API_BASE}/staff/${id}`, payload);
    return response.data;
  },

  addStaff: async (
    personalData: PersonalData,
    department: Department
  ): Promise<Staff> => {
    const payload = { personalData, department };
    const response = await axios.post<Staff>(`${API_BASE}/staff`, payload);
    return response.data;
  },
  deleteStaff: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE}/staff/${id}`);
  },
};






