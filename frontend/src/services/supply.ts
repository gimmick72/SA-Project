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
