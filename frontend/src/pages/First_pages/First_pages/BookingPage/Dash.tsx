// // src/pages/Queue/BookedQueuesPage.tsx
// // ————————————————————————————————————————————————————————————
// // หน้าสำหรับ "แสดงคิวที่จอง" พร้อมตัวกรองและการยกเลิกคิว
// // วิธีใช้งานอย่างไว:
// // 1) วางไฟล์นี้ไว้ใน src/pages/Queue/ หรือโฟลเดอร์ที่ต้องการ
// // 2) เพิ่ม route เช่น path="/admin/queue/booked" เพื่อเปิดหน้านี้
// // 3) ค่า USE_MOCK=true จะใช้ข้อมูลจำลองทันที ถ้าพร้อมต่อ backend ให้ตั้งเป็น false
// //    และปรับ ENDPOINT ให้ตรงกับเซิร์ฟเวอร์ของคุณ (เช่น /api/bookings)
// // ————————————————————————————————————————————————————————————

// import React, { useEffect, useMemo, useState } from "react";
// import {
//   Layout,
//   Card,
//   Row,
//   Col,
//   DatePicker,
//   Input,
//   Select,
//   Space,
//   Tag,
//   Button,
//   Table,
//   Modal,
//   Descriptions,
//   Statistic,
//   message,
//   Popconfirm,
//   Typography,
//   theme,
// } from "antd";
// import type { ColumnsType } from "antd/es/table";
// import dayjs, { Dayjs } from "dayjs";
// import "dayjs/locale/th";
// import axios from "axios";

// // ตั้ง locale ภาษาไทย
//  dayjs.locale("th");

// const { Content } = Layout;
// const { RangePicker } = DatePicker;
// const { Text } = Typography;

// // ————————————————————————————————————————————————————————————
// // CONFIG
// // ————————————————————————————————————————————————————————————
// const USE_MOCK = true; // ← เปลี่ยนเป็น false เมื่อต้องการต่อ API จริง
// const ENDPOINT = "/api/bookings"; // ตัวอย่าง endpoint

// // ————————————————————————————————————————————————————————————
// // Types & Helpers
// // ————————————————————————————————————————————————————————————
// type TimeSlot = "morning" | "afternoon" | "evening";
// type BookingStatus = "pending" | "confirmed" | "checked_in" | "completed" | "cancelled";

// const timeSlotLabel: Record<TimeSlot, string> = {
//   morning: "ช่วงเช้า (09:00–12:00)",
//   afternoon: "ช่วงบ่าย (13:00–17:00)",
//   evening: "ช่วงเย็น (18:00–20:00)",
// };

// const statusLabel: Record<BookingStatus, string> = {
//   pending: "รอยืนยัน",
//   confirmed: "ยืนยันแล้ว",
//   checked_in: "เช็คอินแล้ว",
//   completed: "เสร็จสิ้น",
//   cancelled: "ยกเลิก",
// };

// const statusColor: Record<BookingStatus, string> = {
//   pending: "gold",
//   confirmed: "green",
//   checked_in: "blue",
//   completed: "default",
//   cancelled: "red",
// };

// export type Booking = {
//   id: number;
//   date: string; // YYYY-MM-DD
//   startTime: string; // HH:mm
//   endTime?: string; // HH:mm
//   timeSlot: TimeSlot;
//   patientName: string;
//   patientPhone: string;
//   serviceName?: string;
//   note?: string;
//   status: BookingStatus;
//   createdAt: string; // ISO
// };

// // ————————————————————————————————————————————————————————————
// // Mock Utilities
// // ————————————————————————————————————————————————————————————
// function randomPick<T>(arr: T[]) { return arr[Math.floor(Math.random() * arr.length)]; }

// function makeMockData(range: [Dayjs, Dayjs], q?: string, status?: BookingStatus, slot?: TimeSlot): Booking[] {
//   const names = ["วริษฐา มากมูล", "สุชญา วิศวะ", "กนกพร ใจดี", "ธนกร ตั้งมั่น", "พิมพ์ชนก สายชล", "ศุภกร สุขใจ"]; 
//   const phones = ["081-234-5678", "089-999-0000", "086-111-2222", "090-333-4444", "092-555-6666"]; 
//   const services = ["ตรวจสุขภาพช่องปาก", "ขูดหินปูน", "อุดฟัน", "ถอนฟัน", "จัดฟัน", "เอ็กซเรย์"];
//   const statuses: BookingStatus[] = ["pending", "confirmed", "checked_in", "completed", "cancelled"];
//   const slots: TimeSlot[] = ["morning", "afternoon", "evening"];

