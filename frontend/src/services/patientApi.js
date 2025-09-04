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
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const http = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: { "Content-Type": "application/json" },
});
//Patient API function
const getCookie = (name) => {
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
export const Post = (url_1, data_1, ...args_1) => __awaiter(void 0, [url_1, data_1, ...args_1], void 0, function* (url, data, requireAuth = true) {
    const config = requireAuth ? getConfig() : getConfigWithOutAuth();
    return yield axios
        .post(`${API_BASE_URL}/api${url}`, data, config)
        // .post(`${API_BASE_URL}${url}`, data, config)
        .then((response) => response)
        .catch((error) => {
        var _a;
        if (((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
            localStorage.clear();
            window.location.reload();
        }
        return error.response;
    });
});
export const Get = (url_1, data_1, ...args_1) => __awaiter(void 0, [url_1, data_1, ...args_1], void 0, function* (url, data, requireAuth = true) {
    const config = requireAuth ? getConfig() : getConfigWithOutAuth();
    return yield axios
        .get(`${API_BASE_URL}/api${url}`, Object.assign({ params: data }, config))
        .then((response) => response)
        .catch((error) => {
        var _a;
        if ((error === null || error === void 0 ? void 0 : error.message) === "Network Error") {
            return error.response;
        }
        if (((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
            localStorage.clear();
            window.location.reload();
        }
        return error.response;
    });
});
export const Update = (url_1, data_1, ...args_1) => __awaiter(void 0, [url_1, data_1, ...args_1], void 0, function* (url, data, requireAuth = true) {
    const config = requireAuth ? getConfig() : getConfigWithOutAuth();
    return yield axios
        .put(`${API_BASE_URL}/api${url}`, data, config)
        .then((response) => response)
        .catch((error) => {
        var _a;
        if (((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
            localStorage.clear();
            window.location.reload();
        }
        return error.response;
    });
});
export const Delete = (url_1, data_1, ...args_1) => __awaiter(void 0, [url_1, data_1, ...args_1], void 0, function* (url, data, requireAuth = true) {
    const config = requireAuth ? getConfig() : getConfigWithOutAuth();
    return yield axios
        .delete(`${API_BASE_URL}/api${url}`, config)
        .then((response) => response)
        .catch((error) => {
        var _a;
        if (((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
            localStorage.clear();
            window.location.reload();
        }
        return error.response;
    });
});
//Patient API
export const PatientAPI = {
    getAll: () => Get('/patient', {}),
    getByID: (id) => Get(`/patient/${id}`, {}),
    create: (data) => Post('/patient', data),
    update: (id, data) => Update(`/patient/${id}`, data),
    delete: (id) => Delete(`/patient/${id}`, {}),
};
