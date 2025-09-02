// src/pages/staff_info/types.ts

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
    AffBrance: string;
    License: string;
    CompRate: number;
    LicenseDate: string;
    Specialization: string;
    StartDate: string;

    PersonalDataID: number;
    PersonalData?: PersonalData;

    CreatedAt?: string;
    UpdatedAt?: string;
    DeletedAt?: string | null;
}

