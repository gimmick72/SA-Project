import axios from "axios";
import type { AxiosError } from "axios";


const API_URL = "http://localhost:8080/api";


export interface Service {
  Id: number;
  Name: string;
}

export interface Patient {
  ID: number;
  FirstName: string;
  LastName: string;
}

export interface Status {
  ID: number;
  Name: string;
}

export interface Symptomps {
  ID: number;
  Symptomps: string;
  BloodPressure: string;
  Visit: string;
  HeartRate: string;
  Weight: number;
  Height: number;
  ServiceID: number;
  PatientID: number;
  StatusID: number;
  Service?: Service;
  Patient?: Patient;
  Status?: Status;
}


export interface SymptompsResponse {
  date: string;
  symptomps: Symptomps[];
}

// ฟังก์ชันดึงข้อมูลของวันนี้
export const getTodayInitialSymptomps = async (): Promise<SymptompsResponse> => {
  const response = await axios.get<SymptompsResponse>(`${API_URL}/dashboardStaff`);
  return response.data;
};