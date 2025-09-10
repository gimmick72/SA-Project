// src/interface/Staff.ts

export interface PersonalData {
  ID?: number;             // gorm.Model ID
  Title: string;
  FirstName: string;
  LastName: string; 
  Gender: string;
  Age: number;
  EmpNationalID: string;
  Email: string;
  Tel: string;

  HouseNumber: string;
  Subdistrict: string;
  District: string;
  VillageNumber: string;

  CreatedAt?: string;      // gorm.Model timestamps
  UpdatedAt?: string;
  DeletedAt?: string | null;
}

export interface Department {
  ID?: number;
  PersonalDataID: number;
  PersonalData?: PersonalData;

  Position: string;
  EmpType: string;
  License: string;
  CompRate: number;
  Specialization: string;
  StartDate: string;

  CreatedAt?: string;
  UpdatedAt?: string;
  DeletedAt?: string | null;
}

export interface NewStaffData {
  title: string;
  firstName: string;
  lastName: string;
  gender: string;
  age: number;
  idCard: string;
  phone: string;
  email: string;

  HouseNumber: string;
  Subdistrict: string;
  District: string;
  VillageNumber: string;
  address: string;

  position: string;
  employeeType: string;
  licenseNumber?: string;
  Specialization?: string;
  CompRate?: number;
  startDate: any; // DatePicker คืนค่า moment
}

export interface Staff {
  ID: number | undefined;
  Employee_ID: number;
  title: string;
  firstName: string;
  lastName: string;
  gender: string;
  age: number;
  idCard: string;
  phone: string;
  email: string;

  HouseNumber: string;
  Subdistrict: string;
  District: string;
  VillageNumber: string;
  address: string;

  position: string;
  employeeType: string;
  licenseNumber: string;
  Specialization?: string;
  CompRate: number;
  startDate: string;

  Department: any; // optional, join กับ PersonalData
}
