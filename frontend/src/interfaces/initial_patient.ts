export interface PersonalInfomation{
    id:number;
    citizenID: string;
    prefix : string;
    firstname: string;
    lastname: string;
    nickname: string;
    gender:"male"|"female";
    birthdate: Date;
    age:number;
    ethnicity: string;
    nationality: string;
    phone_number: string;
    underlyingDisease:string;
    bloodtype: string;
    drugAllergy?: string;
    contact: Contact;
    histories?: History[];
}

export interface Contact{
    id:number;
    relationship: string;
    phone_number: string;
    address: PatientAddress;
}

export interface PatientAddress {
    id: string;
    houseNo: string;
    moo: string;
    subdistrict: string;
    district: string;
    province: string;
    postcode: string;
  }

export interface History {
    id: number;
    visitDate: Date;
    service: string;
    dentist: string;
    diagnosis: string;
    note?: string;
  }