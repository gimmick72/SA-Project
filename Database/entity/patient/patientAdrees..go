package patientEntity

import (
	"gorm.io/gorm"
)

type Address struct {
	gorm.Model
	HouseNumber string   `json:"housenumber"`
	Moo         string   `json:"moo"`
	Subdistrict string   `json:"subdistrict"`
	District    string   `json:"district"`
	Province    string   `json:"province"`
	Postcode    string   `json:"postcode"`
	PatientID   uint     `json:"patientID" gorm:"uniqueIndex"`
	Patient     *Patient `json:"patient,omitempty"`
}