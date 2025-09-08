package patientEntity

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

	ServiceID uint     `json:"serviceID" gorm:"index"`
	PatientID uint     `json:"patientID" gorm:"index"`
	Patient   *Patient `json:"patient,omitempty" gorm:"foreignKey:PatientID;references:ID"`

}