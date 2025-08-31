import axios from 'axios';
import type { AxiosError, AxiosResponse } from 'axios';
import type { Patient, ContactPerson,Address,InitialSymptomps,ServiceRef,HistoryPatien,CaseRef} from '../interface/patient';


const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const http = axios.create({
	baseURL: `${API_BASE_URL}/api`,
	headers: { "Content-Type": "application/json" },
});


//Patient API function

const getCookie = (name: string): string | null => {
	const cookies = document.cookie.split('; ');
	const cookie = cookies.find((row) => row.startsWith(`${name}=`));

	if (cookie) {
		let AccessToken = decodeURIComponent(cookie.split("=")[1]);
		AccessToken = AccessToken.replace(/\\/g, "").replace(/"/g, "");
		return AccessToken ? AccessToken : null;
	  }
	  return null;
}

const getConfig = () => ({
	withCredentials: true,
  headers: {
    Authorization: `Bearer ${getCookie("access_token")}`,
    "Content-Type": "application/json",
  },
});

const getConfigWithOutAuth = () => ({
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});	


export const Post = async (
	url: string,
	data: any,
	requireAuth: boolean = true
): Promise<AxiosResponse | any> => {
	const config = requireAuth ? getConfig() : getConfigWithOutAuth();
	return await axios
		.post(`${API_BASE_URL}/api${url}`, data, config)
		// .post(`${API_BASE_URL}${url}`, data, config)

		.then((response) => response)
		.catch((error: AxiosError) => {
			if (error?.response?.status === 401){
				localStorage.clear();
				window.location.reload();
			}
			return error.response;
		})
}

export const Get = async (
	url: string,
	data: any,
	requireAuth: boolean = true
) : Promise<AxiosResponse | any> => {
	const config = requireAuth ? getConfig() : getConfigWithOutAuth();
	return await axios
		.get(`${API_BASE_URL}/api${url}`, { params: data, ...config })
		.then((response) => response)
		.catch((error: AxiosError) => {
			if (error?.message === "Network Error" ){
				return error.response;
			}
			if (error?.response?.status === 401){
				localStorage.clear();
				window.location.reload();
			}
			return error.response;
		});
}

export const Update = async (
	url: string,
	data: any,
	requireAuth: boolean = true
): Promise<AxiosResponse | any> => {
	const config = requireAuth ? getConfig() : getConfigWithOutAuth();
	return await axios
		.put(`${API_BASE_URL}/api${url}`, data, config)
		.then((response) => response)
		.catch((error: AxiosError) => {
			if (error?.response?.status === 401){
				localStorage.clear();
				window.location.reload();
			}
			return error.response;
		})
}

export const Delete = async (
	url: string,
	data: any,
	requireAuth: boolean = true
): Promise<AxiosResponse | any> => {
	const config = requireAuth ? getConfig() : getConfigWithOutAuth();
	return await axios
		.delete(`${API_BASE_URL}/api${url}`, config)
		.then((response) => response)
		.catch((error: AxiosError) => {
			if (error?.response?.status === 401){
				localStorage.clear();
				window.location.reload();
			}
			return error.response;
		})
}

//Patient API
export const PatientAPI = {
	getAll: () => Get('/patient', {}),
	getByID: (id: number) => Get(`/patient/${id}`, {}),
	create: (data: Patient) => Post('/patient', data),
	update: (id: number, data: Patient) => Update(`/patient/${id}`, data),
	delete: (id: number) => Delete(`/patient/${id}`, {}),
}