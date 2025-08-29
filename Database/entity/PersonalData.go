package entity

import (
	"time"

	"gorm.io/gorm"
)

type PersonalData struct {
	gorm.Model
	Title         string
	FirstName     string
	LastName      string
	Gender        string
	Email         string
	Age           int
	EmpNationalID string
	Tel           string
	HouseNumber   string
	Subdistrict   string
	District      string
	VillageNumber string
}


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
