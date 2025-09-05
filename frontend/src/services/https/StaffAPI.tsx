//frontend/src/services/https/Staff.tsx 
import axios from 'axios';
const API_BASE = 'http://localhost:8080';
import type { Department, NewStaffData, PersonalData, Staff } from '../../interface/Staff';


export const StaffController = {
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
    // แยก address
    const addressParts = values.address
      ? values.address.split(',').map((part: string) => part.trim())
      : [];

    // เตรียม personalData
    const personalData: PersonalData = {
      Title: values.title,
      FirstName: values.firstName,
      LastName: values.lastName,
      Gender: values.gender,
      Email: values.email,
      Age: Number(values.age),
      EmpNationalID: values.idCard,
      Tel: values.phone,
      HouseNumber: addressParts[0] || "",
      Subdistrict: addressParts[1] || "",
      District: addressParts[2] || "",
      VillageNumber: addressParts[3] || "",
    };

    // เตรียม department
    const department: Department = {
      Position: values.position,
      EmpType: values.employeeType,
      StartDate: values.startDate ? values.startDate.toISOString() : null,
      License: values.licenseNumber,
      Specialization: values.Specialization,
      CompRate: Number(values.CompRate),
      PersonalDataID: staff.Employee_ID,
      ID: staff.Department?.ID || 0,
    };

    // เรียก API อัปเดต
    const payload = { personalData, department };
    const response = await axios.put<Staff>(`${API_BASE}/staff/${id}`, payload);
    return response.data;
  },
  // Staff.tsx
  addStaff: async (newStaff: NewStaffData): Promise<Staff> => {
    const personalData: PersonalData = {
      Title: newStaff.title,
      FirstName: newStaff.firstName,
      LastName: newStaff.lastName,
      Gender: newStaff.gender,
      Email: newStaff.email,
      Age: Number(newStaff.age) || 0,
      EmpNationalID: newStaff.idCard,
      Tel: newStaff.phone,
      HouseNumber: newStaff.HouseNumber || newStaff.address || '',
      Subdistrict: newStaff.Subdistrict || '',
      District: newStaff.District || '',
      VillageNumber: newStaff.VillageNumber || '',
    };

    const department: Department = {
      Position: newStaff.position,
      EmpType: newStaff.employeeType,
      License: newStaff.licenseNumber || '',
      CompRate: Number(newStaff.CompRate) || 0,
      Specialization: newStaff.Specialization || '',
      StartDate: newStaff.startDate
        ? newStaff.startDate.toISOString()
        : new Date().toISOString(),
      PersonalDataID: 0,
    };

    const payload = { personalData, department };
    const response = await axios.post<Staff>(`${API_BASE}/staff`, payload);
    return response.data;
  },

  deleteStaff: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE}/staff/${id}`);
  },
}; 