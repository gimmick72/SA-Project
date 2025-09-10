//Database/entity/Address.go		
package entity
import (
	"gorm.io/gorm"
	
)

type Address struct {
	gorm.Model
	HouseNumber string
	Moo         string
	Subdistrict string
	District    string
	Provice     string
	Postcod     string

	PatientID uint
	Patient   *Patient `gorm:"foreignKey:PatientID;references:ID"`
}


