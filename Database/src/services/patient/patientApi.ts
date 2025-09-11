import axios from 'axios';
import type { AxiosError, AxiosResponse } from 'axios';
import type { Patient } from '../../interface/initailPatient/patient';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080');


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

export const Post = async (url: string, data: any, requireAuth = true) => {
  const config = requireAuth ? getConfig() : getConfigWithOutAuth();
  return await axios
    .post(`${API_BASE_URL}${url}`, data, config)
    .then(res => res.data)            
    .catch((error: AxiosError) => {
      if (error?.response?.status === 401) {
        localStorage.clear();
        window.location.reload();
      }
      // ส่งข้อความจาก backend กลับไปให้แสดงผล
      return Promise.reject(error);
    });
};

export const Get = async (url: string, requireAuth = true) => {
  const config = requireAuth ? getConfig() : getConfigWithOutAuth();
  return await axios
    .get(`${API_BASE_URL}${url}`, config)
    .then(res => res.data)             
    .catch((error: AxiosError) => {
      if (error?.message === "Network Error") return Promise.reject(error);
      if (error?.response?.status === 401) {
        localStorage.clear();
        window.location.reload();
      }
      return Promise.reject(error);
    });
};

export const Update = async (url: string, data: any, requireAuth = true) => {
  const config = requireAuth ? getConfig() : getConfigWithOutAuth();
  return await axios
    .put(`${API_BASE_URL}${url}`, data, config)
    .then(res => res.data)             
    .catch((error: AxiosError) => {
      if (error?.response?.status === 401) {
        localStorage.clear();
        window.location.reload();
      }
      return Promise.reject(error);
    });
};

export const Delete = async (url: string, requireAuth = true) => {
  const config = requireAuth ? getConfig() : getConfigWithOutAuth();
  return await axios
    .delete(`${API_BASE_URL}${url}`, config)
    .then(res => res.data)             
    .catch((error: AxiosError) => {
      if (error?.response?.status === 401) {
        localStorage.clear();
        window.location.reload();
      }
      return Promise.reject(error);
    });
};


export const PatientAPI = {
  getAll:  () => Get('/api/patients', false),
  getByID: (id:number) => Get(`/api/patients/${id}`),
  createPatient: (data: Patient) => Post('/api/patients', data, false),
  update:  (id: number, data: Patient) => Update(`/api/patients/${id}`, data),
  delete:  (id: number) => Delete(`/api/patients/${id}`),
};

export const PatientSymptomsAPI = {
  createSymtom: (id: number | string, data: any) =>Post(`/api/patients/${id}/symptoms`, data, false),
}

export const ServiceToSymtomsAPI = {
  getService: () => Get(`/api/services`,false)
}

export const GetCaseDataToHistory = {
  getCaseData: (id?: string) => Get(`/api/case-data/${id}`,false)
}


