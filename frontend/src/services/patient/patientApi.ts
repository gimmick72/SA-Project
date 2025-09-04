import axios from 'axios';
import type { AxiosError, AxiosResponse } from 'axios';
import type { Patient } from '../../interface/patient';

// 1) รวม /api ตั้งแต่ต้น
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080');
const API_URL = "http://localhost:8080/api";

const http = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// ===== common config =====
const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split('; ');
  const cookie = cookies.find((row) => row.startsWith(`${name}=`));
  if (cookie) {
    let AccessToken = decodeURIComponent(cookie.split("=")[1]);
    AccessToken = AccessToken.replace(/\\/g, "").replace(/"/g, "");
    return AccessToken ? AccessToken : null;
  }
  return null;
};

const getConfig = () => ({
  withCredentials: true,
  headers: {
    // Authorization: `Bearer ${getCookie("access_token")}`,
    "Content-Type": "application/json",
  },
});

const getConfigWithOutAuth = () => ({
  withCredentials: false,
  headers: { "Content-Type": "application/json" },
});

// ===== HTTP helpers (ใช้ BASE_URL แล้ว) =====
export const Post = async (url: string, data: any, requireAuth = true): Promise<AxiosResponse | any> => {
  const config = requireAuth ? getConfig() : getConfigWithOutAuth();
  return await axios
    .post(`${API_BASE_URL}${url}`, data, config)   
    .then((response) => response)
    .catch((error: AxiosError) => {
      if (error?.response?.status === 401) {
        localStorage.clear();
        window.location.reload();
      }
      return error.response;
    });
};

export const Get = async (url: string, requireAuth = true): Promise<AxiosResponse | any> => {
  const config = requireAuth ? getConfig() : getConfigWithOutAuth();
  return await axios
    .get(`${API_BASE_URL}${url}`, config)          
    .then((response) => response)
    .catch((error: AxiosError) => {
      if (error?.message === "Network Error") return error.response;
      if (error?.response?.status === 401) {
        localStorage.clear();
        window.location.reload();
      }
      return error.response;
    });
};

export const Update = async (url: string, data: any, requireAuth = true): Promise<AxiosResponse | any> => {
  const config = requireAuth ? getConfig() : getConfigWithOutAuth();
  return await axios
    .put(`${API_BASE_URL}${url}`, data, config)
    .then((response) => response)
    .catch((error: AxiosError) => {
      if (error?.response?.status === 401) {
        localStorage.clear();
        window.location.reload();
      }
      return error.response;
    });
};

export const Delete = async (url: string, requireAuth = true): Promise<AxiosResponse | any> => {
  const config = requireAuth ? getConfig() : getConfigWithOutAuth();
  return await axios
    .delete(`${API_BASE_URL}${url}`, config)
    .then((response) => response)
    .catch((error: AxiosError) => {
      if (error?.response?.status === 401) {
        localStorage.clear();
        window.location.reload();
      }
      return error.response;
    });
};


export const PatientAPI = {
  getAll:   () => Get('/patient'),
  getByID:  (id: number) => Get(`${API_URL}/patients/${id}`),
  create:   (data: Patient) => Post(`${API_URL}/patients`, data, false),
  update:   (id: number, data: Patient) => Update(`${API_URL}/patients/${id}`, data),
  delete:   (id: number) => Delete(`${API_URL}/patients/${id}`),
};


