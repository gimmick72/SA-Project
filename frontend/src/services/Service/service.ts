// services/Service/service.ts
export interface DentalService {
  id: number;
  service_code: string;
  service_name: string;
  category: string;
  description: string;
  duration_minutes: number;
  price: number;
  is_active: boolean;
  requires_appointment: boolean;
  equipment_needed?: string[];
  prerequisites?: string;
  created_at: string;
  updated_at: string;
}

export interface ServicePromotion {
  id: number;
  promotion_code: string;
  title: string;
  description: string;
  service_ids: number[];
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  terms_conditions?: string;
  max_uses?: number;
  current_uses: number;
  created_at: string;
  updated_at: string;
}

export interface CreateServicePayload {
  service_code: string;
  service_name: string;
  category: string;
  description: string;
  duration_minutes: number;
  price: number;
  requires_appointment?: boolean;
  equipment_needed?: string[];
  prerequisites?: string;
}

export interface CreatePromotionPayload {
  promotion_code: string;
  title: string;
  description: string;
  service_ids: number[];
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  start_date: string;
  end_date: string;
  terms_conditions?: string;
  max_uses?: number;
}

// Mock data for development
const mockServices: DentalService[] = [
  {
    id: 1,
    service_code: "SRV001",
    service_name: "ตรวจฟันทั่วไป",
    category: "การตรวจ",
    description: "ตรวจสุขภาพฟันและเหงือกทั่วไป รวมถึงการให้คำแนะนำการดูแลฟัน",
    duration_minutes: 30,
    price: 300,
    is_active: true,
    requires_appointment: true,
    equipment_needed: ["เก้าอี้ทันตกรรม", "กระจกส่องฟัน", "เครื่องมือตรวจ"],
    prerequisites: "ไม่มี",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z"
  },
  {
    id: 2,
    service_code: "SRV002",
    service_name: "อุดฟัน",
    category: "การรักษา",
    description: "อุดฟันผุด้วยวัสดุคุณภาพสูง เหมาะสำหรับฟันผุขนาดเล็กถึงกลาง",
    duration_minutes: 60,
    price: 800,
    is_active: true,
    requires_appointment: true,
    equipment_needed: ["เครื่องเจาะฟัน", "วัสดุอุดฟัน", "หลอดไฟส่อง"],
    prerequisites: "ต้องตรวจฟันก่อน",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z"
  },
  {
    id: 3,
    service_code: "SRV003",
    service_name: "ขูดหินปูน",
    category: "การทำความสะอาด",
    description: "ทำความสะอาดหินปูนและคราบพลัคบนฟัน เพื่อสุขภาพเหงือกที่ดี",
    duration_minutes: 45,
    price: 600,
    is_active: true,
    requires_appointment: true,
    equipment_needed: ["เครื่องขูดหินปูน", "เครื่องมือทำความสะอาด"],
    prerequisites: "ไม่มี",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z"
  },
  {
    id: 4,
    service_code: "SRV004",
    service_name: "ถอนฟัน",
    category: "การผ่าตัด",
    description: "ถอนฟันที่เสียหายหรือไม่สามารถรักษาได้ ด้วยเทคนิคที่ปลอดภัย",
    duration_minutes: 30,
    price: 500,
    is_active: true,
    requires_appointment: true,
    equipment_needed: ["คีมถอนฟัน", "เครื่องมือผ่าตัด", "ยาชา"],
    prerequisites: "ต้องตรวจฟันและถ่ายเอกซเรย์ก่อน",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z"
  },
  {
    id: 5,
    service_code: "SRV005",
    service_name: "ฟอกสีฟัน",
    category: "ความงาม",
    description: "ฟอกสีฟันให้ขาวสะอาด ด้วยเทคโนโลยีที่ปลอดภัยและมีประสิทธิภาพ",
    duration_minutes: 90,
    price: 3000,
    is_active: true,
    requires_appointment: true,
    equipment_needed: ["เครื่องฟอกสีฟัน", "เจลฟอกสีฟัน", "แผ่นกั้นเหงือก"],
    prerequisites: "ต้องทำความสะอาดฟันก่อน",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z"
  }
];

