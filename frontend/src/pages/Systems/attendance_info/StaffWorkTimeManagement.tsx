import React, { useState, useEffect } from 'react';
import { Typography, message } from 'antd';
import {
  CalendarOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import StaffCalendarView from './components/StaffCalendarView';
import { attendanceAPI } from '../../../services/api';
import { staffAPI } from '../../../services/staffApi';
import { ensureAuthentication } from '../../../utils/auth';
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
      // Check authentication first
      const token = localStorage.getItem('token');
      console.log('Token check:', token ? 'Token exists' : 'No token found');
      
      // Always try to ensure authentication
      const isAuth = await ensureAuthentication();
      console.log('Authentication status:', isAuth);
      
      if (!isAuth) {
        console.warn('Authentication failed, using mock data');
        // Set mock data for demo
        setStaffMembers([
          { id: '1', name: 'ดร.สมชาย ใจดี', position: 'ทันตแพทย์', color: '#1890ff' },
          { id: '2', name: 'พยาบาล สุดา สวยงาม', position: 'ผู้ช่วย', color: '#52c41a' }
        ]);
        setSchedules([
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
          }
        ]);
        setLoading(false);
        return;
      }

      // Load both attendance and staff data - prioritize Staff API
      console.log('Making API calls to get attendances and staff...');
      
      // First try to get staff data directly
      let staffResponse;
      try {
        staffResponse = await staffAPI.getStaff({ page: 1, page_size: 100 });
        console.log('Raw Staff API Response:', staffResponse);
      } catch (error) {
        console.error('Staff API failed:', error);
        staffResponse = { data: [] };
      }
      
      // Then get attendance data
      let attendanceResponse;
      try {
        attendanceResponse = await attendanceAPI.getAttendances({ page: 1, page_size: 100 });
      } catch (error) {
        console.warn('Attendance API failed:', error);
        attendanceResponse = { data: [] };
      }
      
      console.log('Attendance Response:', attendanceResponse);
      console.log('Staff Response:', staffResponse);
      console.log('Attendance Array Length:', attendanceResponse?.data?.length || 0);
      console.log('Staff Array Length:', staffResponse?.data?.length || 0);
      
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
      
      // Combine staff data from both sources
      const uniqueStaff = new Map();
      const attendanceArray = attendanceResponse?.data || [];
      const staffArray = staffResponse?.data || [];
      
      // First, add staff from the staff API
      staffArray.forEach((staff: any) => {
        const staffName = `${staff.first_name || ''} ${staff.last_name || ''}`.trim();
        const position = staff.position || 'Staff';
        
        uniqueStaff.set(staff.id, {
          id: staff.id.toString(),
          name: staffName || `Staff ${staff.id}`,
          position: position,
          color: positionColors[position] || positionColors.default
        });
      });
      
      // Then, add any additional staff from attendance records
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
        } else if (attendance.staff_id && !uniqueStaff.has(attendance.staff_id)) {
          // Handle case where staff_id exists but no staff object
          uniqueStaff.set(attendance.staff_id, {
            id: attendance.staff_id.toString(),
            name: `Staff ${attendance.staff_id}`,
            position: 'Staff',
            color: positionColors.default
          });
        }
      });
      
      const staffData: StaffMember[] = Array.from(uniqueStaff.values());
      
      // Convert attendance to schedule format with proper date handling
      const scheduleData: Schedule[] = attendanceArray
        .filter((attendance: any) => {
          console.log('Processing attendance record:', attendance);
          return attendance && attendance.date;
        })
        .map((attendance: any) => {
          // Handle staff data - check both staff object and staff_id
          let staffMember = null;
          let staffId = '';
          let staffName = '';
          let position = '';

          if (attendance.staff) {
            staffId = attendance.staff.id.toString();
            staffName = `${attendance.staff.first_name || ''} ${attendance.staff.last_name || ''}`.trim();
            position = attendance.staff.position_info?.name || attendance.staff.position || 'Staff';
            staffMember = staffData.find(s => s.id === staffId);
          } else if (attendance.staff_id) {
            staffId = attendance.staff_id.toString();
            staffMember = staffData.find(s => s.id === staffId);
            staffName = staffMember?.name || `Staff ${staffId}`;
            position = staffMember?.position || 'Staff';
          }
          
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
          
          const schedule = {
            id: attendance.id.toString(),
            staffId: staffId,
            staffName: staffName || `Staff ${staffId}`,
            position: position,
            date: attendance.date,
            startTime: attendance.check_in_time || startTime,
            endTime: attendance.check_out_time || endTime,
            scheduleType: 'regular' as const,
            status: attendance.status === 'present' ? 'confirmed' as const : 'scheduled' as const
          };
          
          console.log('Converted to schedule:', schedule);
          return schedule;
        });
      
      console.log('Processed Staff Data:', staffData);
      console.log('Processed Schedule Data:', scheduleData);
      
      // Prioritize real staff data from Staff API over demo data
      let finalStaffData: StaffMember[] = [];
      
      if (staffArray.length > 0) {
        // Use real staff data from Staff API - handle the correct response structure
        finalStaffData = staffArray.map((staff: any) => ({
          id: staff.ID.toString(),
          name: `${staff.PersonalData?.FirstName || ''} ${staff.PersonalData?.LastName || ''}`.trim() || `Staff ${staff.ID}`,
          position: staff.Position || 'Staff',
          color: positionColors[staff.Position] || positionColors.default
        }));
        console.log('Using real staff data from Staff API:', finalStaffData);
      } else if (staffData.length > 0) {
        // Fallback to staff data from attendance records
        finalStaffData = staffData;
        console.log('Using staff data from attendance records:', finalStaffData);
      } else {
        // Final fallback to demo data
        finalStaffData = [
          { id: '1', name: 'ดร.สมชาย ใจดี', position: 'ทันตแพทย์', color: '#1890ff' },
          { id: '2', name: 'พยาบาล สุดา สวยงาม', position: 'ผู้ช่วย', color: '#52c41a' },
          { id: '3', name: 'นางสาว มาลี จริงใจ', position: 'เจ้าหน้าที่แผนกต้อนรับ', color: '#faad14' }
        ];
        console.log('Using demo staff data:', finalStaffData);
      }
      
      // Always use fresh staff data from API, prioritizing real data
      setStaffMembers(finalStaffData);
      
      setSchedules(prev => {
        // Prioritize real database data over demo data
        if (scheduleData.length > 0) {
          // Replace demo data with real data, but keep user-added schedules
          const realData = scheduleData;
          const userAdded = prev.filter(s => !s.id.startsWith('demo-') && !scheduleData.find(sd => sd.id === s.id));
          return [...realData, ...userAdded];
        }
        
        // If no API data and no existing schedules, show demo only
        if (prev.length === 0) {
          return [{
            id: 'demo-1',
            staffId: '1',
            staffName: 'ดร.สมชาย ใจดี',
            position: 'ทันตแพทย์',
            date: dayjs().format('YYYY-MM-DD'),
            startTime: '09:00',
            endTime: '17:00',
            scheduleType: 'regular' as const,
            status: 'confirmed' as const
          }];
        }
        
        return prev;
      });
      
      console.log('Data loading completed');
      if (staffArray.length === 0 && scheduleData.length === 0) {
        message.info('ไม่พบข้อมูลพนักงานในระบบ - กรุณาเพิ่มข้อมูลพนักงานในหน้าจัดการบุคลากรก่อน');
      } else if (staffArray.length > 0) {
        message.success(`โหลดข้อมูลพนักงาน ${staffArray.length} คน จากระบบบุคลากร`);
      }
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
      // Ensure authentication before making request
      const isAuth = await ensureAuthentication();
      if (!isAuth) {
        message.error('ไม่สามารถยืนยันตัวตนได้ กรุณาตรวจสอบการเชื่อมต่อ');
        return;
      }

      // Ensure staff member exists in our list
      let targetStaff = staffMembers.find(s => s.id === schedule.staffId);
      if (!targetStaff) {
        // Add the staff member to our list if not found
        targetStaff = {
          id: schedule.staffId,
          name: schedule.staffName || `Staff ${schedule.staffId}`,
          position: schedule.position || 'Staff',
          color: '#666666'
        };
        setStaffMembers(prev => [...prev, targetStaff!]);
        console.log('Added new staff member:', targetStaff);
      }

      // Create attendance record for the schedule
      const attendanceData = {
        staff_id: parseInt(schedule.staffId),
        date: schedule.date,
        status: 'scheduled',
        notes: schedule.notes || `Schedule: ${schedule.startTime} - ${schedule.endTime}`,
        location: 'Main Clinic'
      };

      console.log('Creating attendance with data:', attendanceData);
      
      const response = await attendanceAPI.createAttendance(attendanceData);
      console.log('Create response:', response);
      
      message.success('เพิ่มตารางงานสำเร็จ');
      
      // Immediately add the schedule to the current state for instant feedback
      const newSchedule: Schedule = {
        id: response.data?.id?.toString() || Date.now().toString(),
        staffId: schedule.staffId,
        staffName: targetStaff.name,
        position: targetStaff.position,
        date: schedule.date,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        scheduleType: 'regular',
        status: 'scheduled'
      };
      
      console.log('Adding new schedule to state:', newSchedule);
      setSchedules(prev => {
        // Check if schedule already exists to avoid duplicates
        const exists = prev.find(s => s.id === newSchedule.id);
        if (exists) return prev;
        return [...prev, newSchedule];
      });
    } catch (error: any) {
      console.error('Error adding schedule:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error details:', error.response?.data);
      
      if (error.response?.status === 401) {
        message.error('การยืนยันตัวตนหมดอายุ กำลังพยายามเข้าสู่ระบบใหม่...');
        const retryAuth = await ensureAuthentication();
        if (retryAuth) {
          // Retry the request with the same data
          try {
            const retryData = {
              staff_id: parseInt(schedule.staffId),
              date: schedule.date,
              status: 'scheduled',
              notes: schedule.notes || `Schedule: ${schedule.startTime} - ${schedule.endTime}`,
              location: 'Main Clinic'
            };
            const retryResponse = await attendanceAPI.createAttendance(retryData);
            message.success('เพิ่มตารางงานสำเร็จ');
            
            // Immediately add the schedule to state
            const newSchedule: Schedule = {
              id: retryResponse.data?.id?.toString() || Date.now().toString(),
              staffId: schedule.staffId,
              staffName: schedule.staffName || `Staff ${schedule.staffId}`,
              position: schedule.position || 'Staff',
              date: schedule.date,
              startTime: schedule.startTime,
              endTime: schedule.endTime,
              scheduleType: 'regular',
              status: 'scheduled'
            };
            
            setSchedules(prev => {
              const exists = prev.find(s => s.id === newSchedule.id);
              if (exists) return prev;
              return [...prev, newSchedule];
            });
          } catch (retryError) {
            message.error('ไม่สามารถเพิ่มตารางงานได้แม้หลังจากเข้าสู่ระบบใหม่');
          }
        }
      } else if (error.response?.status === 400) {
        message.error(`ข้อมูลไม่ถูกต้อง: ${error.response?.data?.error || 'รูปแบบข้อมูลผิด'}`);
      } else {
        message.error('ไม่สามารถเพิ่มตารางงานได้ กรุณาลองใหม่');
      }
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

  console.log('Rendering with schedules:', schedules);
  console.log('Rendering with staffMembers:', staffMembers);

  return (
    <div className="attendance-container">
      <div className="page-header">
        <Title level={2}>
          <CalendarOutlined /> การจัดการเวลาทำงานบุคลากร
        </Title>
        <div style={{ marginTop: 10, fontSize: '14px', color: '#666' }}>
          พนักงาน: {staffMembers.length} คน | ตารางงาน: {schedules.length} รายการ
        </div>
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
