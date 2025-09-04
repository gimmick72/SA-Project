// src/interface/types.ts

export interface PersonalData {
    ID?: number;             // gorm.Model ID
    Title: string;
    FirstName: string;
    LastName: string; 
    Gender: string;
    Email: string;
    Age: number;
    EmpNationalID: string;
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
    Position: string;
    EmpType: string;
    License: string;
    CompRate: number;
    Specialization: string;
    StartDate: string;

    PersonalDataID: number;
    PersonalData?: PersonalData;

    CreatedAt?: string;
    UpdatedAt?: string;
    DeletedAt?: string | null;
}

export interface NewStaffData {
  VillageNumber: string;
  District: string;
  Subdistrict: string;
  HouseNumber: string;
  title: string;
  firstName: string;
  lastName: string;
  gender: string;
  age: number;
  idCard: string;
  phone: string;
  email: string;
  address: string;
  position: string;
  employeeType: string;
  licenseNumber?: string;
  Specialization?: string;
  CompRate?: number;
  startDate: any; // DatePicker คืนค่า moment
}

export interface Staff {
  Department: any;
  ID: number | undefined;
  Employee_ID: number;
  title: string;
  firstName: string;
  lastName: string;
  position: string;
  phone: string;
  gender: string;
  startDate: string;
  age: number;
  idCard: string;
  address: string;
  email: string;
  employeeType: string;
  licenseNumber: string;
  Specialization?: string;
  HouseNumber: string;
  Subdistrict: string;
  District: string;
  VillageNumber: string;
  CompRate: number;
}