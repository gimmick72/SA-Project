// entity/patient.go
package patientEntity

import (
	"time"

	"gorm.io/gorm"
)

type Patient struct {
	gorm.Model
	 PatientID uint `gorm:"column:patient_id;primaryKey;autoIncrement"`
	CitizenID        string    `json:"citizenID"`
	Prefix           string    `json:"prefix"`
	FirstName        string    `json:"firstname"`
	LastName         string    `json:"lastname"`
	NickName         string    `json:"nickname"`
	CongenitaDisease string    `json:"congenitadisease"`
	BloodType        string    `json:"blood_type"`
	Gender           string    `json:"gender"`
	BirthDay         time.Time `json:"birthday"`
	PhoneNumber      string    `json:"phonenumber"`
	Age              int       `json:"age"`
	DrugAllergy      string    `json:"drugallergy"`

// 	ContactPerson    *ContactPerson     `json:"contactperson,omitempty" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
// 	Address          *Address           `json:"address,omitempty" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
// 	InitialSymptomps []InitialSymptomps `json:"initialsymptomps,omitempty" gorm:"constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;"`
// 	Histories        []HistoryPatien    `json:"histories,omitempty" gorm:"constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;"`
}

// type ContactPerson struct {
// 	gorm.Model
// 	Relationship       string   `json:"relationship"`
// 	ContactpersonPhone string   `json:"contactpersonphone"`
// 	PatientID          uint     `json:"patientID" gorm:"uniqueIndex"`
// 	Patient            *Patient `json:"patient,omitempty"`
// }

// type Address struct {
// 	gorm.Model
// 	HouseNumber string   `json:"housenumber"`
// 	Moo         string   `json:"moo"`
// 	Subdistrict string   `json:"subdistrict"`
// 	District    string   `json:"district"`
// 	Province    string   `json:"province"`
// 	Postcode    string   `json:"postcode"`
// 	PatientID   uint     `json:"patientID" gorm:"uniqueIndex"`
// 	Patient     *Patient `json:"patient,omitempty"`
// }

// type InitialSymptomps struct {
// 	gorm.Model
// 	Symptomps     string    `json:"symptomps"`
// 	BloodPressure string    `json:"bloodpressure"`
// 	Visit         time.Time `json:"visit"`
// 	HeartRate     string    `json:"heartrate"`
// 	Weight        float64   `json:"weight"`
// 	Height        float64   `json:"height"`

// 	ServiceID uint     `json:"serviceID" gorm:"index"`
// 	PatientID uint     `json:"patientID" gorm:"index"`
// 	Patient   *Patient `json:"patient,omitempty"`
// }

// type HistoryPatien struct {
// 	gorm.Model
// 	PatientID uint `json:"patientID" gorm:"index"`
// 	Patient   *Patient `json:"patient,omitempty"`

// 	ServiceID uint            `json:"serviceID" gorm:"index"`
// 	Service   *ExternalService `json:"service,omitempty"`

// 	CaseDataID uint     `json:"caseDataID"`
// 	CaseData   *CaseRef `json:"caseData,omitempty"`
// }

// type ExternalService struct {
// 	ID    uint    `json:"id"`
// 	Name  string  `json:"name"`
// 	Price float64 `json:"price"`
// }

// type CaseRef struct {
// 	ID        uint    `json:"id"`
// 	Code      string  `json:"code"`
// 	Title     string  `json:"title"`
// 	Diagnosis string  `json:"diagnosis"`
// 	Price     float64 `json:"price"`
// }
