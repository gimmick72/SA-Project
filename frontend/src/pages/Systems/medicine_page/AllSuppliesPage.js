var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/medicine_page/AllSuppliesPage.tsx
import { useState, useEffect, useMemo } from "react";
import { Input, Table, Button, Space, Select, DatePicker, Tag, Tooltip, message, Popconfirm } from "antd";
import { SearchOutlined, ReloadOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { fetchSupplies, deleteSupply } from "../../../services/supply";
const { Search } = Input;
const { Option } = Select;
// ถ้ายังอยากกันเคสคีย์ตัวใหญ่จาก backend ไว้ ก็เก็บ normalizer นี้ไว้ได้
function normalizeSupply(raw) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const id = (_b = (_a = raw === null || raw === void 0 ? void 0 : raw.id) !== null && _a !== void 0 ? _a : raw === null || raw === void 0 ? void 0 : raw.ID) !== null && _b !== void 0 ? _b : raw === null || raw === void 0 ? void 0 : raw.Id;
    const code = (_c = raw === null || raw === void 0 ? void 0 : raw.code) !== null && _c !== void 0 ? _c : raw === null || raw === void 0 ? void 0 : raw.Code;
    const name = (_d = raw === null || raw === void 0 ? void 0 : raw.name) !== null && _d !== void 0 ? _d : raw === null || raw === void 0 ? void 0 : raw.Name;
    const category = (_e = raw === null || raw === void 0 ? void 0 : raw.category) !== null && _e !== void 0 ? _e : raw === null || raw === void 0 ? void 0 : raw.Category;
    const quantity = (_f = raw === null || raw === void 0 ? void 0 : raw.quantity) !== null && _f !== void 0 ? _f : raw === null || raw === void 0 ? void 0 : raw.Quantity;
    const unit = (_g = raw === null || raw === void 0 ? void 0 : raw.unit) !== null && _g !== void 0 ? _g : raw === null || raw === void 0 ? void 0 : raw.Unit;
    const importDate = (_h = raw === null || raw === void 0 ? void 0 : raw.importDate) !== null && _h !== void 0 ? _h : raw === null || raw === void 0 ? void 0 : raw.ImportDate;
    const expiryDate = (_j = raw === null || raw === void 0 ? void 0 : raw.expiryDate) !== null && _j !== void 0 ? _j : raw === null || raw === void 0 ? void 0 : raw.ExpiryDate;
    return {
        id: Number(id),
        code: String(code !== null && code !== void 0 ? code : ""),
        name: String(name !== null && name !== void 0 ? name : ""),
        category: String(category !== null && category !== void 0 ? category : ""),
        quantity: Number(quantity !== null && quantity !== void 0 ? quantity : 0),
        unit: String(unit !== null && unit !== void 0 ? unit : ""),
        importDate: importDate ? String(importDate) : "",
        expiryDate: expiryDate ? String(expiryDate) : "",
    };
}
const AllSuppliesPage = () => {
    const [query, setQuery] = useState({
        q: "",
        category: "all",
        importDate: null,
        expiryDate: null,
        page: 1,
        pageSize: 10,
        sortBy: "created_at",
        order: "desc",
    });
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    const [msg, ctx] = message.useMessage();
    const fetchData = () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        setLoading(true);
        try {
            const data = yield fetchSupplies({
                q: query.q,
                category: query.category,
                import_date: query.importDate ? query.importDate.format("YYYY-MM-DD") : undefined,
                expiry_date: query.expiryDate ? query.expiryDate.format("YYYY-MM-DD") : undefined,
                page: query.page,
                page_size: query.pageSize,
                sort_by: query.sortBy,
                order: query.order,
            });
            const itemsRaw = Array.isArray(data) ? data : Array.isArray(data === null || data === void 0 ? void 0 : data.items) ? data.items : [];
            const normalized = itemsRaw.map(normalizeSupply);
            setRows(normalized);
            setTotal(Array.isArray(data) ? normalized.length : Number((_a = data === null || data === void 0 ? void 0 : data.total) !== null && _a !== void 0 ? _a : normalized.length));
        }
        catch (e) {
            msg.error((e === null || e === void 0 ? void 0 : e.message) || "โหลดข้อมูลไม่สำเร็จ");
        }
        finally {
            setLoading(false);
        }
    });
    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query.page, query.pageSize, query.sortBy, query.order, query.q, query.category, query.importDate, query.expiryDate]);
    const handleResetFilters = () => {
        setQuery((q) => (Object.assign(Object.assign({}, q), { q: "", category: "all", importDate: null, expiryDate: null, page: 1, sortBy: "created_at", order: "desc" })));
    };
    const handleEdit = (record) => {
        console.log("แก้ไข:", record);
        msg.info(`กำลังแก้ไข: ${record.name}`);
    };
    const handleDelete = (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield deleteSupply(id);
            msg.success("ลบรายการสำเร็จ");
            fetchData();
        }
        catch (e) {
            msg.error((e === null || e === void 0 ? void 0 : e.message) || "ลบไม่สำเร็จ");
        }
    });
    const columns = useMemo(() => [
        { title: "รหัส", dataIndex: "code", key: "code", sorter: true },
        { title: "ชื่อเวชภัณฑ์", dataIndex: "name", key: "name", sorter: true },
        {
            title: "หมวดหมู่",
            dataIndex: "category",
            key: "category",
            filters: Array.from(new Set(rows.map(r => r.category).filter(Boolean))).map(v => ({ text: v, value: v })),
            filteredValue: query.category === "all" ? null : [query.category], // ✅ sync กับ server-side filter
            render: (v) => _jsx(Tag, { color: "blue", children: v })
        },
        { title: "จำนวน", dataIndex: "quantity", key: "quantity", sorter: true },
        { title: "หน่วย", dataIndex: "unit", key: "unit" },
        {
            title: "วันที่นำเข้า", dataIndex: "importDate", key: "importDate", sorter: true,
            render: (d) => (d ? dayjs(d).format("YYYY-MM-DD") : "-")
        },
        {
            title: "วันหมดอายุ", dataIndex: "expiryDate", key: "expiryDate", sorter: true,
            render: (d) => {
                if (!d)
                    return "-";
                const left = dayjs(d).diff(dayjs(), "day");
                const color = left <= 0 ? "red" : left <= 30 ? "orange" : "default";
                return _jsxs(Tag, { color: color, children: [dayjs(d).format("YYYY-MM-DD"), left <= 0 ? " (หมดอายุ)" : left <= 30 ? ` (เหลือ ${left} วัน)` : ""] });
            }
        },
        {
            title: "จัดการ",
            key: "action",
            render: (_, record) => (_jsxs(Space, { size: "middle", children: [_jsx(Tooltip, { title: "\u0E41\u0E01\u0E49\u0E44\u0E02", children: _jsx(Button, { icon: _jsx(EditOutlined, {}), onClick: () => handleEdit(record) }) }), _jsx(Popconfirm, { title: "\u0E04\u0E38\u0E13\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E25\u0E1A\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E19\u0E35\u0E49\u0E43\u0E0A\u0E48\u0E44\u0E2B\u0E21?", onConfirm: () => handleDelete(record.id), okText: "\u0E43\u0E0A\u0E48", cancelText: "\u0E44\u0E21\u0E48", children: _jsx(Tooltip, { title: "\u0E25\u0E1A", children: _jsx(Button, { icon: _jsx(DeleteOutlined, {}), danger: true }) }) })] })),
        },
    ], [rows, query.category]);
    const onTableChange = (pagination, filters, sorter) => {
        var _a;
        const s = Array.isArray(sorter) ? sorter[0] : sorter;
        const sortMap = {
            code: "code",
            name: "name",
            quantity: "quantity",
            importDate: "import_date",
            expiryDate: "expiry_date",
        };
        const selectedCat = (_a = filters === null || filters === void 0 ? void 0 : filters.category) === null || _a === void 0 ? void 0 : _a[0];
        setQuery((q) => {
            var _a, _b, _c;
            return (Object.assign(Object.assign({}, q), { page: (_a = pagination.current) !== null && _a !== void 0 ? _a : 1, pageSize: (_b = pagination.pageSize) !== null && _b !== void 0 ? _b : q.pageSize, sortBy: (s === null || s === void 0 ? void 0 : s.field) ? (_c = sortMap[String(s.field)]) !== null && _c !== void 0 ? _c : q.sortBy : q.sortBy, order: (s === null || s === void 0 ? void 0 : s.order) ? (s.order === "ascend" ? "asc" : "desc") : q.order, category: selectedCat ? String(selectedCat) : q.category }));
        });
    };
    return (_jsxs("div", { style: { marginTop: 24 }, children: [ctx, _jsxs("div", { style: { marginBottom: 24, display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }, children: [_jsxs(Space, { size: "middle", children: [_jsx(Search, { placeholder: "\u0E04\u0E49\u0E19\u0E2B\u0E32\u0E40\u0E27\u0E0A\u0E20\u0E31\u0E13\u0E11\u0E4C (\u0E0A\u0E37\u0E48\u0E2D/\u0E23\u0E2B\u0E31\u0E2A)", allowClear: true, value: query.q, onChange: (e) => setQuery(q => (Object.assign(Object.assign({}, q), { q: e.target.value }))), onSearch: () => setQuery(q => (Object.assign(Object.assign({}, q), { page: 1 }))), style: { width: 260 }, prefix: _jsx(SearchOutlined, {}) }), _jsxs(Select, { style: { width: 180 }, value: query.category, onChange: (v) => setQuery(q => (Object.assign(Object.assign({}, q), { category: v, page: 1 }))), children: [_jsx(Option, { value: "all", children: "\u0E2B\u0E21\u0E27\u0E14\u0E2B\u0E21\u0E39\u0E48\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14" }), Array.from(new Set(rows.map(r => r.category).filter(Boolean))).map(c => (_jsx(Option, { value: c, children: c }, c)))] }), _jsx(DatePicker, { placeholder: "\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E19\u0E33\u0E40\u0E02\u0E49\u0E32", value: query.importDate, onChange: (d) => setQuery(q => (Object.assign(Object.assign({}, q), { importDate: d, page: 1 }))), style: { width: 150 } }), _jsx(DatePicker, { placeholder: "\u0E27\u0E31\u0E19\u0E2B\u0E21\u0E14\u0E2D\u0E32\u0E22\u0E38", value: query.expiryDate, onChange: (d) => setQuery(q => (Object.assign(Object.assign({}, q), { expiryDate: d, page: 1 }))), style: { width: 150 } }), _jsx(Button, { icon: _jsx(ReloadOutlined, {}), onClick: handleResetFilters, children: "\u0E23\u0E35\u0E40\u0E0B\u0E47\u0E15" })] }), _jsx(Space, { style: { marginLeft: "auto" }, children: _jsx(Button, { type: "primary", children: "\u0E14\u0E39\u0E23\u0E32\u0E22\u0E07\u0E32\u0E19\u0E01\u0E32\u0E23\u0E40\u0E1A\u0E34\u0E01/\u0E08\u0E48\u0E32\u0E22" }) })] }), _jsx(Table, { rowKey: "id", loading: loading, dataSource: rows, columns: columns, bordered: true, pagination: { current: query.page, pageSize: query.pageSize, total, showSizeChanger: true }, onChange: onTableChange })] }));
};
export default AllSuppliesPage;
