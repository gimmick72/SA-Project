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
  Space,
  message,
  theme,
  Alert,
  Select,
  Spin,
} from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { CalendarOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";
import SiteHeader from "./siteHeader";

// types จาก services
import type {
  TimeSlot,
  IServiceItem,
  ICapacitySummary,
  ICreateBookingPayload,
} from "../../../../services/booking/bookingApi";

// services
import {
  createBooking,
  getCapacityByDate,
  // ⬇️ ใช้ getService (mock ได้)
  getService,
} from "../../../../services/booking/bookingApi";

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

  const [cap, setCap] = useState<ICapacitySummary>({
    morning: 0,
    afternoon: 0,
    evening: 0,
  });

  const [services, setServices] = useState<IServiceItem[]>([]);
  const [loadingCap, setLoadingCap] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // watch สำหรับ summary
  const firstName = Form.useWatch("firstName", form);
  const lastName = Form.useWatch("lastName", form);
  const phone = Form.useWatch("phone", form);
  const serviceId = Form.useWatch("serviceId", form);

  const selectedService = useMemo(
    () => services.find((s) => s.id === serviceId),
    [serviceId, services]
  );

  const disabledDate = (current: Dayjs) =>
    current.startOf("day").isBefore(dayjs().startOf("day"));

  // โหลด "บริการ" ตอน mount (mock ได้ถ้า API ล้มเหลว)
  useEffect(() => {
    (async () => {
      try {
        setLoadingServices(true);
        const svcs = await getService();
        setServices(svcs);
      } catch (e) {
        setServices([]); // กรณีผิดพลาดจริง ๆ
      } finally {
        setLoadingServices(false);
      }
    })();
  }, []);

  // โหลด capacity เมื่อเลือกวัน
  useEffect(() => {
    (async () => {
      if (!date) {
        setCap({ morning: 0, afternoon: 0, evening: 0 });
        setSlot(undefined);
        return;
      }
      setLoadingCap(true);
      try {
        const c = await getCapacityByDate(date);
        setCap(c);
        if (slot && c[slot] <= 0) setSlot(undefined);
      } catch {
        message.error("ไม่สามารถโหลดจำนวนคิวคงเหลือได้");
        setCap({ morning: 0, afternoon: 0, evening: 0 });
        setSlot(undefined);
      } finally {
        setLoadingCap(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const summary = useMemo(
    () => ({
      name: firstName && lastName ? `${firstName} ${lastName}` : "—",
      phone: phone || "—",
      service: selectedService?.name ?? "—",
      date: date ? date.format("DD MMMM YYYY") : "—",
      slot: slot ? timeSlotLabel[slot] : "—",
    }),
    [firstName, lastName, phone, selectedService, date, slot]
  );

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

    const payload: ICreateBookingPayload = {
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone,
      serviceId: values.serviceId,
      date, // ให้ service แปลงเป็น YYYY-MM-DD เอง
      timeSlot: slot,
    };

    try {
      setSubmitting(true);
      await createBooking(payload);

      const fresh = await getCapacityByDate(date);
      setCap(fresh);

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
                              loading={loadingServices}
                              options={services.map((s) => ({ value: s.id, label: s.name }))}
                              notFoundContent={loadingServices ? "กำลังโหลด..." : "ไม่พบบริการ"}
                              showSearch
                              filterOption={(input, option) =>
                                (option?.label as string)
                                  .toLowerCase()
                                  .includes(input.toLowerCase())
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
                            <Spin spinning={loadingCap}>
                              <Radio.Group
                                onChange={(e) => setSlot(e.target.value)}
                                value={slot}
                                style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
                                disabled={!date}
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
                            </Spin>
                          </Form.Item>
                        </Col>
                      </Row>

                      <Space
                        size="middle"
                        style={{ width: "100%", justifyContent: "flex-end", marginTop: 8 }}
                      >
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
                          disabled={!date || !slot || cap[slot as TimeSlot] <= 0}
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
                        <Col span={10}>
                          <strong>ชื่อ-สกุล</strong>
                        </Col>
                        <Col span={14}>{firstName && lastName ? `${firstName} ${lastName}` : "—"}</Col>
                      </Row>
                      <Row style={{ marginBottom: 8 }}>
                        <Col span={10}>
                          <strong>เบอร์โทร</strong>
                        </Col>
                        <Col span={14}>{phone || "—"}</Col>
                      </Row>
                      <Row style={{ marginBottom: 8 }}>
                        <Col span={10}>
                          <strong>บริการ</strong>
                        </Col>
                        <Col span={14}>{selectedService?.name ?? "—"}</Col>
                      </Row>
                      <Row style={{ marginBottom: 8 }}>
                        <Col span={10}>
                          <strong>วันที่</strong>
                        </Col>
                        <Col span={14}>{date ? date.format("DD MMMM YYYY") : "—"}</Col>
                      </Row>
                      <Row>
                        <Col span={10}>
                          <strong>ช่วงเวลา</strong>
                        </Col>
                        <Col span={14}>{slot ? timeSlotLabel[slot] : "—"}</Col>
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
