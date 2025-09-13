// src/interface/patient.ts
export interface Address {
  HouseNumber?: string;
  Moo?: string;
  Subdistrict?: string;
  District?: string;
  Provice?: string;
  Postcod?: string;
}

export interface ContactPerson {
  Relationship?: string;
  ContactperPhone?: string;
}

export interface InitialSymptomps {
  Symptomps?: string;
  systolic?: number;   // ต้องตรงกับ API key
  diastolic
  ?: number;  // ต้องตรงกับ API key
  Visit?: string | Date; // ถ้าใช้ date จาก backend
  HeartRate?: string;
  Weight?: number;
  Height?: number;
}

export interface Patients {
  ID?: number;
  CitizenID?: string;
  Prefix?: string;
  FirstName?: string;
  LastName?: string;
  NickName?: string;
  phone_number?: string;
  Age?: number;
  drug_allergy
  ?: string;
  Address?: Address[];
  ContactPerson?: ContactPerson[];
  InitialSymptomps?: InitialSymptomps[];
  congenital_disease?: string;
  BloodType?: string

  patient?: any
}
export interface CaseData {
  ID?: number;
  SignDate: string;
  Note: string;
  PatientID: number;
  DepartmentID: number;
  appointment_date?: string;  // ✅ new
  TotalPrice?: number;     // ✅ new
  Treatment?: Treatment[];
  Patient?: any;

  Department?: {
    ID: number;
    Position: string;
    EmpType: string;
    License: string;
    CompRate: number;
    Specialization: string;
    StartDate: string;
    PersonalData?: {
      ID: number;
      FirstName: string;
      LastName: string;
      Title?: string;
      Gender?: string;
    };
  };

}

export interface Treatment {
  ID?: number;                // PK from DB
  CaseDataID?: number;        // FK -> case
  TreatmentName: string;
  Price: number;
  appointment_date?: string | null; // ISO string หรือ null
}

export type CaseRow = {
  id: number;
  patientId: number;
  appointment_date?: string | null;
  treatments: Treatment[];
  note?: string;
  patient?: any; // can tighten type if you have Patient interface
  SignDate?: string;
  totalPrice?: number;   // ✅ new field

};