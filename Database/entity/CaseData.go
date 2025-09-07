// Database/entity/CaseData.go
package entity

import (
	"time"

	"gorm.io/gorm"
)

type CaseData struct {
	gorm.Model
	SignDate      time.Time
	Appointment_date time.Time
	Note          string
	TotalPrice    float64 `gorm:"type:decimal(10,2)"`

	DepartmentID uint
	Department   Department `gorm:"foreignKey:DepartmentID"`

	PatientID uint
	Patient   Patient `gorm:"foreignKey:PatientID"`

	// TreatmentID uint
	Treatment   []Treatment `gorm:"foreignKey:CaseDataID"`
}
