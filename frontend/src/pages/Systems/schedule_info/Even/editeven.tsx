import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, TimePicker, Button, Space, message } from 'antd';
import dayjs from 'dayjs';
import type { Event as RBCEvent } from 'react-big-calendar';
import 'antd/dist/reset.css';

type Props = {
    event: RBCEvent | null;
    visible: boolean;
    onSave: (eventData: { room: string; start: Date; end: Date }) => void;
    onCancel: () => void;
};

const EditEventModal: React.FC<Props> = ({ event, visible, onSave, onCancel }) => {
    const [room, setRoom] = useState('');
    const [timein, setTimein] = useState('');
    const [timeout, setTimeout] = useState('');


    useEffect(() => {
        if (event) {
            setRoom(String(event.title ?? ''));
            setTimein(event.start ? dayjs(event.start).format('HH:mm') : '');
            setTimeout(event.end ? dayjs(event.end).format('HH:mm') : '');
        }
    }, [event]);

    const handleOk = () => {
        if (room && timein && timeout) {
            const today = event?.start ? dayjs(event.start) : dayjs();

            const [startHour, startMinute] = timein.split(':').map(Number);
            const [endHour, endMinute] = timeout.split(':').map(Number);

            const start = today.hour(startHour).minute(startMinute).second(0).toDate();
            const end = today.hour(endHour).minute(endMinute).second(0).toDate();

            if (start >= end) {
                message.error('เวลาเริ่มต้นต้องน้อยกว่าเวลาสิ้นสุด');
                return;
            }

            onSave({ room, start, end });
            resetForm();
        } else {
            message.error('กรุณากรอกข้อมูลให้ครบถ้วน');
        }
    };

    const resetForm = () => {
        setRoom('');
        setTimein('');
        setTimeout('');
    };

    const rooms = ["B001", "B002", "B003", "B004"];

    return (
        <Modal
            title="แก้ไขกิจกรรม"
            open={visible}
            footer={null}
            onCancel={() => {
                resetForm();
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
                            placeholder="เลือกเวลา"
                            minuteStep={5}
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
                            placeholder="เลือกเวลา"
                            minuteStep={5}
                            allowClear
                            style={{ width: '100%' }}
                            inputReadOnly
                        />
                    </Form.Item>

                    <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
                        <Space size="middle">
                            <Button type="primary" htmlType="submit" style={{ width: 120 }}>
                                บันทึก
                            </Button>
                            <Button style={{ width: 120 }} onClick={() => {
                                resetForm();
                                onCancel();
                            }}>
                                ยกเลิก
                            </Button>
                        </Space>
                    </Form.Item>

                </div>
            </Form>
        </Modal>
    );
};

export default EditEventModal;
