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
}

// Schedule/Appointment Types
export interface ScheduleEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  room: string;
  dentist: string;
  patient_id?: string;
  patient_name?: string;
  type: 'appointment' | 'walkin';
  case_code?: string;
  note?: string;
  duration_min?: number;
}

export interface TimeSlot {
  time: string;
  patient: {
    id: string;
    name: string;
    type: string;
    caseCode?: string;
    note?: string;
    durationMin?: number;
  } | null;
}

export interface RoomSchedule {
  roomId: string;
  roomName: string;
  assignedDoctor?: string;
  timeSlots: TimeSlot[];
}

export interface AssignScheduleRequest {
  date: string;
  roomId: string;
  time: string;
  patientId?: string;
  fromRoomId?: string;
  fromTime?: string;
  patientName?: string;
  type?: 'appointment' | 'walkin';
  caseCode?: string;
  note?: string;
  durationMin?: number;
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

// Staff API integration for attendance
export const staffAttendanceAPI = {
  // Get staff list for attendance management
  getStaffList: async () => {
    const response = await api.get('/staff');
    return response.data;
  },
  
  // Get attendance statistics
  getAttendanceStats: async (fromDate?: string, toDate?: string) => {
    const response = await api.get<ApiResponse<AttendanceStats>>('/attendance/stats', {
      params: { from_date: fromDate, to_date: toDate },
    });
    return response.data;
  },
};

// Attendance API
export const attendanceAPI = {
  // Get attendances with optional filters
  getAttendances: async (params?: {
    page?: number;
    page_size?: number;
    staff_id?: string;
    status?: string;
    date_from?: string;
    date_to?: string;
  }) => {
    const response = await api.get('/attendance', { params });
    return response.data;
  },

  // Get staff list from staff_info API for attendance
  getStaffForAttendance: async () => {
    const response = await api.get('/staff');
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

// Room Schedule API (keeping existing functionality)
export const roomScheduleAPI = {
  getSchedule: async (date: string) => {
    const response = await api.get<RoomSchedule[]>(`/schedule?mode=day&date=${date}`);
    return response.data;
  },

  assignSchedule: async (assignData: AssignScheduleRequest) => {
    const response = await api.post<ApiResponse<{ ok: boolean }>>('/schedule/assign', assignData);
    return response.data;
  },

  // Convert backend room schedule to calendar events
  convertToEvents: (roomSchedules: RoomSchedule[], date: string): ScheduleEvent[] => {
    const events: ScheduleEvent[] = [];
    
    roomSchedules.forEach(room => {
      room.timeSlots.forEach((slot, index) => {
        if (slot.patient) {
          events.push({
            id: parseInt(`${room.roomId}${index}`),
            title: slot.patient.name,
            start: new Date(`${date}T${slot.time}:00`),
            end: new Date(`${date}T${slot.time}:00`),
            room: room.roomName,
            dentist: room.assignedDoctor || 'ไม่ระบุ',
            patient_id: slot.patient.id,
            patient_name: slot.patient.name,
            type: slot.patient.type as 'appointment' | 'walkin',
            case_code: slot.patient.caseCode,
            note: slot.patient.note,
            duration_min: slot.patient.durationMin
          });
        }
      });
    });
    
    return events;
  }
};

// Schedule API interfaces
interface ScheduleData {
  id: number;
  staff_id: number;
  staff_name: string;
  date: string;
  start_time: string;
  end_time: string;
  shift_type: 'morning' | 'afternoon' | 'evening' | 'night' | 'full_day';
  status: 'scheduled' | 'confirmed' | 'cancelled';
  notes?: string;
}

interface ScheduleRequest {
  staff_id: number;
  date: string;
  start_time: string;
  end_time: string;
  shift_type: string;
  status?: string;
  notes?: string;
}

interface WeeklyScheduleRequest {
  staff_ids: number[];
  start_date: string;
  end_date: string;
  shift_type?: string;
  start_time?: string;
  end_time?: string;
}

interface ScheduleStatsData {
  total_schedules: number;
  confirmed_schedules: number;
  pending_schedules: number;
  cancelled_schedules: number;
  staff_count: number;
}

// Staff Schedule API (for calendar-based schedule management)
export const staffScheduleAPI = {
  // Get schedules with filtering and pagination
  getSchedules: async (params?: {
    page?: number;
    page_size?: number;
    staff_id?: number;
    start_date?: string;
    end_date?: string;
    status?: string;
    shift_type?: string;
  }): Promise<ApiResponse<ScheduleData[]>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
    if (params?.staff_id) queryParams.append('staff_id', params.staff_id.toString());
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.shift_type) queryParams.append('shift_type', params.shift_type);

    const response = await api.get<ApiResponse<ScheduleData[]>>(`/staff-schedule?${queryParams.toString()}`);
    return response.data;
  },

  // Get specific schedule by ID
  getSchedule: async (id: number): Promise<ApiResponse<ScheduleData>> => {
    const response = await api.get<ApiResponse<ScheduleData>>(`/staff-schedule/${id}`);
    return response.data;
  },

  // Create new schedule
  createSchedule: async (data: ScheduleRequest): Promise<ApiResponse<ScheduleData>> => {
    const response = await api.post<ApiResponse<ScheduleData>>('/staff-schedule', data);
    return response.data;
  },

  // Update existing schedule
  updateSchedule: async (id: number, data: ScheduleRequest): Promise<ApiResponse<ScheduleData>> => {
    const response = await api.put<ApiResponse<ScheduleData>>(`/staff-schedule/${id}`, data);
    return response.data;
  },

  // Delete schedule
  deleteSchedule: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`/staff-schedule/${id}`);
    return response.data;
  },

  // Generate weekly schedules
  generateWeeklySchedule: async (data: WeeklyScheduleRequest): Promise<ApiResponse<{
    created_count: number;
    skipped_count: number;
    total_requested: number;
  }>> => {
    const response = await api.post<ApiResponse<{
      created_count: number;
      skipped_count: number;
      total_requested: number;
    }>>('/staff-schedule/weekly', data);
    return response.data;
  },

  // Get schedule statistics
  getStats: async (): Promise<ApiResponse<ScheduleStatsData>> => {
    const response = await api.get<ApiResponse<ScheduleStatsData>>('/staff-schedule/stats');
    return response.data;
  }
};

