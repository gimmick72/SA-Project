package entity

import (
	

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

	Department   *Department `gorm:"foreignKey:PersonalDataID;references:ID"` // 1 ต่อ 1
}

