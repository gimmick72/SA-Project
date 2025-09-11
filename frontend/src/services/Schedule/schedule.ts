// services/Schedule/schedule.ts
export interface ScheduleEvent {
  id: number;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  doctor: string;
  patient_name?: string;
  patient_phone?: string;
  service_type: string;
  room: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  event_type: 'appointment' | 'break' | 'meeting' | 'other';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSchedulePayload {
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  doctor: string;
  patient_name?: string;
  patient_phone?: string;
  service_type: string;
  room: string;
  event_type: 'appointment' | 'break' | 'meeting' | 'other';
  notes?: string;
}

export interface DoctorSchedule {
  doctor: string;
  events: ScheduleEvent[];
  total_appointments: number;
  available_slots: number;
}

// Mock data for development
const mockSchedules: ScheduleEvent[] = [
  {
    id: 1,
    title: "นัดหมายผู้ป่วย - สมชาย ใจดี",
    description: "ตรวจฟันและอุดฟัน",
    start_date: "2024-03-15",
    end_date: "2024-03-15",
    start_time: "09:00",
    end_time: "10:00",
    doctor: "ทพ.สมิท จันทร์เจ้า",
    patient_name: "สมชาย ใจดี",
    patient_phone: "081-234-5678",
    service_type: "ตรวจฟัน",
    room: "ห้อง 1",
    status: "confirmed",
    event_type: "appointment",
    notes: "ผู้ป่วยมีประวัติแพ้ยา",
    created_at: "2024-03-10T10:00:00Z",
    updated_at: "2024-03-10T10:00:00Z"
  },
  {
    id: 2,
    title: "พักเบรค",
    description: "พักกลางวัน",
    start_date: "2024-03-15",
    end_date: "2024-03-15",
    start_time: "12:00",
    end_time: "13:00",
    doctor: "ทพ.สมิท จันทร์เจ้า",
    service_type: "พักเบรค",
    room: "ห้องพัก",
    status: "scheduled",
    event_type: "break",
    created_at: "2024-03-10T10:00:00Z",
    updated_at: "2024-03-10T10:00:00Z"
  },
  {
    id: 3,
    title: "นัดหมายผู้ป่วย - สมหญิง รักสุขภาพ",
    description: "ขูดหินปูนและทำความสะอาดฟัน",
    start_date: "2024-03-15",
    end_date: "2024-03-15",
    start_time: "14:00",
    end_time: "15:30",
    doctor: "ทพ.วิมล สีขาว",
    patient_name: "สมหญิง รักสุขภาพ",
    patient_phone: "082-345-6789",
    service_type: "ขูดหินปูน",
    room: "ห้อง 2",
    status: "scheduled",
    event_type: "appointment",
    notes: "ผู้ป่วยต้องการทำความสะอาดฟันเป็นพิเศษ",
    created_at: "2024-03-12T10:00:00Z",
    updated_at: "2024-03-12T10:00:00Z"
  },
  {
    id: 4,
    title: "ประชุมทีม",
    description: "ประชุมทีมแพทย์รายสัปดาห์",
    start_date: "2024-03-16",
    end_date: "2024-03-16",
    start_time: "08:00",
    end_time: "09:00",
    doctor: "ทุกคน",
    service_type: "ประชุม",
    room: "ห้องประชุม",
    status: "scheduled",
    event_type: "meeting",
    notes: "ประชุมรายสัปดาห์",
    created_at: "2024-03-01T10:00:00Z",
    updated_at: "2024-03-01T10:00:00Z"
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchSchedules = async (params?: {
  start_date?: string;
  end_date?: string;
  doctor?: string;
  status?: string;
}): Promise<{ data: ScheduleEvent[]; total: number }> => {
  await delay(500);
  
  let filteredSchedules = [...mockSchedules];
  
  // Apply date range filter
  if (params?.start_date) {
    filteredSchedules = filteredSchedules.filter(schedule => 
      schedule.start_date >= params.start_date!
    );
  }
  
  if (params?.end_date) {
    filteredSchedules = filteredSchedules.filter(schedule => 
      schedule.end_date <= params.end_date!
    );
  }
  
  // Apply doctor filter
  if (params?.doctor && params.doctor !== 'all') {
    filteredSchedules = filteredSchedules.filter(schedule => 
      schedule.doctor === params.doctor || schedule.doctor === 'ทุกคน'
    );
  }
  
  // Apply status filter
  if (params?.status && params.status !== 'all') {
    filteredSchedules = filteredSchedules.filter(schedule => 
      schedule.status === params.status
    );
  }
  
  return {
    data: filteredSchedules,
    total: filteredSchedules.length
  };
};

export const fetchDoctorSchedules = async (date: string): Promise<DoctorSchedule[]> => {
  await delay(400);
  
  const doctors = ['ทพ.สมิท จันทร์เจ้า', 'ทพ.วิมล สีขาว'];
  const schedules: DoctorSchedule[] = [];
  
  for (const doctor of doctors) {
    const events = mockSchedules.filter(s => 
      s.doctor === doctor && s.start_date === date
    );
    
    schedules.push({
      doctor,
      events,
      total_appointments: events.filter(e => e.event_type === 'appointment').length,
      available_slots: 8 - events.length // Assuming 8 slots per day
    });
  }
  
  return schedules;
};

export const createSchedule = async (payload: CreateSchedulePayload): Promise<ScheduleEvent> => {
  await delay(800);
  
  // Simulate validation
  if (!payload.title || !payload.start_date || !payload.doctor) {
    throw new Error("กรุณากรอกข้อมูลที่จำเป็น");
  }
  
  // Check for time conflicts
  const conflicts = mockSchedules.filter(s => 
    s.doctor === payload.doctor &&
    s.start_date === payload.start_date &&
    s.room === payload.room &&
    ((payload.start_time >= s.start_time && payload.start_time < s.end_time) ||
     (payload.end_time > s.start_time && payload.end_time <= s.end_time))
  );
  
  if (conflicts.length > 0) {
    throw new Error("มีการนัดหมายซ้อนทับกันในช่วงเวลานี้");
  }
  
  const newSchedule: ScheduleEvent = {
    id: Math.max(...mockSchedules.map(s => s.id)) + 1,
    status: 'scheduled',
    ...payload,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  mockSchedules.push(newSchedule);
  return newSchedule;
};

export const updateSchedule = async (id: number, payload: Partial<CreateSchedulePayload>): Promise<ScheduleEvent> => {
  await delay(600);
  
  const index = mockSchedules.findIndex(s => s.id === id);
  if (index === -1) {
    throw new Error("ไม่พบตารางนัดหมายที่ต้องการแก้ไข");
  }
  
  mockSchedules[index] = {
    ...mockSchedules[index],
    ...payload,
    updated_at: new Date().toISOString()
  };
  
  return mockSchedules[index];
};

export const updateScheduleStatus = async (id: number, status: ScheduleEvent['status']): Promise<ScheduleEvent> => {
  await delay(400);
  
  const index = mockSchedules.findIndex(s => s.id === id);
  if (index === -1) {
    throw new Error("ไม่พบตารางนัดหมายที่ต้องการอัปเดต");
  }
  
  mockSchedules[index] = {
    ...mockSchedules[index],
    status,
    updated_at: new Date().toISOString()
  };
  
  return mockSchedules[index];
};

export const deleteSchedule = async (id: number): Promise<void> => {
  await delay(400);
  
  const index = mockSchedules.findIndex(s => s.id === id);
  if (index === -1) {
    throw new Error("ไม่พบตารางนัดหมายที่ต้องการลบ");
  }
  
  mockSchedules.splice(index, 1);
};

export const getAvailableTimeSlots = async (doctor: string, date: string): Promise<string[]> => {
  await delay(300);
  
  const workingHours = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
  ];
  
  const bookedSlots = mockSchedules
    .filter(s => s.doctor === doctor && s.start_date === date)
    .map(s => s.start_time);
  
  return workingHours.filter(slot => !bookedSlots.includes(slot));
};
