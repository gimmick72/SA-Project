package entity
import (
	"gorm.io/gorm"
	
)


type HistoryPatient struct {
	gorm.Model

	PatientID uint
	Patient   Patient `gorm:"foreignKey:PatientID;references:ID"`

	ServiceID uint
	Service   Service `gorm:"foreignKey:ServiceID;references:ID"`
}