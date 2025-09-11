package entity

import (
	"gorm.io/gorm"
	"time"
)

type Patient struct {
	gorm.Model
	CitizenID        string    `json:"citizenID"`
	Prefix           string    `json:"prefix"`
	FirstName        string    `json:"firstname"`
	LastName         string    `json:"lastname"`
	NickName         string    `json:"nickname"`
	CongenitalDisease string    `json:"congenital_disease"`
	BloodType        string    `json:"blood_type"`
	Gender           string    `json:"gender"`
	Birthday         time.Time `json:"birthday" gorm:"type:date"`
	PhoneNumber      string    `json:"phone_number"`
	Age              int       `json:"age"`
	DrugAllergyType  string    `json:"drug_allergy_type"`
	DrugAllergy      string    `json:"drug_allergy"`

	ContactPerson    *ContactPerson     `json:"contactperson,omitempty" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Address          *Address           `json:"address,omitempty" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Histories        []HistoryPatient   `json:"histories" gorm:"foreignKey:PatientID "`
	InitialSymptomps []InitialSymptomps `json:"initialsymptomps" gorm:"foreignKey:PatientID;references:ID"`
	CaseData		[]CaseData		`json:"case_data" gorm:"foreignKey:PatientID;references:ID"`

}

