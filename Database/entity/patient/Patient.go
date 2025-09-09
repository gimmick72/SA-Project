package patient

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
	CongenitaDisease string    `json:"congenitadisease"`
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

}

// type PatientData struct {
// 	gorm.Model
// 	CitizenID        string    `json:"citizenID"`
// 	Prefix           string    `json:"prefix"`
// 	FirstName        string    `json:"firstname"`
// 	LastName         string    `json:"lastname"`
// 	NickName         string    `json:"nickname"`
// 	CongenitaDisease string    `json:"congenitadisease"`
// 	BloodType        string    `json:"blood_type"`
// 	Gender           string    `json:"gender"`
// 	Birthday time.Time `json:"birthday" time_format:"2006-01-02" time_utc:"1" binding:"required"`
// 	PhoneNumber      string    `json:"phone_number"`
// 	Age              int       `json:"age"`
// 	DrugAllergyType string    `json:"drug_allergy_type"`
// 	DrugAllergy      string    `json:"drug_allergy"`

// 	ContactPerson *ContactPerson `json:"contactperson,omitempty" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
// 	Address       *Address       `json:"address,omitempty" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
// 	Histories   []HistoryPatient `json:"histories" gorm:"foreignKey:PatientID"`
// 	InitialSymptomps []InitialSymptomps `json:"initialsymptomps" gorm:"foreignKey:PatientID"`
// };