const mockPromotions: ServicePromotion[] = [
  {
    id: 1,
    promotion_code: "PROMO001",
    title: "แพ็คเกจตรวจฟันครบครัน",
    description: "ตรวจฟัน + ขูดหินปูน ในราคาพิเศษ",
    service_ids: [1, 3],
    discount_type: "percentage",
    discount_value: 20,
    start_date: "2024-03-01",
    end_date: "2024-03-31",
    is_active: true,
    terms_conditions: "ใช้ได้เฉพาะลูกค้าใหม่เท่านั้น",
    max_uses: 100,
    current_uses: 25,
    created_at: "2024-02-15T10:00:00Z",
    updated_at: "2024-02-15T10:00:00Z"
  },
  {
    id: 2,
    promotion_code: "PROMO002",
    title: "ส่วนลดฟอกสีฟัน",
    description: "ฟอกสีฟันลด 1000 บาท",
    service_ids: [5],
    discount_type: "fixed_amount",
    discount_value: 1000,
    start_date: "2024-03-15",
    end_date: "2024-04-15",
    is_active: true,
    terms_conditions: "ไม่สามารถใช้ร่วมกับโปรโมชั่นอื่นได้",
    max_uses: 50,
    current_uses: 12,
    created_at: "2024-03-01T10:00:00Z",
    updated_at: "2024-03-01T10:00:00Z"
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchServices = async (params?: any): Promise<{ data: DentalService[]; total: number }> => {
  await delay(500);
  
  let filteredServices = [...mockServices];
  
  // Apply search filter
  if (params?.q) {
    const query = params.q.toLowerCase();
    filteredServices = filteredServices.filter(service => 
      service.service_name.toLowerCase().includes(query) ||
      service.service_code.toLowerCase().includes(query) ||
      service.category.toLowerCase().includes(query)
    );
  }
  
  // Apply category filter
  if (params?.category && params.category !== 'all') {
    filteredServices = filteredServices.filter(service => service.category === params.category);
  }
  
  // Apply active filter
  if (params?.is_active !== undefined) {
    filteredServices = filteredServices.filter(service => service.is_active === params.is_active);
  }
  
  return {
    data: filteredServices,
    total: filteredServices.length
  };
};

export const fetchServiceById = async (id: number): Promise<DentalService> => {
  await delay(300);
  
  const service = mockServices.find(s => s.id === id);
  if (!service) {
    throw new Error("ไม่พบบริการที่ต้องการ");
  }
  
  return service;
};

export const createService = async (payload: CreateServicePayload): Promise<DentalService> => {
  await delay(800);
  
  // Simulate validation
  if (!payload.service_code || !payload.service_name || !payload.category) {
    throw new Error("กรุณากรอกข้อมูลที่จำเป็น");
  }
  
  // Check if service code already exists
  if (mockServices.some(s => s.service_code === payload.service_code)) {
    throw new Error("รหัสบริการนี้มีอยู่แล้ว");
  }
  
  const newService: DentalService = {
    id: Math.max(...mockServices.map(s => s.id)) + 1,
    is_active: true,
    requires_appointment: payload.requires_appointment || true,
    equipment_needed: payload.equipment_needed || [],
    prerequisites: payload.prerequisites || "ไม่มี",
    ...payload,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  mockServices.push(newService);
  return newService;
};

export const updateService = async (id: number, payload: Partial<CreateServicePayload>): Promise<DentalService> => {
  await delay(600);
  
  const index = mockServices.findIndex(s => s.id === id);
  if (index === -1) {
    throw new Error("ไม่พบบริการที่ต้องการแก้ไข");
  }
  
  mockServices[index] = {
    ...mockServices[index],
    ...payload,
    updated_at: new Date().toISOString()
  };
  
  return mockServices[index];
};

export const toggleServiceStatus = async (id: number): Promise<DentalService> => {
  await delay(400);
  
  const index = mockServices.findIndex(s => s.id === id);
  if (index === -1) {
    throw new Error("ไม่พบบริการที่ต้องการอัปเดต");
  }
  
  mockServices[index] = {
    ...mockServices[index],
    is_active: !mockServices[index].is_active,
    updated_at: new Date().toISOString()
  };
  
  return mockServices[index];
};

export const deleteService = async (id: number): Promise<void> => {
  await delay(400);
  
  const index = mockServices.findIndex(s => s.id === id);
  if (index === -1) {
    throw new Error("ไม่พบบริการที่ต้องการลบ");
  }
  
  mockServices.splice(index, 1);
};

// Promotion functions
export const fetchPromotions = async (params?: any): Promise<{ data: ServicePromotion[]; total: number }> => {
  await delay(400);
  
  let filteredPromotions = [...mockPromotions];
  
  // Apply active filter
  if (params?.is_active !== undefined) {
    filteredPromotions = filteredPromotions.filter(promo => promo.is_active === params.is_active);
  }
  
  return {
    data: filteredPromotions,
    total: filteredPromotions.length
  };
};

export const createPromotion = async (payload: CreatePromotionPayload): Promise<ServicePromotion> => {
  await delay(800);
  
  // Simulate validation
  if (!payload.promotion_code || !payload.title || !payload.service_ids.length) {
    throw new Error("กรุณากรอกข้อมูลที่จำเป็น");
  }
  
  // Check if promotion code already exists
  if (mockPromotions.some(p => p.promotion_code === payload.promotion_code)) {
    throw new Error("รหัสโปรโมชั่นนี้มีอยู่แล้ว");
  }
  
  const newPromotion: ServicePromotion = {
    id: Math.max(...mockPromotions.map(p => p.id)) + 1,
    is_active: true,
    current_uses: 0,
    max_uses: payload.max_uses || undefined,
    terms_conditions: payload.terms_conditions || "",
    ...payload,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  mockPromotions.push(newPromotion);
  return newPromotion;
};

export const updatePromotion = async (id: number, payload: Partial<CreatePromotionPayload>): Promise<ServicePromotion> => {
  await delay(600);
  
  const index = mockPromotions.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error("ไม่พบโปรโมชั่นที่ต้องการแก้ไข");
  }
  
  mockPromotions[index] = {
    ...mockPromotions[index],
    ...payload,
    updated_at: new Date().toISOString()
  };
  
  return mockPromotions[index];
};

export const deletePromotion = async (id: number): Promise<void> => {
  await delay(400);
  
  const index = mockPromotions.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error("ไม่พบโปรโมชั่นที่ต้องการลบ");
  }
  
  mockPromotions.splice(index, 1);
};

export const togglePromotionStatus = async (id: number): Promise<ServicePromotion> => {
  await delay(400);
  
  const index = mockPromotions.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error("ไม่พบโปรโมชั่นที่ต้องการอัปเดต");
  }
  
  mockPromotions[index] = {
    ...mockPromotions[index],
    is_active: !mockPromotions[index].is_active,
    updated_at: new Date().toISOString()
  };
  
  return mockPromotions[index];
};
