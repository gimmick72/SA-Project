//frontend/src/services/https/StaffAPI.tsx 
import axios from 'axios';
const API_BASE = 'http://localhost:8080';
import type { Department, NewStaffData, PersonalData, Staff } from '../../interface/Staff';

const mapToPersonalData = (values: any): PersonalData => {
  const addr = values.address?.split(',').map((x: string) => x.trim()) || [];
  return {
    Title: values.title,
    FirstName: values.firstName,
    LastName: values.lastName,
    Gender: values.gender,
    Email: values.email,
    Age: Number(values.age) || 0,
    EmpNationalID: values.idCard,
    Tel: values.phone,
    HouseNumber: addr[0] || values.HouseNumber || '',
    Subdistrict: addr[1] || values.Subdistrict || '',
    District: addr[2] || values.District || '',
    VillageNumber: addr[3] || values.VillageNumber || '',
  };
};

const mapToDepartment = (values: any, staff?: Staff): Department => ({
  ID: staff?.Department?.ID || 0,
  PersonalDataID: staff?.Employee_ID || 0,
  Position: values.position,
  EmpType: values.employeeType,
  License: values.licenseNumber || '',
  Specialization: values.Specialization || '',
  CompRate: Number(values.CompRate) || 0,
  StartDate: values.startDate ? values.startDate.toISOString() : new Date().toISOString(),
});

export const StaffAPI = {
  getAllStaff: async (): Promise<Staff[]> => {
    const response = await axios.get(`${API_BASE}/staff`);
    const data = response.data as any;
    // backend คืนค่าเป็น Department + PersonalData
    // map เป็น interface Staff
    return data.map((staff: any) => ({
      Employee_ID: staff.PersonalData.ID,
      title: staff.PersonalData.Title,
      firstName: staff.PersonalData.FirstName,
      lastName: staff.PersonalData.LastName,
      position: staff.Position, 

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
  updateStaff: async (id: number, values: any, staff: Staff): Promise<Staff> => {
    const payload = {
      personalData: mapToPersonalData(values),
      department: mapToDepartment(values, staff),
    };
    const { data } = await axios.put<Staff>(`${API_BASE}/staff/${id}`, payload);
    return data;
  },
  addStaff: async (newStaff: NewStaffData): Promise<Staff> => {
    const payload = {
      personalData: mapToPersonalData(newStaff),
      department: mapToDepartment(newStaff),
    };
    const { data } = await axios.post<Staff>(`${API_BASE}/staff`, payload);
    return data;
  },
  deleteStaff: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE}/staff/${id}`);
  },
}; 