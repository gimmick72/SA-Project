// src/pages/BookingPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Layout,
  Card,
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Radio,
  Button,
  Typography,
  Space,
  message,
  theme,
  Alert,
  Select,
} from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { CalendarOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";
import SiteHeader from "./siteHeader";
import { createBooking, getCapacityByDate, listServices, type ServiceItem, type TimeSlot } from "../../../../services/booking/bookingApi";

dayjs.locale("th");
const { Content } = Layout;

const timeSlotLabel: Record<TimeSlot, string> = {
  morning: "ช่วงเช้า (09:00–12:00)",
  afternoon: "ช่วงบ่าย (13:00–17:00)",
  evening: "ช่วงเย็น (18:00–20:00)",
};

const BookingPage: React.FC = () => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const [slot, setSlot] = useState<TimeSlot | undefined>(undefined);
  const [date, setDate] = useState<Dayjs | null>(null);

  const [cap, setCap] = useState<Record<TimeSlot, number>>({
    morning: 0,
    afternoon: 0,
    evening: 0,
  });

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loadingCap, setLoadingCap] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ทำให้ summary อัปเดตตามค่าฟอร์มแบบ reactive จริง
  const firstName = Form.useWatch("firstName", form);
  const lastName  = Form.useWatch("lastName", form);
  const phone     = Form.useWatch("phone", form);
  const serviceId = Form.useWatch("serviceId", form);

  const selectedService = useMemo(
    () => services.find(s => s.id === serviceId),
    [serviceId, services]
  );

  const disabledDate = (current: Dayjs) =>
    current.startOf("day").isBefore(dayjs().startOf("day"));

  // โหลด service ตอน mount
  useEffect(() => {
    (async () => {
      try {
        const svcs = await listServices();
        setServices(svcs);
      } catch (e) {
        // ถ้า backend ยังไม่มี ลอง mock ชั่วคราว
        setServices([
          { id: 1, name: "ตรวจสุขภาพช่องปาก" },
          { id: 2, name: "ขูดหินปูน" },
          { id: 3, name: "อุดฟัน" },
        ]);
      }
    })();
  }, []);

  // โหลดความจุเมื่อเลือกวัน
  useEffect(() => {
    (async () => {
      setLoadingCap(true);
      try {
        const c = await getCapacityByDate(date);
        setCap(c);
        if (slot && c[slot] <= 0) setSlot(undefined);
      } catch {
        message.error("ไม่สามารถโหลดจำนวนคิวคงเหลือได้");
        setCap({ morning: 0, afternoon: 0, evening: 0 });
      } finally {
        setLoadingCap(false);
      }
    })();
  }, [date]);

  const summary = useMemo(() => {
    return {
      name: firstName && lastName ? `${firstName} ${lastName}` : "—",
      phone: phone || "—",
      service: selectedService?.name ?? "—",
      date: date ? date.format("DD MMMM YYYY") : "—",
      slot: slot ? timeSlotLabel[slot] : "—",
    };
  }, [firstName, lastName, phone, selectedService, date, slot]);

  const allFull = useMemo(() => Object.values(cap).every((n) => n <= 0), [cap]);

  const onFinish = async (values: any) => {
    if (!date || !slot) {
      message.error("กรุณาเลือกวันและช่วงเวลาที่ต้องการจอง");
      return;
    }
    if (cap[slot] <= 0) {
      message.error("ช่วงเวลาที่เลือกคิวเต็มแล้ว กรุณาเลือกช่วงเวลาอื่น");
      return;
    }
    if (!values.serviceId) {
      message.error("กรุณาเลือกบริการ");
      return;
    }

    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone,
      serviceId: values.serviceId,
      date: date.format("YYYY-MM-DD"),
      timeSlot: slot,
    };

    try {
      setSubmitting(true);
      // เรียก backend จริง
      const resp = await createBooking(payload);
      console.log("BOOKING_PAYLOAD:", payload, "RESP:", resp);

      // เดโม่: หักคิวคงเหลือด้านหน้า (ของจริง refresh จาก API อีกครั้งจะชัวร์กว่า)
      setCap((prev) => ({ ...prev, [slot]: Math.max(0, prev[slot] - 1) }));

      message.success("จองคิวสำเร็จ! เราจะติดต่อยืนยันกลับอีกครั้ง");
      form.resetFields();
      setSlot(undefined);
    } catch (e: any) {
      message.error(e?.response?.data?.error ?? "จองคิวไม่สำเร็จ");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#F3EDF9" }}>
      <SiteHeader />
      <Content>
        <div
          style={{
            padding: "32px 16px",
            background: "#F3EDF9",
            minHeight: "calc(100vh - 64px)",
          }}
        >
          <Row justify="center">
            <Col xs={24} lg={22} xxl={18}>
              <Row gutter={[24, 24]}>
                {/* Hero card */}
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
                  />
                </Col>

                {/* Form */}
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
                      disabled={submitting}
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

                      <Row gutter={16}>
                        <Col xs={24} md={12}>
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
                        </Col>

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
                              loading={loadingCap as any}
                            />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={16}>
                        <Col xs={24} md={12}>
                          <Form.Item
                            label="บริการ"
                            name="serviceId"
                            rules={[{ required: true, message: "กรุณาเลือกบริการ" }]}
                          >
                            <Select
                              placeholder="เลือกบริการ"
                              options={services.map(s => ({ value: s.id, label: s.name }))}
                              showSearch
                              filterOption={(input, option) =>
                                (option?.label as string).toLowerCase().includes(input.toLowerCase())
                              }
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                          <Form.Item label="เลือกช่วงเวลา" required>
                            {allFull && date && (
                              <Alert
                                style={{ marginBottom: 12 }}
                                type="error"
                                showIcon
                                message="คิวเต็มทุกช่วงเวลาในวันที่เลือก"
                              />
                            )}
                            <Radio.Group
                              onChange={(e) => setSlot(e.target.value)}
                              value={slot}
                              style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
                            >
                              <Radio.Button value="morning" disabled={cap.morning <= 0}>
                                เช้า {cap.morning <= 0 ? "(เต็ม)" : `(${cap.morning} คิว)`}
                              </Radio.Button>
                              <Radio.Button value="afternoon" disabled={cap.afternoon <= 0}>
                                บ่าย {cap.afternoon <= 0 ? "(เต็ม)" : `(${cap.afternoon} คิว)`}
                              </Radio.Button>
                              <Radio.Button value="evening" disabled={cap.evening <= 0}>
                                เย็น {cap.evening <= 0 ? "(เต็ม)" : `(${cap.evening} คิว)`}
                              </Radio.Button>
                            </Radio.Group>
                          </Form.Item>
                        </Col>
                      </Row>

                      <Space size="middle" style={{ width: "100%", justifyContent: "flex-end", marginTop: 8 }}>
                        <Button
                          onClick={() => {
                            form.resetFields();
                            setDate(null);
                            setSlot(undefined);
                            setCap({ morning: 0, afternoon: 0, evening: 0 });
                          }}
                        >
                          ล้างข้อมูล
                        </Button>
                        <Button
                          type="primary"
                          htmlType="submit"
                          loading={submitting}
                          disabled={!date || !slot || cap[(slot as TimeSlot)] <= 0}
                          style={{ background: token.colorPrimary }}
                        >
                          จองคิวทันที
                        </Button>
                      </Space>
                    </Form>
                  </Card>
                </Col>

                {/* Summary */}
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
                        <Col span={10}><strong>บริการ</strong></Col>
                        <Col span={14}>{summary.service}</Col>
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
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default BookingPage;
