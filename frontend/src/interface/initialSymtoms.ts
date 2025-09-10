import type {Patient} from "./initailPatient/patient";

export interface InitialSymptoms extends Patient {
    symptomps : string;
	bloodpressure : string;
	visit : string;
	heartrate : string;
	weight  : Float64Array;
	height : Float64Array;
}