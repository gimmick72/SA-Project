//Database/entity/Patient.go
package entity
import (
	"gorm.io/gorm"
	"time"
)

type Patient struct{
	gorm.Model
	CitizenID string
	Prefix string
	FirstName string
	LastName string
	NickName string
	Enthnicity string
	Nationality string
	CongenitaDisease string
	BloodType string
	Gender string
	BirthDay time.Time
	PhoneNumber string
	Age int
	DrugAllergy string
	// HistoryPatientID uint
	HistoryPatient []HistoryPatient `gorm:"foreignKey:PatientID"`

	// AddressID uint
	Address []Address `gorm:"foreignKey:PatientID"`

	// ContactPersonID uint
	ContactPerson []ContactPerson `gorm:"foreignKey:PatientID"`

	// InitialSymptompID uint
	InitialSymptomps []InitialSymptomps `gorm:"foreignKey:PatientID"`
}