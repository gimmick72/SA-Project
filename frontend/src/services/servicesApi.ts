import api from './api';

// Service Types
export interface Service {
  id: number;
  service_name: string;
  description: string;
  price: number;
  duration_minutes: number;
  category_id: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  category?: Category;
}

export interface Category {
  id: number;
  category_name: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

export interface Promotion {
  id: number;
  promotion_name: string;
  description: string;
  discount_percentage: number;
  discount_amount: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  service_id?: number;
  created_at: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  pagination?: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}

// Services API
export const servicesAPI = {
  // Get all services
  getServices: async (params?: {
    page?: number;
    page_size?: number;
    category_id?: number;
    is_active?: boolean;
    search?: string;
  }) => {
    const response = await api.get<ApiResponse<Service[]>>('/services', { params });
    return response.data;
  },

  // Get service by ID
  getServiceById: async (id: number) => {
    const response = await api.get<ApiResponse<Service>>(`/services/${id}`);
    return response.data;
  },

  // Create new service
  createService: async (serviceData: {
    service_name: string;
    description: string;
    price: number;
    duration_minutes: number;
    category_id: number;
    is_active?: boolean;
  }) => {
    const response = await api.post<ApiResponse<Service>>('/services', serviceData);
    return response.data;
  },

  // Update service
  updateService: async (id: number, serviceData: Partial<Service>) => {
    const response = await api.put<ApiResponse<Service>>(`/services/${id}`, serviceData);
    return response.data;
  },

  // Delete service
  deleteService: async (id: number) => {
    const response = await api.delete<ApiResponse<null>>(`/services/${id}`);
    return response.data;
  },
};

// Categories API
export const categoriesAPI = {
  // Get all categories
  getCategories: async () => {
    const response = await api.get<ApiResponse<Category[]>>('/categories');
    return response.data;
  },

  // Get category by ID
  getCategoryById: async (id: number) => {
    const response = await api.get<ApiResponse<Category>>(`/categories/${id}`);
    return response.data;
  },

  // Create new category
  createCategory: async (categoryData: {
    category_name: string;
    description: string;
    is_active?: boolean;
  }) => {
    const response = await api.post<ApiResponse<Category>>('/categories', categoryData);
    return response.data;
  },

  // Update category
  updateCategory: async (id: number, categoryData: Partial<Category>) => {
    const response = await api.put<ApiResponse<Category>>(`/categories/${id}`, categoryData);
    return response.data;
  },

  // Delete category
  deleteCategory: async (id: number) => {
    const response = await api.delete<ApiResponse<null>>(`/categories/${id}`);
    return response.data;
  },
};

// Promotions API
export const promotionsAPI = {
  // Get all promotions
  getPromotions: async (params?: {
    page?: number;
    page_size?: number;
    is_active?: boolean;
    service_id?: number;
  }) => {
    const response = await api.get<ApiResponse<Promotion[]>>('/promotions', { params });
    return response.data;
  },

  // Get promotion by ID
  getPromotionById: async (id: number) => {
    const response = await api.get<ApiResponse<Promotion>>(`/promotions/${id}`);
    return response.data;
  },

  // Create new promotion
  createPromotion: async (promotionData: {
    promotion_name: string;
    description: string;
    discount_percentage?: number;
    discount_amount?: number;
    start_date: string;
    end_date: string;
    service_id?: number;
    is_active?: boolean;
  }) => {
    const response = await api.post<ApiResponse<Promotion>>('/promotions', promotionData);
    return response.data;
  },

  // Update promotion
  updatePromotion: async (id: number, promotionData: Partial<Promotion>) => {
    const response = await api.put<ApiResponse<Promotion>>(`/promotions/${id}`, promotionData);
    return response.data;
  },

  // Delete promotion
  deletePromotion: async (id: number) => {
    const response = await api.delete<ApiResponse<null>>(`/promotions/${id}`);
    return response.data;
  },
};
