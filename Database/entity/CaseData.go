// Database/entity/CaseData.go
package entity

import (
	"time"

	"gorm.io/gorm"

	"Database/entity/patient"
)

type CaseData struct {
	gorm.Model
	SignDate      time.Time
	Appointment_date time.Time
	Note          string
	TotalPrice    float64 `gorm:"type:decimal(10,2)"`

	DepartmentID uint
	Department   Department `gorm:"foreignKey:DepartmentID"`

	PatientID  uint      `json:"patient_id" gorm:"index"` // <- ต้องมีคอลัมน์นี้ในตาราง
    Patient    patient.Patient `json:"patient"`

	// TreatmentID uint
	 Treatments []Treatment `json:"treatments" gorm:"foreignKey:CaseID"`
}
