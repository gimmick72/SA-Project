import axios from "axios";
import type { AxiosError } from "axios";
import dayjs, { Dayjs } from "dayjs";
import type {
  UpdateSlot, Slottime, QueueSlot, CreateBooking,SummaryBooking
} from "../../interface/bookingQueue";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const getConfig = () => ({
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});
const getConfigWithOutAuth = () => ({
  withCredentials: false,
  headers: { "Content-Type": "application/json" },
});

export const Post = async (url: string, data?: any, requireAuth = true) => {
  const config = requireAuth ? getConfig() : getConfigWithOutAuth();
  return axios.post(`${API_BASE_URL}${url}`, data, config)
    .then(res => res.data)
    .catch((error: AxiosError) => {
      if (error?.response?.status === 401) { localStorage.clear(); window.location.reload(); }
      return Promise.reject(error);
    });
};

export const Get = async (url: string, requireAuth = true) => {
  const config = requireAuth ? getConfig() : getConfigWithOutAuth();
  return axios.get(`${API_BASE_URL}${url}`, config)
    .then(res => res.data)
    .catch((error: AxiosError) => {
      if (error?.message === "Network Error") return Promise.reject(error);
      if (error?.response?.status === 401) { localStorage.clear(); window.location.reload(); }
      return Promise.reject(error);
    });
};

export const Update = async (url: string, data?: any, requireAuth = true) => {
  const config = requireAuth ? getConfig() : getConfigWithOutAuth();
  return axios.put(`${API_BASE_URL}${url}`, data, config)
    .then(res => res.data)
    .catch((error: AxiosError) => {
      if (error?.response?.status === 401) { localStorage.clear(); window.location.reload(); }
      return Promise.reject(error);
    });
};

export const Delete = async (url: string, requireAuth = true) => {
  const config = requireAuth ? getConfig() : getConfigWithOutAuth();
  return axios.delete(`${API_BASE_URL}${url}`, config)
    .then(res => res.data)
    .catch((error: AxiosError) => {
      if (error?.response?.status === 401) { localStorage.clear(); window.location.reload(); }
      return Promise.reject(error);
    });
};

// ---------- Booking ----------
export const BookingAPI = {
  listByDate:   (date: string) => Get(`/api/bookings?date=${date}`, false),
  getByID:      (id: number)   => Get(`/api/bookings/${id}`, false),
  create:       (data: CreateBooking) => Post(`/api/bookings`, data, false),
  cancel:       (id: number)   => Delete(`/api/bookings/${id}/cancel`, false),
};

// ---------- Queue / Slots ----------
export const QueueSlotAPI = {
  listByDate:   (date: string) => Get(`/api/queue/slots?date=${date}`, false),
  getByID:      (id: number)   => Get(`/api/queue/slots/${id}`, false),
  // upsert หลายช่องเวลาในวัน/ช่วงเดียวกัน (capacity=0 = ปิด/ลบ)
  createCapacity: (data: UpdateSlot) => Post(`/api/queue/slots`, data, false),
  updateOne:    (id: number, data: Slottime) => Update(`/api/queue/slots/${id}`, data, false),
  deleteOne:    (id: number)   => Delete(`/api/queue/slots/${id}`, false),
};

