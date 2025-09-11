import axios from 'axios';
import type { AxiosError, AxiosResponse } from 'axios';
import type { CapacitySummary,ServiceItem,Slottime,UpdateSlot,QueueSlot,CreateBooking,SummaryBooking } from '../../interface/bookingQueue';
import { createBooking } from './bookingApi';
import { create } from 'qrcode';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080');


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


export const BookingAPI = {
    getAllBooking: () => Get('/api/bookings', false),
    getBookingByID: (id:number) => Get(`/api/bookings/${id}`),
    createBooking: (data: CreateBooking) => Post('/api/bookings', data, false),
    delete:  (id: number) => Delete(`/api/bookings/${id}`),
}

export const QueueSlotAPI = {
    createQueueSlot: (data: QueueSlot) => Post(`/api/queue/slots`, data, false),
    deleteQueueSlot:  (id: number) => Delete(`/api/queue/slots/${id}`),
    createCapaity:(data: Slottime) => Post(`/api/queue/capacity`, data, false),
    updateQueueSlot: (id: number, data: Slottime) => Update(`/api/queue/slots/${id}`, data, false),
    getQueueSlot: (id: number) => Get(`/api/queue/slots/${id}`)
}