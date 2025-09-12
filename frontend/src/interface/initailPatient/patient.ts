export interface ContactPerson {
  relationship?: string;
  emergency_phone?: string;
}

export interface Address {
  house_number?: string;
  moo?: string;
  subdistrict?: string;
  district?: string;
  province?: string;
  postcode?: string;
}

export interface Patient {
  citizenID?: string;
  prefix?: string;
  firstname?: string;
  lastname?: string;
  nickname?: string;
  congenita_disease?: string;
  blood_type?: string;
  gender?: "male" | "female" | "";

  birthday?: string;      // "YYYY-MM-DD"
  phone_number?: string;
  age?: number;

  drug_allergy_type?: "hasAllergy" | "noAllergy"; // optional ถ้าอยากส่ง
  drug_allergy?: string;  // ✅ backend ต้องการ snake_case

  contactperson?: ContactPerson | null;
  address?: Address | null;
}

export interface PatientRow {
  id: string | number;
  citizenID: string;
  firstname: string;
  lastname: string;
  phonenumber: string;
}
