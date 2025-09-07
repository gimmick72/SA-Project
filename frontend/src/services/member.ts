import { Member, MemberPage } from "../interface/member";

export const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

function normalizeMember(raw: any): Member {
  const id = raw?.id ?? raw?.ID ?? raw?.Id;
  return {
    id: Number(id),
    first_name: String(raw?.first_name ?? raw?.member_first_name ?? ""),
    last_name:  String(raw?.last_name  ?? raw?.member_last_name  ?? ""),
    email:      String(raw?.email ?? ""),
    phone:      String(raw?.phone ?? raw?.phone_number ?? ""),
    username:   String(raw?.username ?? ""),
    created_at: raw?.created_at ?? raw?.CreatedAt,
    updated_at: raw?.updated_at ?? raw?.UpdatedAt,
  };
}

export async function fetchMembers(params: {
  q?: string;
  page?: number;
  page_size?: number;
  sort_by?: string;
  order?: "asc" | "desc";
}): Promise<MemberPage> {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qs.append(k, String(v));
  });
  const res = await fetch(`${BASE_URL}/api/members?` + qs.toString());
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();

  const itemsRaw: any[] = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
  const items = itemsRaw.map(normalizeMember);
  const total = Array.isArray(data) ? items.length : Number(data?.total ?? items.length);
  return { items, total, page: params.page ?? 1, page_size: params.page_size ?? items.length };
}

export async function createMember(payload: {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  username: string;
  password: string;
}) {
  const res = await fetch(`${BASE_URL}/api/members`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
  try { return JSON.parse(text); } catch { return text; }
}

export async function updateMember(id: number, payload: Partial<{
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  username: string;
  password: string;
}>) {
  const res = await fetch(`${BASE_URL}/api/members/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
  try { return JSON.parse(text); } catch { return text; }
}

export async function deleteMember(id: number) {
  const res = await fetch(`${BASE_URL}/api/members/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text());
}
