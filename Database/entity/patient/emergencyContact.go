package patientEntity

import (
	"gorm.io/gorm"
)

type ContactPerson struct {
	gorm.Model
	Relationship       string   `json:"relationship"`
	ContactpersonPhone string   `json:"contactpersonphone"`
	PatientID          uint     `json:"patientID" gorm:"uniqueIndex"`
	Patient            *Patient `json:"patient,omitempty"`
}