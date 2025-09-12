import api from './api';

// Staff Types
export interface Staff {
  id: number;
  title: string;
  first_name: string;
  last_name: string;
  gender: string;
  email: string;
  age: number;
  emp_national_id: string;
  tel: string;
  house_number: string;
  subdistrict: string;
  district: string;
  village_number: string;
  position: string;
  emp_type: string;
  license: string;
  comp_rate: number;
  specialization: string;
  start_date: string;
  created_at: string;
  updated_at?: string;
}

export interface Department {
  id: number;
  personal_data_id: number;
  position: string;
  emp_type: string;
  license: string;
  comp_rate: number;
  specialization: string;
  start_date: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  pagination?: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}

// Staff API
export const staffAPI = {
  // Get all staff
  getStaff: async (params?: {
    page?: number;
    page_size?: number;
    position?: string;
    department?: string;
  }) => {
    const response = await api.get<ApiResponse<Staff[]>>('/staff', { params });
    return response.data;
  },

  // Get staff by ID
  getStaffById: async (id: number) => {
    const response = await api.get<ApiResponse<Staff>>(`/staff/${id}`);
    return response.data;
  },

  // Create new staff
  createStaff: async (staffData: {
    title: string;
    first_name: string;
    last_name: string;
    gender: string;
    email: string;
    age: number;
    emp_national_id: string;
    tel: string;
    house_number: string;
    subdistrict: string;
    district: string;
    village_number: string;
    position: string;
    emp_type: string;
    license?: string;
    comp_rate: number;
    specialization?: string;
    start_date: string;
  }) => {
    const response = await api.post<ApiResponse<Staff>>('/staff', staffData);
    return response.data;
  },

  // Update staff
  updateStaff: async (id: number, staffData: Partial<Staff>) => {
    const response = await api.put<ApiResponse<Staff>>(`/staff/${id}`, staffData);
    return response.data;
  },

  // Delete staff
  deleteStaff: async (id: number) => {
    const response = await api.delete<ApiResponse<null>>(`/staff/${id}`);
    return response.data;
  },
};

// Department API
export const departmentAPI = {
  // Get all departments
  getDepartments: async () => {
    const response = await api.get<ApiResponse<Department[]>>('/departments');
    return response.data;
  },

  // Get department by ID
  getDepartmentById: async (id: number) => {
    const response = await api.get<ApiResponse<Department>>(`/departments/${id}`);
    return response.data;
  },
};
