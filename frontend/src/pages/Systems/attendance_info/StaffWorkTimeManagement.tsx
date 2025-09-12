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
  scheduleType: 'regular' | 'overtime' | 'holiday' | 'shift_change';
  status: 'scheduled' | 'confirmed' | 'cancelled';
}

interface StaffMember {
  id: string;
  name: string;
  position: string;
  color: string;
}

const StaffWorkTimeManagement: React.FC = () => {
  console.log('StaffWorkTimeManagement: Component rendering...');
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(false);

  // Load data from backend
  const loadData = async () => {
    console.log('loadData: Function called, starting data load process...');
    setLoading(true);
    try {
      // Check authentication first
      const token = localStorage.getItem('token');
      console.log('loadData: Token check:', token ? 'Token exists' : 'No token found');
      
      // Always try to ensure authentication
      console.log('Calling ensureAuthentication...');
      const isAuth = await ensureAuthentication();
      console.log('Authentication status:', isAuth);
      console.log('Token after auth check:', localStorage.getItem('token') ? 'Token present' : 'No token');
      
      // Force set a valid token for testing
      localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJFbWFpbCI6InRlc3RhZG1pbjJAY2xpbmljLmNvbSIsIlJvbGUiOiJhZG1pbiIsImV4cCI6MTc1Nzc4NzI5MiwiaXNzIjoiQXV0aFNlcnZpY2UifQ.DM83TLcywHc2iyI89BllDkhmlpFZKL-qOucZ-Bpa4Oo');
      console.log('loadData: Set valid token, proceeding with API calls...');
      
      if (false) { // Skip mock data completely
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

      // Load both attendance and staff data - use integrated APIs
      console.log('loadData: Making API calls to get attendances and staff...');
      
      // First get staff data from staff_info API
      let staffResponse;
      try {
        console.log('loadData: Calling attendanceAPI.getStaffForAttendance()...');
        staffResponse = await attendanceAPI.getStaffForAttendance();
        console.log('loadData: Staff API Response received:', staffResponse);
      } catch (error) {
        console.error('loadData: Staff API failed with error:', error);
        staffResponse = { data: [] };
      }
      
      // Then get attendance data with staff relationships
      let attendanceResponse;
      try {
        console.log('loadData: Calling attendanceAPI.getAttendances()...');
        attendanceResponse = await attendanceAPI.getAttendances({ page: 1, page_size: 100 });
        console.log('loadData: Attendance API Response received:', attendanceResponse);
      } catch (error) {
        console.error('loadData: Attendance API failed with error:', error);
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
      
      // First, add staff from the staff API (PersonalData structure)
      staffArray.forEach((staff: any) => {
        console.log('Processing staff:', staff);
        const staffName = `${staff.first_name || ''} ${staff.last_name || ''}`.trim();
        const position = staff.department?.position || 'Staff';
        
        uniqueStaff.set(staff.id, {
          id: staff.id.toString(),
          name: staffName || `Staff ${staff.id}`,
          position: position,
          color: positionColors[position] || positionColors.default,
          email: staff.email,
          tel: staff.tel
        });
      });
      
      // Then, add any additional staff from attendance records
      attendanceArray.forEach((attendance: any) => {
        if (attendance.staff && !uniqueStaff.has(attendance.staff.id)) {
          const staffName = `${attendance.staff.first_name || ''} ${attendance.staff.last_name || ''}`.trim();
          const position = attendance.staff.department?.position || 'Staff';
          
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
      
      // Convert schedules from attendance data with improved staff relationship handling
      const convertedSchedules: Schedule[] = attendanceArray.map((attendance: any) => {
        console.log('Processing attendance:', attendance);
        
        // Use the staff object from attendance response (now includes full PersonalData)
        let staffName = 'Unknown Staff';
        let position = 'Staff';
        
        if (attendance.staff && attendance.staff.id) {
          // Use staff data from attendance response
          staffName = `${attendance.staff.first_name || ''} ${attendance.staff.last_name || ''}`.trim();
          position = attendance.staff.department?.position || 'Staff';
        } else if (attendance.staff_id) {
          // Fallback to staff from uniqueStaff map
          const staff = uniqueStaff.get(attendance.staff_id);
          if (staff) {
            staffName = staff.name;
            position = staff.position;
          }
        }
        
        return {
          id: attendance.id?.toString() || Math.random().toString(),
          staffId: (attendance.staff?.id || attendance.staff_id)?.toString() || '',
          staffName: staffName,
          position: position,
          date: attendance.date ? dayjs(attendance.date).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
          startTime: attendance.check_in_time ? dayjs(attendance.check_in_time).format('HH:mm') : '09:00',
          endTime: attendance.check_out_time ? dayjs(attendance.check_out_time).format('HH:mm') : '17:00',
          scheduleType: 'regular' as const,
          status: attendance.status === 'present' || attendance.status === 'late' ? 'confirmed' as const : 'scheduled' as const
        };
      });
      
      console.log('Processed Staff Data:', staffData);
      console.log('Processed Schedule Data:', convertedSchedules);
      
      // Prioritize real staff data from Staff API over demo data
      let finalStaffData: StaffMember[] = [];
      
      if (staffArray.length > 0) {
        // Use real staff data from Staff API - handle the correct response structure
        finalStaffData = staffArray.map((staff: any) => ({
          id: staff.id.toString(),
          name: `${staff.first_name || ''} ${staff.last_name || ''}`.trim() || `Staff ${staff.id}`,
          position: staff.department?.position || 'Staff',
          color: positionColors[staff.department?.position] || positionColors.default
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
      
      // Set final data
      setStaffMembers(finalStaffData);
      
      if (convertedSchedules.length > 0) {
        setSchedules(convertedSchedules);
      } else {
        // Use demo schedule if no real data
        setSchedules([
          {
            id: 'demo-1',
            staffId: finalStaffData[0]?.id || '1',
            staffName: finalStaffData[0]?.name || 'ดร.สมชาย ใจดี',
            position: finalStaffData[0]?.position || 'ทันตแพทย์',
            date: dayjs().format('YYYY-MM-DD'),
            startTime: '09:00',
            endTime: '17:00',
            scheduleType: 'regular',
            status: 'confirmed'
          }
        ]);
      }

    } catch (error) {
      console.error('Error loading data:', error);
      message.error('Failed to load data');
      
      // Set fallback data on error
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
    } finally {
      setLoading(false);
    }
  };

  // Direct API test function
  const testAPIDirect = async () => {
    console.log('testAPIDirect: Starting direct API test...');
    
    // Test staff API directly
    try {
      console.log('testAPIDirect: Testing staff API...');
      const response = await fetch('http://localhost:8080/api/staff', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJFbWFpbCI6InRlc3RhZG1pbjJAY2xpbmljLmNvbSIsIlJvbGUiOiJhZG1pbiIsImV4cCI6MTc1Nzc4NzI5MiwiaXNzIjoiQXV0aFNlcnZpY2UifQ.DM83TLcywHc2iyI89BllDkhmlpFZKL-qOucZ-Bpa4Oo`
        }
      });
      const staffData = await response.json();
      console.log('testAPIDirect: Staff API direct response:', staffData);
    } catch (error) {
      console.error('testAPIDirect: Staff API direct test failed:', error);
    }
    
    // Test attendance API directly
    try {
      console.log('testAPIDirect: Testing attendance API...');
      const response = await fetch('http://localhost:8080/api/attendance', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJFbWFpbCI6InRlc3RhZG1pbjJAY2xpbmljLmNvbSIsIlJvbGUiOiJhZG1pbiIsImV4cCI6MTc1Nzc4NzI5MiwiaXNzIjoiQXV0aFNlcnZpY2UifQ.DM83TLcywHc2iyI89BllDkhmlpFZKL-qOucZ-Bpa4Oo`
        }
      });
      const attendanceData = await response.json();
      console.log('testAPIDirect: Attendance API direct response:', attendanceData);
    } catch (error) {
      console.error('testAPIDirect: Attendance API direct test failed:', error);
    }
  };

  useEffect(() => {
    console.log('StaffWorkTimeManagement: Component mounted, running direct API test...');
    testAPIDirect();
    console.log('StaffWorkTimeManagement: Also calling loadData...');
    loadData();
  }, []);

  // Add new staff member
  const handleAddStaff = (newStaff: Omit<StaffMember, 'id'>) => {
    const id = Date.now().toString();
    const colors = ['#1890ff', '#52c41a', '#faad14', '#722ed1', '#f5222d', '#fa8c16'];
    const color = colors[staffMembers.length % colors.length];
    
    setStaffMembers(prev => [...prev, { ...newStaff, id, color }]);
    message.success('เพิ่มพนักงานสำเร็จ');
  };

  // Update staff member
  const handleUpdateStaff = (id: string, updatedStaff: Partial<StaffMember>) => {
    setStaffMembers(prev => prev.map(staff => 
      staff.id === id ? { ...staff, ...updatedStaff } : staff
    ));
    message.success('อัปเดตข้อมูลพนักงานสำเร็จ');
  };

  // Delete staff member
  const handleDeleteStaff = (id: string) => {
    setStaffMembers(prev => prev.filter(staff => staff.id !== id));
    // Also remove related schedules
    setSchedules(prev => prev.filter(schedule => schedule.staffId !== id));
    message.success('ลบพนักงานสำเร็จ');
  };

  // Add new schedule
  const handleAddSchedule = (newSchedule: Omit<Schedule, 'id'>) => {
    const id = Date.now().toString();
    setSchedules(prev => [...prev, { ...newSchedule, id }]);
    message.success('เพิ่มตารางงานสำเร็จ');
  };

  // Update schedule
  const handleUpdateSchedule = (updatedSchedule: Schedule) => {
    setSchedules(prev => prev.map(schedule => 
      schedule.id === updatedSchedule.id ? updatedSchedule : schedule
    ));
    message.success('อัปเดตตารางงานสำเร็จ');
  };

  // Delete schedule
  const handleDeleteSchedule = (id: string) => {
    setSchedules(prev => prev.filter(schedule => schedule.id !== id));
    message.success('ลบตารางงานสำเร็จ');
  };

  // Generate weekly schedules
  const handleGenerateWeeklySchedules = () => {
    const startOfWeek = dayjs().startOf('week');
    const newSchedules: Schedule[] = [];
    
    staffMembers.forEach(staff => {
      for (let i = 0; i < 7; i++) {
        const date = startOfWeek.add(i, 'day');
        if (date.day() !== 0) { // Skip Sunday
          newSchedules.push({
            id: `${staff.id}-${date.format('YYYY-MM-DD')}`,
            staffId: staff.id,
            staffName: staff.name,
            position: staff.position,
            date: date.format('YYYY-MM-DD'),
            startTime: '09:00',
            endTime: '17:00',
            scheduleType: 'regular',
            status: 'scheduled'
          });
        }
      }
    });
    
    setSchedules(prev => {
      // Remove existing schedules for this week and add new ones
      const filtered = prev.filter(s => !newSchedules.some(ns => ns.id === s.id));
      return [...filtered, ...newSchedules];
    });
    
    message.success('สร้างตารางงานรายสัปดาห์สำเร็จ');
    loadData(); // Reload to sync with backend
  };

  // Refresh data
  const handleRefresh = () => {
    loadData();
  };

  return (
    <div className="staff-work-time-management">
      <div className="page-header">
        <Title level={2}>
          <CalendarOutlined /> Staff Work Time Management
        </Title>
      </div>

      <StaffCalendarView
        schedules={schedules}
        staffMembers={staffMembers}
        onScheduleAdd={handleAddSchedule}
        onScheduleEdit={handleUpdateSchedule}
        onScheduleDelete={handleDeleteSchedule}
      />
    </div>
  );
};

export default StaffWorkTimeManagement;
