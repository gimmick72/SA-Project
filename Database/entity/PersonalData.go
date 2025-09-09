package entity

import (
	"gorm.io/gorm"
	"time"
)

type PersonalData struct{
	gorm.Model
	Title string
	FullName string
	Gender string
	Email string
	Age int
	EmpNationalID string
	Tel string
	HouseNumber string
	Subdistrict string
	District string
	VillageNumber string
}

type Department struct{
	gorm.Model
	Position string
	EmpType string
	AffBrance string
	License string
	CompRate float32
	LicenseDate time.Time
	Specialization string
	StartDate time.Time

	PersonalDataID uint
	PersonalData PersonalData
}