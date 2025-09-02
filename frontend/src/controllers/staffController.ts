// controllers/staffController.ts
import axios from 'axios';
import type { Department } from '../pages/staff_info/types';
import type { Staff } from '../pages/staff_info/index';
import { message } from 'antd';

const API_BASE = 'http://localhost:8080';

export const StaffController = {
  getAllStaff: async (): Promise<Staff[]> => {
    try {
      const res = await axios.get<Department[]>(`${API_BASE}/staff`);
      return res.data.map((dept) => {
        const pd = dept.PersonalData;
        return {
          Employee_ID: dept.ID || 0,
          title: pd?.Title || '',
          firstName: pd?.FirstName || '',
          lastName: pd?.LastName || '',
          age: pd?.Age || 0,
          gender: pd?.Gender || '',
          phone: pd?.Tel || '',
          email: pd?.Email || '',
          idCard: pd?.EmpNationalID || '',
          address: pd?.HouseNumber || '',
          position: dept.Position || '',
          employeeType: dept.EmpType || '',
          startDate: dept.StartDate || '',
          licenseNumber: dept.License || '',
        } as Staff;
      });
    } catch (err) {
      console.error(err);
      message.error('ไม่สามารถโหลดข้อมูลบุคลากรจากเซิร์ฟเวอร์ได้');
      return [];
    }
  },

  addStaff: async (department: Department, personalData: any) => {
    try {
      await axios.post(`${API_BASE}/staff`, { department, personalData });
      message.success('เพิ่มข้อมูลบุคลากรเรียบร้อย!');
    } catch (err) {
      console.error(err);
      message.error('เกิดข้อผิดพลาดในการเพิ่มข้อมูลบุคลากร');
      throw err;
    }
  },


  updateStaff: async (employeeId: number, payload: any) => {
    try {
      const res = await axios.put(`${API_BASE}/staff/${employeeId}`, payload);
      message.success('แก้ไขข้อมูลเรียบร้อย!');
      return res.data;
    } catch (err) {
      console.error('updateStaff error', err);
      message.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
      throw err;
    }
  }
};
