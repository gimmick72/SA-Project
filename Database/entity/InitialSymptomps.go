package entity

import (
	"gorm.io/gorm"
	"time"
)

type InitialSymptomps struct {
	gorm.Model
	Symptomps     string
	BloodPressure string
	Visit         time.Time
	HeartRate     string
	Weight        float64
	Height        float64

	ServiceID uint
	Service   Service `gorm:"foreignKey:ServiceID;references:ID"`

	PatientID uint
	Patient   Patient `gorm:"foreignKey:PatientID;references:ID"`
	
	StatusID uint
	Status   Status `gorm:"foreignKey:StatusID;references:ID"`
}

type Status struct{
	gorm.Model
	StatusName string
}
