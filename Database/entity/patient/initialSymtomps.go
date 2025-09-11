package patient

import (
	"gorm.io/gorm"
	"time"
)

type InitialSymptomps struct {
	gorm.Model
	Symptomps     string    `json:"symptomps"`
//Blood Pressure (Systolic บีบตีว/Diastolic คลายตัว)
	Systolic		int		`json:"systolic"`
	Diastolic		int		`json:"diastolic"`
	HeartRate     string    `json:"heartrate"`
	Visit         time.Time `json:"visit"`
	Weight        float64   `json:"weight"`
	Height        float64   `json:"height"`

	 // FK ไปหา Patient
	 PatientID uint             `json:"patientID"`
	 Patient   Patient          `json:"patient" gorm:"foreignKey:PatientID;references:ID"`
 
	 // FK ไปหา Service
	 ServiceID *uint `json:"serviceID,omitempty"`

	StatusID uint   `json:"statusID"`
	Status   Status `json:"status" gorm:"foreignKey:StatusID;references:ID"`
}

type Status struct{
	gorm.Model
	StatusName string
}
