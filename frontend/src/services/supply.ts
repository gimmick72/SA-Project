// src/services/supply.ts
export const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

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

// --- helper แปลงคีย์ให้เป็นตัวเล็กแบบที่ UI ใช้ ---
function normalizeSupply(raw: any): Supply {
  const id = raw?.id ?? raw?.ID ?? raw?.Id;
  const code = raw?.code ?? raw?.Code;
  const name = raw?.name ?? raw?.Name;
  const category = raw?.category ?? raw?.Category;
  const quantity = raw?.quantity ?? raw?.Quantity;
  const unit = raw?.unit ?? raw?.Unit;
  const importDate = raw?.importDate ?? raw?.ImportDate;
  const expiryDate = raw?.expiryDate ?? raw?.ExpiryDate;
  const createdAt = raw?.createdAt ?? raw?.CreatedAt;
  const updatedAt = raw?.updatedAt ?? raw?.UpdatedAt;

  return {
    id: Number(id),
    code: String(code ?? ""),
    name: String(name ?? ""),
    category: String(category ?? ""),
    quantity: Number(quantity ?? 0),
    unit: String(unit ?? ""),
    importDate: importDate ? String(importDate) : "",
    expiryDate: expiryDate ? String(expiryDate) : "",
    createdAt: createdAt ? String(createdAt) : undefined,
    updatedAt: updatedAt ? String(updatedAt) : undefined,
  };
}

export async function fetchSupplies(params: {
  q?: string;
  category?: string;
  import_date?: string;
  expiry_date?: string;
  page?: number;
  page_size?: number;
  sort_by?: string;
  order?: "asc" | "desc";
}): Promise<SupplyPage> {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qs.append(k, String(v));
  });

  const res = await fetch(`${BASE_URL}/api/supplies?` + qs.toString());
  if (!res.ok) throw new Error(await res.text());
  const data: any = await res.json();

  // รองรับทั้ง array ตรง ๆ หรือ { items, total, ... }
  const itemsRaw: any[] = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
  const items = itemsRaw.map(normalizeSupply);
  const total = Array.isArray(data) ? items.length : Number(data?.total ?? items.length);

  // รักษา page/page_size จากพารามิเตอร์ (ถ้า backend ไม่คืนมา)
  return {
    items,
    total,
    page: params.page ?? 1,
    page_size: params.page_size ?? items.length,
  };
}

export async function deleteSupply(id: number) {
  const res = await fetch(`${BASE_URL}/api/supplies/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text()); // พอแล้ว ไม่ต้องเช็ก 204 เพิ่ม
}

//create supply
export async function createSupply(payload: {
  code: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  import_date: string; // "YYYY-MM-DD"
  expiry_date: string; // "YYYY-MM-DD"
}) {
  const res = await fetch(`${BASE_URL}/api/supplies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return await res.json();
}

//Dispense supply
// โหลดตัวเลือกเวชภัณฑ์จาก backend (หน้า AllSupplies ใช้อยู่แล้ว)
export async function fetchSupplyOptions() {
  const res = await fetch(`${BASE_URL}/api/supplies?page=1&page_size=100`);
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  const items = Array.isArray(data) ? data : data.items || [];
  return items.map((it: any) => ({
    code: it.code ?? it.Code,
    name: it.name ?? it.Name,
    category: it.category ?? it.Category,
  }));
}

// สร้างรายการเบิกจ่าย
export async function createDispense(payload: {
  case_code: string;
  dispenser: string;
  items: { supply_code: string; quantity: number }[];
}) {
  const res = await fetch(`${BASE_URL}/api/dispenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
  try { return JSON.parse(text); } catch { return text; }
}

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

export async function fetchDispenses(params: {
  q?: string;
  date_from?: string; // YYYY-MM-DD
  date_to?: string;   // YYYY-MM-DD
  page?: number;
  page_size?: number;
  sort_by?: string;   // recorded_at|supply_code|supply_name|quantity|dispenser|case_code
  order?: "asc" | "desc";
}): Promise<DispensePage> {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qs.append(k, String(v));
  });
  const res = await fetch(`${BASE_URL}/api/dispenses?` + qs.toString());
  if (!res.ok) throw new Error(await res.text());
  return await res.json() as DispensePage;
}


