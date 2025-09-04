package patientEntity

import (
	"gorm.io/gorm"
	"time"
)

type InitialSymptomps struct {
	gorm.Model
	Symptomps     string    `json:"symptomps"`
	BloodPressure string    `json:"bloodpressure"`
	Visit         time.Time `json:"visit"`
	HeartRate     string    `json:"heartrate"`
	Weight        float64   `json:"weight"`
	Height        float64   `json:"height"`

	ServiceID uint     `json:"serviceID" gorm:"index"`
	PatientID uint     `json:"patientID" gorm:"index"`
	Patient   *Patient `json:"patient,omitempty"`
}