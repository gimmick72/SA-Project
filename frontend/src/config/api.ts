// API Configuration for Go Backend Integration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
    LOGOUT: '/auth/logout'
  },
  
  // Staff Management
  STAFF: {
    LIST: '/staff',
    CREATE: '/staff',
    UPDATE: '/staff',
    DELETE: '/staff',
    BY_ID: '/staff'
  },
  
  // Patient Management
  PATIENTS: {
    LIST: '/patients',
    CREATE: '/patients',
    UPDATE: '/patients',
    DELETE: '/patients',
    BY_ID: '/patients'
  },
  
  // Payment System
  PAYMENTS: {
    LIST: '/payments',
    CREATE: '/payments',
    UPDATE: '/payments',
    DELETE: '/payments',
    BY_ID: '/payments'
  },
  
  // Receipts
  RECEIPTS: {
    LIST: '/receipts',
    CREATE: '/receipts',
    BY_ID: '/receipts'
  },
  
  // Attendance System
  ATTENDANCE: {
    LIST: '/attendance',
    CREATE: '/attendance',
    UPDATE: '/attendance',
    DELETE: '/attendance',
    BY_ID: '/attendance',
    STATS: '/attendance/stats',
    CHECKIN: '/attendance/checkin',
    CHECKOUT: '/attendance/checkout'
  },
  
  // Services
  SERVICES: {
    LIST: '/services',
    CREATE: '/services',
    UPDATE: '/services',
    DELETE: '/services',
    BY_ID: '/services'
  },
  
  // Appointments/Queue
  APPOINTMENTS: {
    LIST: '/appointments',
    CREATE: '/appointments',
    UPDATE: '/appointments',
    DELETE: '/appointments',
    BY_ID: '/appointments'
  },
  
  // Supplies
  SUPPLIES: {
    LIST: '/supplies',
    CREATE: '/supplies',
    UPDATE: '/supplies',
    DELETE: '/supplies',
    BY_ID: '/supplies'
  },
  
  // Dentist Management
  DENTISTS: {
    LIST: '/dentists',
    CREATE: '/dentists',
    UPDATE: '/dentists',
    DELETE: '/dentists',
    BY_ID: '/dentists'
  },
  
  // Case Data (Medical Records)
  CASES: {
    LIST: '/cases',
    CREATE: '/cases',
    UPDATE: '/cases',
    DELETE: '/cases',
    BY_ID: '/cases'
  }
};

// Response Types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  status?: number;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Error Types
export interface ApiError {
  message: string;
  status: number;
  details?: any;
}