//   const days = range[1].diff(range[0], "day") + 1;
//   const rows: Booking[] = [];
//   let id = 1;
//   for (let d = 0; d < days; d++) {
//     const day = range[0].add(d, "day");
//     // ต่อวัน: ทำ 8–16 รายการ
//     const n = 8 + Math.floor(Math.random() * 9);
//     for (let i = 0; i < n; i++) {
//       const pickSlot = randomPick(slots);
//       const baseHour = pickSlot === "morning" ? 9 : pickSlot === "afternoon" ? 13 : 18;
//       const minute = ["00", "15", "30", "45"][Math.floor(Math.random() * 4)];
//       const start = `${String(baseHour + Math.floor(Math.random() * 3)).padStart(2, "0")}:${minute}`;
//       const s = randomPick(statuses);
//       const row: Booking = {
//         id: id++,
//         date: day.format("YYYY-MM-DD"),
//         startTime: start,
//         endTime: undefined,
//         timeSlot: pickSlot,
//         patientName: randomPick(names),
//         patientPhone: randomPick(phones),
//         serviceName: randomPick(services),
//         note: Math.random() < 0.2 ? "ต้องการหมอผู้หญิง" : undefined,
//         status: s,
//         createdAt: day.add(-1, "day").toISOString(),
//       };
//       rows.push(row);
//     }
//   }

//   // Apply simple filters
//   let out = rows;
//   if (q) {
//     const qq = q.trim().toLowerCase();
//     out = out.filter(r =>
//       r.patientName.toLowerCase().includes(qq) ||
//       r.patientPhone.replace(/[-\s]/g, "").includes(qq) ||
//       (r.serviceName || "").toLowerCase().includes(qq)
//     );
//   }
//   if (status) out = out.filter(r => r.status === status);
//   if (slot) out = out.filter(r => r.timeSlot === slot);
//   return out.sort((a,b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));
// }

// // ————————————————————————————————————————————————————————————
// // API (in-file สำหรับเดโม) — แนะนำย้ายไป services/queue/queueApi.ts เมื่อพร้อม
// // ————————————————————————————————————————————————————————————
// async function listBookings(params: {
//   dateRange?: [Dayjs, Dayjs];
//   q?: string;
//   status?: BookingStatus;
//   slot?: TimeSlot;
// }): Promise<Booking[]> {
//   if (USE_MOCK) {
//     const range: [Dayjs, Dayjs] = params.dateRange || [dayjs(), dayjs()];
//     return new Promise((res) => setTimeout(() => res(makeMockData(range, params.q, params.status, params.slot)), 300));
//   }
//   // ตัวอย่างเรียกจริง (ควรปรับที่ backend ให้รองรับ query parameters เหล่านี้)
//   const { dateRange, q, status, slot } = params;
//   const query = new URLSearchParams();
//   if (dateRange) {
//     query.set("start", dateRange[0].format("YYYY-MM-DD"));
//     query.set("end", dateRange[1].format("YYYY-MM-DD"));
//   }
//   if (q) query.set("q", q);
//   if (status) query.set("status", status);
//   if (slot) query.set("slot", slot);

//   const res = await axios.get(`${ENDPOINT}?${query.toString()}`);
//   // ควร map ผลลัพธ์ให้ตรงกับชนิด Booking ถ้า backend ส่งฟิลด์ต่างกัน
//   return res.data?.data ?? res.data ?? [];
// }

// async function cancelBooking(id: number): Promise<void> {
//   if (USE_MOCK) {
//     // จำลองสำเร็จ
//     return new Promise((res) => setTimeout(() => res(), 250));
//   }
//   await axios.patch(`${ENDPOINT}/${id}`, { status: "cancelled" satisfies BookingStatus });
// }

// // ————————————————————————————————————————————————————————————
// // Component
// // ————————————————————————————————————————————————————————————
// const BookedQueuesPage: React.FC = () => {
//   const { token } = theme.useToken();
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState<Booking[]>([]);
//   const [selected, setSelected] = useState<Booking | null>(null);

//   // Filters
//   const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([dayjs(), dayjs()]);
//   const [q, setQ] = useState<string>("");
//   const [status, setStatus] = useState<BookingStatus | undefined>();
//   const [slot, setSlot] = useState<TimeSlot | undefined>();

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const rows = await listBookings({ dateRange, q, status, slot });
//       setData(rows);
//     } catch (err: any) {
//       console.error(err);
//       message.error("โหลดข้อมูลคิวไม่สำเร็จ");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [dateRange, status, slot]);

