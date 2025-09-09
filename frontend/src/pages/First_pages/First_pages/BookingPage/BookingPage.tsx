// src/pages/BookingPage.tsx
import React, { useMemo, useState } from "react";
import { Card, Row, Col, Form, Input, DatePicker, Radio, Button, Typography, Space, message, theme } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { CalendarOutlined, PhoneOutlined, UserOutlined, SmileOutlined } from "@ant-design/icons";

dayjs.locale("th");

type TimeSlot = "morning" | "afternoon" | "evening";

const timeSlotLabel: Record<TimeSlot, string> = {
  morning: "ช่วงเช้า (10:00–12:00)",
  afternoon: "ช่วงบ่าย (13:00–16:00)",
  evening: "ช่วงเย็น (17:00–19:00)",
};

const BookingPage: React.FC = () => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const [slot, setSlot] = useState<TimeSlot | undefined>(undefined);
  const [date, setDate] = useState<Dayjs | null>(null);

  const disabledDate = (current: Dayjs) => {
    // ไม่ให้เลือกวันย้อนหลัง
    return current.startOf("day").isBefore(dayjs().startOf("day"));
  };

  const summary = useMemo(() => {
    const values = form.getFieldsValue();
    return {
      name: values.firstName && values.lastName ? `${values.firstName} ${values.lastName}` : "—",
      phone: values.phone || "—",
      date: date ? date.format("DD MMMM YYYY") : "—",
      slot: slot ? timeSlotLabel[slot] : "—",
    };
  }, [form, date, slot]);

  const onFinish = (values: any) => {
    if (!date || !slot) {
      message.error("กรุณาเลือกวันและช่วงเวลาที่ต้องการจอง");
      return;
    }
    const payload = {
      ...values,
      date: date.format("YYYY-MM-DD"),
      timeSlot: slot,
    };
    console.log("BOOKING_PAYLOAD:", payload);
    message.success("จองคิวสำเร็จ! เราจะติดต่อยืนยันกลับอีกครั้ง");
    form.resetFields();
    setDate(null);
    setSlot(undefined);
  };

  return (
    <div
      style={{
        padding: "32px 16px",
        background: "#F3EDF9",
        minHeight: "100vh",
      }}
    >
      <Row justify="center">
        <Col xs={24} lg={22} xxl={18}>
          <Row gutter={[24, 24]}>
            {/* Hero card – โทนตามภาพ */}
            <Col span={24}>
              <Card
                bordered={false}
                style={{
                  borderRadius: 24,
                  padding: 0,
                  background: "linear-gradient(135deg, #E9DDFB 0%, #D9C6FA 100%)",
                  boxShadow: "0 8px 24px rgba(112, 0, 255, 0.08)",
                }}
                bodyStyle={{ padding: 0 }}
              >
                <Row align="middle" gutter={[24, 24]} style={{ padding: 24 }}>
                  <Col xs={24} md={14}>
                    <div
                      style={{
                        background: "rgba(255,255,255,0.55)",
                        borderRadius: 20,
                        padding: 24,
                      }}
                    >
                      <Typography.Title level={3} style={{ color: "#5B2EC6", marginTop: 0 }}>
                        ยิ้มสวย มั่นใจ ไปกับทันตแพทย์มืออาชีพ
                      </Typography.Title>
                      <Typography.Paragraph style={{ marginBottom: 0, color: "#5B2EC6" }}>
                        เลือกวัน-เวลา แล้วกรอกข้อมูลติดต่อสั้น ๆ เพื่อจองคิวกับเรา
                      </Typography.Paragraph>
                    </div>
                  </Col>
                  <Col xs={24} md={10}>
                    <div
                      style={{
                        borderRadius: 16,
                        height: 180,
                        background: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "4px solid #D2BDF8",
                      }}
                    >
                      <SmileOutlined style={{ fontSize: 48, color: "#8A63E6" }} />
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Form + Summary */}
            <Col xs={24} lg={14}>
              <Card
                title="กรอกข้อมูลสำหรับจองคิว"
                bordered={false}
                style={{ borderRadius: 20 }}
                headStyle={{ borderBottom: "none" }}
                bodyStyle={{ paddingTop: 0 }}
              >
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  requiredMark="optional"
                  style={{ marginTop: 8 }}
                >
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="ชื่อ"
                        name="firstName"
                        rules={[{ required: true, message: "กรุณากรอกชื่อ" }]}
                      >
                        <Input placeholder="ชื่อจริง" prefix={<UserOutlined />} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="นามสกุล"
                        name="lastName"
                        rules={[{ required: true, message: "กรุณากรอกนามสกุล" }]}
                      >
                        <Input placeholder="นามสกุล" prefix={<UserOutlined />} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    label="เบอร์โทร"
                    name="phone"
                    rules={[
                      { required: true, message: "กรุณากรอกเบอร์โทร" },
                      { pattern: /^0\d{8,9}$/, message: "กรุณากรอกเบอร์โทรให้ถูกต้อง" },
                    ]}
                  >
                    <Input placeholder="08xxxxxxxx" prefix={<PhoneOutlined />} />
                  </Form.Item>

                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item label="เลือกวัน" required>
                        <DatePicker
                          allowClear
                          style={{ width: "100%" }}
                          format="DD/MM/YYYY"
                          placeholder="เลือกวัน"
                          disabledDate={disabledDate}
                          onChange={(d) => setDate(d)}
                          suffixIcon={<CalendarOutlined />}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item label="เลือกช่วงเวลา" required>
                        <Radio.Group
                          onChange={(e) => setSlot(e.target.value)}
                          value={slot}
                          style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
                        >
                          <Radio.Button value="morning">เช้า</Radio.Button>
                          <Radio.Button value="afternoon">บ่าย</Radio.Button>
                          <Radio.Button value="evening">เย็น</Radio.Button>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Space size="middle" style={{ width: "100%", justifyContent: "flex-end", marginTop: 8 }}>
                    <Button onClick={() => { form.resetFields(); setDate(null); setSlot(undefined); }}>
                      ล้างข้อมูล
                    </Button>
                    <Button type="primary" htmlType="submit" style={{ background: token.colorPrimary }}>
                      จองคิวทันที
                    </Button>
                  </Space>
                </Form>
              </Card>
            </Col>

            <Col xs={24} lg={10}>
              <Card
                bordered={false}
                style={{
                  borderRadius: 20,
                  background: "linear-gradient(135deg,#FFFFFF 0%, #F0E9FF 100%)",
                }}
                headStyle={{ borderBottom: "none" }}
                title="สรุปรายการจอง"
              >
                <div
                  style={{
                    border: "1px dashed #CBB6FA",
                    borderRadius: 16,
                    padding: 16,
                    background: "#fff",
                  }}
                >
                  <Row style={{ marginBottom: 8 }}>
                    <Col span={10}><strong>ชื่อ-สกุล</strong></Col>
                    <Col span={14}>{summary.name}</Col>
                  </Row>
                  <Row style={{ marginBottom: 8 }}>
                    <Col span={10}><strong>เบอร์โทร</strong></Col>
                    <Col span={14}>{summary.phone}</Col>
                  </Row>
                  <Row style={{ marginBottom: 8 }}>
                    <Col span={10}><strong>วันที่</strong></Col>
                    <Col span={14}>{summary.date}</Col>
                  </Row>
                  <Row>
                    <Col span={10}><strong>ช่วงเวลา</strong></Col>
                    <Col span={14}>{summary.slot}</Col>
                  </Row>
                </div>

                <Typography.Paragraph style={{ marginTop: 16, color: "#6F55C8" }}>
                  หลังจากกด “จองคิวทันที” เจ้าหน้าที่จะติดต่อยืนยันภายในเวลาทำการ
                </Typography.Paragraph>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default BookingPage;
