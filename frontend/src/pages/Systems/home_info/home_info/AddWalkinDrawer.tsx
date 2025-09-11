import React from "react";
import { Drawer, Form, Input, Select, DatePicker, TimePicker, Button } from "antd";
import dayjs from "dayjs";
import { Person } from "./types";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (p: Person) => void;
  nextId: number;
};

const AddWalkinDrawer: React.FC<Props> = ({ open, onClose, onSubmit, nextId }) => {
  const [form] = Form.useForm();

  const handleFinish = (v: any) => {
    const p: Person = {
      id: nextId,
      firstName: v.name, lastName: v.surname, type: "วอล์คอิน",
      date: v.date.format("YYYY-MM-DD"),
      timeStart: v.time[0].format("HH:mm"), timeEnd: v.time[1].format("HH:mm"),
      service: v.service, doctor: v.doctor, room: v.room, status: "รอเช็คอิน",
    };
    onSubmit(p); form.resetFields(); onClose();
  };

  return (
    <Drawer title="เพิ่มวอล์คอิน" open={open} onClose={onClose} width={420} destroyOnClose>
      <Form
        form={form} layout="vertical" onFinish={handleFinish}
        initialValues={{
          date: dayjs(),
          time: [dayjs().hour(10).minute(0), dayjs().hour(10).minute(30)],
          service: "ขูดหินปูน", doctor: "นพ.กิตติ", room: "X001",
        }}
      >
        <Form.Item label="ชื่อ" name="name" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item label="นามสกุล" name="surname" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item label="บริการ" name="service" rules={[{ required: true }]}>
          <Select options={[{value:"ขูดหินปูน",label:"ขูดหินปูน"},{value:"อุดฟัน",label:"อุดฟัน"},{value:"ถอนฟัน",label:"ถอนฟัน"}]} />
        </Form.Item>
        <Form.Item label="แพทย์" name="doctor" rules={[{ required: true }]}>
          <Select options={[{value:"นพ.กิตติ",label:"นพ.กิตติ"},{value:"ทพญ.วริศรา",label:"ทพญ.วริศรา"}]} />
        </Form.Item>
        <Form.Item label="ห้อง" name="room" rules={[{ required: true }]}>
          <Select options={[{value:"X001",label:"X001"},{value:"X002",label:"X002"},{value:"X003",label:"X003"}]} />
        </Form.Item>
        <Form.Item label="วันที่" name="date" rules={[{ required: true }]}><DatePicker style={{ width:"100%" }} /></Form.Item>
        <Form.Item label="เวลา (เริ่ม–สิ้นสุด)" name="time" rules={[{ required: true }]}><TimePicker.RangePicker format="HH:mm" style={{ width:"100%" }} /></Form.Item>
        <Button type="primary" htmlType="submit" block>เพิ่มรายการ</Button>
      </Form>
    </Drawer>
  );
};

export default AddWalkinDrawer;
