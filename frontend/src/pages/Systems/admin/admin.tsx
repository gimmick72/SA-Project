import React, { useMemo, useState } from "react";
import {
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
} from "antd";
import {
  EditOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

type Role = "ทันตแพทย์" | "ผู้ช่วยทันตะ" | "ทันตภิบาล" | "เวชระเบียน" | "คนจ่ายยา";

type Employee = {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  role: Role;
};

// --- mock data 10 คน ---
const MOCK_EMPLOYEES: Employee[] = [
  { id: 1,  firstName: "Anan",    lastName: "Prakob",   username: "anan.p",   password: "Dent@1001", role: "ทันตแพทย์" },
  { id: 2,  firstName: "Bussara", lastName: "Krittaya", username: "bussara",  password: "Assist#22", role: "ผู้ช่วยทันตะ" },
  { id: 3,  firstName: "Chatchai",lastName: "Lertpras", username: "chatchai", password: "Rec0rd123", role: "เวชระเบียน" },
  { id: 4,  firstName: "Duangjai",lastName: "Siri",     username: "duang",    password: "Pharm_44",  role: "คนจ่ายยา" },
  { id: 5,  firstName: "Ekkarat", lastName: "Maneerat", username: "ekkarat",  password: "DenT5599",  role: "ทันตแพทย์" },
  { id: 6,  firstName: "Fah",     lastName: "Thongkum", username: "fah.t",    password: "Hygi@n66",  role: "ทันตภิบาล" },
  { id: 7,  firstName: "Ganya",   lastName: "Suksawat", username: "ganya",    password: "Assist_77", role: "ผู้ช่วยทันตะ" },
  { id: 8,  firstName: "Hiran",   lastName: "Boonsom",  username: "hiran.b",  password: "Rec0rd88",  role: "เวชระเบียน" },
  { id: 9,  firstName: "Intira",  lastName: "Meedech",  username: "intira",   password: "Ph@rm99",   role: "คนจ่ายยา" },
  { id: 10, firstName: "Jirawat", lastName: "Saelim",   username: "jirawat",  password: "DenTx101",  role: "ทันตแพทย์" },
];

const mask = (s: string) => "•".repeat(Math.max(6, Math.min(12, s.length)));

const roleTagColor = (role: Role) => {
  switch (role) {
    case "ทันตแพทย์": return "geekblue";
    case "ผู้ช่วยทันตะ": return "green";
    case "ทันตภิบาล": return "purple";
    case "เวชระเบียน": return "gold";
    case "คนจ่ายยา": return "volcano";
    default: return "default";
  }
};

const Admin: React.FC = () => {
  // ข้อมูล + ฟิลเตอร์
  const [list, setList] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [q, setQ] = useState<string>("");
  const [role, setRole] = useState<string>("all");
  const [showPwIds, setShowPwIds] = useState<Set<number>>(new Set());

  // Modal เพิ่มพนักงาน
  const [openAdd, setOpenAdd] = useState(false);
  const [form] = Form.useForm();

  const data = useMemo(() => {
    const text = q.trim().toLowerCase();
    return list.filter((e) => {
      const matchesText =
        !text ||
        `${e.firstName} ${e.lastName} ${e.username} ${e.password} ${e.role}`
          .toLowerCase()
          .includes(text);
      const matchesRole = role === "all" || e.role === role;
      return matchesText && matchesRole;
    });
  }, [q, role, list]);

  const toggleShow = (id: number) => {
    setShowPwIds((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const handleAdd = async (values: any) => {
    const nextId = list.length ? Math.max(...list.map((e) => e.id)) + 1 : 1;
    const newEmp: Employee = {
      id: nextId,
      firstName: values.firstName,
      lastName: values.lastName,
      username: values.username,
      password: values.password,
      role: values.role as Role,
    };
    setList((prev) => [newEmp, ...prev]);
    message.success("เพิ่มพนักงานเรียบร้อย");
    setOpenAdd(false);
    form.resetFields();
  };

  const columns = [
    { title: "ชื่อ", dataIndex: "firstName", sorter: (a: Employee, b: Employee) => a.firstName.localeCompare(b.firstName) },
    { title: "นามสกุล", dataIndex: "lastName", sorter: (a: Employee, b: Employee) => a.lastName.localeCompare(b.lastName) },
    { title: "ชื่อผู้ใช้", dataIndex: "username", width: 160, sorter: (a: Employee, b: Employee) => a.username.localeCompare(b.username) },
    {
      title: "รหัสผ่าน",
      key: "password",
      width: 200,
      render: (_: unknown, row: Employee) => {
        const show = showPwIds.has(row.id);
        return (
          <Space>
            <Text code>{show ? row.password : mask(row.password)}</Text>
            <Tooltip title={show ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}>
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
        { text: "คนจ่ายยา", value: "คนจ่ายยา" },
      ],
      onFilter: (value: string, rec: Employee) => rec.role === value,
      render: (v: Role) => <Tag color={roleTagColor(v)}>{v}</Tag>,
    },
    {
      title: "การจัดการ",
      key: "actions",
      fixed: "right" as const,
      width: 110,
      render: (_: unknown, row: Employee) => (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => console.log("edit employee:", row)}
        >
          แก้ไข
        </Button>
      ),
    },
  ];

  return (
    <div className="container" style={{ padding: 16 }}>
      {/* แถวหัวข้อ + ปุ่มเพิ่มพนักงาน */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12, // เว้นระยะกับตัวกรอง
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          รายชื่อพนักงาน
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setOpenAdd(true)}
        >
          เพิ่มพนักงาน
        </Button>
      </div>

      {/* ตัวกรอง */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 16, // เว้นระยะกับตาราง
          flexWrap: "wrap",
        }}
      >
        <Input
          allowClear
          prefix={<SearchOutlined />}
          placeholder="ค้นหาชื่อ, นามสกุล, ชื่อผู้ใช้, รหัสผ่าน, ตำแหน่ง..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ width: 320 }}
        />
        <Select
          value={role}
          onChange={(v) => setRole(v)}
          style={{ width: 200 }}
          suffixIcon={<FilterOutlined />}
        >
          <Option value="all">ตำแหน่งทั้งหมด</Option>
          <Option value="ทันตแพทย์">ทันตแพทย์</Option>
          <Option value="ผู้ช่วยทันตะ">ผู้ช่วยทันตะ</Option>
          <Option value="ทันตภิบาล">ทันตภิบาล</Option>
          <Option value="เวชระเบียน">เวชระเบียน</Option>
          <Option value="คนจ่ายยา">คนจ่ายยา</Option>
        </Select>
      </div>

      {/* ตาราง */}
      <Table<Employee>
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 8, showSizeChanger: false }}
        scroll={{ x: 900 }}
        bordered
        size="middle"
      />

      {/* Modal เพิ่มพนักงาน */}
      <Modal
        open={openAdd}
        title="เพิ่มพนักงาน"
        onCancel={() => setOpenAdd(false)}
        onOk={() => form.submit()}
        okText="บันทึก"
        cancelText="ยกเลิก"
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAdd}
          preserve={false}
        >
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
          <Form.Item
            label="รหัสผ่าน"
            name="password"
            rules={[{ required: true, message: "กรอกรหัสผ่าน" }]}
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
              <Option value="คนจ่ายยา">คนจ่ายยา</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Admin;
