// src/pages/medicine_page/AllSuppliesPage.tsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Input, Table, Button, Space, Select, DatePicker, Tag, Tooltip,
  message, Popconfirm, Drawer, Form, InputNumber
} from "antd";
import { SearchOutlined, ReloadOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import type { ColumnsType } from "antd/es/table";
import type { TableProps } from "antd";
import { fetchSupplies, deleteSupply, fetchDispenses, updateSupply, Supply } from "../../../services/Supply/supply";
const { Search } = Input;
const { RangePicker } = DatePicker;

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

// Use the Supply type from the service instead of redefining it
type SupplyDisplay = {
  id: number;
  code: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  importDate: string;
  expiryDate: string;
};

// ปรับคีย์ตัวใหญ่/เล็กจาก backend ให้สม่ำเสมอ
function normalizeSupply(raw: any): SupplyDisplay {
  const id = raw?.id ?? raw?.ID ?? raw?.Id;
  const code = raw?.code ?? raw?.Code;
  const name = raw?.name ?? raw?.Name;
  const category = raw?.category ?? raw?.Category;
  const quantity = raw?.quantity ?? raw?.Quantity;
  const unit = raw?.unit ?? raw?.Unit;
  const importDate = raw?.importDate ?? raw?.ImportDate ?? raw?.import_date;
  const expiryDate = raw?.expiryDate ?? raw?.ExpiryDate ?? raw?.expiry_date;

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

// รายการหมวดหมู่เบื้องต้น (เปลี่ยนเป็นดึงจาก backend ก็ได้)
const CATEGORY_OPTIONS = [
  "ยา", "เวชภัณฑ์", "อุปกรณ์", "อื่นๆ"
];

type DispenseItem = {
  id: number;
  recorded_at: string;
  supply_code: string;
  supply_name: string;
  category: string;
  quantity: number;
  case_code: string;
  dispenser: string;
};

const AllSuppliesPage: React.FC = () => {
  // ---------- ตารางเวชภัณฑ์ ----------
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
  const [rows, setRows] = useState<SupplyDisplay[]>([]);
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

      const itemsRaw: any[] = Array.isArray(data.data) ? data.data : [];
      const normalized = itemsRaw.map(normalizeSupply);
      setRows(normalized);
      setTotal(data.total || normalized.length);
    } catch (e: any) {
      msg.error(e?.message || "โหลดข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  // โหลดข้อมูลเมื่อมีการเปลี่ยน query
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    query.page,
    query.pageSize,
    query.sortBy,
    query.order,
    query.q,
    query.category,
    query.importDate,
    query.expiryDate,
  ]);

  // ฟัง event suppliesUpdated เพื่อรีเฟรชอัตโนมัติขณะยังอยู่หน้าเดิม
  useEffect(() => {
    const handler = () => fetchData();
    window.addEventListener("suppliesUpdated", handler);
    return () => window.removeEventListener("suppliesUpdated", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ ปุ่มรีเซ็ต: เคลียร์ค้นหา/ฟิลเตอร์/เรียง/หน้า แล้วรีโหลด
  const handleResetFilters = () => {
    setQuery({
      q: "",
      category: "all",
      importDate: null,
      expiryDate: null,
      page: 1,
      pageSize: 10,
      sortBy: "created_at",
      order: "desc",
    });
  };

  // ---------- แก้ไข ----------
  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editing, setEditing] = useState<SupplyDisplay | null>(null);
  const [form] = Form.useForm();

  const handleEdit = (record: SupplyDisplay) => {
    setEditing(record);
    form.setFieldsValue({
      code: record.code,
      name: record.name,
      category: record.category || undefined,
      quantity: record.quantity,
      unit: record.unit,
      importDate: record.importDate ? dayjs(record.importDate) : null,
      expiryDate: record.expiryDate ? dayjs(record.expiryDate) : null,
    });
    setEditOpen(true);
  };

  const submitEdit = async () => {
    try {
      const vals = await form.validateFields();
      if (!editing) return;
      setEditLoading(true);

      // map payload ให้ตรง backend
      const payload = {
        code: vals.code,
        name: vals.name,
        category: vals.category ?? "",
        quantity: Number(vals.quantity ?? 0),
        unit: vals.unit ?? "",
        import_date: vals.importDate ? (vals.importDate as Dayjs).format("YYYY-MM-DD") : "",
        expiry_date: vals.expiryDate ? (vals.expiryDate as Dayjs).format("YYYY-MM-DD") : "",
      };

      await updateSupply(editing.id, payload);
      msg.success("อัปเดตรายการสำเร็จ");
      setEditOpen(false);
      setEditing(null);
      form.resetFields();

      // แจ้ง event และรีโหลด
      window.dispatchEvent(new Event("suppliesUpdated"));
      fetchData();
    } catch (e: any) {
      if (e?.errorFields) return; // validation error
      msg.error(e?.message || "อัปเดตไม่สำเร็จ");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteSupply(id);
      msg.success("ลบรายการสำเร็จ");
      window.dispatchEvent(new Event("suppliesUpdated"));
      fetchData();
    } catch (e: any) {
      msg.error(e?.message || "ลบไม่สำเร็จ");
    }
  };

  const columns: ColumnsType<SupplyDisplay> = useMemo(
    () => [
      { title: "รหัส", dataIndex: "code", key: "code", sorter: true, fixed: "left", width: 120 },
      { title: "ชื่อเวชภัณฑ์", dataIndex: "name", key: "name", sorter: true, width: 260 },
      {
        title: "หมวดหมู่",
        dataIndex: "category",
        key: "category",
        filters: Array.from(new Set(rows.map((r) => r.category).filter(Boolean))).map((v) => ({
          text: v,
          value: v,
        })),
        filteredValue: query.category === "all" ? null : [query.category],
        render: (v: string) => <Tag color="blue">{v}</Tag>,
        width: 160,
      },
      { title: "จำนวน", dataIndex: "quantity", key: "quantity", sorter: true, align: "right", width: 120 },
      { title: "หน่วย", dataIndex: "unit", key: "unit", width: 120 },
      {
        title: "วันที่นำเข้า",
        dataIndex: "importDate",
        key: "importDate",
        sorter: true,
        render: (d: string) => (d ? dayjs(d).format("YYYY-MM-DD") : "-"),
        width: 150,
      },
      {
        title: "วันหมดอายุ",
        dataIndex: "expiryDate",
        key: "expiryDate",
        sorter: true,
        render: (d: string) => {
          if (!d) return "-";
          const left = dayjs(d).diff(dayjs(), "day");
          const color = left <= 0 ? "red" : left <= 30 ? "orange" : "default";
          return (
            <Tag color={color}>
              {dayjs(d).format("YYYY-MM-DD")}
              {left <= 0 ? " (หมดอายุ)" : left <= 30 ? ` (เหลือ ${left} วัน)` : ""}
            </Tag>
          );
        },
        width: 170,
      },
      {
        title: "จัดการ",
        key: "action",
        fixed: "right",
        width: 120,
        render: (_, record) => (
          <Space size="middle">
            <Tooltip title="ลบ">
                <Button icon={<DeleteOutlined />} danger />
              </Tooltip>
            <Tooltip title="แก้ไข">
              <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
            </Tooltip>
            <Popconfirm
              title="คุณต้องการลบรายการนี้ใช่ไหม?"
              onConfirm={() => handleDelete(record.id)}
              okText="ใช่"
              cancelText="ไม่"
            >
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [rows, query.category]
  );

  const onTableChange: TableProps<SupplyDisplay>["onChange"] = (pagination, filters, sorter) => {
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

  // ---------- Drawer รายงานเบิก/จ่าย ----------
  const [reportOpen, setReportOpen] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportRows, setReportRows] = useState<DispenseItem[]>([]);
  const [reportTotal, setReportTotal] = useState(0);
  const [reportQuery, setReportQuery] = useState<{
    q: string;
    date_from?: string;
    date_to?: string;
    page: number;
    page_size: number;
    sort_by: string;
    order: "asc" | "desc";
  }>({
    q: "",
    page: 1,
    page_size: 10,
    sort_by: "recorded_at",
    order: "desc",
  });

  const loadReport = async () => {
    setReportLoading(true);
    try {
      const data = await fetchDispenses(reportQuery);
      setReportRows(data.data);
      setReportTotal(data.total);
    } catch (e: any) {
      msg.error(e.message || "โหลดรายงานไม่สำเร็จ");
    } finally {
      setReportLoading(false);
    }
  };

  useEffect(() => {
    if (reportOpen) loadReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportOpen, reportQuery.page, reportQuery.page_size, reportQuery.sort_by, reportQuery.order]);

  useEffect(() => {
    const h = () => {
      if (reportOpen) loadReport();
    };
    window.addEventListener("suppliesUpdated", h);
    return () => window.removeEventListener("suppliesUpdated", h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportOpen]);

  const reportColumns: ColumnsType<DispenseItem> = [
    {
      title: "วันที่",
      dataIndex: "recorded_at",
      key: "recorded_at",
      sorter: true,
      render: (d: string) => dayjs(d).format("YYYY-MM-DD HH:mm"),
      width: 170,
    },
    { title: "รหัส", dataIndex: "supply_code", key: "supply_code", sorter: true, width: 120 },
    { title: "ชื่อเวชภัณฑ์", dataIndex: "supply_name", key: "supply_name", sorter: true, width: 260 },
    { title: "หมวดหมู่", dataIndex: "category", key: "category", width: 160 },
    { title: "จำนวน", dataIndex: "quantity", key: "quantity", sorter: true, align: "right", width: 120 },
    { title: "รหัสเคส", dataIndex: "case_code", key: "case_code", sorter: true, width: 140 },
    { title: "ผู้เบิก", dataIndex: "dispenser", key: "dispenser", sorter: true, width: 160 },
  ];

  const onReportTableChange: TableProps<DispenseItem>["onChange"] = (pagination, _filters, sorter) => {
    const s = Array.isArray(sorter) ? sorter[0] : sorter;
    const sortMap: Record<string, string> = {
      recorded_at: "recorded_at",
      supply_code: "supply_code",
      supply_name: "supply_name",
      quantity: "quantity",
      case_code: "case_code",
      dispenser: "dispenser",
    };
    setReportQuery((q) => ({
      ...q,
      page: pagination.current ?? 1,
      page_size: pagination.pageSize ?? q.page_size,
      sort_by: s?.field ? sortMap[String(s.field)] ?? q.sort_by : q.sort_by,
      order: s?.order ? (s.order === "ascend" ? "asc" : "desc") : q.order,
    }));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        padding: 16,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {ctx}

      {/* แถวฟิลเตอร์ + ปุ่มรายงาน */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          alignItems: "center",
          marginTop: 8,
          marginBottom: 8,
          width: "100%",
        }}
      >
        <Space size="middle" wrap>
          <Search
            placeholder="ค้นหาเวชภัณฑ์ (ชื่อ/รหัส)"
            allowClear
            value={query.q}
            onChange={(e) => setQuery((q) => ({ ...q, q: e.target.value }))}
            onSearch={() => setQuery((q) => ({ ...q, page: 1 }))}
            style={{ width: 260 }}
            prefix={<SearchOutlined />}
          />

          <Select
            style={{ width: 200 }}
            value={query.category}
            onChange={(v) => setQuery((q) => ({ ...q, category: v, page: 1 }))}
            options={[
              { label: "หมวดหมู่ทั้งหมด", value: "all" },
              ...Array.from(new Set([ ...rows.map((r) => r.category).filter(Boolean), ...CATEGORY_OPTIONS ])).map(c => ({ label: c, value: c }))
            ]}
          />

          <DatePicker
            placeholder="วันที่นำเข้า"
            value={query.importDate}
            onChange={(d) => setQuery((q) => ({ ...q, importDate: d, page: 1 }))}
            style={{ width: 160 }}
            allowClear
          />
          <DatePicker
            placeholder="วันหมดอายุ"
            value={query.expiryDate}
            onChange={(d) => setQuery((q) => ({ ...q, expiryDate: d, page: 1 }))}
            style={{ width: 160 }}
            allowClear
          />

          <Button icon={<ReloadOutlined />} onClick={handleResetFilters}>
            รีเซ็ต
          </Button>
        </Space>

        <Space style={{ marginLeft: "auto" }}>
          <Button type="primary" onClick={() => setReportOpen(true)}>
            ดูรายงานการเบิก/จ่าย
          </Button>
        </Space>
      </div>

      {/* ตารางหลัก */}
      <div style={{ flex: "1 1 auto", minHeight: 0 }}>
        <Table
          rowKey="id"
          loading={loading}
          dataSource={rows}
          columns={columns}
          bordered
          scroll={{ x: 1200, y: 300 }}
          style={{ width: "100%" }}
          pagination={{
            current: query.page,
            pageSize: query.pageSize,
            total,
            showSizeChanger: true,
          }}
          onChange={onTableChange}
        />
      </div>

      {/* Drawer: แก้ไขเวชภัณฑ์ */}
      <Drawer
        title={editing ? `แก้ไขเวชภัณฑ์: ${editing.name}` : "แก้ไขเวชภัณฑ์"}
        width={520}
        open={editOpen}
        onClose={() => { setEditOpen(false); setEditing(null); }}
        destroyOnClose
        extra={
          <Space>
            <Button onClick={() => { form.resetFields(); if (editing) handleEdit(editing); }}>
              รีเซ็ตแบบฟอร์ม
            </Button>
            <Button type="primary" loading={editLoading} onClick={submitEdit}>
              บันทึก
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="รหัส" name="code" rules={[{ required: true, message: "กรุณากรอกรหัส" }]}>
            <Input placeholder="เช่น MED-001" />
          </Form.Item>
          <Form.Item label="ชื่อเวชภัณฑ์" name="name" rules={[{ required: true, message: "กรุณากรอกชื่อเวชภัณฑ์" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="หมวดหมู่" name="category" rules={[{ required: true, message: "กรุณาเลือกหมวดหมู่" }]}>
            <Select
              options={[
                ...Array.from(new Set([ ...rows.map((r) => r.category).filter(Boolean), ...CATEGORY_OPTIONS ])).map(c => ({ label: c, value: c }))
              ]}
              placeholder="เลือกหมวดหมู่"
            />
          </Form.Item>
          <Form.Item label="จำนวน" name="quantity" rules={[{ required: true, message: "กรุณากรอกจำนวน" }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="หน่วย" name="unit" rules={[{ required: true, message: "กรุณากรอกหน่วย" }]}>
            <Input placeholder="เช่น กล่อง, ขวด, ชิ้น" />
          </Form.Item>
          <Form.Item label="วันที่นำเข้า" name="importDate">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="วันหมดอายุ" name="expiryDate">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Drawer>

      {/* Drawer รายงานเบิก/จ่าย */}
      <Drawer
        title="รายงานการเบิก/จ่ายเวชภัณฑ์"
        width={960}
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        destroyOnClose
      >
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            placeholder="ค้นหา (รหัส/ชื่อเวชภัณฑ์/รหัสเคส/ผู้เบิก)"
            style={{ width: 280 }}
            allowClear
            value={reportQuery.q}
            onChange={(e) =>
              setReportQuery((q) => ({ ...q, q: e.target.value, page: 1 }))
            }
            onPressEnter={() => loadReport()}
          />
          <RangePicker
            onChange={(vals) =>
              setReportQuery((q) => ({
                ...q,
                date_from: vals?.[0] ? vals[0].format("YYYY-MM-DD") : undefined,
                date_to: vals?.[1] ? vals[1].format("YYYY-MM-DD") : undefined,
                page: 1,
              }))
            }
          />
          <Button onClick={() => loadReport()}>ค้นหา</Button>
          <Button
            onClick={() =>
              setReportQuery({
                q: "",
                page: 1,
                page_size: 10,
                sort_by: "recorded_at",
                order: "desc",
              })
            }
          >
            รีเซ็ต
          </Button>
        </Space>

        <Table
          rowKey="id"
          loading={reportLoading}
          dataSource={reportRows}
          columns={reportColumns}
          bordered
          scroll={{ x: 900, y: 480 }}
          pagination={{
            current: reportQuery.page,
            pageSize: reportQuery.page_size,
            total: reportTotal,
            showSizeChanger: true,
          }}
          onChange={onReportTableChange}
        />
      </Drawer>
    </div>
  );
};

export default AllSuppliesPage;