//   const counts = useMemo(() => {
//     const c: Record<BookingStatus, number> = {
//       pending: 0,
//       confirmed: 0,
//       checked_in: 0,
//       completed: 0,
//       cancelled: 0,
//     };
//     data.forEach((r) => { c[r.status]++; });
//     return c;
//   }, [data]);

//   const columns: ColumnsType<Booking> = [
//     {
//       title: "วันที่",
//       dataIndex: "date",
//       key: "date",
//       width: 130,
//       render: (v: string) => dayjs(v).format("DD MMM YYYY"),
//       sorter: (a, b) => a.date.localeCompare(b.date),
//     },
//     {
//       title: "เวลา",
//       key: "time",
//       width: 110,
//       render: (_, r) => `${r.startTime}${r.endTime ? `–${r.endTime}` : ""}`,
//       sorter: (a, b) => a.startTime.localeCompare(b.startTime),
//     },
//     {
//       title: "ช่วง",
//       dataIndex: "timeSlot",
//       key: "timeSlot",
//       width: 160,
//       render: (v: TimeSlot) => <Tag>{timeSlotLabel[v]}</Tag>,
//       filters: [
//         { text: timeSlotLabel.morning, value: "morning" },
//         { text: timeSlotLabel.afternoon, value: "afternoon" },
//         { text: timeSlotLabel.evening, value: "evening" },
//       ],
//       onFilter: (value, record) => record.timeSlot === value,
//     },
//     {
//       title: "ชื่อคนไข้",
//       dataIndex: "patientName",
//       key: "patientName",
//       ellipsis: true,
//     },
//     {
//       title: "โทร",
//       dataIndex: "patientPhone",
//       key: "patientPhone",
//       width: 130,
//     },
//     {
//       title: "บริการ",
//       dataIndex: "serviceName",
//       key: "serviceName",
//       ellipsis: true,
//     },
//     {
//       title: "สถานะ",
//       dataIndex: "status",
//       key: "status",
//       width: 120,
//       render: (v: BookingStatus) => <Tag color={statusColor[v]}>{statusLabel[v]}</Tag>,
//       filters: Object.entries(statusLabel).map(([k, label]) => ({ text: label, value: k })),
//       onFilter: (value, record) => record.status === value,
//     },
//     {
//       title: "การทำงาน",
//       key: "actions",
//       fixed: "right",
//       width: 210,
//       render: (_, r) => (
//         <Space>
//           <Button onClick={() => setSelected(r)}>ดูรายละเอียด</Button>
//           <Popconfirm
//             title="ยืนยันยกเลิกคิว?"
//             okText="ยกเลิก"
//             cancelText="กลับ"
//             onConfirm={async () => {
//               try {
//                 await cancelBooking(r.id);
//                 message.success("ยกเลิกคิวแล้ว");
//                 fetchData();
//               } catch (e) {
//                 message.error("ยกเลิกคิวไม่สำเร็จ");
//               }
//             }}
//           >
//             <Button danger disabled={r.status === "cancelled" || r.status === "completed"}>
//               ยกเลิกคิว
//             </Button>
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <Layout style={{ minHeight: "100%" }}>
//       <Content style={{ padding: 16 }}>
//         <Space direction="vertical" size={16} style={{ display: "flex" }}>
//           {/* Header */}
//           <Row gutter={[16, 16]} align="middle">
//             <Col flex="auto">
//               <Typography.Title level={3} style={{ margin: 0 }}>
//                 แสดงคิวที่จอง
//               </Typography.Title>
//               <Text type="secondary">ดูรายการจองคิวทั้งหมดแบบเรียลไทม์ พร้อมตัวกรองและการยกเลิก</Text>
//             </Col>
//             <Col>
//               <Space>
//                 <Button onClick={fetchData}>รีเฟรช</Button>
//               </Space>
//             </Col>
//           </Row>

