// src/interface/ford.ts

//{supply, dispense item} data model ที่ใช้ใน UI
export type Supply = {
  id: number;
  code: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  importDate: string;  // "YYYY-MM-DD" หรือ RFC3339
  expiryDate: string;
  createdAt?: string;
  updatedAt?: string;
};

export type SupplyPage = {
  items: Supply[];
  total: number;
  page: number;
  page_size: number;
};

export type DispenseItem = {
  id: number;
  recorded_at: string;
  action: string;
  supply_id: number;
  supply_code: string;
  supply_name: string;
  category: string;
  quantity: number;
  case_code: string;
  dispenser: string;
};

export type DispensePage = {
  items: DispenseItem[];
  total: number;
  page: number;
  page_size: number;
};

//{schedule, case} data model ที่ใช้ใน UI