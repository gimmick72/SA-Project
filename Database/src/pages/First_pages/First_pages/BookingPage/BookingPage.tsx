import React, { useEffect, useMemo, useState } from "react";
import {Layout,Card,Row,Col,Form,Input,DatePicker,Radio,Button,Space,message,theme,Alert,Select,Spin,} from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { CalendarOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";
import SiteHeader from "./siteHeader";
import {TimeSlot,IServiceItem,ICapacitySummary,ICreateBookingPayload,createBooking,getCapacityByDate,getService} from "../../../../services/booking/bookingApi";
import { CapacitySummary,ServiceItem,Slottime,UpdateSlot,QueueSlot,CreateBooking,SummaryBooking } from "../../../../interface/bookingQueue";
dayjs.locale("th");
const { Content } = Layout;

const timeSlotLabel: Record<TimeSlot, string> = {
  morning: "ช่วงเช้า (09:00–12:00)",
  afternoon: "ช่วงบ่าย (13:00–17:00)",
  evening: "ช่วงเย็น (18:00–20:00)",
};

const BookingPage: React.FC = () => {
  const [form] = Form.useForm();
  const [slot, setSlot] = useState<TimeSlot | undefined>(undefined);
  const [date, setDate] = useState<Dayjs | null>(null);
  const [services, setServices] = useState<IServiceItem[]>([]);
  const [loadingCapacity, setLoadingCapacity] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  

  // watch สำหรับ summary ตอนจองแบบ real-time
  const firstName = Form.useWatch("firstName", form);
  const lastName = Form.useWatch("lastName", form);
  const phone = Form.useWatch("phone", form);
  const serviceId = Form.useWatch("serviceId", form);

  //เก็บจำนวนคิวที่เหลือ
  const [capacity, setCapacity] = useState<CapacitySummary>({
    morning: 0,
    afternoon: 0,
    evening: 0,
  });
  
  //เอาไว้ lock วัน เพื่อกำหนดว่า “วันไหนเลือกไม่ได้”
  const disabledDate = (current: Dayjs) =>
    current.startOf("day").isBefore(dayjs().startOf("day"));

  const fetchService = async () =>{
    try {
      setLoadingServices(true);
      const response = await getService();
      setServices(response);
    } catch (e) {
      message.error("ไม่มีบริการนี้");
      setServices([]);
    } finally {
      setLoadingServices(false);
    }
  }

  useEffect(() => {
    fetchService();
  }, []);

  //useEffect ที่ทำงานทุกครั้งเมื่อค่า date เปลี่ยน
  //เอาไว้บอกว่าแต่ละวันมีคิวเท่าไร
  useEffect(() => {
    (async () => {
      if (!date) {
        //set 0 คิวตลอดถ้ายังไม่ define
        setCapacity({ morning: 0, afternoon: 0, evening: 0 });
        setSlot(undefined);
        return;
      }
      setLoadingCapacity(true);
      try {
        const capacity = await getCapacityByDate(date);
        setCapacity(capacity);
        //ตรวจสอบว่าว่างอยู่หรือไม่
        setSlot(undefined)
        if (slot && capacity[slot] <= 0) setSlot(undefined);
      } catch {
        message.error("ไม่สามารถโหลดจำนวนคิวคงเหลือได้");
        setCapacity({ morning: 0, afternoon: 0, evening: 0 });
        setSlot(undefined);
      } finally {
        setLoadingCapacity(false);
      }
    })();
  }, [date]);

  //เอาไว้สรุปข้อมูลการจอง
  const summary = useMemo(
    () => ({
      name: firstName && lastName ? `${firstName} ${lastName}` : "—",
      phone: phone || "—",
      service: fetchService?.name ?? "—",
      date: date ? date.format("DD MMMM YYYY") : "—",
      slot: slot ? timeSlotLabel[slot] : "—",
    }),
    [firstName, lastName, phone, fetchService, date, slot]
  );

  //เอาไว้ตรวจสอบว่าเต็มหรือยัง
  const allFull = Math.max(...Object.values(capacity)) <= 0;


  const handleSubmit = async (values: any) => {
    if (!date || !slot) {
      message.error("กรุณาเลือกวันและช่วงเวลาที่ต้องการจอง");
      return;
    }
    if (capacity[slot] <= 0) {
      message.error("ช่วงเวลาที่เลือกคิวเต็มแล้ว กรุณาเลือกช่วงเวลาอื่น");
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
      date: values.date,
      timeSlot: slot,
    };

    try {
      setSubmitting(true);
      await createBooking(payload); //post

      const fresh = await getCapacityByDate(date); //get
      setCapacity(fresh);

      message.success("จองคิวสำเร็จ! ");
      form.resetFields();
      // setTimeout(() => {
      //   navigate("/my-booking");
      // }, 2500);
      setSlot(undefined);
    } catch (error) {
      message.error("จองคิวไม่สำเร็จ");
    } finally {
      setSubmitting(false);
    }
  };

  // function setSearchTerm(value: string): void {
  //   throw new Error("Function not implemented.");
  // }

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
                            <Spin spinning={loadingCapacity}>
                              <Radio.Group
                                onChange={(e) => setSlot(e.target.value)}
                                value={slot}
                                style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
                                disabled={!date}
                              >
                                <Radio.Button value="morning" disabled={capacity.morning <= 0}>
                                  เช้า {capacity.morning <= 0 ? "(เต็ม)" : `(${capacity.morning} คิว)`}
                                </Radio.Button>
                                <Radio.Button value="afternoon" disabled={capacity.afternoon <= 0}>
                                  บ่าย {capacity.afternoon <= 0 ? "(เต็ม)" : `(${capacity.afternoon} คิว)`}
                                </Radio.Button>
                                <Radio.Button value="evening" disabled={capacity.evening <= 0}>
                                  เย็น {capacity.evening <= 0 ? "(เต็ม)" : `(${capacity.evening} คิว)`}
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
                            setCapacity({ morning: 0, afternoon: 0, evening: 0 });
                          }}
                        >
                          ล้างข้อมูล
                        </Button>
                        <Button
                          type="primary"
                          htmlType="submit"
                          loading={submitting}
                          disabled={!date || !slot || capacity[slot as TimeSlot] <= 0}
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
                        <Col span={14}>{fetchService?.name ?? "—"}</Col>
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