//           {/* Filters Card */}
//           <Card bodyStyle={{ paddingBottom: 8 }}>
//             <Row gutter={[12, 12]} align="middle">
//               <Col xs={24} md={10} lg={8}>
//                 <RangePicker
//                   style={{ width: "100%" }}
//                   value={dateRange}
//                   onChange={(v) => {
//                     if (!v) return;
//                     setDateRange([v[0]!, v[1]!]);
//                   }}
//                   allowClear={false}
//                 />
//               </Col>
//               <Col xs={24} md={6} lg={5}>
//                 <Select
//                   style={{ width: "100%" }}
//                   placeholder="สถานะทั้งหมด"
//                   value={status}
//                   onChange={(v) => setStatus(v as BookingStatus)}
//                   allowClear
//                   options={Object.entries(statusLabel).map(([value, label]) => ({ value, label }))}
//                 />
//               </Col>
//               <Col xs={24} md={6} lg={5}>
//                 <Select
//                   style={{ width: "100%" }}
//                   placeholder="ทุกช่วงเวลา"
//                   value={slot}
//                   onChange={(v) => setSlot(v as TimeSlot)}
//                   allowClear
//                   options={Object.entries(timeSlotLabel).map(([value, label]) => ({ value, label }))}
//                 />
//               </Col>
//               <Col xs={24} md={12} lg={6}>
//                 <Input.Search
//                   placeholder="ค้นหาชื่อ/เบอร์/บริการ"
//                   allowClear
//                   onSearch={(v) => setQ(v)}
//                 />
//               </Col>
//             </Row>
//           </Card>

//           {/* Summary */}
//           <Row gutter={[16, 16]}>
//             <Col xs={12} sm={8} md={6} lg={4}>
//               <Card bordered={false} style={{ background: token.colorFillTertiary }}>
//                 <Statistic title="รอยืนยัน" value={counts.pending} />
//               </Card>
//             </Col>
//             <Col xs={12} sm={8} md={6} lg={4}>
//               <Card bordered={false} style={{ background: token.colorFillTertiary }}>
//                 <Statistic title="ยืนยันแล้ว" value={counts.confirmed} />
//               </Card>
//             </Col>
//             <Col xs={12} sm={8} md={6} lg={4}>
//               <Card bordered={false} style={{ background: token.colorFillTertiary }}>
//                 <Statistic title="เช็คอินแล้ว" value={counts.checked_in} />
//               </Card>
//             </Col>
//             <Col xs={12} sm={8} md={6} lg={4}>
//               <Card bordered={false} style={{ background: token.colorFillTertiary }}>
//                 <Statistic title="เสร็จสิ้น" value={counts.completed} />
//               </Card>
//             </Col>
//             <Col xs={12} sm={8} md={6} lg={4}>
//               <Card bordered={false} style={{ background: token.colorFillTertiary }}>
//                 <Statistic title="ยกเลิก" value={counts.cancelled} />
//               </Card>
//             </Col>
//           </Row>

//           {/* Table */}
//           <Card>
//             <Table
//               rowKey="id"
//               loading={loading}
//               dataSource={data}
//               columns={columns}
//               scroll={{ x: 1000 }}
//               pagination={{ pageSize: 12, showSizeChanger: true }}
//             />
//           </Card>
//         </Space>

//         {/* Detail Modal */}
//         <Modal
//           open={!!selected}
//           onCancel={() => setSelected(null)}
//           title={`รายละเอียดคิว #${selected?.id ?? ""}`}
//           footer={<Button onClick={() => setSelected(null)}>ปิด</Button>}
//         >
//           {selected && (
//             <Descriptions bordered column={1} size="middle">
//               <Descriptions.Item label="วันที่">
//                 {dayjs(selected.date).format("DD MMM YYYY")}
//               </Descriptions.Item>
//               <Descriptions.Item label="เวลา">
//                 {selected.startTime}{selected.endTime ? `–${selected.endTime}` : ""}
//               </Descriptions.Item>
//               <Descriptions.Item label="ช่วง">
//                 {timeSlotLabel[selected.timeSlot]}
//               </Descriptions.Item>
//               <Descriptions.Item label="สถานะ">
//                 <Tag color={statusColor[selected.status]}>{statusLabel[selected.status]}</Tag>
//               </Descriptions.Item>
//               <Descriptions.Item label="ผู้ป่วย">
//                 {selected.patientName} ({selected.patientPhone})
//               </Descriptions.Item>
//               {selected.serviceName && (
//                 <Descriptions.Item label="บริการ">
//                   {selected.serviceName}
//                 </Descriptions.Item>
//               )}
//               {selected.note && (
//                 <Descriptions.Item label="หมายเหตุ">{selected.note}</Descriptions.Item>
//               )}
//               <Descriptions.Item label="สร้างเมื่อ">
//                 {dayjs(selected.createdAt).format("DD MMM YYYY HH:mm")}
//               </Descriptions.Item>
//             </Descriptions>
//           )}
//         </Modal>
//       </Content>
//     </Layout>
//   );
// };

// export default BookedQueuesPage;
