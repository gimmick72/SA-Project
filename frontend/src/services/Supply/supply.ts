// services/Supply/supply.ts
export interface Supply {
  id: number;
  code: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  import_date: string;
  expiry_date: string;
  created_at: string;
  updated_at: string;
}

export interface SupplyOption {
  code: string;
  name: string;
  category: string;
}

export interface CreateSupplyPayload {
  code: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  import_date: string;
  expiry_date: string;
}

export interface DispensePayload {
  caseCode: string;
  items: Array<{
    supplyCode: string;
    quantity: number;
  }>;
}

// Mock data for development
const mockSupplies: Supply[] = [
  {
    id: 1,
    code: "MED001",
    name: "ยาแก้ปวด",
    category: "ยา",
    quantity: 100,
    unit: "เม็ด",
    import_date: "2024-01-15",
    expiry_date: "2025-01-15",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z"
  },
  {
    id: 2,
    code: "SUP001",
    name: "ถุงมือยาง",
    category: "เวชภัณฑ์",
    quantity: 500,
    unit: "ชิ้น",
    import_date: "2024-02-01",
    expiry_date: "2025-02-01",
    created_at: "2024-02-01T10:00:00Z",
    updated_at: "2024-02-01T10:00:00Z"
  },
  {
    id: 3,
    code: "EQU001",
    name: "เข็มฉีดยา",
    category: "อุปกรณ์",
    quantity: 200,
    unit: "อัน",
    import_date: "2024-01-20",
    expiry_date: "2025-01-20",
    created_at: "2024-01-20T10:00:00Z",
    updated_at: "2024-01-20T10:00:00Z"
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchSupplies = async (params?: any): Promise<{ data: Supply[]; total: number }> => {
  await delay(500);
  return {
    data: mockSupplies,
    total: mockSupplies.length
  };
};

export const fetchSupplyOptions = async (): Promise<SupplyOption[]> => {
  await delay(300);
  return mockSupplies.map(supply => ({
    code: supply.code,
    name: supply.name,
    category: supply.category
  }));
};

export const createSupply = async (payload: CreateSupplyPayload): Promise<Supply> => {
  await delay(800);
  
  // Simulate validation
  if (!payload.code || !payload.name) {
    throw new Error("รหัสและชื่อเวชภัณฑ์จำเป็นต้องระบุ");
  }
  
  // Check if code already exists
  if (mockSupplies.some(s => s.code === payload.code)) {
    throw new Error("รหัสเวชภัณฑ์นี้มีอยู่แล้ว");
  }
  
  const newSupply: Supply = {
    id: Math.max(...mockSupplies.map(s => s.id)) + 1,
    ...payload,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  mockSupplies.push(newSupply);
  return newSupply;
};

export const updateSupply = async (id: number, payload: Partial<CreateSupplyPayload>): Promise<Supply> => {
  await delay(600);
  
  const index = mockSupplies.findIndex(s => s.id === id);
  if (index === -1) {
    throw new Error("ไม่พบเวชภัณฑ์ที่ต้องการแก้ไข");
  }
  
  mockSupplies[index] = {
    ...mockSupplies[index],
    ...payload,
    updated_at: new Date().toISOString()
  };
  
  return mockSupplies[index];
};

export const deleteSupply = async (id: number): Promise<void> => {
  await delay(400);
  
  const index = mockSupplies.findIndex(s => s.id === id);
  if (index === -1) {
    throw new Error("ไม่พบเวชภัณฑ์ที่ต้องการลบ");
  }
  
  mockSupplies.splice(index, 1);
};

export const createDispense = async (payload: DispensePayload): Promise<{ success: boolean; message: string }> => {
  await delay(1000);
  
  // Validate case code
  if (!payload.caseCode) {
    throw new Error("กรุณาระบุรหัสเคส");
  }
  
  // Validate items
  if (!payload.items || payload.items.length === 0) {
    throw new Error("กรุณาเลือกเวชภัณฑ์ที่ต้องการจ่าย");
  }
  
  // Check stock availability
  for (const item of payload.items) {
    const supply = mockSupplies.find(s => s.code === item.supplyCode);
    if (!supply) {
      throw new Error(`ไม่พบเวชภัณฑ์รหัส ${item.supplyCode}`);
    }
    if (supply.quantity < item.quantity) {
      throw new Error(`เวชภัณฑ์ ${supply.name} มีจำนวนไม่เพียงพอ (คงเหลือ ${supply.quantity} ${supply.unit})`);
    }
  }
  
  // Update stock quantities
  for (const item of payload.items) {
    const supply = mockSupplies.find(s => s.code === item.supplyCode);
    if (supply) {
      supply.quantity -= item.quantity;
      supply.updated_at = new Date().toISOString();
    }
  }
  
  return {
    success: true,
    message: "จ่ายเวชภัณฑ์สำเร็จ"
  };
};

export const fetchDispenses = async (params?: any): Promise<{ data: any[]; total: number }> => {
  await delay(400);
  // Mock dispense history data
  return {
    data: [],
    total: 0
  };
};
