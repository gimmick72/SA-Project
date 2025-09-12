//Database/interface/patient.ts
export interface Patient {
  id: number;
  citizenID: string;
  prefix: string;
  firstname: string;
  lastname: string;
  nickname: string;
  congenita_disease: string;
  blood_type: string;
  gender: string;
  birth_day: string;
  phonenumber: string;
  age: number;
  drugallergy: string;

  contactperson?: ContactPerson;
  address?: Address;
  initialsymptomps?: InitialSymptomps[];
  histories?: HistoryPatien[];
}

export interface ContactPerson {
  id: number;
  relationship: string;
  contactpersonphone: string;
  patientID: number;

  patient?: Patient;
}

export interface Address {
  id: number;
  housenumber: string;
  moo: string;
  subdistrict: string;
  district: string;
  provice: string;
  postcod: string;
  patientID: number;

  patient?: Patient;
}

export interface InitialSymptomps {
  id: number;
  symptomps: string;
  bloodpressure: string;
  visit: string; // ISO string
  heartrate: string;
  weight: number;
  height: number;
  serviceID: number;
  patientID: number;

  service?: ServiceRef;
  patient?: Patient;
}

export interface ServiceRef {
  id: number;
  name: string;
  price: number;
}

export interface HistoryPatien {
  id: number;
  patientID: number;
  caseDataID: number; // อ้างอิงเคสจากอีกระบบ/อีกตาราง
  note?: string;

  patient?: Patient;
  caseData?: CaseRef; // แนบรายละเอียดเคสตอน GET (optional)
}

export interface CaseRef {
  id: number;
  code: string;
  title: string;
  diagnosis?: string;
  price?: number;
}
