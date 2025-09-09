var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
authApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
// Add response interceptor to handle token expiration
authApi.interceptors.response.use((response) => response, (error) => {
    var _a;
    if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
        // Token expired or invalid
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/auth/login';
    }
    return Promise.reject(error);
});
// Authentication API functions
export const AuthAPI = {
    // Login user
    login: (credentials) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield authApi.post('/auth/login', credentials);
        const { token, user } = response.data;
        // Store authentication data
        localStorage.setItem('authToken', token);
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userData', JSON.stringify(user));
        return response.data;
    }),
    // Register user
    register: (userData) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield authApi.post('/auth/register', userData);
        const { token, user } = response.data;
        // Store authentication data
        localStorage.setItem('authToken', token);
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userData', JSON.stringify(user));
        return response.data;
    }),
    // Get user profile
    getProfile: () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield authApi.get('/profile');
        return response.data;
    }),
    // Update user profile
    updateProfile: (userData) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield authApi.put('/profile', userData);
        return response.data;
    }),
    // Logout user
    logout: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield authApi.post('/auth/logout');
        }
        catch (error) {
            console.error('Logout API call failed:', error);
        }
        finally {
            // Clear local storage regardless of API call result
            localStorage.removeItem('authToken');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('userData');
        }
    }),
    // Check if user is authenticated
    isAuthenticated: () => {
        return localStorage.getItem('isAuthenticated') === 'true' &&
            localStorage.getItem('authToken') !== null;
    },
    // Get current user role
    getUserRole: () => {
        return localStorage.getItem('userRole');
    },
    // Get current user data
    getCurrentUser: () => {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    },
    // Admin-only functions
    getPatients: () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield authApi.get('/admin/patients');
        return response.data;
    }),
    getAdmins: () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield authApi.get('/admin/admins');
        return response.data;
    }),
};
export default authApi;
