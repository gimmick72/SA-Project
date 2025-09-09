package patient

import (
	"gorm.io/gorm"
)

type ContactPerson struct {
	gorm.Model
	Relationship string `json:"relationship"`
	PhoneNumber  string `json:"emergency_phone"`
	PatientID uint `gorm:"index;not null;constraint:OnDelete:CASCADE;"`
}