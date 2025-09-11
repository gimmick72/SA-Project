// services/Patient/patient.ts
export interface Patient {
  id: number;
  patient_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  phone: string;
  email?: string;
  address?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  medical_history?: string;
  allergies?: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePatientPayload {
  patient_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  phone: string;
  email?: string;
  address?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  medical_history?: string;
  allergies?: string;
}

export interface PatientHistory {
  id: number;
  patient_id: string;
  visit_date: string;
  diagnosis: string;
  treatment: string;
  doctor: string;
  notes?: string;
  created_at: string;
}

// Mock data for development
const mockPatients: Patient[] = [
  {
    id: 1,
    patient_id: "P001",
    first_name: "สมชาย",
    last_name: "ใจดี",
    date_of_birth: "1985-05-15",
    gender: "ชาย",
    phone: "081-234-5678",
    email: "somchai@email.com",
    address: "123 ถนนสุขุมวิท กรุงเทพฯ 10110",
    emergency_contact: "สมหญิง ใจดี",
    emergency_phone: "081-234-5679",
    medical_history: "ความดันโลหิตสูง",
    allergies: "ยาปฏิชีวนะ",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z"
  },
  {
    id: 2,
    patient_id: "P002",
    first_name: "สมหญิง",
    last_name: "รักสุขภาพ",
    date_of_birth: "1990-08-22",
    gender: "หญิง",
    phone: "082-345-6789",
    email: "somying@email.com",
    address: "456 ถนนพหลโยธิน กรุงเทพฯ 10400",
    emergency_contact: "สมศักดิ์ รักสุขภาพ",
    emergency_phone: "082-345-6780",
    medical_history: "เบาหวาน",
    allergies: "ไม่มี",
    created_at: "2024-02-01T10:00:00Z",
    updated_at: "2024-02-01T10:00:00Z"
  },
  {
    id: 3,
    patient_id: "P003",
    first_name: "วิชัย",
    last_name: "สุขใส",
    date_of_birth: "1975-12-10",
    gender: "ชาย",
    phone: "083-456-7890",
    email: "wichai@email.com",
    address: "789 ถนนรัชดาภิเษก กรุงเทพฯ 10310",
    emergency_contact: "วิไล สุขใส",
    emergency_phone: "083-456-7891",
    medical_history: "โรคหัวใจ",
    allergies: "อาหารทะเล",
    created_at: "2024-01-20T10:00:00Z",
    updated_at: "2024-01-20T10:00:00Z"
  }
];

const mockHistory: PatientHistory[] = [
  {
    id: 1,
    patient_id: "P001",
    visit_date: "2024-03-01",
    diagnosis: "ปวดฟัน",
    treatment: "อุดฟัน",
    doctor: "ทพ.สมิท จันทร์เจ้า",
    notes: "ฟันผุลึก ต้องรักษารากฟัน",
    created_at: "2024-03-01T10:00:00Z"
  },
  {
    id: 2,
    patient_id: "P001",
    visit_date: "2024-02-15",
    diagnosis: "ขูดหินปูน",
    treatment: "ทำความสะอาดฟัน",
    doctor: "ทพ.สมิท จันทร์เจ้า",
    notes: "มีหินปูนมาก แนะนำให้มาทำความสะอาดทุก 6 เดือน",
    created_at: "2024-02-15T10:00:00Z"
  },
  {
    id: 3,
    patient_id: "P002",
    visit_date: "2024-03-05",
    diagnosis: "ตรวจสุขภาพฟัน",
    treatment: "ตรวจทั่วไป",
    doctor: "ทพ.วิมล สีขาว",
    notes: "สุขภาพฟันดี แนะนำให้แปรงฟันอย่างถูกวิธี",
    created_at: "2024-03-05T10:00:00Z"
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchPatients = async (params?: any): Promise<{ data: Patient[]; total: number }> => {
  await delay(500);
  
  let filteredPatients = [...mockPatients];
  
  // Apply search filter
  if (params?.q) {
    const query = params.q.toLowerCase();
    filteredPatients = filteredPatients.filter(patient => 
      patient.patient_id.toLowerCase().includes(query) ||
      patient.first_name.toLowerCase().includes(query) ||
      patient.last_name.toLowerCase().includes(query) ||
      patient.phone.includes(query)
    );
  }
  
  // Apply gender filter
  if (params?.gender && params.gender !== 'all') {
    filteredPatients = filteredPatients.filter(patient => patient.gender === params.gender);
  }
  
  return {
    data: filteredPatients,
    total: filteredPatients.length
  };
};

export const fetchPatientById = async (id: number): Promise<Patient> => {
  await delay(300);
  
  const patient = mockPatients.find(p => p.id === id);
  if (!patient) {
    throw new Error("ไม่พบข้อมูลผู้ป่วย");
  }
  
  return patient;
};

export const fetchPatientHistory = async (patientId: string): Promise<PatientHistory[]> => {
  await delay(400);
  
  return mockHistory.filter(h => h.patient_id === patientId);
};

export const createPatient = async (payload: CreatePatientPayload): Promise<Patient> => {
  await delay(800);
  
  // Simulate validation
  if (!payload.patient_id || !payload.first_name || !payload.last_name) {
    throw new Error("กรุณากรอกข้อมูลที่จำเป็น");
  }
  
  // Check if patient ID already exists
  if (mockPatients.some(p => p.patient_id === payload.patient_id)) {
    throw new Error("รหัสผู้ป่วยนี้มีอยู่แล้ว");
  }
  
  const newPatient: Patient = {
    id: Math.max(...mockPatients.map(p => p.id)) + 1,
    ...payload,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  mockPatients.push(newPatient);
  return newPatient;
};

export const updatePatient = async (id: number, payload: Partial<CreatePatientPayload>): Promise<Patient> => {
  await delay(600);
  
  const index = mockPatients.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error("ไม่พบผู้ป่วยที่ต้องการแก้ไข");
  }
  
  mockPatients[index] = {
    ...mockPatients[index],
    ...payload,
    updated_at: new Date().toISOString()
  };
  
  return mockPatients[index];
};

export const deletePatient = async (id: number): Promise<void> => {
  await delay(400);
  
  const index = mockPatients.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error("ไม่พบผู้ป่วยที่ต้องการลบ");
  }
  
  mockPatients.splice(index, 1);
};

export const addPatientHistory = async (patientId: string, historyData: Omit<PatientHistory, 'id' | 'patient_id' | 'created_at'>): Promise<PatientHistory> => {
  await delay(500);
  
  const newHistory: PatientHistory = {
    id: Math.max(...mockHistory.map(h => h.id)) + 1,
    patient_id: patientId,
    ...historyData,
    created_at: new Date().toISOString()
  };
  
  mockHistory.push(newHistory);
  return newHistory;
};