// Work Schedule API
export const workScheduleAPI = {
  // Get work schedules with optional filters
  getWorkSchedules: async (params?: {
    page?: number;
    page_size?: number;
    staff_id?: number;
    start_date?: string;
    end_date?: string;
    shift_type?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
    if (params?.staff_id) queryParams.append('staff_id', params.staff_id.toString());
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);
    if (params?.shift_type) queryParams.append('shift_type', params.shift_type);

    const response = await api.get(`/work-schedule?${queryParams.toString()}`);
    return response.data;
  },

  // Get specific work schedule by ID
  getWorkSchedule: async (id: number) => {
    const response = await api.get(`/work-schedule/${id}`);
    return response.data;
  },

  // Create new work schedule
  createWorkSchedule: async (data: {
    staff_id: number;
    date: string;
    start_time: string;
    end_time: string;
    shift_type: string;
    notes?: string;
  }) => {
    const response = await api.post('/work-schedule', data);
    return response.data;
  },

  // Update existing work schedule
  updateWorkSchedule: async (id: number, data: {
    staff_id?: number;
    date?: string;
    start_time?: string;
    end_time?: string;
    shift_type?: string;
    notes?: string;
  }) => {
    const response = await api.put(`/work-schedule/${id}`, data);
    return response.data;
  },

  // Delete work schedule
  deleteWorkSchedule: async (id: number) => {
    const response = await api.delete(`/work-schedule/${id}`);
    return response.data;
  },

  // Get work schedule statistics
  getWorkScheduleStats: async () => {
    const response = await api.get('/work-schedule/stats');
    return response.data;
  },

  // Get schedules for specific staff
  getStaffWorkSchedules: async (staffId: number, params?: {
    start_date?: string;
    end_date?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);

    const response = await api.get(`/work-schedule/staff/${staffId}?${queryParams.toString()}`);
    return response.data;
  }
};

export default api;
