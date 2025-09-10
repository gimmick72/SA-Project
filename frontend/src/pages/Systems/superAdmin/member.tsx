import React, { useEffect, useState } from "react";
import { Card, Table, Input, Button, Space, Modal, Form, message, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Member } from "../../../interface/member";
import { fetchMembers, createMember, updateMember, deleteMember } from "../../../services/SuperAdmin/member";

const MemberPage: React.FC = () => {
  const [rows, setRows] = useState<Member[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [page, setPage] = useState({ current: 1, pageSize: 10 });

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [form] = Form.useForm();

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchMembers({
        q, page: page.current, page_size: page.pageSize, sort_by: "created_at", order: "desc",
      });
      setRows(res.items);
      setTotal(res.total);
    } catch (e: any) {
      message.error(e?.message || "โหลดข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, [q, page.current, page.pageSize]);

  const onOpenCreate = () => { setEditing(null); form.resetFields(); setOpen(true); };
  const onOpenEdit = (m: Member) => {
    setEditing(m); setOpen(true);
    form.setFieldsValue({
      first_name: m.first_name, last_name: m.last_name, email: m.email,
      phone: m.phone, username: m.username, password: "",
    });
  };

  const onSubmit = async () => {
    try {
      const v = await form.validateFields();
      if (editing) {
        const payload = { ...v };
        if (!payload.password) delete (payload as any).password;
        await updateMember(editing.id, payload);
        message.success("แก้ไขสำเร็จ");
      } else {
        await createMember(v);
        message.success("เพิ่มสมาชิกสำเร็จ");
        setPage((p) => ({ ...p, current: 1 }));
      }
      setOpen(false); load();
    } catch (e: any) {
      if (e?.errorFields) return;
      message.error(e?.message || "บันทึกไม่สำเร็จ");
    }
  };

  const onDelete = async (id: number) => {
    try { await deleteMember(id); message.success("ลบสำเร็จ"); load(); }
    catch (e: any) { message.error(e?.message || "ลบไม่สำเร็จ"); }
  };

  const columns: ColumnsType<Member> = [
    { title: "ชื่อ-นามสกุล", render: (_, r) => `${r.first_name} ${r.last_name}` },
    { title: "อีเมล", dataIndex: "email" },
    { title: "เบอร์โทร", dataIndex: "phone" },
    { title: "ชื่อผู้ใช้", dataIndex: "username" },
    { title: "รหัสผ่าน", render: () => "••••••••" },
    {
      title: "การจัดการ",
      width: 200,
      fixed: "right",
      render: (_, r) => (
        <Space>
          <Button size="small" onClick={() => onOpenEdit(r)}>แก้ไข</Button>
          <Popconfirm title="ยืนยันการลบ?" onConfirm={() => onDelete(r.id)}>
            <Button size="small" danger>ลบ</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="container" style={{ padding: 16 }}>
      <Card
        title="สมาชิก"
        extra={
          <Space>
            <Input.Search
              placeholder="ค้นหา: ชื่อ/อีเมล/เบอร์/ชื่อผู้ใช้"
              allowClear
              onSearch={(v) => { setPage((p) => ({ ...p, current: 1 })); setQ(v); }}
              onChange={(e) => { setPage((p) => ({ ...p, current: 1 })); setQ(e.target.value); }}
              style={{ width: 260 }}
            />
            <Button type="primary" onClick={onOpenCreate}>เพิ่มสมาชิก</Button>
          </Space>
        }
        bodyStyle={{ padding: 0 }}
        style={{ borderRadius: 12 }}
      >
        <Table<Member>
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
        />
      </Card>

      <Modal
        title={editing ? "แก้ไขสมาชิก" : "เพิ่มสมาชิก"}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={onSubmit}
        okText="บันทึก"
        cancelText="ยกเลิก"
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="first_name" label="ชื่อ" rules={[{ required: true, message: "กรอกชื่อ" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="last_name" label="นามสกุล" rules={[{ required: true, message: "กรอกนามสกุล" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="อีเมล" rules={[{ type: "email", required: true, message: "อีเมลไม่ถูกต้อง" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="เบอร์โทร" rules={[{ required: true, message: "กรอกเบอร์โทร" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="username" label="ชื่อผู้ใช้" rules={[{ required: true, message: "กรอกชื่อผู้ใช้" }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label={editing ? "รหัสผ่าน (เว้นว่าง = ไม่เปลี่ยน)" : "รหัสผ่าน"}
            rules={editing ? [] : [{ required: true, message: "กรอกรหัสผ่าน" }]}
          >
            <Input.Password placeholder={editing ? "ปล่อยว่างเพื่อใช้รหัสเดิม" : ""} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MemberPage;
