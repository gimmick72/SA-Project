import axios from 'axios';

// Base API configuration
const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Types
export interface User {
  id: number;
  email: string;
  role: 'admin' | 'patient';
  first_name: string;
  last_name: string;
  phone_number?: string;
  date_of_birth?: string;
  is_active: boolean;
  last_login?: string;
  department?: string;
  position?: string;
  citizen_id?: string;
  created_at: string;
  updated_at?: string;
}

export interface Payment {
  id: number;
  transaction_number: string;
  amount: number;
  payment_method: 'cash' | 'credit_card' | 'promptpay' | 'bank_transfer';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  payment_date: string;
  description: string;
  patient_id: number;
  staff_id: number;
  service_id: number;
  service_name?: string;
  staff_name?: string;
  receipt_number?: string;
  created_at: string;
}

export interface Attendance {
  id: number;
  staff_id: number;
  date: string;
  check_in_time?: string;
  check_out_time?: string;
  work_hours: number;
  status: 'present' | 'late' | 'absent' | 'half_day';
  notes: string;
  location: string;
  is_late: boolean;
  late_minutes: number;
  staff?: {
    first_name: string;
    last_name: string;
  };
  created_at: string;
}

export interface AttendanceStats {
  total_staff: number;
  present_count: number;
  late_count: number;
  absent_count: number;
  half_day_count: number;
  average_hours: number;
  total_hours: number;
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

// Authentication API
export const authAPI = {
  login: async (email: string, password: string, role: string) => {
    const response = await api.post<ApiResponse<{ token: string; user: User }>>('/auth/login', {
      email,
      password,
      role,
    });
    return response.data;
  },

  register: async (userData: {
    email: string;
    password: string;
    role: string;
    first_name: string;
    last_name: string;
    phone_number?: string;
    date_of_birth?: string;
    citizen_id?: string;
    department?: string;
    position?: string;
  }) => {
    const response = await api.post<ApiResponse<User>>('/auth/register', userData);
    return response.data;
  },

  logout: async () => {
    const response = await api.post<ApiResponse<null>>('/auth/logout');
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get<ApiResponse<User>>('/profile');
    return response.data;
  },

  updateProfile: async (userData: Partial<User>) => {
    const response = await api.put<ApiResponse<User>>('/profile', userData);
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.put<ApiResponse<null>>('/profile/password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response.data;
  },
};

// Payment API
export const paymentAPI = {
  getPayments: async (params?: {
    page?: number;
    page_size?: number;
    status?: string;
    payment_method?: string;
    patient_id?: number;
  }) => {
    const response = await api.get<ApiResponse<Payment[]>>('/payments', { params });
    return response.data;
  },

  getPayment: async (id: number) => {
    const response = await api.get<ApiResponse<Payment>>(`/payments/${id}`);
    return response.data;
  },

  createPayment: async (paymentData: {
    amount: number;
    payment_method: string;
    patient_id: number;
    staff_id: number;
    service_id: number;
    description: string;
  }) => {
    const response = await api.post<ApiResponse<Payment>>('/payments', paymentData);
    return response.data;
  },

  updatePayment: async (id: number, paymentData: Partial<Payment>) => {
    const response = await api.put<ApiResponse<Payment>>(`/payments/${id}`, paymentData);
    return response.data;
  },

  deletePayment: async (id: number) => {
    const response = await api.delete<ApiResponse<null>>(`/payments/${id}`);
    return response.data;
  },
};

// Attendance API
export const attendanceAPI = {
  getAttendances: async (params?: {
    page?: number;
    page_size?: number;
    staff_id?: number;
    date?: string;
    status?: string;
  }) => {
    const response = await api.get<ApiResponse<Attendance[]>>('/attendance', { params });
    return response.data;
  },

  getAttendance: async (id: number) => {
    const response = await api.get<ApiResponse<Attendance>>(`/attendance/${id}`);
    return response.data;
  },

  createAttendance: async (attendanceData: {
    staff_id: number;
    date: string;
    status: string;
    notes?: string;
    location?: string;
  }) => {
    const response = await api.post<ApiResponse<Attendance>>('/attendance', attendanceData);
    return response.data;
  },

  updateAttendance: async (id: number, attendanceData: Partial<Attendance>) => {
    const response = await api.put<ApiResponse<Attendance>>(`/attendance/${id}`, attendanceData);
    return response.data;
  },

  deleteAttendance: async (id: number) => {
    const response = await api.delete<ApiResponse<null>>(`/attendance/${id}`);
    return response.data;
  },

  checkIn: async (staffId: number, location?: string, notes?: string) => {
    const response = await api.post<ApiResponse<{
      check_in_time: string;
      is_late: boolean;
      late_minutes: number;
    }>>('/attendance/checkin', {
      staff_id: staffId,
      location,
      notes,
    });
    return response.data;
  },

  checkOut: async (staffId: number, notes?: string) => {
    const response = await api.post<ApiResponse<{
      check_out_time: string;
      work_hours: number;
    }>>('/attendance/checkout', {
      staff_id: staffId,
      notes,
    });
    return response.data;
  },

  getStats: async (fromDate?: string, toDate?: string) => {
    const response = await api.get<ApiResponse<AttendanceStats>>('/attendance/stats', {
      params: { from_date: fromDate, to_date: toDate },
    });
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  getPatients: async () => {
    const response = await api.get<ApiResponse<User[]>>('/admin/patients');
    return response.data;
  },

  getAdmins: async () => {
    const response = await api.get<ApiResponse<User[]>>('/admin/admins');
    return response.data;
  },
};

export default api;
