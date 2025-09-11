// services/Staff/staff.ts
export interface Staff {
  id: number;
  staff_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hire_date: string;
  salary: number;
  is_active: boolean;
  address?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  qualifications?: string[];
  specializations?: string[];
  work_schedule?: string;
  created_at: string;
  updated_at: string;
}

export interface StaffAttendance {
  id: number;
  staff_id: number;
  date: string;
  check_in_time?: string;
  check_out_time?: string;
  work_hours: number;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'overtime';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateStaffPayload {
  staff_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hire_date: string;
  salary: number;
  address?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  qualifications?: string[];
  specializations?: string[];
  work_schedule?: string;
}

export interface AttendancePayload {
  staff_id: number;
  date: string;
  check_in_time?: string;
  check_out_time?: string;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'overtime';
  notes?: string;
}

// Mock data for development
const mockStaff: Staff[] = [
  {
    id: 1,
    staff_code: "STF001",
    first_name: "สมชาย",
    last_name: "ใจดี",
    email: "somchai@clinic.com",
    phone: "081-234-5678",
    position: "ทันตแพทย์",
    department: "แผนกทันตกรรม",
    hire_date: "2023-01-15",
    salary: 45000,
    is_active: true,
    address: "123 ถนนสุขุมวิท กรุงเทพฯ 10110",
    emergency_contact: "สมหญิง ใจดี",
    emergency_phone: "081-234-5679",
    qualifications: ["ปริญญาตรีทันตแพทยศาสตร์", "ใบประกอบวิชาชีพทันตแพทย์"],
    specializations: ["ทันตกรรมทั่วไป", "การถอนฟัน"],
    work_schedule: "จันทร์-ศุกร์ 08:00-17:00",
    created_at: "2023-01-15T10:00:00Z",
    updated_at: "2023-01-15T10:00:00Z"
  },
  {
    id: 2,
    staff_code: "STF002",
    first_name: "สมหญิง",
    last_name: "รักษ์ดี",
    email: "somying@clinic.com",
    phone: "082-345-6789",
    position: "พยาบาล",
    department: "แผนกพยาบาล",
    hire_date: "2023-02-01",
    salary: 25000,
    is_active: true,
    address: "456 ถนนรัชดาภิเษก กรุงเทพฯ 10400",
    emergency_contact: "สมศักดิ์ รักษ์ดี",
    emergency_phone: "082-345-6790",
    qualifications: ["ปริญญาตรีพยาบาลศาสตร์", "ใบประกอบวิชาชีพพยาบาล"],
    specializations: ["การพยาบาลทั่วไป", "การดูแลผู้ป่วย"],
    work_schedule: "จันทร์-ศุกร์ 08:00-17:00",
    created_at: "2023-02-01T10:00:00Z",
    updated_at: "2023-02-01T10:00:00Z"
  },
  {
    id: 3,
    staff_code: "STF003",
    first_name: "วิชัย",
    last_name: "เก่งมาก",
    email: "wichai@clinic.com",
    phone: "083-456-7890",
    position: "เจ้าหน้าที่การเงิน",
    department: "แผนกการเงิน",
    hire_date: "2023-03-01",
    salary: 22000,
    is_active: true,
    address: "789 ถนนพหลโยธิน กรุงเทพฯ 10900",
    emergency_contact: "วิมล เก่งมาก",
    emergency_phone: "083-456-7891",
    qualifications: ["ปริญญาตรีบัญชี", "ใบประกาศนียบัตรการเงิน"],
    specializations: ["การบัญชี", "การเงิน"],
    work_schedule: "จันทร์-ศุกร์ 09:00-18:00",
    created_at: "2023-03-01T10:00:00Z",
    updated_at: "2023-03-01T10:00:00Z"
  },
  {
    id: 4,
    staff_code: "STF004",
    first_name: "นิดา",
    last_name: "ช่วยเหลือ",
    email: "nida@clinic.com",
    phone: "084-567-8901",
    position: "เจ้าหน้าที่ต้อนรับ",
    department: "แผนกต้อนรับ",
    hire_date: "2023-04-01",
    salary: 18000,
    is_active: true,
    address: "321 ถนนลาดพร้าว กรุงเทพฯ 10230",
    emergency_contact: "สุนิดา ช่วยเหลือ",
    emergency_phone: "084-567-8902",
    qualifications: ["ปริญญาตรีศิลปศาสตร์", "ใบประกาศนียบัตรการต้อนรับ"],
    specializations: ["การต้อนรับลูกค้า", "การประสานงาน"],
    work_schedule: "จันทร์-เสาร์ 08:00-17:00",
    created_at: "2023-04-01T10:00:00Z",
    updated_at: "2023-04-01T10:00:00Z"
  },
  {
    id: 5,
    staff_code: "STF005",
    first_name: "ประยุทธ",
    last_name: "ทำความสะอาด",
    email: "prayuth@clinic.com",
    phone: "085-678-9012",
    position: "พนักงานทำความสะอาด",
    department: "แผนกสนับสนุน",
    hire_date: "2023-05-01",
    salary: 15000,
    is_active: false,
    address: "654 ถนนเพชรบุรี กรุงเทพฯ 10400",
    emergency_contact: "ประภา ทำความสะอาด",
    emergency_phone: "085-678-9013",
    qualifications: ["มัธยมศึกษาตอนปลาย"],
    specializations: ["การทำความสะอาด", "การดูแลอุปกรณ์"],
    work_schedule: "จันทร์-เสาร์ 06:00-15:00",
    created_at: "2023-05-01T10:00:00Z",
    updated_at: "2023-05-01T10:00:00Z"
  }
];

const mockAttendance: StaffAttendance[] = [
  {
    id: 1,
    staff_id: 1,
    date: "2024-03-11",
    check_in_time: "08:00",
    check_out_time: "17:00",
    work_hours: 8,
    status: "present",
    notes: "",
    created_at: "2024-03-11T08:00:00Z",
    updated_at: "2024-03-11T17:00:00Z"
  },
  {
    id: 2,
    staff_id: 2,
    date: "2024-03-11",
    check_in_time: "08:15",
    check_out_time: "17:00",
    work_hours: 7.75,
    status: "late",
    notes: "มาสาย 15 นาที",
    created_at: "2024-03-11T08:15:00Z",
    updated_at: "2024-03-11T17:00:00Z"
  },
  {
    id: 3,
    staff_id: 3,
    date: "2024-03-11",
    check_in_time: "09:00",
    check_out_time: "18:00",
    work_hours: 8,
    status: "present",
    notes: "",
    created_at: "2024-03-11T09:00:00Z",
    updated_at: "2024-03-11T18:00:00Z"
  },
  {
    id: 4,
    staff_id: 4,
    date: "2024-03-11",
    check_in_time: "08:00",
    check_out_time: "17:00",
    work_hours: 8,
    status: "present",
    notes: "",
    created_at: "2024-03-11T08:00:00Z",
    updated_at: "2024-03-11T17:00:00Z"
  },
  {
    id: 5,
    staff_id: 1,
    date: "2024-03-10",
    check_in_time: "",
    check_out_time: "",
    work_hours: 0,
    status: "absent",
    notes: "ลาป่วย",
    created_at: "2024-03-10T08:00:00Z",
    updated_at: "2024-03-10T08:00:00Z"
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchStaff = async (params?: any): Promise<{ data: Staff[]; total: number }> => {
  await delay(500);
  
  let filteredStaff = [...mockStaff];
  
  // Apply search filter
  if (params?.q) {
    const query = params.q.toLowerCase();
    filteredStaff = filteredStaff.filter(staff => 
      staff.first_name.toLowerCase().includes(query) ||
      staff.last_name.toLowerCase().includes(query) ||
      staff.staff_code.toLowerCase().includes(query) ||
      staff.email.toLowerCase().includes(query) ||
      staff.position.toLowerCase().includes(query) ||
      staff.department.toLowerCase().includes(query)
    );
  }
  
  // Apply department filter
  if (params?.department && params.department !== 'all') {
    filteredStaff = filteredStaff.filter(staff => staff.department === params.department);
  }
  
  // Apply position filter
  if (params?.position && params.position !== 'all') {
    filteredStaff = filteredStaff.filter(staff => staff.position === params.position);
  }
  
  // Apply active filter
  if (params?.is_active !== undefined) {
    filteredStaff = filteredStaff.filter(staff => staff.is_active === params.is_active);
  }
  
  return {
    data: filteredStaff,
    total: filteredStaff.length
  };
};

export const fetchStaffById = async (id: number): Promise<Staff> => {
  await delay(300);
  
  const staff = mockStaff.find(s => s.id === id);
  if (!staff) {
    throw new Error("ไม่พบข้อมูลพนักงานที่ต้องการ");
  }
  
  return staff;
};

export const createStaff = async (payload: CreateStaffPayload): Promise<Staff> => {
  await delay(800);
  
  // Simulate validation
  if (!payload.staff_code || !payload.first_name || !payload.last_name || !payload.email) {
    throw new Error("กรุณากรอกข้อมูลที่จำเป็น");
  }
  
  // Check if staff code already exists
  if (mockStaff.some(s => s.staff_code === payload.staff_code)) {
    throw new Error("รหัสพนักงานนี้มีอยู่แล้ว");
  }
  
  // Check if email already exists
  if (mockStaff.some(s => s.email === payload.email)) {
    throw new Error("อีเมลนี้มีอยู่แล้ว");
  }
  
  const newStaff: Staff = {
    id: Math.max(...mockStaff.map(s => s.id)) + 1,
    is_active: true,
    qualifications: payload.qualifications || [],
    specializations: payload.specializations || [],
    work_schedule: payload.work_schedule || "จันทร์-ศุกร์ 08:00-17:00",
    ...payload,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  mockStaff.push(newStaff);
  return newStaff;
};

export const updateStaff = async (id: number, payload: Partial<CreateStaffPayload>): Promise<Staff> => {
  await delay(600);
  
  const index = mockStaff.findIndex(s => s.id === id);
  if (index === -1) {
    throw new Error("ไม่พบข้อมูลพนักงานที่ต้องการแก้ไข");
  }
  
  // Check if email already exists (excluding current staff)
  if (payload.email && mockStaff.some(s => s.id !== id && s.email === payload.email)) {
    throw new Error("อีเมลนี้มีอยู่แล้ว");
  }
  
  mockStaff[index] = {
    ...mockStaff[index],
    ...payload,
    updated_at: new Date().toISOString()
  };
  
  return mockStaff[index];
};

export const toggleStaffStatus = async (id: number): Promise<Staff> => {
  await delay(400);
  
  const index = mockStaff.findIndex(s => s.id === id);
  if (index === -1) {
    throw new Error("ไม่พบข้อมูลพนักงานที่ต้องการอัปเดต");
  }
  
  mockStaff[index] = {
    ...mockStaff[index],
    is_active: !mockStaff[index].is_active,
    updated_at: new Date().toISOString()
  };
  
  return mockStaff[index];
};

export const deleteStaff = async (id: number): Promise<void> => {
  await delay(400);
  
  const index = mockStaff.findIndex(s => s.id === id);
  if (index === -1) {
    throw new Error("ไม่พบข้อมูลพนักงานที่ต้องการลบ");
  }
  
  mockStaff.splice(index, 1);
};

// Attendance functions
export const fetchAttendance = async (params?: any): Promise<{ data: StaffAttendance[]; total: number }> => {
  await delay(400);
  
  let filteredAttendance = [...mockAttendance];
  
  // Apply staff filter
  if (params?.staff_id) {
    filteredAttendance = filteredAttendance.filter(att => att.staff_id === params.staff_id);
  }
  
  // Apply date filter
  if (params?.date) {
    filteredAttendance = filteredAttendance.filter(att => att.date === params.date);
  }
  
  // Apply date range filter
  if (params?.start_date && params?.end_date) {
    filteredAttendance = filteredAttendance.filter(att => 
      att.date >= params.start_date && att.date <= params.end_date
    );
  }
  
  // Apply status filter
  if (params?.status && params.status !== 'all') {
    filteredAttendance = filteredAttendance.filter(att => att.status === params.status);
  }
  
  return {
    data: filteredAttendance,
    total: filteredAttendance.length
  };
};

export const createAttendance = async (payload: AttendancePayload): Promise<StaffAttendance> => {
  await delay(600);
  
  // Simulate validation
  if (!payload.staff_id || !payload.date) {
    throw new Error("กรุณากรอกข้อมูลที่จำเป็น");
  }
  
  // Check if attendance already exists for this staff and date
  if (mockAttendance.some(att => att.staff_id === payload.staff_id && att.date === payload.date)) {
    throw new Error("มีข้อมูลการเข้างานสำหรับวันนี้แล้ว");
  }
  
  // Calculate work hours if check-in and check-out times are provided
  let work_hours = 0;
  if (payload.check_in_time && payload.check_out_time) {
    const checkIn = new Date(`2024-01-01 ${payload.check_in_time}`);
    const checkOut = new Date(`2024-01-01 ${payload.check_out_time}`);
    work_hours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
  }
  
  const newAttendance: StaffAttendance = {
    id: Math.max(...mockAttendance.map(att => att.id)) + 1,
    work_hours,
    notes: payload.notes || "",
    ...payload,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  mockAttendance.push(newAttendance);
  return newAttendance;
};

export const updateAttendance = async (id: number, payload: Partial<AttendancePayload>): Promise<StaffAttendance> => {
  await delay(500);
  
  const index = mockAttendance.findIndex(att => att.id === id);
  if (index === -1) {
    throw new Error("ไม่พบข้อมูลการเข้างานที่ต้องการแก้ไข");
  }
  
  // Recalculate work hours if times are updated
  let work_hours = mockAttendance[index].work_hours;
  const check_in_time = payload.check_in_time || mockAttendance[index].check_in_time;
  const check_out_time = payload.check_out_time || mockAttendance[index].check_out_time;
  
  if (check_in_time && check_out_time) {
    const checkIn = new Date(`2024-01-01 ${check_in_time}`);
    const checkOut = new Date(`2024-01-01 ${check_out_time}`);
    work_hours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
  }
  
  mockAttendance[index] = {
    ...mockAttendance[index],
    ...payload,
    work_hours,
    updated_at: new Date().toISOString()
  };
  
  return mockAttendance[index];
};

export const deleteAttendance = async (id: number): Promise<void> => {
  await delay(400);
  
  const index = mockAttendance.findIndex(att => att.id === id);
  if (index === -1) {
    throw new Error("ไม่พบข้อมูลการเข้างานที่ต้องการลบ");
  }
  
  mockAttendance.splice(index, 1);
};

// Get staff attendance statistics
export const getAttendanceStats = async (params?: any): Promise<any> => {
  await delay(300);
  
  let filteredAttendance = [...mockAttendance];
  
  // Apply date range filter
  if (params?.start_date && params?.end_date) {
    filteredAttendance = filteredAttendance.filter(att => 
      att.date >= params.start_date && att.date <= params.end_date
    );
  }
  
  const stats = {
    total_records: filteredAttendance.length,
    present: filteredAttendance.filter(att => att.status === 'present').length,
    absent: filteredAttendance.filter(att => att.status === 'absent').length,
    late: filteredAttendance.filter(att => att.status === 'late').length,
    half_day: filteredAttendance.filter(att => att.status === 'half_day').length,
    overtime: filteredAttendance.filter(att => att.status === 'overtime').length,
    total_work_hours: filteredAttendance.reduce((sum, att) => sum + att.work_hours, 0),
    average_work_hours: filteredAttendance.length > 0 
      ? filteredAttendance.reduce((sum, att) => sum + att.work_hours, 0) / filteredAttendance.length 
      : 0
  };
  
  return stats;
};
