// frontend/src/services/employee.ts
export const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export type Employee = {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  role: string;
  // password: string (ไม่ส่งกลับจาก backend)
};

function norm(raw: any): Employee {
  return {
    id: Number(raw?.id ?? raw?.ID),
    firstName: String(raw?.firstName ?? raw?.first_name ?? ""),
    lastName:  String(raw?.lastName  ?? raw?.last_name  ?? ""),
    username:  String(raw?.username ?? ""),
    role:      String(raw?.role ?? ""),
  };
}

export async function fetchEmployees(params: { q?: string; role?: string; page?: number; page_size?: number; }) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v) qs.append(k, String(v)); });
  const res = await fetch(`${BASE_URL}/api/employees?` + qs.toString());
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  const items = (Array.isArray(data?.items) ? data.items : []).map(norm);
  return { items, total: Number(data?.total ?? items.length), page: Number(data?.page ?? 1), page_size: Number(data?.page_size ?? items.length) };
}

export async function createEmployee(payload: { firstName: string; lastName: string; username: string; password: string; role: string; }) {
  const res = await fetch(`${BASE_URL}/api/employees`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  const t = await res.text(); if (!res.ok) throw new Error(t || `HTTP ${res.status}`); try { return JSON.parse(t); } catch { return t; }
}

export async function updateEmployee(id: number, payload: Partial<{ firstName: string; lastName: string; username: string; password: string; role: string; }>) {
  const res = await fetch(`${BASE_URL}/api/employees/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  const t = await res.text(); if (!res.ok) throw new Error(t || `HTTP ${res.status}`); try { return JSON.parse(t); } catch { return t; }
}

export async function deleteEmployee(id: number) {
  const res = await fetch(`${BASE_URL}/api/employees/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text());
}
