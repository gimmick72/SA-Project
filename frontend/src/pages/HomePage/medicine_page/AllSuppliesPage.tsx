// src/pages/medicine_page/AllSuppliesPage.tsx
import React, { useState, useEffect, useMemo } from "react";
import { Input, Table, Button, Space, Select, DatePicker, Tag, Tooltip, message, Popconfirm } from "antd";
import { SearchOutlined, ReloadOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import type { ColumnsType } from "antd/es/table";
import type { SorterResult } from "antd/es/table/interface";
import type { TableProps } from "antd";
import { fetchSupplies, deleteSupply } from "../../../services/supply";

const { Search } = Input;
const { Option } = Select;

type QueryState = {
  q: string;
  category: string;
  importDate: Dayjs | null;
  expiryDate: Dayjs | null;
  page: number;
  pageSize: number;
  sortBy: string;
  order: "asc" | "desc";
};

type Supply = {
  id: number;
  code: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  importDate: string;
  expiryDate: string;
};

// ถ้ายังอยากกันเคสคีย์ตัวใหญ่จาก backend ไว้ ก็เก็บ normalizer นี้ไว้ได้
function normalizeSupply(raw: any): Supply {
  const id = raw?.id ?? raw?.ID ?? raw?.Id;
  const code = raw?.code ?? raw?.Code;
  const name = raw?.name ?? raw?.Name;
  const category = raw?.category ?? raw?.Category;
  const quantity = raw?.quantity ?? raw?.Quantity;
  const unit = raw?.unit ?? raw?.Unit;
  const importDate = raw?.importDate ?? raw?.ImportDate;
  const expiryDate = raw?.expiryDate ?? raw?.ExpiryDate;

  return {
    id: Number(id),
    code: String(code ?? ""),
    name: String(name ?? ""),
    category: String(category ?? ""),
    quantity: Number(quantity ?? 0),
    unit: String(unit ?? ""),
    importDate: importDate ? String(importDate) : "",
    expiryDate: expiryDate ? String(expiryDate) : "",
  };
}

const AllSuppliesPage: React.FC = () => {
  const [query, setQuery] = useState<QueryState>({
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
  const [rows, setRows] = useState<Supply[]>([]);
  const [total, setTotal] = useState(0);
  const [msg, ctx] = message.useMessage();

  const fetchData = async () => {
    setLoading(true);
    try {
      const data: any = await fetchSupplies({
        q: query.q,
        category: query.category,
        import_date: query.importDate ? query.importDate.format("YYYY-MM-DD") : undefined,
        expiry_date: query.expiryDate ? query.expiryDate.format("YYYY-MM-DD") : undefined,
        page: query.page,
        page_size: query.pageSize,
        sort_by: query.sortBy,
        order: query.order,
      });

      const itemsRaw: any[] = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
      const normalized = itemsRaw.map(normalizeSupply);
      setRows(normalized);
      setTotal(Array.isArray(data) ? normalized.length : Number(data?.total ?? normalized.length));
    } catch (e: any) {
      msg.error(e?.message || "โหลดข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.page, query.pageSize, query.sortBy, query.order, query.q, query.category, query.importDate, query.expiryDate]);

  const handleResetFilters = () => {
    setQuery((q) => ({
      ...q,
      q: "",
      category: "all",
      importDate: null,
      expiryDate: null,
      page: 1,
      sortBy: "created_at",
      order: "desc",
    }));
  };

  const handleEdit = (record: Supply) => {
    console.log("แก้ไข:", record);
    msg.info(`กำลังแก้ไข: ${record.name}`);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteSupply(id);
      msg.success("ลบรายการสำเร็จ");
      fetchData();
    } catch (e: any) {
      msg.error(e?.message || "ลบไม่สำเร็จ");
    }
  };

  const columns: ColumnsType<Supply> = useMemo(() => [
    { title: "รหัส", dataIndex: "code", key: "code", sorter: true },
    { title: "ชื่อเวชภัณฑ์", dataIndex: "name", key: "name", sorter: true },
    {
      title: "หมวดหมู่",
      dataIndex: "category",
      key: "category",
      filters: Array.from(new Set(rows.map(r => r.category).filter(Boolean))).map(v => ({ text: v, value: v })),
      filteredValue: query.category === "all" ? null : [query.category], // ✅ sync กับ server-side filter
      render: (v: string) => <Tag color="blue">{v}</Tag>
    },
    { title: "จำนวน", dataIndex: "quantity", key: "quantity", sorter: true },
    { title: "หน่วย", dataIndex: "unit", key: "unit" },
    {
      title: "วันที่นำเข้า", dataIndex: "importDate", key: "importDate", sorter: true,
      render: (d: string) => (d ? dayjs(d).format("YYYY-MM-DD") : "-")
    },
    {
      title: "วันหมดอายุ", dataIndex: "expiryDate", key: "expiryDate", sorter: true,
      render: (d: string) => {
        if (!d) return "-";
        const left = dayjs(d).diff(dayjs(), "day");
        const color = left <= 0 ? "red" : left <= 30 ? "orange" : "default";
        return <Tag color={color}>{dayjs(d).format("YYYY-MM-DD")}{left<=0 ? " (หมดอายุ)" : left<=30 ? ` (เหลือ ${left} วัน)` : ""}</Tag>;
      }
    },
    {
      title: "จัดการ",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="แก้ไข">
            <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Popconfirm
            title="คุณต้องการลบรายการนี้ใช่ไหม?"
            onConfirm={() => handleDelete(record.id)}
            okText="ใช่"
            cancelText="ไม่"
          >
            <Tooltip title="ลบ">
              <Button icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ], [rows, query.category]);

  const onTableChange: TableProps<Supply>["onChange"] = (pagination, filters, sorter) => {
    const s = Array.isArray(sorter) ? sorter[0] : sorter;
    const sortMap: Record<string, string> = {
      code: "code",
      name: "name",
      quantity: "quantity",
      importDate: "import_date",
      expiryDate: "expiry_date",
    };
    const selectedCat = (filters?.category as React.Key[] | null)?.[0];

    setQuery((q) => ({
      ...q,
      page: pagination.current ?? 1,
      pageSize: pagination.pageSize ?? q.pageSize,
      sortBy: s?.field ? sortMap[String(s.field)] ?? q.sortBy : q.sortBy,
      order: s?.order ? (s.order === "ascend" ? "asc" : "desc") : q.order,
      category: selectedCat ? String(selectedCat) : q.category,
    }));
  };

  return (
    <div style={{ marginTop: 24 }}>
      {ctx}
      <div style={{ marginBottom: 24, display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
        <Space size="middle">
          <Search
            placeholder="ค้นหาเวชภัณฑ์ (ชื่อ/รหัส)"
            allowClear
            value={query.q}
            onChange={(e)=> setQuery(q=>({...q, q: e.target.value }))}
            onSearch={()=> setQuery(q=>({...q, page:1 }))}
            style={{ width: 260 }}
            prefix={<SearchOutlined />}
          />
          <Select
            style={{ width: 180 }}
            value={query.category}
            onChange={(v)=> setQuery(q=>({...q, category: v, page:1 }))}
          >
            <Option value="all">หมวดหมู่ทั้งหมด</Option>
            {Array.from(new Set(rows.map(r=> r.category).filter(Boolean))).map(c => (
              <Option key={c} value={c}>{c}</Option>
            ))}
          </Select>
          <DatePicker
            placeholder="วันที่นำเข้า"
            value={query.importDate}
            onChange={(d)=> setQuery(q=>({...q, importDate: d, page:1 }))}
            style={{ width: 150 }}
          />
          <DatePicker
            placeholder="วันหมดอายุ"
            value={query.expiryDate}
            onChange={(d)=> setQuery(q=>({...q, expiryDate: d, page:1 }))}
            style={{ width: 150 }}
          />
          <Button icon={<ReloadOutlined />} onClick={handleResetFilters}>รีเซ็ต</Button>
        </Space>
        <Space style={{ marginLeft: "auto" }}>
          <Button type="primary">ดูรายงานการเบิก/จ่าย</Button>
        </Space>
      </div>

      <Table
        rowKey="id"
        loading={loading}
        dataSource={rows}
        columns={columns}
        bordered
        pagination={{ current: query.page, pageSize: query.pageSize, total, showSizeChanger: true }}
        onChange={onTableChange}
      />
    </div>
  );
};

export default AllSuppliesPage;
