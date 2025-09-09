package entity

import (
	"gorm.io/gorm"
)

type HistoryPatient struct {
	gorm.Model
	PatientID uint     `json:"patientID" gorm:"index"`
	Patient   *Patient `json:"patient,omitempty"`

	ServiceID uint             `json:"serviceID" gorm:"index"`
	Service   *ExternalService `json:"service,omitempty"`
}

// Define the ExternalService struct
type ExternalService struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}

	// CaseDataID uint     `json:"caseDataID"` 
	// CaseData   *CaseRef `json:"caseData,omitempty"` 


// Define the CaseRef struct
type CaseRef struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}
