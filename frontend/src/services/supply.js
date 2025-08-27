var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
// src/services/supply.ts
export const BASE_URL = (_a = import.meta.env.VITE_API_URL) !== null && _a !== void 0 ? _a : "http://localhost:8080";
// --- helper แปลงคีย์ให้เป็นตัวเล็กแบบที่ UI ใช้ ---
function normalizeSupply(raw) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    const id = (_b = (_a = raw === null || raw === void 0 ? void 0 : raw.id) !== null && _a !== void 0 ? _a : raw === null || raw === void 0 ? void 0 : raw.ID) !== null && _b !== void 0 ? _b : raw === null || raw === void 0 ? void 0 : raw.Id;
    const code = (_c = raw === null || raw === void 0 ? void 0 : raw.code) !== null && _c !== void 0 ? _c : raw === null || raw === void 0 ? void 0 : raw.Code;
    const name = (_d = raw === null || raw === void 0 ? void 0 : raw.name) !== null && _d !== void 0 ? _d : raw === null || raw === void 0 ? void 0 : raw.Name;
    const category = (_e = raw === null || raw === void 0 ? void 0 : raw.category) !== null && _e !== void 0 ? _e : raw === null || raw === void 0 ? void 0 : raw.Category;
    const quantity = (_f = raw === null || raw === void 0 ? void 0 : raw.quantity) !== null && _f !== void 0 ? _f : raw === null || raw === void 0 ? void 0 : raw.Quantity;
    const unit = (_g = raw === null || raw === void 0 ? void 0 : raw.unit) !== null && _g !== void 0 ? _g : raw === null || raw === void 0 ? void 0 : raw.Unit;
    const importDate = (_h = raw === null || raw === void 0 ? void 0 : raw.importDate) !== null && _h !== void 0 ? _h : raw === null || raw === void 0 ? void 0 : raw.ImportDate;
    const expiryDate = (_j = raw === null || raw === void 0 ? void 0 : raw.expiryDate) !== null && _j !== void 0 ? _j : raw === null || raw === void 0 ? void 0 : raw.ExpiryDate;
    const createdAt = (_k = raw === null || raw === void 0 ? void 0 : raw.createdAt) !== null && _k !== void 0 ? _k : raw === null || raw === void 0 ? void 0 : raw.CreatedAt;
    const updatedAt = (_l = raw === null || raw === void 0 ? void 0 : raw.updatedAt) !== null && _l !== void 0 ? _l : raw === null || raw === void 0 ? void 0 : raw.UpdatedAt;
    return {
        id: Number(id),
        code: String(code !== null && code !== void 0 ? code : ""),
        name: String(name !== null && name !== void 0 ? name : ""),
        category: String(category !== null && category !== void 0 ? category : ""),
        quantity: Number(quantity !== null && quantity !== void 0 ? quantity : 0),
        unit: String(unit !== null && unit !== void 0 ? unit : ""),
        importDate: importDate ? String(importDate) : "",
        expiryDate: expiryDate ? String(expiryDate) : "",
        createdAt: createdAt ? String(createdAt) : undefined,
        updatedAt: updatedAt ? String(updatedAt) : undefined,
    };
}
export function fetchSupplies(params) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        const qs = new URLSearchParams();
        Object.entries(params).forEach(([k, v]) => {
            if (v !== undefined && v !== null && v !== "")
                qs.append(k, String(v));
        });
        const res = yield fetch(`${BASE_URL}/api/supplies?` + qs.toString());
        if (!res.ok)
            throw new Error(yield res.text());
        const data = yield res.json();
        // รองรับทั้ง array ตรง ๆ หรือ { items, total, ... }
        const itemsRaw = Array.isArray(data) ? data : Array.isArray(data === null || data === void 0 ? void 0 : data.items) ? data.items : [];
        const items = itemsRaw.map(normalizeSupply);
        const total = Array.isArray(data) ? items.length : Number((_a = data === null || data === void 0 ? void 0 : data.total) !== null && _a !== void 0 ? _a : items.length);
        // รักษา page/page_size จากพารามิเตอร์ (ถ้า backend ไม่คืนมา)
        return {
            items,
            total,
            page: (_b = params.page) !== null && _b !== void 0 ? _b : 1,
            page_size: (_c = params.page_size) !== null && _c !== void 0 ? _c : items.length,
        };
    });
}
export function deleteSupply(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(`${BASE_URL}/api/supplies/${id}`, { method: "DELETE" });
        if (!res.ok)
            throw new Error(yield res.text()); // พอแล้ว ไม่ต้องเช็ก 204 เพิ่ม
    });
}
