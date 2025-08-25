import React, { useState } from 'react';
import { Modal, Input, Form, Select } from 'antd';

type EventData = {
  title: string;
  start: Date;
  end: Date;
};

type Props = {
  visible: boolean;
  onAdd: (event: EventData) => void;
  onCancel: () => void;
};

const AddEventModal: React.FC<Props> = ({ visible, onAdd, onCancel }) => {
  const [title, setTitle] = useState('');
  const [timein, setTimein] = useState('');
  const [timeout, setTimeout] = useState('');

  const handleOk = () => {
    if (title && timein && timeout) {
      const today = new Date();
      const start = new Date(today.toDateString() + ' ' + timein);
      const end = new Date(today.toDateString() + ' ' + timeout);
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
      onOk={handleOk}
      onCancel={() => {
        setTitle('');
        onCancel();
      }}
      okText="เพิ่ม"
      cancelText="ยกเลิก"
    >
      <Form layout="vertical">
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
            <Input
              type='time'
              value={timein}
              onChange={(e) => setTimein(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="เวลาออกงาน">
            <Input
              type='time'
              value={timeout}
              onChange={(e) => setTimeout(e.target.value)}

            />
          </Form.Item>
        </div>
      </Form>
    </Modal >
  );
};

export default AddEventModal;
