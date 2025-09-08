import axios, { AxiosResponse } from "axios";

// ================================
// INTERFACES
// ================================

export interface Service {
    id?: number;
    name_service: string;
    detail_service: string;
    cost: number;
    category_id: number;
}


export interface Category {
    id?: number;
    name_category: string;
}

export interface Promotion {
    id?: number;
    name_promotion: string;
    service_id: number;
    promotion_detail: string;
    cost: number;
    date_start: string;
    date_end: string;
}



const API_URL = "http://localhost:8080";
const API_BASE = `${API_URL}/api`;

// Axios instance with default config
const api = axios.create({
    baseURL: API_BASE,
});

// Request interceptor for debugging
api.interceptors.request.use(
    (config) => {
        console.log(`🚀 API Request: ${config.method} ${config.url}`, config.data);
        return config;
    },
    (error) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response: AxiosResponse) => {
        console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
        return response;
    },
    (error) => {
        console.error('❌ API Response Error:', error.response?.data || error.message);

        // Customize error messages
        if (error.response?.status === 404) {
            error.message = 'ไม่พบข้อมูลที่ต้องการ';
        } else if (error.response?.status === 400) {
            error.message = error.response.data?.error || 'ข้อมูลไม่ถูกต้อง';
        } else if (error.response?.status === 500) {
            error.message = 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์';
        } else if (!error.response) {
            error.message = 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้';
        }

        return Promise.reject(error);
    }
);


// ================================
// SERVICE API
// ================================

// ดึงบริการทั้งหมด
export const getAllService = async (): Promise<Service[]> => {
    const response = await api.get('/Service_controller');
    return response.data;
};

// สร้างบริการใหม่
export const createService = async (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<Service> => {
    const response = await api.post('/Service_controller', service);
    return response.data;
};

//  แก้ไขบริการ
export const updateService = async (id: number, service: Partial<Service>): Promise<Service> => {
    const response = await api.put(`/Service_controller/${id}`, service);
    return response.data;
};

//  ลบบริการ

export const deleteService = async (id: number): Promise<void> => {
    await api.delete(`/Service_controller/${id}`);
};


// ================================
// CATEGORY API
// ================================


//  ดึงหมวดหมู่ทั้งหมด

export const getAllCategory = async (): Promise<Category[]> => {
    const response = await api.get('/category_controller');
    return response.data;
};


//  สร้างหมวดหมู่ใหม่
export const createCategory = async (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> => {
        try {
         const response = await api.post<Category>('/category_controller', category);
        console.log("🚀 createCategory response.data:", response.data); // <-- เช็คข้อมูลที่ส่งมาจาก backend
        return response.data;
    } catch (error) {
        console.error("❌ createCategory error:", error);
        throw error;
    }
};

// ดึงโปรโมชั่นทั้งหมด
export const getAllPromotion = async (): Promise<Promotion[]> => {
    try {
        const response = await api.get('/promotion_controller');
        console.log("🚀 getAllPromotion response.data:", response.data); // <-- เช็คข้อมูลที่ส่งมาจาก backend
        return response.data;
    } catch (error) {
        console.error("❌ getAllPromotion error:", error);
        throw error;
    }
};


// สร้างโปรโมชั่นใหม่
export const createPromotion = async (promotion: Omit<Promotion, 'id' | 'created_at' | 'updated_at'>): Promise<Promotion> => {
    
        try {
        // แปลงวันที่เป็น RFC3339
        const payload = {
            ...promotion,
            date_start: promotion.date_start ? promotion.date_start + 'T00:00:00Z' : undefined,
            date_end: promotion.date_end ? promotion.date_end + 'T00:00:00Z' : undefined,
        };

        const response = await api.post<Promotion>('/promotion_controller', payload);
        console.log("🚀 createPromotion response.data:", response.data); // เช็คข้อมูล backend
        return response.data;
    } catch (error) {
        console.error("❌ createPromotion error:", error);
        throw error;
    }
};


// แก้ไขโปรโมชั่น

export const updatePromotion = async (id: number, promotion: Partial<Promotion>): Promise<Promotion> => {
    try {
        const response = await api.put<Promotion>(`/promotion_controller/${id}`, promotion);
        console.log("🚀 updatePromotion response.data:", response.data); // <-- เช็คข้อมูลที่ส่งมาจาก backend
        return response.data;
    } catch (error) {
        console.error("❌ cupdatePromotion error:", error);
        throw error;
    }

};




// ลบโปรโมชั่น
export const deletePromotion = async (id: number): Promise<void> => {
    try {
        const response = await api.delete(`/promotion_controller/${id}`);
        console.log("🚀 deletePromotion response.data:", response.data); // <-- เช็คข้อมูลที่ส่งมาจาก backend
    } catch (error) {
        console.error("❌ deletePromotion error:", error);
        throw error;
    }
};


// ================================
// LEGACY SUPPORT - เพื่อให้ใช้กับโค้ดเก่าได้
// ================================

// Export default object with all APIs
export default {
    // Services
    getAllService,
    // getServicesByCategory,
    // getServiceById,
    // createService,
    // updateService,
    // deleteService,

    // Categories
    getAllCategory,
    // getCategoryById,
    createCategory,
    // updateCategory,
    // deleteCategory,

    // Promotions
    getAllPromotion,
    // getPromotionById,
    createPromotion,
    updatePromotion,
    deletePromotion,

    // Utilities
    // checkServerHealth,
    // formatDateForApi,
    // parseDateFromApi,
    // formatCurrency,
    //     searchServices,
    //     filterServicesByPriceRange,
    //     sortServices,
};