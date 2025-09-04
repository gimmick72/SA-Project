package entity

import (
	"time"

	"gorm.io/gorm"
)

type Department struct {
	gorm.Model
	Position       string
	EmpType        string
	AffBrance      string
	License        string
	CompRate       float32
	LicenseDate    time.Time
	Specialization string
	StartDate      time.Time

	PersonalDataID uint
	PersonalData   PersonalData `gorm:"foreignKey:PersonalDataID;references:ID"`
}
