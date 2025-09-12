import api from './api';

// Patient Types
export interface Patient {
  id: number;
  citizen_id: string;
  prefix: string;
  first_name: string;
  last_name: string;
  nick_name: string;
  enthnicity: string;
  nationality: string;
  congenita_disease: string;
  blood_type: string;
  gender: string;
  birth_day: string;
  phone_number: string;
  age: number;
  drug_allergy: string;
  created_at: string;
  updated_at?: string;
  addresses?: Address[];
  contact_people?: ContactPerson[];
  initial_symptomps?: InitialSymptomps[];
}

export interface Address {
  id: number;
  house_number: string;
  moo: string;
  subdistrict: string;
  district: string;
  province: string;
  postcode: string;
  patient_id: number;
}

export interface ContactPerson {
  id: number;
  relationship: string;
  contactper_phone: string;
  patient_id: number;
}

export interface InitialSymptomps {
  id: number;
  symptomps: string;
  blood_pressure: string;
  visit: string;
  heart_rate: string;
  weight: number;
  height: number;
  patient_id: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  pagination?: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}

// Patient API
export const patientAPI = {
  // Get all patients
  getPatients: async (params?: {
    page?: number;
    page_size?: number;
    search?: string;
    blood_type?: string;
    gender?: string;
  }) => {
    const response = await api.get<ApiResponse<Patient[]>>('/patients', { params });
    return response.data;
  },

  // Get patient by ID
  getPatientById: async (id: number) => {
    const response = await api.get<ApiResponse<Patient>>(`/patients/${id}`);
    return response.data;
  },

  // Create new patient
  createPatient: async (patientData: {
    citizen_id: string;
    prefix: string;
    first_name: string;
    last_name: string;
    nick_name: string;
    enthnicity: string;
    nationality: string;
    congenita_disease: string;
    blood_type: string;
    gender: string;
    birth_day: string;
    phone_number: string;
    age: number;
    drug_allergy: string;
    addresses?: Omit<Address, 'id' | 'patient_id'>[];
    contact_people?: Omit<ContactPerson, 'id' | 'patient_id'>[];
    initial_symptomps?: Omit<InitialSymptomps, 'id' | 'patient_id'>[];
  }) => {
    const response = await api.post<ApiResponse<Patient>>('/patients', patientData);
    return response.data;
  },

  // Update patient
  updatePatient: async (id: number, patientData: Partial<Patient>) => {
    const response = await api.put<ApiResponse<Patient>>(`/patients/${id}`, patientData);
    return response.data;
  },

  // Delete patient
  deletePatient: async (id: number) => {
    const response = await api.delete<ApiResponse<null>>(`/patients/${id}`);
    return response.data;
  },

  // Get patient history
  getPatientHistory: async (patientId: number) => {
    const response = await api.get<ApiResponse<any[]>>(`/patients/${patientId}/history`);
    return response.data;
  },
};
