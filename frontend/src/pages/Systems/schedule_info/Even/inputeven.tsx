import React, { useState } from 'react';
import { Modal, Input, Form, Select, TimePicker, Button, Space } from 'antd';
import dayjs from 'dayjs';
import 'antd/dist/reset.css';
// import { dentists } from './../../../First_pages/First_pages/OurDentistsPage/dentistsData';

type EventData = {
  room: string;
  start: Date;
  end: Date;
  dentist: string;
};



type Props = {
  visible: boolean;
  onAdd: (event: EventData) => void;
  onCancel: () => void;
  selectedDate: Date | null;
};

const AddEventModal: React.FC<Props> = ({ visible, onAdd, onCancel, selectedDate }) => {
  const [room, setRoom] = useState('');
  const [timein, setTimein] = useState('');
  const [timeout, setTimeout] = useState('');
  const [dentist, setDentist] = useState("สมชาย");

  const handleOk = () => {
    if (room && timein && timeout && selectedDate) {
      const base = dayjs(selectedDate); // วันจาก calendar
      const start = base.hour(Number(timein.split(':')[0])).minute(Number(timein.split(':')[1])).second(0).toDate();
      const end = base.hour(Number(timeout.split(':')[0])).minute(Number(timeout.split(':')[1])).second(0).toDate();

      onAdd({ room, start, end, dentist });
      setRoom('');
      setTimein('');
      setTimeout('');
      setDentist('');
    }
  };

  //option of room
  const rooms = ["B001", "B002", "B003", "B004"];

  // default timein  - timeout
  const defaultTimeIn = dayjs('09:00', 'HH:mm');
  const defaultTimeOut = dayjs('17:00', 'HH:MM');



  return (
    <Modal
      title="เพิ่มรายการ"
      open={visible}
      footer={null}
      onCancel={() => {
        setRoom('');
        onCancel();
      }}
      width={420}
    >
      <Form layout="vertical" onFinish={handleOk}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <Form.Item label="เลือกห้อง">
            <Select
              value={room}
              onChange={(value) => setRoom(value)}
              placeholder="เลือกห้อง"
              options={rooms.map((room) => ({
                value: room,
                label: room,
              }))}
            />
          </Form.Item>

          <Form.Item label="เวลาเข้างาน">
            <TimePicker
              value={timein ? dayjs(timein, 'HH:mm') : null}
              onChange={t => setTimein(t ? t.format('HH:mm') : '')}
              format="HH:mm"
              minuteStep={1}
              allowClear
              style={{ width: '100%' }}
              inputReadOnly
              defaultOpenValue={defaultTimeIn}
            />
          </Form.Item>

          <Form.Item label="เวลาออกงาน">
            <TimePicker
              value={timeout ? dayjs(timeout, 'HH:mm') : null}
              onChange={t => setTimeout(t ? t.format('HH:mm') : '')}
              format="HH:mm"
              minuteStep={1}
              allowClear
              style={{ width: '100%' }}
              inputReadOnly
              defaultOpenValue={defaultTimeOut}
            />
          </Form.Item>

          <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
            <Space size="middle">
              <Button type="primary" htmlType="submit" style={{ width: 120 }}>
                เพิ่ม
              </Button>
              <Button style={{ width: 120 }} onClick={() => {
                setRoom('');
                setTimein('');
                setTimeout('');
                onCancel();
              }}>
                ยกเลิก
              </Button>
            </Space>
          </Form.Item>

        </div>
      </Form>
    </Modal >
  );
};

export default AddEventModal;
