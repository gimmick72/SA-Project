import React, { useMemo, useState } from "react";
import {
  Tabs,
  Card,
  Row,
  Col,
  Table,
  Typography,
  Input,
  Tag,
  Space,
  Button,
  Form,
  Select,
  DatePicker,
  TimePicker,
  message,
  Empty,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";

const { Paragraph, Text, Title } = Typography;

type Person = {
  id: number;
  firstName: string;
  lastName: string;
  type: "จอง" | "วอล์คอิน";
  date: string; // YYYY-MM-DD
  timeStart: string; // HH:mm
  timeEnd: string;   // HH:mm
  service: string;
  doctor: string;
  room: string;
  status: "รอเช็คอิน" | "เช็คอินแล้ว" | "รอตรวจ" | "กำลังตรวจ" | "เสร็จสิ้น" | "ยกเลิก";
};

// ---------- MOCK DATA ----------
const MOCK_APPOINTMENTS: Person[] = [
  { id: 1,  firstName: "สมชาย",   lastName: "ใจดี",   type: "จอง",   date: dayjs().format("YYYY-MM-DD"), timeStart: "08:00", timeEnd: "08:30", service: "ขูดหินปูน", doctor: "นพ.กิตติ",  room: "X001", status: "รอเช็คอิน" },
  { id: 2,  firstName: "กนกวรรณ", lastName: "รื่นรมย์", type: "จอง", date: dayjs().format("YYYY-MM-DD"), timeStart: "08:30", timeEnd: "09:00", service: "อุดฟัน",     doctor: "นพ.กิตติ",  room: "X001", status: "เช็คอินแล้ว" },
  { id: 3,  firstName: "ธนกฤต",   lastName: "ชัยพร",  type: "จอง",   date: dayjs().format("YYYY-MM-DD"), timeStart: "09:00", timeEnd: "09:30", service: "ถอนฟัน",     doctor: "ทพญ.วริศรา", room: "X002", status: "รอตรวจ" },
  { id: 4,  firstName: "วริศรา",   lastName: "มากดี",   type: "จอง",   date: dayjs().format("YYYY-MM-DD"), timeStart: "09:30", timeEnd: "10:00", service: "ขูดหินปูน", doctor: "ทพญ.วริศรา", room: "X003", status: "กำลังตรวจ" },
  { id: 5,  firstName: "พิชญา",    lastName: "สุนทร",   type: "จอง",   date: dayjs().format("YYYY-MM-DD"), timeStart: "10:00", timeEnd: "10:30", service: "อุดฟัน",     doctor: "นพ.กิตติ",  room: "X001", status: "เสร็จสิ้น" },
];

const MOCK_WALKINS: Person[] = [
  { id: 101, firstName: "จิรายุ",    lastName: "ทองแท้",  type: "วอล์คอิน", date: dayjs().format("YYYY-MM-DD"), timeStart: "10:30", timeEnd: "11:00", service: "ขูดหินปูน", doctor: "ทพญ.วริศรา", room: "X003", status: "เช็คอินแล้ว" },
  { id: 102, firstName: "นภัสกร",   lastName: "อิ่มสุข",  type: "วอล์คอิน", date: dayjs().format("YYYY-MM-DD"), timeStart: "11:00", timeEnd: "11:30", service: "ขูดหินปูน", doctor: "นพ.กิตติ",  room: "X001", status: "รอตรวจ" },
  { id: 103, firstName: "กิตติ",     lastName: "โสภา",    type: "วอล์คอิน", date: dayjs().format("YYYY-MM-DD"), timeStart: "13:00", timeEnd: "13:30", service: "อุดฟัน",     doctor: "นพ.กิตติ",  room: "X002", status: "รอเช็คอิน" },
  { id: 104, firstName: "ปาณิสรา",  lastName: "จิตดี",    type: "วอล์คอิน", date: dayjs().format("YYYY-MM-DD"), timeStart: "13:30", timeEnd: "14:00", service: "ถอนฟัน",     doctor: "ทพญ.วริศรา", room: "X003", status: "เสร็จสิ้น" },
];

// ---------- UTILS ----------
const serviceColor = (s: string) => (s === "อุดฟัน" ? "gold" : s === "ถอนฟัน" ? "volcano" : "geekblue");
const typeColor = (t: Person["type"]) => (t === "จอง" ? "processing" : "purple");
const statusColor: Record<Person["status"], any> = {
  "รอเช็คอิน": "default",
  "เช็คอินแล้ว": "processing",
  "รอตรวจ": "geekblue",
  "กำลังตรวจ": "orange",
  "เสร็จสิ้น": "success",
  "ยกเลิก": "error",
};

const HomeInfoPage: React.FC = () => {
  // state หลัก
  const [list, setList] = useState<Person[]>([...MOCK_APPOINTMENTS, ...MOCK_WALKINS]);
  const [q, setQ] = useState("");
  const [activeId, setActiveId] = useState<number | null>(list[0]?.id ?? null);
  const active = useMemo(() => list.find((x) => x.id === activeId) || null, [list, activeId]);

  // ตารางรวม (หน้าแรก)
  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();
    if (!text) return list;
    return list.filter((r) =>
      `${r.firstName} ${r.lastName} ${r.service} ${r.room} ${r.doctor} ${r.type}`
        .toLowerCase()
        .includes(text)
    );
  }, [list, q]);

  const columns: ColumnsType<Person> = [
    {
      title: "No.",
      width: 70,
      align: "center",
      render: (_v, _r, index) => index + 1,
    },
    {
      title: "ชื่อ",
      dataIndex: "firstName",
      render: (_v, r) => (
        <>
          <div>{r.firstName} {r.lastName}</div>
          <div style={{ fontSize: 12, color: "#8c8c8c" }}>
            {r.timeStart}–{r.timeEnd} • ห้อง {r.room}
          </div>
        </>
      ),
    },
    {
      title: "ประเภท",
      dataIndex: "type",
      width: 110,
      render: (t: Person["type"]) => <Tag color={typeColor(t)}>{t}</Tag>,
    },
    {
      title: "บริการ",
      dataIndex: "service",
      width: 120,
      render: (v: string) => <Tag color={serviceColor(v)}>{v}</Tag>,
      responsive: ["md"],
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      width: 120,
      render: (s: Person["status"]) => <Tag color={statusColor[s]}>{s}</Tag>,
    },
  ];

  // เพิ่มรายการใหม่ (วอล์คอิน)
  type WalkinForm = {
    name: string;
    surname: string;
    service: string;
    doctor: string;
    room: string;
    date: Dayjs;
    time: [Dayjs, Dayjs];
  };
  const [form] = Form.useForm<WalkinForm>();

  const addWalkin = (values: WalkinForm) => {
    const newItem: Person = {
      id: Math.max(...list.map((x) => x.id)) + 1,
      firstName: values.name,
      lastName: values.surname,
      type: "วอล์คอิน",
      date: values.date.format("YYYY-MM-DD"),
      timeStart: values.time[0].format("HH:mm"),
      timeEnd: values.time[1].format("HH:mm"),
      service: values.service,
      doctor: values.doctor,
      room: values.room,
      status: "รอเช็คอิน",
    };
    setList((prev) => [newItem, ...prev]);
    setActiveId(newItem.id);
    message.success("เพิ่มวอล์คอินสำเร็จ");
    form.resetFields();
  };

  // หน้าชำระเงิน = เอาเฉพาะเสร็จสิ้น
  const payRows = useMemo(() => list.filter((x) => x.status === "เสร็จสิ้น"), [list]);

  return (
    <div className="container" style={{ padding: 16 }}>
      <Tabs
        defaultActiveKey="list"
        items={[
          {
            key: "list",
            label: "รายการ",
            children: (
              <Card bodyStyle={{ padding: 20 }} style={{ borderRadius: 16 }}>
                <Row gutter={[24, 24]}>
                  {/* ตารางซ้าย */}
                  <Col xs={24} md={10}>
                    <Card
                      size="small"
                      title={
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                          <span>รายการวันนี้ (จอง + วอล์คอิน)</span>
                          <Input.Search
                            placeholder="ค้นหาชื่อ/บริการ/ห้อง/แพทย์"
                            allowClear
                            onChange={(e) => setQ(e.target.value)}
                            style={{ width: 240 }}
                          />
                        </div>
                      }
                      bodyStyle={{ padding: 0 }}
                      style={{ borderRadius: 12 }}
                    >
                      <Table<Person>
                        rowKey="id"
                        columns={columns}
                        dataSource={filtered}
                        pagination={{ pageSize: 8, showSizeChanger: false }}
                        onRow={(rec) => ({ onClick: () => setActiveId(rec.id) })}
                        rowClassName={(rec) => (rec.id === activeId ? "active-row" : "")}
                        size="middle"
                      />
                    </Card>
                  </Col>

                  {/* รายละเอียด + ปุ่มขวา */}
                  <Col xs={24} md={14}>
                    <Card title="รายละเอียด" size="small" style={{ borderRadius: 12, marginBottom: 16 }}>
                      {active ? (
                        <>
                          <Paragraph style={{ marginBottom: 6 }}>
                            <Text strong>คิวที่:</Text>{" "}
                            {filtered.findIndex((x) => x.id === active.id) + 1}
                          </Paragraph>
                          <Paragraph style={{ marginBottom: 6 }}>
                            <Text strong>เวลา:</Text> {active.timeStart} น. ถึง {active.timeEnd} น.
                          </Paragraph>
                          <Paragraph style={{ marginBottom: 6 }}>
                            <Text strong>ชื่อ:</Text> {active.firstName} {active.lastName}
                          </Paragraph>
                          <Paragraph style={{ marginBottom: 6 }}>
                            <Text strong>ประเภท:</Text> <Tag color={typeColor(active.type)}>{active.type}</Tag>
                          </Paragraph>
                          <Paragraph style={{ marginBottom: 6 }}>
                            <Text strong>บริการ:</Text> <Tag color={serviceColor(active.service)}>{active.service}</Tag>
                          </Paragraph>
                          <Paragraph style={{ marginBottom: 0 }}>
                            <Text strong>แพทย์/ห้อง:</Text> {active.doctor} • {active.room}
                          </Paragraph>
                        </>
                      ) : (
                        <Empty description="ยังไม่ได้เลือกผู้ป่วย" />
                      )}
                    </Card>

                    {/* ปุ่มแบบตามภาพ (เวชระเบียน/ประวัติเบื้องต้น/จองห้องและคิว/เพิ่ม/ยกเลิก) */}
                    <div className="btn-grid">
                      <Button className="btn-cell" onClick={() => console.log("เวชระเบียน", active)}>เวชระเบียน</Button>
                      <Button className="btn-cell" onClick={() => console.log("ประวัติเบื้องต้น", active)}>ประวัติเบื้องต้น</Button>
                      <Button className="btn-cell" onClick={() => console.log("จองห้องและคิว", active)}>จองห้องและคิว</Button>
                      <Space style={{ width: "100%" }} size="middle">
                        <Button type="primary" className="btn-flex" onClick={() => console.log("เพิ่ม", active)}>เพิ่ม</Button>
                        <Button danger className="btn-flex" onClick={() => console.log("ยกเลิก", active)}>ยกเลิก</Button>
                      </Space>
                    </div>
                  </Col>
                </Row>

                <style>{`
                  .active-row td { background: #f9f0ff !important; }
                  .btn-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
                  .btn-cell { height: 40px; }
                  .btn-flex { flex: 1; height: 40px; }
                `}</style>
              </Card>
            ),
          },
          {
            key: "add",
            label: "เพิ่มรายการใหม่",
            children: (
              <Card bodyStyle={{ padding: 20 }} style={{ borderRadius: 16 }}>
                <Title level={5} style={{ marginTop: 0 }}>เพิ่มผู้ป่วยวอล์คอิน</Title>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={addWalkin}
                  initialValues={{
                    date: dayjs(),
                    time: [dayjs().hour(10).minute(0), dayjs().hour(10).minute(30)],
                    service: "ขูดหินปูน",
                    doctor: "นพ.กิตติ",
                    room: "X001",
                  }}
                >
                  <Row gutter={16}>
                    <Col xs={24} md={8}>
                      <Form.Item name="name" label="ชื่อ" rules={[{ required: true, message: "กรอกชื่อ" }]}>
                        <Input placeholder="เช่น สมชาย" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item name="surname" label="นามสกุล" rules={[{ required: true, message: "กรอกนามสกุล" }]}>
                        <Input placeholder="เช่น ใจดี" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item name="service" label="บริการ" rules={[{ required: true }]}>
                        <Select
                          options={[
                            { value: "ขูดหินปูน", label: "ขูดหินปูน" },
                            { value: "อุดฟัน", label: "อุดฟัน" },
                            { value: "ถอนฟัน", label: "ถอนฟัน" },
                          ]}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                      <Form.Item name="doctor" label="แพทย์" rules={[{ required: true }]}>
                        <Select
                          options={[
                            { value: "นพ.กิตติ", label: "นพ.กิตติ" },
                            { value: "ทพญ.วริศรา", label: "ทพญ.วริศรา" },
                          ]}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                      <Form.Item name="room" label="ห้อง" rules={[{ required: true }]}>
                        <Select
                          options={[
                            { value: "X001", label: "X001" },
                            { value: "X002", label: "X002" },
                            { value: "X003", label: "X003" },
                          ]}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                      <Form.Item name="date" label="วันที่" rules={[{ required: true }]}>
                        <DatePicker style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                      <Form.Item name="time" label="เวลา (เริ่ม–สิ้นสุด)" rules={[{ required: true }]}>
                        <TimePicker.RangePicker format="HH:mm" style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Space>
                    <Button type="primary" htmlType="submit">เพิ่มวอล์คอิน</Button>
                    <Button htmlType="button" onClick={() => form.resetFields()}>ล้างฟอร์ม</Button>
                  </Space>
                </Form>
              </Card>
            ),
          },
          {
            key: "pay",
            label: "ชำระเงิน",
            children: (
              <Card bodyStyle={{ padding: 20 }} style={{ borderRadius: 16 }}>
                <Title level={5} style={{ marginTop: 0 }}>รอชำระเงิน (จากเคสที่เสร็จสิ้น)</Title>
                <Table<Person>
                  rowKey="id"
                  columns={[
                    { title: "เวลา", render: (_v, r) => `${r.timeStart}–${r.timeEnd}` },
                    { title: "ชื่อ", render: (_v, r) => `${r.firstName} ${r.lastName}` },
                    { title: "บริการ", dataIndex: "service", render: (v) => <Tag color={serviceColor(v)}>{v}</Tag> },
                    { title: "แพทย์/ห้อง", render: (_v, r) => `${r.doctor} • ${r.room}` },
                    {
                      title: "การกระทำ",
                      width: 220,
                      render: (_v, r) => (
                        <Space>
                          <Button type="primary" onClick={() => message.success(`ชำระเงิน: ${r.firstName}`)}>ชำระเงิน</Button>
                          <Button danger onClick={() => message.warning(`ยกเลิก: ${r.firstName}`)}>ยกเลิก</Button>
                        </Space>
                      ),
                    },
                  ]}
                  dataSource={payRows}
                  pagination={{ pageSize: 6, showSizeChanger: false }}
                />
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
};

export default HomeInfoPage;
