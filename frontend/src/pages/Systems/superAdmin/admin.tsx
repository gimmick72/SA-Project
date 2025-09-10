import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Table,
  Input,
  Select,
  Button,
  Space,
  Typography,
  Tooltip,
  Tag,
  Modal,
  Form,
  message,
  Popconfirm,
} from "antd";
import {
  EditOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import type { ColumnsType } from "antd/es/table";
import {
  fetchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../../services/SuperAdmin/employee";

const { Title, Text } = Typography;
const { Option } = Select;

type Role = "ทันตแพทย์" | "ผู้ช่วยทันตะ" | "ทันตภิบาล" | "เวชระเบียน" | "คนจ่ายยา";

type Employee = {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  role: Role;
  // หมายเหตุ: backend ไม่ส่ง password กลับมา (เพื่อความปลอดภัย)
};

const mask = (len = 8) => "•".repeat(len);

const roleTagColor = (role: Role) => {
  switch (role) {
    case "ทันตแพทย์":
      return "geekblue";
    case "ผู้ช่วยทันตะ":
      return "green";
    case "ทันตภิบาล":
      return "purple";
    case "เวชระเบียน":
      return "gold";
    case "คนจ่ายยา":
      return "volcano";
    default:
      return "default";
  }
};

const AdminPage: React.FC = () => {
  // ตาราง + คิวรี
  const [rows, setRows] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [role, setRole] = useState<string>("all");
  const [page, setPage] = useState({ current: 1, pageSize: 10 });

  // toggle ดู/ซ่อน "รหัสผ่าน" (จริง ๆ จะบอกข้อมูลไม่ได้)
  const [showPwIds, setShowPwIds] = useState<Set<number>>(new Set());
  const toggleShow = (id: number) =>
    setShowPwIds((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  // Modal เพิ่ม/แก้ไข
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [form] = Form.useForm();

  // โหลดข้อมูล
  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchEmployees({
        q,
        role,
        page: page.current,
        page_size: page.pageSize,
      });
      setRows(res.items as Employee[]);
      setTotal(res.total);
    } catch (e: any) {
      message.error(e?.message || "โหลดข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, role, page.current, page.pageSize]);

  // เปิดโมดัล
  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setOpen(true);
  };
  const openEdit = (row: Employee) => {
    setEditing(row);
    setOpen(true);
    form.setFieldsValue({
      firstName: row.firstName,
      lastName: row.lastName,
      username: row.username,
      role: row.role,
      password: "", // เว้นว่าง = ไม่เปลี่ยน
    });
  };

  // submit
  const onSubmit = async () => {
    try {
      const v = await form.validateFields();
      if (editing) {
        const payload: any = {
          firstName: v.firstName,
          lastName: v.lastName,
          username: v.username,
          role: v.role,
        };
        if (v.password) payload.password = v.password; // ส่งเมื่อมีการเปลี่ยนจริง
        await updateEmployee(editing.id, payload);
        message.success("แก้ไขข้อมูลสำเร็จ");
      } else {
        await createEmployee({
          firstName: v.firstName,
          lastName: v.lastName,
          username: v.username,
          password: v.password,
          role: v.role,
        });
        message.success("เพิ่มพนักงานสำเร็จ");
        setPage((p) => ({ ...p, current: 1 }));
      }
      setOpen(false);
      load();
    } catch (e: any) {
      if (e?.errorFields) return; // validation error ในฟอร์ม
      message.error(e?.message || "บันทึกไม่สำเร็จ");
    }
  };

  const onDelete = async (id: number) => {
    try {
      await deleteEmployee(id);
      message.success("ลบพนักงานสำเร็จ");
      load();
    } catch (e: any) {
      message.error(e?.message || "ลบไม่สำเร็จ");
    }
  };

  const columns: ColumnsType<Employee> = useMemo(
    () => [
      {
        title: "ชื่อ",
        dataIndex: "firstName",
        sorter: (a, b) => a.firstName.localeCompare(b.firstName),
      },
      {
        title: "นามสกุล",
        dataIndex: "lastName",
        sorter: (a, b) => a.lastName.localeCompare(b.lastName),
      },
      {
        title: "ชื่อผู้ใช้",
        dataIndex: "username",
        width: 160,
        sorter: (a, b) => a.username.localeCompare(b.username),
      },
      {
        title: "รหัสผ่าน",
        key: "password",
        width: 220,
        render: (_: unknown, row) => {
          const show = showPwIds.has(row.id);
          const display = show ? "ไม่สามารถแสดงรหัสเดิมได้" : mask();
          return (
            <Space>
              <Text code>{display}</Text>
              <Tooltip
                title={show ? "ซ่อนข้อมูล" : "แสดงข้อมูล (ไม่แสดงรหัสจริงเพื่อความปลอดภัย)"}
              >
                <Button
                  size="small"
                  type="text"
                  icon={show ? <EyeInvisibleOutlined /> : <EyeTwoTone twoToneColor="#1677ff" />}
                  onClick={() => toggleShow(row.id)}
                />
              </Tooltip>
            </Space>
          );
        },
      },
      {
        title: "ตำแหน่ง",
        dataIndex: "role",
        width: 160,
        filters: [
          { text: "ทันตแพทย์", value: "ทันตแพทย์" },
          { text: "ผู้ช่วยทันตะ", value: "ผู้ช่วยทันตะ" },
          { text: "ทันตภิบาล", value: "ทันตภิบาล" },
          { text: "เวชระเบียน", value: "เวชระเบียน" },
          { text: "เจ้าหน้าที่จ่ายยา", value: "เจ้าหน้าที่จ่ายยา" },
        ],
        onFilter: (value: any, rec) => rec.role === value,
        render: (v: Role) => <Tag color={roleTagColor(v)}>{v}</Tag>,
      },
      {
        title: "การจัดการ",
        key: "actions",
        fixed: "right",
        width: 160,
        render: (_: unknown, row) => (
          <Space>
            <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(row)}>
              แก้ไข
            </Button>
            <Popconfirm title="ยืนยันการลบพนักงานนี้?" onConfirm={() => onDelete(row.id)}>
              <Button size="small" danger>
                ลบ
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showPwIds]
  );

  return (
    <div className="container" style={{ padding: 16 }}>
      <Card
        title={
          <Space align="center">
            <Title level={4} style={{ margin: 0 }}>
              รายชื่อพนักงาน
            </Title>
          </Space>
        }
        extra={
          <Space wrap>
            <Input
              allowClear
              prefix={<SearchOutlined />}
              placeholder="ค้นหา: ชื่อ/นามสกุล/ชื่อผู้ใช้/ตำแหน่ง"
              value={q}
              onChange={(e) => {
                setPage((p) => ({ ...p, current: 1 }));
                setQ(e.target.value);
              }}
              style={{ width: 300 }}
            />
            <Select
              value={role}
              onChange={(v) => {
                setPage((p) => ({ ...p, current: 1 }));
                setRole(v);
              }}
              style={{ width: 200 }}
              suffixIcon={<FilterOutlined />}
            >
              <Option value="all">ตำแหน่งทั้งหมด</Option>
              <Option value="ทันตแพทย์">ทันตแพทย์</Option>
              <Option value="ผู้ช่วยทันตะ">ผู้ช่วยทันตะ</Option>
              <Option value="ทันตภิบาล">ทันตภิบาล</Option>
              <Option value="เวชระเบียน">เวชระเบียน</Option>
              <Option value="เจ้าหน้าที่จ่ายยา">เจ้าหน้าที่จ่ายยา</Option>
            </Select>
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
              เพิ่มพนักงาน
            </Button>
          </Space>
        }
        bodyStyle={{ padding: 0 }}
        style={{ borderRadius: 12 }}
      >
        <Table<Employee>
          rowKey="id"
          columns={columns}
          dataSource={rows}
          loading={loading}
          pagination={{
            current: page.current,
            pageSize: page.pageSize,
            total,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 20, 50],
            onChange: (current, pageSize) => setPage({ current, pageSize }),
            position: ["bottomRight"],
          }}
          scroll={{ x: 900 }}
          bordered
          size="middle"
        />
      </Card>

      {/* Modal เพิ่ม/แก้ไข */}
      <Modal
        open={open}
        title={editing ? "แก้ไขพนักงาน" : "เพิ่มพนักงาน"}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        okText="บันทึก"
        cancelText="ยกเลิก"
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onSubmit} preserve={false}>
          <Form.Item
            label="ชื่อ"
            name="firstName"
            rules={[{ required: true, message: "กรอกชื่อ" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="นามสกุล"
            name="lastName"
            rules={[{ required: true, message: "กรอกนามสกุล" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="ชื่อผู้ใช้"
            name="username"
            rules={[{ required: true, message: "กรอกชื่อผู้ใช้" }]}
          >
            <Input />
          </Form.Item>

          {/* หมายเหตุ: เวลาตั้งค่าแก้ไข ถ้าปล่อยว่าง = ไม่เปลี่ยนรหัสผ่าน */}
          <Form.Item
            label={editing ? "รหัสผ่าน (เว้นว่าง = ไม่เปลี่ยน)" : "รหัสผ่าน"}
            name="password"
            rules={editing ? [] : [{ required: true, message: "กรอกรหัสผ่าน" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="ตำแหน่ง"
            name="role"
            rules={[{ required: true, message: "เลือกตำแหน่ง" }]}
          >
            <Select placeholder="เลือกตำแหน่ง">
              <Option value="ทันตแพทย์">ทันตแพทย์</Option>
              <Option value="ผู้ช่วยทันตะ">ผู้ช่วยทันตะ</Option>
              <Option value="ทันตภิบาล">ทันตภิบาล</Option>
              <Option value="เวชระเบียน">เวชระเบียน</Option>
              <Option value="เจ้าหน้าที่จ่ายยา">เจ้าหน้าที่จ่ายยา</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPage;
