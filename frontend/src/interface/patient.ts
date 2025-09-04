
export interface Patient {
 
  citizenID: string;
  prefix: string;
  firstname: string;
  lastname: string;
  nickname: string;
  congenitadisease: string;
  blood_type: string;
  gender: string;
  birthday: string;
  phonenumber: string;
  age: number;
  drugallergy: string;
  drugAllergyType: string;

}

// ใช้สำหรับตาราง (แค่ฟิลด์ที่ต้องโชว์)
export interface PatientRow {
  id: number | string;
  firstname: string;
  lastname: string;
  phonenumber: string;
}