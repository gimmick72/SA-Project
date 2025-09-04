import React, { useMemo, useState } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Typography,
  Tooltip,
  Modal,
  Form,
  message,
} from "antd";
import {
  EditOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  SearchOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

type MemberRow = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  password: string; // mock
};

// --- mock data 10 รายการ ---
const MOCK_MEMBERS: MemberRow[] = [
  { id: 1, firstName: "Napat",    lastName: "Wongchai",   email: "napat.w@example.com",    phone: "081-234-5678", username: "napatw",  password: "Pa$$w0rd1" },
  { id: 2, firstName: "Benjawan", lastName: "Suksan",     email: "benja.s@example.com",    phone: "089-765-4321", username: "benja",    password: "Secret#22" },
  { id: 3, firstName: "Kittisak", lastName: "Boonyuen",   email: "kitti.b@example.com",    phone: "082-111-2222", username: "kitti",    password: "1234abcd" },
  { id: 4, firstName: "Thanaporn",lastName: "Meechai",    email: "thana.m@example.com",    phone: "086-000-9900", username: "thanap",   password: "Me3chai!!" },
  { id: 5, firstName: "Sudarat",  lastName: "Prasert",    email: "sudarat.p@example.com",  phone: "080-555-6666", username: "sudap",    password: "Pra$ert55" },
  { id: 6, firstName: "Anucha",   lastName: "Kraiwut",    email: "anucha.k@example.com",   phone: "083-444-5555", username: "anucha",   password: "AnuCha_66" },
  { id: 7, firstName: "Warisa",   lastName: "Chanida",    email: "warisa.c@example.com",   phone: "087-333-2222", username: "warisac",  password: "w@riSa77" },
  { id: 8, firstName: "Prayuth",  lastName: "Thongdee",   email: "prayuth.t@example.com",  phone: "085-999-0000", username: "pyt",      password: "Th0ngd33" },
  { id: 9, firstName: "Peerawat", lastName: "Kongsiri",   email: "peerawat.k@example.com", phone: "084-777-8888", username: "peera",    password: "K0ngS!ri" },
  { id:10, firstName: "Kannika",  lastName: "Limsakul",   email: "kannika.l@example.com",  phone: "089-111-9999", username: "kannika",  password: "Lim$akul" },
];

const mask = (s: string) => "•".repeat(Math.max(6, Math.min(12, s.length)));

const Member: React.FC = () => {
  // ข้อมูล + ฟิลเตอร์
  const [list, setList] = useState<MemberRow[]>(MOCK_MEMBERS);
  const [query, setQuery] = useState("");
  const [showPwIds, setShowPwIds] = useState<Set<number>>(new Set());

  // Modal เพิ่มสมาชิก
  const [openAdd, setOpenAdd] = useState(false);
  const [form] = Form.useForm();

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((m) => {
      const blob = `${m.firstName} ${m.lastName} ${m.email} ${m.phone} ${m.username} ${m.password}`.toLowerCase();
      return blob.includes(q);
    });
  }, [query, list]);

  const toggleShow = (id: number) => {
    setShowPwIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleAdd = (values: any) => {
    const nextId = list.length ? Math.max(...list.map((e) => e.id)) + 1 : 1;
    const newMember: MemberRow = {
      id: nextId,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      username: values.username,
      password: values.password,
    };
    setList((prev) => [newMember, ...prev]);
    message.success("เพิ่มสมาชิกเรียบร้อย");
    setOpenAdd(false);
    form.resetFields();
  };

  const columns = [
    { title: "ชื่อ", dataIndex: "firstName", sorter: (a: MemberRow, b: MemberRow) => a.firstName.localeCompare(b.firstName) },
    { title: "นามสกุล", dataIndex: "lastName", sorter: (a: MemberRow, b: MemberRow) => a.lastName.localeCompare(b.lastName) },
    { title: "อีเมล", dataIndex: "email", responsive: ["md"] as const },
    { title: "เบอร์โทร", dataIndex: "phone", width: 140 },
    { title: "ชื่อผู้ใช้", dataIndex: "username", width: 140, sorter: (a: MemberRow, b: MemberRow) => a.username.localeCompare(b.username) },
    {
      title: "รหัสผ่าน",
      key: "password",
      width: 200,
      render: (_: unknown, row: MemberRow) => {
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
      title: "การจัดการ",
      key: "actions",
      fixed: "right" as const,
      width: 110,
      render: (_: unknown, row: MemberRow) => (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => console.log("edit member:", row)} // ไว้ต่อ Modal/Form จริงภายหลัง
        >
          แก้ไข
        </Button>
      ),
    },
  ];

  return (
    <div className="container" style={{ padding: 16 }}>
      {/* แถวหัวข้อ + ปุ่มเพิ่มสมาชิก */}
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
        <Title level={3} style={{ margin: 0 }}>รายชื่อสมาชิก</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpenAdd(true)}>
          เพิ่มสมาชิก
        </Button>
      </div>

      {/* ตัวกรอง (ค้นหาทุกคอลัมน์) */}
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
          placeholder="ค้นหาชื่อ, นามสกุล, อีเมล, เบอร์, ชื่อผู้ใช้..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: 360, maxWidth: "100%" }}
        />
      </div>

      {/* ตาราง */}
      <Table<MemberRow>
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 8, showSizeChanger: false }}
        scroll={{ x: 950 }}
        bordered
        size="middle"
      />

      {/* Modal เพิ่มสมาชิก */}
      <Modal
        open={openAdd}
        title="เพิ่มสมาชิก"
        onCancel={() => setOpenAdd(false)}
        onOk={() => form.submit()}
        okText="บันทึก"
        cancelText="ยกเลิก"
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleAdd} preserve={false}>
          <Form.Item label="ชื่อ" name="firstName" rules={[{ required: true, message: "กรอกชื่อ" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="นามสกุล" name="lastName" rules={[{ required: true, message: "กรอกนามสกุล" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="อีเมล" name="email" rules={[{ required: true, type: "email", message: "อีเมลไม่ถูกต้อง" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="เบอร์โทร" name="phone" rules={[{ required: true, message: "กรอกเบอร์โทร" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="ชื่อผู้ใช้" name="username" rules={[{ required: true, message: "กรอกชื่อผู้ใช้" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="รหัสผ่าน" name="password" rules={[{ required: true, message: "กรอกรหัสผ่าน" }]}>
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Member;
