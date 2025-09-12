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
  Alert,
  Select,
  Spin,
  Table,
  Divider,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import "dayjs/locale/th";
import {
  CalendarOutlined,
  PhoneOutlined,
  UserOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import {
  TimeSlot,
  IServiceItem,
  createBooking,
  getCapacityByDate,
  getService,
} from "../../../../services/booking/bookingApi";
import type {
  CapacitySummary,
  ServiceItem,
  Slottime,
  UpdateSlot,
  QueueSlot,
  CreateBooking,
  SummaryBooking,
} from "../../../../interface/bookingQueue";
import { searchBookings } from "../../../../services/booking/bookingApi";

dayjs.locale("th");
const { Content } = Layout;

const timeSlotLabel: Record<TimeSlot, string> = {
  morning: "ช่วงเช้า (09:00–12:00)",
  afternoon: "ช่วงบ่าย (13:00–17:00)",
  evening: "ช่วงเย็น (18:00–20:00)",
};

function toTime(hhmm: string) {
  return `${hhmm.slice(0, 2)}:${hhmm.slice(2)}`;
}

const BookingPage: React.FC = () => {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();

  // Booking form states
  const [slot, setSlot] = useState<TimeSlot | undefined>(undefined);
  const [date, setDate] = useState<Dayjs | null>(null);
  const [services, setServices] = useState<IServiceItem[]>([]);
  const [loadingCapacity, setLoadingCapacity] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Search states
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SummaryBooking[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Watch form values for summary
  const firstName = Form.useWatch("firstName", form);
  const lastName = Form.useWatch("lastName", form);
  const phone = Form.useWatch("phone", form);
  const serviceId = Form.useWatch("serviceId", form);

  // Capacity state
  const [capacity, setCapacity] = useState<CapacitySummary>({
    morning: 0,
    afternoon: 0,
    evening: 0,
  });

  // Disable past dates
  const disabledDate = (current: Dayjs) =>
    current.startOf("day").isBefore(dayjs().startOf("day"));

  const loadServices = async () => {
    try {
      setLoadingServices(true);
      const response = await getService();
      setServices(response);
    } catch (e) {
      message.error("ไม่สามารถโหลดรายการบริการได้");
      setServices([]);
    } finally {
      setLoadingServices(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  // Load capacity when date changes
  useEffect(() => {
    (async () => {
      if (!date) {
        setCapacity({ morning: 0, afternoon: 0, evening: 0 });
        setSlot(undefined);
        return;
      }
      setLoadingCapacity(true);
      try {
        const cap = await getCapacityByDate(date);
        setCapacity(cap);

        // ถ้า slot เดิมยังจองได้อยู่ ให้คงไว้ ไม่งั้นเคลียร์
        setSlot((prev) => (prev && cap[prev] > 0 ? prev : undefined));
      } catch {
        message.error("ไม่สามารถโหลดจำนวนคิวคงเหลือได้");
        setCapacity({ morning: 0, afternoon: 0, evening: 0 });
        setSlot(undefined);
      } finally {
        setLoadingCapacity(false);
      }
    })();
  }, [date]);
  const allFull = !loadingCapacity && Math.max(...Object.values(capacity)) <= 0;

  // Summary for booking
  const summary = useMemo(
    () => ({
      name: firstName && lastName ? `${firstName} ${lastName}` : "—",
      phone: phone || "—",
      service: services.find((s) => s.id === serviceId)?.name_service ?? "—",
      date: date ? date.format("DD MMMM YYYY") : "—",
      slot: slot ? timeSlotLabel[slot] : "—",
    }),
    [firstName, lastName, phone, serviceId, services, date, slot]
  );

  //Search
  const handleSearch = async (values: {
    phone_number?: string;
    date?: Dayjs;
  }) => {
    const rawPhone = values.phone_number?.toString().trim() ?? "";
    const phone = rawPhone ? rawPhone.replace(/\D/g, "") : "";
    const dateStr = values.date ? values.date.format("YYYY-MM-DD") : undefined;

    if (!phone && !dateStr) {
      message.warning("กรุณากรอกเบอร์โทรหรือเลือกวันที่");
      return;
    }

    setSearchLoading(true);
    try {
      let results: SummaryBooking[] = [];

      if (phone) {
        // ค้นหาด้วยเบอร์ (ถ้าเลือกวัน ก็ส่งไปด้วย)
        results = await searchBookings(phone, dateStr);
      } else {
        message.warning("กรุณากรอกเบอร์หรือเลือกวันอย่างน้อยหนึ่งอย่าง");
        return;
      }

      setSearchResults(results);
      setShowSearchResults(true);

      if (results.length === 0) {
        message.info("ไม่พบการจอง");
      } else {
        message.success(`การจองของคุณ`);
      }
    } catch (e: any) {
      message.error(e?.response?.data?.error ?? "ค้นหาไม่สำเร็จ");
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    if (!date || !slot) {
      message.error("กรุณาเลือกวันและช่วงเวลาที่ต้องการจอง");
      return;
    }
    if (capacity[slot as TimeSlot] <= 0) {
      message.error("คิวเต็มแล้ว กรุณาเลือกช่วงเวลาอื่น");
      return;
    }
    if (!values.serviceId) {
      message.error("กรุณาเลือกบริการ");
      return;
    }

    const payload: CreateBooking = {
      firstName: values.firstName,
      lastName: values.lastName,
      
      phone_number: values.phone,
      serviceId: values.serviceId,
      dateText: date.format("YYYY-MM-DD"),
      timeSlot: slot, // "morning" | "afternoon" | "evening"
    };

    try {
      setSubmitting(true);

      //จองคิว
      const result = await createBooking(payload);
      
      message.success(
        result?.hhmm
          ? `จองคิวสำเร็จ เวลา ${result.hhmm.slice(0, 2)}:${result.hhmm.slice(
              2
            )}`
          : "จองคิวสำเร็จ!"
      );

      // รีเฟรชคิวคงเหลือของวันนั้น
      const fresh = await getCapacityByDate(date);
      setCapacity(fresh);

      // เคลียร์ฟอร์ม
      form.resetFields();
      setSlot(undefined);

      setDate(null);
    } catch (err: any) {
      message.error(err?.response?.data?.error ?? "จองคิวไม่สำเร็จ");
    } finally {
      setSubmitting(false);
    }
  };
  const serviceNameById = (id?: number) =>
    id ? services.find(s => s.id === id)?.name_service ?? "—" : "—";
  
  
  // Table columns for search results
  const searchResultColumns: ColumnsType<SummaryBooking> = [
    {
      title: "ชื่อ-สกุล",
      key: "name",
      render: (_, r) =>
        `${r.firstName ?? ""} ${r.lastName ?? ""}`.trim() || "—",
    },
    {
      title: "เบอร์โทร",
      dataIndex: "phone_number",
      key: "phone",
      render: (v) => v ?? "—",
    },
    {
      title: "วัน-เวลา",
      key: "datetime",
      render: (_, r) => {
        const dd = r.date ? dayjs(r.date) : null;
        const dateStr =
          dd && dd.isValid() ? dd.format("DD/MM/YYYY") : r.date ?? "—";
        return `${dateStr} `;
      },
    },
    {
      title: "ช่วง",
      dataIndex: "segment",
      key: "segment",
      render: (s: TimeSlot) => (s ? timeSlotLabel[s] ?? s : "—"),
    },
    {
      title: "บริการ",
      dataIndex: "service_name",
      key: "service_name",
      render: (_, r) => serviceNameById(r.id),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", background: "#F3EDF9" }}>
      {/* Enhanced Search Section */}
      <Row justify="center" style={{ marginTop: "5rem" }}>
        <Col xs={24} lg={22} xxl={18}>
          <Card
            bordered={false}
            style={{ borderRadius: 20 }}
            title="ค้นหาข้อมูลการจอง"
            headStyle={{ borderBottom: "none" }}
          >
            <Form
              form={searchForm}
              layout="inline"
              onFinish={handleSearch}
              style={{ marginBottom: 16 }}
            >
              <Form.Item
                name="phone_number"
                label="เบอร์โทร"
                style={{ minWidth: 200 }}
              >
                <Input
                  placeholder="เช่น 0891234567"
                  prefix={<PhoneOutlined />}
                  allowClear
                />
              </Form.Item>

              <Form.Item name="date" label="วันที่" style={{ minWidth: 200 }}>
                <DatePicker
                  placeholder="เลือกวันที่"
                  format="DD/MM/YYYY"
                  allowClear
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={searchLoading}
                  icon={<SearchOutlined />}
                >
                  ค้นหา
                </Button>
              </Form.Item>

              <Form.Item>
                <Button
                  onClick={() => {
                    searchForm.resetFields();
                    setSearchResults([]);
                    setShowSearchResults(false);
                  }}
                >
                  ล้างข้อมูล
                </Button>
              </Form.Item>
            </Form>

            {showSearchResults && (
              <Table
                rowKey={(record) =>
                  record.id ??
                  `${record.date}-${record.hhmm}-${record.phone_number}`
                }
                loading={searchLoading}
                columns={searchResultColumns}
                dataSource={searchResults}
                pagination={{ pageSize: 10, showSizeChanger: true }}
                size="middle"
                scroll={{ x: 800 }}
              />
            )}
          </Card>
        </Col>
      </Row>

      <Divider style={{ margin: "32px 0" }} />

      {/* Original Booking Form */}
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
                      onFinish={handleSubmit}
                      requiredMark="optional"
                      style={{ marginTop: 8 }}
                      disabled={submitting}
                    >
                      <Row gutter={16}>
                        <Col xs={24} md={12}>
                          <Form.Item
                            label="ชื่อ"
                            name="firstName"
                            rules={[
                              { required: true, message: "กรุณากรอกชื่อ" },
                            ]}
                          >
                            <Input
                              placeholder="ชื่อจริง"
                              prefix={<UserOutlined />}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item
                            label="นามสกุล"
                            name="lastName"
                            rules={[
                              { required: true, message: "กรุณากรอกนามสกุล" },
                            ]}
                          >
                            <Input
                              placeholder="นามสกุล"
                              prefix={<UserOutlined />}
                            />
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
                              {
                                pattern: /^0\d{8,9}$/,
                                message: "กรุณากรอกเบอร์โทรให้ถูกต้อง",
                              },
                            ]}
                          >
                            <Input
                              placeholder="08xxxxxxxx"
                              maxLength={10}
                              prefix={<PhoneOutlined />}
                            />
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
                            rules={[
                              { required: true, message: "กรุณาเลือกบริการ" },
                            ]}
                          >
                            <Select
                              placeholder="เลือกบริการ"
                              loading={loadingServices}
                              options={services.map((s: any) => ({
                                value: s.id,
                                label: s.name_service,   
                              }))}
                              notFoundContent={
                                loadingServices ? "กำลังโหลด..." : "ไม่พบบริการ"
                              }
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
                                message="ไม่มีคิว"
                              />
                            )}
                            <Spin spinning={loadingCapacity}>
                              <Radio.Group
                                onChange={(e) =>
                                  setSlot(e.target.value as TimeSlot)
                                }
                                value={slot}
                                style={{
                                  display: "flex",
                                  gap: 8,
                                  flexWrap: "wrap",
                                }}
                                disabled={!date}
                              >
                                <Radio.Button
                                  value="morning"
                                  disabled={capacity.morning <= 0}
                                >
                                  เช้า{" "}
                                  {capacity.morning <= 0
                                    ? "(เต็ม)"
                                    : `(${capacity.morning} คิว)`}
                                </Radio.Button>
                                <Radio.Button
                                  value="afternoon"
                                  disabled={capacity.afternoon <= 0}
                                >
                                  บ่าย{" "}
                                  {capacity.afternoon <= 0
                                    ? "(เต็ม)"
                                    : `(${capacity.afternoon} คิว)`}
                                </Radio.Button>
                                <Radio.Button
                                  value="evening"
                                  disabled={capacity.evening <= 0}
                                >
                                  เย็น{" "}
                                  {capacity.evening <= 0
                                    ? "(เต็ม)"
                                    : `(${capacity.evening} คิว)`}
                                </Radio.Button>
                              </Radio.Group>
                            </Spin>
                          </Form.Item>
                        </Col>
                      </Row>

                      <Space
                        size="middle"
                        style={{
                          width: "100%",
                          justifyContent: "flex-end",
                          marginTop: 8,
                        }}
                      >
                        <Button
                          onClick={() => {
                            form.resetFields();
                            setDate(null);
                            setSlot(undefined);
                            setCapacity({
                              morning: 0,
                              afternoon: 0,
                              evening: 0,
                            });
                          }}
                        >
                          ล้างข้อมูล
                        </Button>
                        <Button
                          type="primary"
                          htmlType="submit"
                          loading={submitting}
                          disabled={
                            !date || !slot || capacity[slot as TimeSlot] <= 0
                          }
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
                      background:
                        "linear-gradient(135deg,#FFFFFF 0%, #F0E9FF 100%)",
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
                        <Col span={14}>{summary.name}</Col>
                      </Row>
                      <Row style={{ marginBottom: 8 }}>
                        <Col span={10}>
                          <strong>เบอร์โทร</strong>
                        </Col>
                        <Col span={14}>{summary.phone}</Col>
                      </Row>
                      <Row style={{ marginBottom: 8 }}>
                        <Col span={10}>
                          <strong>บริการ</strong>
                        </Col>
                        <Col span={14}>{summary.service}</Col>
                      </Row>
                      <Row style={{ marginBottom: 8 }}>
                        <Col span={10}>
                          <strong>วันที่</strong>
                        </Col>
                        <Col span={14}>{summary.date}</Col>
                      </Row>
                      <Row>
                        <Col span={10}>
                          <strong>ช่วงเวลา</strong>
                        </Col>
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
