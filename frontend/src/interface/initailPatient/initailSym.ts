
export interface InitialSymtoms{
    symptomps: string;
    systolic: number;
    diastolic: number;
    heartrate: string;  // Backend expects string
    visit: Date;
    weight: number;     // Backend expects float64, not Float64Array
    height: number;     // Backend expects float64, not Float64Array
    serviceID: number;  // Required by backend
    patientID: number;  // Required by backend

}

