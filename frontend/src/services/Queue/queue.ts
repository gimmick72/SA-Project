// services/Queue/queue.ts
export interface QueueItem {
  id: number;
  queue_number: string;
  patient_id: string;
  patient_name: string;
  phone: string;
  service_type: string;
  doctor: string;
  room: string;
  status: 'waiting' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'normal' | 'urgent' | 'emergency';
  appointment_time?: string;
  check_in_time: string;
  estimated_wait_time?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateQueuePayload {
  patient_id: string;
  patient_name: string;
  phone: string;
  service_type: string;
  doctor: string;
  room: string;
  priority?: 'normal' | 'urgent' | 'emergency';
  appointment_time?: string;
  notes?: string;
}

export interface QueueStats {
  total_waiting: number;
  total_in_progress: number;
  total_completed: number;
  average_wait_time: number;
  rooms_occupied: number;
  total_rooms: number;
}

// Mock data for development
const mockQueues: QueueItem[] = [
  {
    id: 1,
    queue_number: "Q001",
    patient_id: "P001",
    patient_name: "สมชาย ใจดี",
    phone: "081-234-5678",
    service_type: "ตรวจฟัน",
    doctor: "ทพ.สมิท จันทร์เจ้า",
    room: "ห้อง 1",
    status: "waiting",
    priority: "normal",
    appointment_time: "2024-03-15T09:00:00Z",
    check_in_time: "2024-03-15T08:45:00Z",
    estimated_wait_time: 15,
    notes: "ปวดฟันด้านขวา",
    created_at: "2024-03-15T08:45:00Z",
    updated_at: "2024-03-15T08:45:00Z"
  },
  {
    id: 2,
    queue_number: "Q002",
    patient_id: "P002",
    patient_name: "สมหญิง รักสุขภาพ",
    phone: "082-345-6789",
    service_type: "ขูดหินปูน",
    doctor: "ทพ.วิมล สีขาว",
    room: "ห้อง 2",
    status: "in_progress",
    priority: "normal",
    appointment_time: "2024-03-15T09:30:00Z",
    check_in_time: "2024-03-15T09:15:00Z",
    estimated_wait_time: 0,
    notes: "ทำความสะอาดฟัน",
    created_at: "2024-03-15T09:15:00Z",
    updated_at: "2024-03-15T09:30:00Z"
  },
  {
    id: 3,
    queue_number: "Q003",
    patient_id: "P003",
    patient_name: "วิชัย สุขใส",
    phone: "083-456-7890",
    service_type: "อุดฟัน",
    doctor: "ทพ.สมิท จันทร์เจ้า",
    room: "ห้อง 1",
    status: "waiting",
    priority: "urgent",
    appointment_time: "2024-03-15T10:00:00Z",
    check_in_time: "2024-03-15T09:45:00Z",
    estimated_wait_time: 30,
    notes: "ฟันผุลึก ต้องรีบรักษา",
    created_at: "2024-03-15T09:45:00Z",
    updated_at: "2024-03-15T09:45:00Z"
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchQueues = async (params?: any): Promise<{ data: QueueItem[]; total: number }> => {
  await delay(500);
  
  let filteredQueues = [...mockQueues];
  
  // Apply status filter
  if (params?.status && params.status !== 'all') {
    filteredQueues = filteredQueues.filter(queue => queue.status === params.status);
  }
  
  // Apply doctor filter
  if (params?.doctor && params.doctor !== 'all') {
    filteredQueues = filteredQueues.filter(queue => queue.doctor === params.doctor);
  }
  
  // Apply room filter
  if (params?.room && params.room !== 'all') {
    filteredQueues = filteredQueues.filter(queue => queue.room === params.room);
  }
  
  // Apply search filter
  if (params?.q) {
    const query = params.q.toLowerCase();
    filteredQueues = filteredQueues.filter(queue => 
      queue.queue_number.toLowerCase().includes(query) ||
      queue.patient_name.toLowerCase().includes(query) ||
      queue.phone.includes(query)
    );
  }
  
  return {
    data: filteredQueues,
    total: filteredQueues.length
  };
};

export const fetchQueueStats = async (): Promise<QueueStats> => {
  await delay(300);
  
  const stats: QueueStats = {
    total_waiting: mockQueues.filter(q => q.status === 'waiting').length,
    total_in_progress: mockQueues.filter(q => q.status === 'in_progress').length,
    total_completed: mockQueues.filter(q => q.status === 'completed').length,
    average_wait_time: 25,
    rooms_occupied: mockQueues.filter(q => q.status === 'in_progress').length,
    total_rooms: 4
  };
  
  return stats;
};

export const createQueue = async (payload: CreateQueuePayload): Promise<QueueItem> => {
  await delay(800);
  
  // Simulate validation
  if (!payload.patient_name || !payload.phone || !payload.service_type) {
    throw new Error("กรุณากรอกข้อมูลที่จำเป็น");
  }
  
  // Generate queue number
  const queueCount = mockQueues.length + 1;
  const queueNumber = `Q${queueCount.toString().padStart(3, '0')}`;
  
  const newQueue: QueueItem = {
    id: Math.max(...mockQueues.map(q => q.id)) + 1,
    queue_number: queueNumber,
    status: 'waiting',
    priority: payload.priority || 'normal',
    check_in_time: new Date().toISOString(),
    estimated_wait_time: 30,
    ...payload,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  mockQueues.push(newQueue);
  return newQueue;
};

export const updateQueueStatus = async (id: number, status: QueueItem['status']): Promise<QueueItem> => {
  await delay(400);
  
  const index = mockQueues.findIndex(q => q.id === id);
  if (index === -1) {
    throw new Error("ไม่พบคิวที่ต้องการอัปเดต");
  }
  
  mockQueues[index] = {
    ...mockQueues[index],
    status,
    updated_at: new Date().toISOString()
  };
  
  return mockQueues[index];
};

export const updateQueue = async (id: number, payload: Partial<CreateQueuePayload>): Promise<QueueItem> => {
  await delay(600);
  
  const index = mockQueues.findIndex(q => q.id === id);
  if (index === -1) {
    throw new Error("ไม่พบคิวที่ต้องการแก้ไข");
  }
  
  mockQueues[index] = {
    ...mockQueues[index],
    ...payload,
    updated_at: new Date().toISOString()
  };
  
  return mockQueues[index];
};

export const deleteQueue = async (id: number): Promise<void> => {
  await delay(400);
  
  const index = mockQueues.findIndex(q => q.id === id);
  if (index === -1) {
    throw new Error("ไม่พบคิวที่ต้องการลบ");
  }
  
  mockQueues.splice(index, 1);
};

export const callNextQueue = async (room: string): Promise<QueueItem | null> => {
  await delay(500);
  
  // Find next waiting queue for the room
  const nextQueue = mockQueues.find(q => 
    q.status === 'waiting' && 
    q.room === room
  );
  
  if (nextQueue) {
    return updateQueueStatus(nextQueue.id, 'in_progress');
  }
  
  return null;
};
