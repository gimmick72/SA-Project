import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Create axios instance with base configuration
const authApi = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('isAuthenticated');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Types
export interface LoginRequest {
  email: string;
  password: string;
  role: 'patient' | 'admin';
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: 'patient' | 'admin';
  phone_number?: string;
  date_of_birth?: string;
  department?: string;
  position?: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'patient' | 'admin';
  is_active: boolean;
  last_login?: string;
  phone_number?: string;
  date_of_birth?: string;
  department?: string;
  position?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

// Authentication API functions
export const AuthAPI = {
  // Login user
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await authApi.post('/auth/login', credentials);
    const { token, user } = response.data;
    
    // Store authentication data
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', user.role);
    localStorage.setItem('userEmail', user.email);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userData', JSON.stringify(user));
    
    return response.data;
  },

  // Register user
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await authApi.post('/auth/register', userData);
    const { token, user } = response.data;
    
    // Store authentication data
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', user.role);
    localStorage.setItem('userEmail', user.email);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userData', JSON.stringify(user));
    
    return response.data;
  },

  // Get user profile
  getProfile: async (): Promise<{ success: boolean; user: User }> => {
    const response = await authApi.get('/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData: Partial<RegisterRequest>): Promise<{ success: boolean; user: User }> => {
    const response = await authApi.put('/profile', userData);
    return response.data;
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await authApi.post('/auth/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear local storage regardless of API call result
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userData');
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return localStorage.getItem('isAuthenticated') === 'true' && 
           localStorage.getItem('authToken') !== null;
  },

  // Get current user role
  getUserRole: (): 'patient' | 'admin' | null => {
    return localStorage.getItem('userRole') as 'patient' | 'admin' | null;
  },

  // Get current user data
  getCurrentUser: (): User | null => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },

  // Admin-only functions
  getPatients: async (): Promise<{ success: boolean; patients: User[]; total: number }> => {
    const response = await authApi.get('/admin/patients');
    return response.data;
  },

  getAdmins: async (): Promise<{ success: boolean; admins: User[]; total: number }> => {
    const response = await authApi.get('/admin/admins');
    return response.data;
  },
};

export default authApi;
