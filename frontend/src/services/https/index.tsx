import axios from "axios";
import type { AxiosResponse, AxiosError } from "axios";
// import type {
//     PersonalInfomation,
//     Contact,
//     PatientAddress,
//     History
// } from "../interfaces"

const API_URL = import.meta.env.VITE_API_KEY || "http://localhost:8088";


const getCookie = (name: string): string | null => {
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((row) => row.startsWith(`${name}=`));
  
    if (cookie) {
      let AccessToken = decodeURIComponent(cookie.split("=")[1]);
      AccessToken = AccessToken.replace(/\\/g, "").replace(/"/g, "");
      return AccessToken ? AccessToken : null;
    }
    return null;
  };
  
  const getConfig = () => ({
    headers: {
      Authorization: `Bearer ${getCookie("0195f494-feaa-734a-92a6-05739101ede9")}`,
      "Content-Type": "application/json",
    },
  });
  
  const getConfigWithoutAuth = () => ({
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  export const Post = async (
    url: string,
    data: any,
    requireAuth: boolean = true
  ): Promise<AxiosResponse | any> => {
    const config = requireAuth ? getConfig() : getConfigWithoutAuth();
    return await axios
      .post(`${API_URL}${url}`, data, config)
      .then((res) => res)
      .catch((error: AxiosError) => {
        if (error?.response?.status === 401) {
          localStorage.clear();
          window.location.reload();
        }
        return error.response;
      });
  };
  
  export const Get = async (
    url: string,
    requireAuth: boolean = true
  ): Promise<AxiosResponse | any> => {
    const config = requireAuth ? getConfig() : getConfigWithoutAuth();
    return await axios
      .get(`${API_URL}${url}`, config)
      .then((res: AxiosResponse) => res.data)
      .catch((error: AxiosError) => {
        if (error?.message === "Network Error") {
          return error.response;
        }
        if (error?.response?.status === 401) {
          localStorage.clear();
          window.location.reload();
        }
        return error.response;
      });
  };
  
  export const Update = async (
    url: string,
    data: any,
    requireAuth: boolean = true
  ): Promise<AxiosResponse | any> => {
    const config = requireAuth ? getConfig() : getConfigWithoutAuth();
    return await axios
      .put(`${API_URL}${url}`, data, config)
      .then((res: AxiosResponse) => res.data)
      .catch((error: AxiosError) => {
        if (error?.response?.status === 401) {
          localStorage.clear();
          window.location.reload();
        }
        return error.response;
      });
  };
  
  export const Delete = async (
    url: string,
    requireAuth: boolean = true
  ): Promise<AxiosResponse | any> => {
    const config = requireAuth ? getConfig() : getConfigWithoutAuth();
    return await axios
      .delete(`${API_URL}${url}`, config)
      .then((res: AxiosResponse) => res.data)
      .catch((error: AxiosError) => {
        if (error?.response?.status === 401) {
          localStorage.clear();
          window.location.reload();
        }
        return error.response;
      });
  };

//Patient APIs
export const PatientAPI = {
    getAll: () => Get("/patient"),
    getById: (id:number) => Get(`/patient/${id}`),
    delete: (id:number) => Delete(`/patient/${id}`),
};