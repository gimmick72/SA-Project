package entity

import (
	"gorm.io/gorm"
)

type Address struct {
	gorm.Model
	HouseNumber string   `json:"house_number"`
	Moo         string   `json:"moo"`
	Subdistrict string   `json:"subdistrict"`
	District    string   `json:"district"`
	Province    string   `json:"province"`
	Postcode    string   `json:"postcode"`
	PatientID uint `gorm:"index;not null;constraint:OnDelete:CASCADE;"`
	Patient     *Patient `json:"patient,omitempty"`
}
