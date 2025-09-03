
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

}

export interface CreatePatient {
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
}

