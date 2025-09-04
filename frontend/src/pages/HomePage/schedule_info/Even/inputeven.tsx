import React, { useState } from 'react';
import { Modal, Input, Form, Select, TimePicker, Button, Space } from 'antd';
import dayjs from 'dayjs';
import 'antd/dist/reset.css';

type EventData = {
  title: string;
  start: Date;
  end: Date;
};

type Props = {
  visible: boolean;
  onAdd: (event: EventData) => void;
  onCancel: () => void;
  selectedDate: Date | null;
};

const AddEventModal: React.FC<Props> = ({ visible, onAdd, onCancel, selectedDate }) => {
  const [title, setTitle] = useState('');
  const [timein, setTimein] = useState('');
  const [timeout, setTimeout] = useState('');

  const handleOk = () => {
  if (title && timein && timeout && selectedDate)  {
      const base = dayjs(selectedDate); // วันจาก calendar
    const start = base.hour(Number(timein.split(':')[0])).minute(Number(timein.split(':')[1])).second(0).toDate();
    const end = base.hour(Number(timeout.split(':')[0])).minute(Number(timeout.split(':')[1])).second(0).toDate();

    onAdd({ title, start, end });
    setTitle('');
    setTimein('');
    setTimeout('');
  }
};

  //option of room
  const rooms = ["x001", "x002", "x003", "004"];

  return (
    <Modal
      title="เพิ่มกิจกรรม"
      open={visible}
      footer={null}
      onCancel={() => {
        setTitle('');
        onCancel();
      }}
      width={420}
    >
      <Form layout="vertical" onFinish={handleOk}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <Form.Item label="เลือกห้อง">
            <Select
              value={title}
              onChange={(value) => setTitle(value)}
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
            />
          </Form.Item>

          <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
            <Space size="middle">
              <Button type="primary" htmlType="submit" style={{ width: 120 }}>
                เพิ่ม
              </Button>
              <Button style={{ width: 120 }} onClick={() => {
                setTitle('');
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
