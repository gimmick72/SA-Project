package entity

import (
	"time"

	"gorm.io/gorm"
)

type CaseData struct {
	gorm.Model
	FollowUpDate time.Time
	Note         string

	PersonalDataID uint
	PersonalData   PersonalData `gorm:"foreignKey:PersonalDataID"`

	PatientID uint
	Patient   Patient `gorm:"foreignKey:PatientID"`

	// One case → many treatment records
	TreatmentTeeth []TreatmentTooth `gorm:"foreignKey:CaseDataID"`
}

type TreatmentTooth struct {
	gorm.Model
	CaseDataID     uint
	TreatmentDate  time.Time
	TreatmentName  string
	Price          float64 `gorm:"type:decimal(10,2)"`

	ToothPositionID uint
	ToothPosition   ToothPosition `gorm:"foreignKey:ToothPositionID"`

	ToothNumberID uint
	ToothNumber   ToothNumber `gorm:"foreignKey:ToothNumberID"`
}

type ToothNumber struct {
	gorm.Model
	Number int
}

type ToothPosition struct {
	gorm.Model
	Position string
}
