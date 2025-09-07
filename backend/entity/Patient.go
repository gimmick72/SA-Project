package entity

import (
	"time"

	"gorm.io/gorm"
)

type Patient struct {
	gorm.Model
	CitizenID        string    `gorm:"unique;not null;type:char(13)" json:"citizenID"`
	Prefix           string    `gorm:"not null" json:"prefix"`
	FirstName        string    `gorm:"not null" json:"firstname"`
	LastName         string    `gorm:"not null" json:"lastname"`
	NickName         string    `gorm:"not null" json:"nickname"`
	CongenitaDisease string    `gorm:"not null" json:"congenitadisease"`
	BloodType        string    `gorm:"not null" json:"blood_type"`
	Gender           string    `gorm:"not null" json:"gender"`
	BirthDay         time.Time `gorm:"not null" json:"birthday"`
	PhoneNumber      string    `gorm:"not null" json:"phonenumber"`
	Age              int       `gorm:"not null" json:"age"`
	DrugAllergy      string    `gorm:"not null" json:"drugallergy"`

	ContactPerson    *ContactPerson     `gorm:"foreignKey:PatientID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"contactperson,omitempty"`
	Address          *Address           `gorm:"foreignKey:PatientID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"address,omitempty"`
	InitialSymptomps []InitialSymptomps `gorm:"foreignKey:PatientID;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;" json:"initialsymptomps,omitempty"`
	Histories        []HistoryPatien    `gorm:"foreignKey:PatientID;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;" json:"histories,omitempty"`
}

type ContactPerson struct {
	gorm.Model
	Relationship       string   `gorm:"not null" json:"relationship"`
	ContactpersonPhone string   `gorm:"not null" json:"contactpersonphone"`
	PatientID          uint     `gorm:"not null;uniqueIndex" json:"patientID"`
	Patient            *Patient `json:"patient,omitempty"`
}

type Address struct {
	gorm.Model
	HouseNumber string   `gorm:"not null" json:"housenumber"`
	Moo         string   `gorm:"not null" json:"moo"`
	Subdistrict string   `gorm:"not null" json:"subdistrict"`
	District    string   `gorm:"not null" json:"district"`
	Provice     string   `gorm:"not null" json:"provice"`
	Postcod     string   `gorm:"not null" json:"postcod"`
	PatientID   uint     `gorm:"not null;uniqueIndex" json:"patientID"`
	Patient     *Patient `json:"patient,omitempty"`
}

type InitialSymptomps struct {
	gorm.Model
	Symptomps     string    `gorm:"not null" json:"symptomps"`
	BloodPressure string    `gorm:"not null" json:"bloodpressure"`
	Visit         time.Time `gorm:"not null" json:"visit"`
	HeartRate     string    `gorm:"not null" json:"heartrate"`
	Weight        float64   `gorm:"not null" json:"weight"`
	Height        float64   `gorm:"not null" json:"height"`

	ServiceID uint     `gorm:"not null;index" json:"serviceID"`
	
	PatientID uint     `gorm:"not null;index" json:"patientID"`
	Patient   *Patient `json:"patient,omitempty"`
}

type HistoryPatien struct {
	gorm.Model
	PatientID uint     `gorm:"not null;index" json:"patientID"`
	Patient   *Patient `json:"patient,omitempty"`

	ServiceID uint     `gorm:"not null;index" json:"serviceID"`
	Service   *Service `json:"service,omitempty"`

	CaseDataID uint      `json:"caseDataID"`
	CaseData   *CaseRef  `json:"caseData,omitempty"`
}

type ExternalService struct {
	ID    uint    `json:"id"`
	Name  string  `json:"name"`
	Price float64 `json:"price"`
	
}

type CaseRef struct {
	ID       uint    `json:"id"`
	Code     string  `json:"code"`
	Title    string  `json:"title"`
	Diagnosis string `json:"diagnosis"`
	Price    float64 `json:"price"`
}