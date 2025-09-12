import React, { useState, useEffect } from 'react';
import { Typography, message } from 'antd';
import {
  CalendarOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import StaffCalendarView from './components/StaffCalendarView';
import { attendanceAPI } from '../../../services/api';
import { staffAPI } from '../../../services/staffApi';
import './StaffWorkTimeManagement.css';

const { Title } = Typography;

interface Schedule {
  id: string;
  staffId: string;
  staffName: string;
  position: string;
  date: string;
  startTime: string;
  endTime: string;
  scheduleType: 'regular' | 'overtime' | 'holiday';
  status: 'scheduled' | 'confirmed' | 'cancelled';
}

interface StaffMember {
  id: string;
  name: string;
  position: string;
  color: string;
}

const StaffWorkTimeManagement: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(false);

  // Load data from backend
  const loadData = async () => {
    setLoading(true);
    try {
      // Load attendance data first to get staff info
      const attendanceResponse = await attendanceAPI.getAttendances({ page: 1, page_size: 100 });
      
      console.log('Attendance Response:', attendanceResponse);
      
      // Process staff data with null checks
      const positionColors: { [key: string]: string } = {
        'ทันตแพทย์': '#1890ff',
        'Dentist': '#1890ff',
        'ผู้ช่วย': '#52c41a', 
        'Assistant': '#52c41a',
        'เจ้าหน้าที่แผนกต้อนรับ': '#faad14',
        'Receptionist': '#faad14',
        'พนักงานทำความสะอาด': '#722ed1',
        'Cleaner': '#722ed1',
        'default': '#666666'
      };
      
      // Extract unique staff members from attendance records
      const uniqueStaff = new Map();
      const attendanceArray = attendanceResponse?.data || [];
      
      attendanceArray.forEach((attendance: any) => {
        if (attendance.staff && !uniqueStaff.has(attendance.staff.id)) {
          const staffName = `${attendance.staff.first_name || ''} ${attendance.staff.last_name || ''}`.trim();
          const position = attendance.staff.position_info?.name || attendance.staff.position || 'Staff';
          
          uniqueStaff.set(attendance.staff.id, {
            id: attendance.staff.id.toString(),
            name: staffName || `Staff ${attendance.staff.id}`,
            position: position,
            color: positionColors[position] || positionColors.default
          });
        }
      });
      
      const staffData: StaffMember[] = Array.from(uniqueStaff.values());
      
      // Convert attendance to schedule format with proper date handling
      const scheduleData: Schedule[] = attendanceArray
        .filter((attendance: any) => attendance.staff && attendance.date)
        .map((attendance: any) => {
          const staffMember = staffData.find(s => s.id === attendance.staff.id.toString());
          
          // Parse notes to extract time if available
          let startTime = '08:00';
          let endTime = '17:00';
          
          if (attendance.notes && attendance.notes.includes('Schedule:')) {
            const timeMatch = attendance.notes.match(/Schedule:\s*(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
            if (timeMatch) {
              startTime = timeMatch[1];
              endTime = timeMatch[2];
            }
          }
          
          return {
            id: attendance.id.toString(),
            staffId: attendance.staff.id.toString(),
            staffName: staffMember?.name || `Staff ${attendance.staff.id}`,
            position: staffMember?.position || 'Staff',
            date: attendance.date,
            startTime: attendance.check_in_time || startTime,
            endTime: attendance.check_out_time || endTime,
            scheduleType: 'regular' as const,
            status: attendance.status === 'present' ? 'confirmed' as const : 'scheduled' as const
          };
        });
      
      console.log('Processed Staff Data:', staffData);
      console.log('Processed Schedule Data:', scheduleData);
      
      setStaffMembers(staffData);
      setSchedules(scheduleData);
    } catch (error) {
      console.error('Error loading data:', error);
      message.error('ไม่สามารถโหลดข้อมูลได้');
      
      // Create mock data for demonstration if API fails
      const mockStaff: StaffMember[] = [
        { id: '1', name: 'ดร.สมชาย ใจดี', position: 'ทันตแพทย์', color: '#1890ff' },
        { id: '2', name: 'พยาบาล สุดา สวยงาม', position: 'ผู้ช่วย', color: '#52c41a' },
        { id: '3', name: 'นางสาว มาลี จริงใจ', position: 'เจ้าหน้าที่แผนกต้อนรับ', color: '#faad14' }
      ];
      
      const mockSchedules: Schedule[] = [
        {
          id: '1',
          staffId: '1',
          staffName: 'ดร.สมชาย ใจดี',
          position: 'ทันตแพทย์',
          date: dayjs().format('YYYY-MM-DD'),
          startTime: '09:00',
          endTime: '17:00',
          scheduleType: 'regular',
          status: 'confirmed'
        },
        {
          id: '2',
          staffId: '2',
          staffName: 'พยาบาล สุดา สวยงาม',
          position: 'ผู้ช่วย',
          date: dayjs().format('YYYY-MM-DD'),
          startTime: '08:00',
          endTime: '16:00',
          scheduleType: 'regular',
          status: 'scheduled'
        }
      ];
      
      setStaffMembers(mockStaff);
      setSchedules(mockSchedules);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleScheduleAdd = async (schedule: any) => {
    try {
      // Create attendance record for the schedule
      const attendanceData = {
        staff_id: parseInt(schedule.staffId),
        date: schedule.date,
        status: 'scheduled',
        notes: schedule.notes || `Schedule: ${schedule.startTime} - ${schedule.endTime}`,
        location: 'Main Clinic'
      };

      console.log('Creating attendance with data:', attendanceData);
      await attendanceAPI.createAttendance(attendanceData);
      message.success('เพิ่มตารางงานสำเร็จ');
      await loadData(); // Reload data
    } catch (error: any) {
      console.error('Error adding schedule:', error);
      console.error('Error details:', error.response?.data);
      message.error('ไม่สามารถเพิ่มตารางงานได้');
    }
  };

  const handleScheduleEdit = async (schedule: any) => {
    try {
      const attendanceData = {
        staff_id: parseInt(schedule.staffId),
        date: schedule.date,
        status: schedule.status || 'scheduled',
        notes: schedule.notes || `Schedule: ${schedule.startTime} - ${schedule.endTime}`,
        location: 'Main Clinic'
      };

      await attendanceAPI.updateAttendance(parseInt(schedule.id), attendanceData);
      message.success('แก้ไขตารางงานสำเร็จ');
      await loadData(); // Reload data
    } catch (error: any) {
      console.error('Error editing schedule:', error);
      console.error('Error details:', error.response?.data);
      message.error('ไม่สามารถแก้ไขตารางงานได้');
    }
  };

  const handleScheduleDelete = async (scheduleId: string) => {
    try {
      await attendanceAPI.deleteAttendance(parseInt(scheduleId));
      message.success('ลบตารางงานสำเร็จ');
      await loadData(); // Reload data
    } catch (error: any) {
      console.error('Error deleting schedule:', error);
      console.error('Error details:', error.response?.data);
      message.error('ไม่สามารถลบตารางงานได้');
    }
  };

  return (
    <div className="attendance-container">
      <div className="page-header">
        <Title level={2}>
          <CalendarOutlined /> การจัดการเวลาทำงานบุคลากร
        </Title>
      </div>

      <StaffCalendarView 
        schedules={schedules}
        staffMembers={staffMembers}
        onScheduleAdd={handleScheduleAdd}
        onScheduleEdit={handleScheduleEdit}
        onScheduleDelete={handleScheduleDelete}
      />
    </div>
  );
};

export default StaffWorkTimeManagement;
