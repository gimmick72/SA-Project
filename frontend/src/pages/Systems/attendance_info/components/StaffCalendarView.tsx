import React, { useState, useMemo } from 'react';
import {
  Card,
  Button,
  Select,
  Space,
  Typography,
  Tag,
  Tooltip,
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  message
} from 'antd';
import {
  LeftOutlined,
  RightOutlined,
  PlusOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import './StaffCalendarView.css';

dayjs.extend(isBetween);

const { Title, Text } = Typography;
const { Option } = Select;

interface Schedule {
  id: string;
  staffId: string;
  staffName: string;
  position: string;
  date: string;
  startTime: string;
  endTime: string;
  scheduleType: 'regular' | 'overtime' | 'holiday' | 'shift_change';
  status: 'scheduled' | 'confirmed' | 'cancelled';
  notes?: string;
}

interface StaffMember {
  id: string;
  name: string;
  position: string;
  color: string;
}

interface CalendarViewProps {
  schedules: Schedule[];
  staffMembers: StaffMember[];
  onScheduleAdd?: (schedule: Omit<Schedule, 'id'>) => void;
  onScheduleEdit?: (schedule: Schedule) => void;
  onScheduleDelete?: (scheduleId: string) => void;
}

const StaffCalendarView: React.FC<CalendarViewProps> = ({
  schedules,
  staffMembers,
  onScheduleAdd,
  onScheduleEdit,
  onScheduleDelete
}) => {
  const [currentWeek, setCurrentWeek] = useState(dayjs().startOf('week'));
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [selectedStaff, setSelectedStaff] = useState<string>('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{
    date: string;
    time: string;
  } | null>(null);
  const [form] = Form.useForm();

  // Generate time slots (6 AM to 10 PM)
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 6; hour <= 22; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  }, []);

  // Generate week days
  const weekDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(currentWeek.add(i, 'day'));
    }
    return days;
  }, [currentWeek]);

  // Filter schedules by selected staff
  const filteredSchedules = useMemo(() => {
    if (selectedStaff === 'all') return schedules;
    return schedules.filter(schedule => schedule.staffId === selectedStaff);
  }, [schedules, selectedStaff]);

  // Get schedules for a specific date and time
  const getSchedulesForSlot = (date: string, time: string) => {
    return filteredSchedules.filter(schedule => {
      if (schedule.date !== date) return false;
      const scheduleStart = dayjs(`${date} ${schedule.startTime}`);
      const scheduleEnd = dayjs(`${date} ${schedule.endTime}`);
      const slotTime = dayjs(`${date} ${time}`);
      return slotTime.isBetween(scheduleStart, scheduleEnd, 'minute', '[)');
    });
  };

  // Get staff member by ID
  const getStaffMember = (staffId: string) => {
    return staffMembers.find(staff => staff.id === staffId);
  };

  // Handle time slot click
  const handleTimeSlotClick = (date: string, time: string) => {
    setSelectedTimeSlot({ date, time });
    setIsModalVisible(true);
    form.setFieldsValue({
      date: dayjs(date),
      startTime: dayjs(time, 'HH:mm')
    });
  };

  // Handle form submit
  const handleFormSubmit = (values: any) => {
    const newSchedule: Omit<Schedule, 'id'> = {
      staffId: values.staffId,
      staffName: staffMembers.find(s => s.id === values.staffId)?.name || '',
      position: staffMembers.find(s => s.id === values.staffId)?.position || '',
      date: values.date.format('YYYY-MM-DD'),
      startTime: values.startTime.format('HH:mm'),
      endTime: values.endTime.format('HH:mm'),
      scheduleType: values.scheduleType || 'regular',
      status: 'scheduled',
      notes: values.notes
    };

    onScheduleAdd?.(newSchedule);
    message.success('เพิ่มตารางงานสำเร็จ');
    setIsModalVisible(false);
    form.resetFields();
  };

  // Navigate week
  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(prev => 
      direction === 'prev' 
        ? prev.subtract(1, 'week')
        : prev.add(1, 'week')
    );
  };

  // Get position color
  const getPositionColor = (position: string) => {
    const colors: Record<string, string> = {
      'Dentist': '#1890ff',
      'Dental Assistant': '#52c41a',
      'Receptionist': '#faad14',
      'Maid': '#722ed1'
    };
    return colors[position] || '#666';
  };

  return (
    <div className="staff-calendar-view">
      {/* Calendar Header */}
      <Card className="calendar-header">
        <div className="calendar-controls">
          <div className="calendar-navigation">
            <Button 
              icon={<LeftOutlined />} 
              onClick={() => navigateWeek('prev')}
              size="small"
            />
            <Title level={4} className="calendar-title">
              {currentWeek.format('MMMM YYYY')} 
              <Text type="secondary" className="week-range">
                ({currentWeek.format('DD MMM')} - {currentWeek.add(6, 'day').format('DD MMM')})
              </Text>
            </Title>
            <Button 
              icon={<RightOutlined />} 
              onClick={() => navigateWeek('next')}
              size="small"
            />
          </div>

          <div className="calendar-filters">
            <Select
              placeholder="เลือกพนักงาน"
              style={{ width: 200 }}
              value={selectedStaff}
              onChange={setSelectedStaff}
            >
              <Option value="all">พนักงานทั้งหมด</Option>
              {staffMembers.map(staff => (
                <Option key={staff.id} value={staff.id}>
                  <Tag color={staff.color} style={{ marginRight: 8 }}>
                    {staff.position}
                  </Tag>
                  {staff.name}
                </Option>
              ))}
            </Select>

            <Select
              value={viewMode}
              onChange={setViewMode}
              style={{ width: 100 }}
            >
              <Option value="week">สัปดาห์</Option>
              <Option value="day">วัน</Option>
            </Select>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalVisible(true)}
            >
              เพิ่มตาราง
            </Button>
          </div>
        </div>
      </Card>

      {/* Calendar Grid */}
      <Card className="calendar-grid">
        <div className="calendar-container">
          {/* Header Row - Days */}
          <div className="calendar-header-row">
            <div className="time-column-header">เวลา</div>
            {weekDays.map(day => (
              <div key={day.format('YYYY-MM-DD')} className="day-header">
                <div className="day-name">{day.format('ddd')}</div>
                <div className="day-date">{day.format('DD')}</div>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          <div className="calendar-body">
            {timeSlots.map(time => (
              <div key={time} className="time-row">
                <div className="time-label">{time}</div>
                {weekDays.map(day => {
                  const dateStr = day.format('YYYY-MM-DD');
                  const schedulesInSlot = getSchedulesForSlot(dateStr, time);
                  
                  return (
                    <div
                      key={`${dateStr}-${time}`}
                      className="time-slot"
                      onClick={() => handleTimeSlotClick(dateStr, time)}
                    >
                      {schedulesInSlot.map(schedule => {
                        const staff = getStaffMember(schedule.staffId);
                        return (
                          <Tooltip
                            key={schedule.id}
                            title={
                              <div>
                                <div><strong>{schedule.staffName}</strong></div>
                                <div>{schedule.startTime} - {schedule.endTime}</div>
                                <div>{schedule.notes}</div>
                              </div>
                            }
                          >
                            <div
                              className={`schedule-item ${schedule.status}`}
                              style={{
                                backgroundColor: getPositionColor(schedule.position),
                                borderLeft: `4px solid ${staff?.color || '#666'}`
                              }}
                            >
                              <div className="schedule-title">{schedule.staffName}</div>
                              <div className="schedule-time">
                                {schedule.startTime} - {schedule.endTime}
                              </div>
                            </div>
                          </Tooltip>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Add Schedule Modal */}
      <Modal
        title="เพิ่มตารางงาน"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
        >
          <Form.Item
            name="staffId"
            label="พนักงาน"
            rules={[{ required: true, message: 'กรุณาเลือกพนักงาน' }]}
          >
            <Select placeholder="เลือกพนักงาน">
              {staffMembers.map(staff => (
                <Option key={staff.id} value={staff.id}>
                  <Tag color={staff.color} style={{ marginRight: 8 }}>
                    {staff.position}
                  </Tag>
                  {staff.name}
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

          <Space.Compact style={{ width: '100%' }}>
            <Form.Item
              name="startTime"
              label="เวลาเริ่ม"
              rules={[{ required: true, message: 'กรุณาเลือกเวลาเริ่ม' }]}
              style={{ width: '50%' }}
            >
              <TimePicker format="HH:mm" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="endTime"
              label="เวลาสิ้นสุด"
              rules={[{ required: true, message: 'กรุณาเลือกเวลาสิ้นสุด' }]}
              style={{ width: '50%' }}
            >
              <TimePicker format="HH:mm" style={{ width: '100%' }} />
            </Form.Item>
          </Space.Compact>

          <Form.Item
            name="scheduleType"
            label="ประเภทตาราง"
          >
            <Select placeholder="เลือกประเภท">
              <Option value="regular">ปกติ</Option>
              <Option value="overtime">ล่วงเวลา</Option>
              <Option value="holiday">วันหยุด</Option>
              <Option value="shift_change">เปลี่ยนกะ</Option>
            </Select>
          </Form.Item>

          <Form.Item name="notes" label="หมายเหตุ">
            <Input.TextArea rows={3} placeholder="หมายเหตุเพิ่มเติม" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                บันทึก
              </Button>
              <Button onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
              }}>
                ยกเลิก
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StaffCalendarView;
