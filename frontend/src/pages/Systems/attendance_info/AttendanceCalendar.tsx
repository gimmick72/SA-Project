import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Space, message, Modal, Form, Select, DatePicker, TimePicker, Input, Badge, Tooltip } from 'antd';
import { PlusOutlined, ReloadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { workScheduleAPI, staffAttendanceAPI } from '../../../services/api';
import { ensureAuthentication } from '../../../utils/auth';
import dayjs from 'dayjs';
import './AttendanceCalendar.css';

const { Title } = Typography;
const { Option } = Select;

interface WorkSchedule {
  id: number;
  staff_id: number;
  date: string;
  start_time: string;
  end_time: string;
  shift_type: string;
  notes?: string;
  staff?: {
    first_name: string;
    last_name: string;
  };
}

interface StaffMember {
  ID: number;
  PersonalData: {
    ID: number;
    FirstName: string;
    LastName: string;
    Title: string;
    Email: string;
  };
  Position: string;
  EmpType: string;
}

interface CalendarEvent {
  id: number;
  title: string;
  start: string;
  end: string;
  date: string;
  staff_id: number;
  shift_type: string;
  notes?: string;
  color: string;
}

const AttendanceCalendar: React.FC = () => {
  const [scheduleData, setScheduleData] = useState<WorkSchedule[]>([]);
  const [staffData, setStaffData] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<WorkSchedule | null>(null);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [form] = Form.useForm();

  // Time slots for calendar (8 AM to 8 PM)
  const timeSlots = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 8;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  // Days of the week
  const weekDays = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

  const loadData = async () => {
    setLoading(true);
    let scheduleResponse: any = null;
    let staffResponse: any = null;
    
    try {
      const isAuth = await ensureAuthentication();
      if (!isAuth) {
        message.error('Authentication failed');
        return;
      }

      [scheduleResponse, staffResponse] = await Promise.all([
        workScheduleAPI.getWorkSchedules(),
        staffAttendanceAPI.getStaffList()
      ]);

      if (scheduleResponse?.data) {
        setScheduleData(scheduleResponse.data);
      }

      if (staffResponse && Array.isArray(staffResponse)) {
        setStaffData(staffResponse);
      }

    } catch (error) {
      console.error('Failed to load data:', error);
      message.error('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getWeekDates = (date: dayjs.Dayjs) => {
    const startOfWeek = date.startOf('week');
    return Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, 'day'));
  };

  const getStaffName = (staffId: number) => {
    const staff = staffData.find(s => s.PersonalData.ID === staffId);
    if (staff?.PersonalData) {
      return `${staff.PersonalData.Title} ${staff.PersonalData.FirstName} ${staff.PersonalData.LastName}`;
    }
    return `พนักงาน ID: ${staffId}`;
  };

  const getShiftColor = (shiftType: string) => {
    switch (shiftType) {
      case 'morning': return '#52c41a';
      case 'afternoon': return '#1890ff';
      case 'evening': return '#fa8c16';
      case 'night': return '#722ed1';
      case 'full_day': return '#eb2f96';
      default: return '#666666';
    }
  };

  const getSchedulesForDate = (date: dayjs.Dayjs) => {
    const dateStr = date.format('YYYY-MM-DD');
    return scheduleData.filter(schedule => schedule.date === dateStr);
  };

  const isTimeInRange = (timeSlot: string, startTime: string, endTime: string) => {
    const slot = dayjs(timeSlot, 'HH:mm');
    const start = dayjs(startTime, 'HH:mm');
    const end = dayjs(endTime, 'HH:mm');
    return (slot.isAfter(start) || slot.isSame(start)) && slot.isBefore(end);
  };

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    form.setFieldsValue({
      date: currentDate,
      start_time: dayjs('08:00', 'HH:mm'),
      end_time: dayjs('17:00', 'HH:mm'),
      shift_type: 'morning'
    });
    setIsModalVisible(true);
  };

  const handleEdit = (record: WorkSchedule) => {
    setEditingRecord(record);
    form.setFieldsValue({
      staff_id: record.staff_id,
      date: dayjs(record.date),
      start_time: dayjs(record.start_time, 'HH:mm'),
      end_time: dayjs(record.end_time, 'HH:mm'),
      shift_type: record.shift_type,
      notes: record.notes
    });
    setIsModalVisible(true);
  };

  const handleDelete = (record: WorkSchedule) => {
    Modal.confirm({
      title: 'ยืนยันการลบ',
      content: 'คุณต้องการลบตารางงานนี้หรือไม่?',
      okText: 'ลบ',
      cancelText: 'ยกเลิก',
      onOk: async () => {
        try {
          await workScheduleAPI.deleteWorkSchedule(record.id);
          message.success('ลบตารางงานสำเร็จ');
          loadData();
        } catch (error) {
          message.error('ไม่สามารถลบตารางงานได้');
        }
      }
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      const scheduleData = {
        staff_id: values.staff_id,
        date: values.date.format('YYYY-MM-DD'),
        start_time: values.start_time.format('HH:mm'),
        end_time: values.end_time.format('HH:mm'),
        shift_type: values.shift_type,
        notes: values.notes || ''
      };

      if (editingRecord) {
        await workScheduleAPI.updateWorkSchedule(editingRecord.id, scheduleData);
        message.success('อัปเดตตารางงานสำเร็จ');
      } else {
        await workScheduleAPI.createWorkSchedule(scheduleData);
        message.success('เพิ่มตารางงานสำเร็จ');
      }

      setIsModalVisible(false);
      loadData();
    } catch (error) {
      message.error('ไม่สามารถบันทึกตารางงานได้');
    }
  };

  const weekDates = getWeekDates(currentDate);

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ 
          marginBottom: '20px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <Title level={3} style={{ margin: 0 }}>
            ปкалендарตารางงาน - {currentDate.format('MMMM YYYY')}
          </Title>
          <Space>
            <Button
              onClick={() => setCurrentDate(currentDate.subtract(1, 'week'))}
            >
              สัปดาห์ก่อน
            </Button>
            <Button
              onClick={() => setCurrentDate(dayjs())}
            >
              วันนี้
            </Button>
            <Button
              onClick={() => setCurrentDate(currentDate.add(1, 'week'))}
            >
              สัปดาห์หน้า
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={loadData}
              loading={loading}
            >
              รีเฟรช
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              เพิ่มตารางงาน
            </Button>
          </Space>
        </div>

        <div className="calendar-container">
          {/* Calendar Header */}
          <div className="calendar-header">
            <div className="time-column-header">เวลา</div>
            {weekDates.map((date, index) => (
              <div key={index} className="day-header">
                <div className="day-name">{weekDays[date.day()]}</div>
                <div className="day-date">{date.format('DD/MM')}</div>
              </div>
            ))}
          </div>

          {/* Calendar Body */}
          <div className="calendar-body">
            {timeSlots.map((timeSlot, timeIndex) => (
              <div key={timeIndex} className="time-row">
                <div className="time-slot">{timeSlot}</div>
                {weekDates.map((date, dayIndex) => {
                  const daySchedules = getSchedulesForDate(date);
                  const cellSchedules = daySchedules.filter(schedule =>
                    isTimeInRange(timeSlot, schedule.start_time, schedule.end_time)
                  );

                  return (
                    <div key={dayIndex} className="calendar-cell">
                      {cellSchedules.map((schedule, scheduleIndex) => (
                        <Tooltip
                          key={scheduleIndex}
                          title={
                            <div>
                              <div><strong>{getStaffName(schedule.staff_id)}</strong></div>
                              <div>{schedule.start_time} - {schedule.end_time}</div>
                              {schedule.notes && <div>หมายเหตุ: {schedule.notes}</div>}
                            </div>
                          }
                        >
                          <div
                            className="schedule-event"
                            style={{
                              backgroundColor: getShiftColor(schedule.shift_type),
                              height: `${(dayjs(schedule.end_time, 'HH:mm').diff(dayjs(schedule.start_time, 'HH:mm'), 'hour', true) * 60)}px`,
                              minHeight: '30px'
                            }}
                            onClick={() => handleEdit(schedule)}
                          >
                            <div className="event-title">
                              {getStaffName(schedule.staff_id)}
                            </div>
                            <div className="event-time">
                              {schedule.start_time}-{schedule.end_time}
                            </div>
                            <div className="event-actions">
                              <Button
                                size="small"
                                type="text"
                                icon={<EditOutlined />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(schedule);
                                }}
                              />
                              <Button
                                size="small"
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(schedule);
                                }}
                              />
                            </div>
                          </div>
                        </Tooltip>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div style={{ marginTop: '20px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Badge color="#52c41a" />
            <span>กะเช้า</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Badge color="#1890ff" />
            <span>กะบ่าย</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Badge color="#fa8c16" />
            <span>กะเย็น</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Badge color="#722ed1" />
            <span>กะกลางคืน</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Badge color="#eb2f96" />
            <span>เต็มวัน</span>
          </div>
        </div>
      </Card>

      <Modal
        title={editingRecord ? 'แก้ไขตารางงาน' : 'เพิ่มตารางงาน'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="staff_id"
            label="พนักงาน"
            rules={[{ required: true, message: 'กรุณาเลือกพนักงาน' }]}
          >
            <Select placeholder="เลือกพนักงาน" showSearch>
              {staffData.map(staff => (
                <Option key={staff.PersonalData.ID} value={staff.PersonalData.ID}>
                  {`${staff.PersonalData.Title} ${staff.PersonalData.FirstName} ${staff.PersonalData.LastName}`}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="date"
            label="วันที่"
            rules={[{ required: true, message: 'กรุณาเลือกวันที่' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="start_time"
              label="เวลาเริ่มงาน"
              rules={[{ required: true, message: 'กรุณาเลือกเวลาเริ่มงาน' }]}
              style={{ flex: 1 }}
            >
              <TimePicker 
                style={{ width: '100%' }} 
                format="HH:mm"
                placeholder="เลือกเวลาเริ่มงาน"
              />
            </Form.Item>
            <Form.Item
              name="end_time"
              label="เวลาเลิกงาน"
              rules={[{ required: true, message: 'กรุณาเลือกเวลาเลิกงาน' }]}
              style={{ flex: 1 }}
            >
              <TimePicker 
                style={{ width: '100%' }} 
                format="HH:mm"
                placeholder="เลือกเวลาเลิกงาน"
              />
            </Form.Item>
          </div>

          <Form.Item
            name="shift_type"
            label="กะการทำงาน"
            rules={[{ required: true, message: 'กรุณาเลือกกะการทำงาน' }]}
          >
            <Select>
              <Option value="morning">เช้า</Option>
              <Option value="afternoon">บ่าย</Option>
              <Option value="evening">เย็น</Option>
              <Option value="night">กลางคืน</Option>
              <Option value="full_day">เต็มวัน</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="notes"
            label="หมายเหตุ"
          >
            <Input.TextArea rows={2} placeholder="หมายเหตุ (ถ้ามี)" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>
                ยกเลิก
              </Button>
              <Button type="primary" htmlType="submit">
                {editingRecord ? 'อัปเดต' : 'เพิ่ม'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AttendanceCalendar;
