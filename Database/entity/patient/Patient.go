// entity/patient.go
package patientEntity

import (
	"time"

	"gorm.io/gorm"
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
	BirthDay         time.Time `json:"birthday" time_format:"2006-01-02" time_utc:"1"`
	PhoneNumber      string    `json:"phonenumber"`
	Age              int       `json:"age"`
	DrugAllergy      string    `json:"drugallergy"`

	ContactPerson    *ContactPerson     `json:"contactperson,omitempty" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Address          *Address           `json:"address,omitempty" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	InitialSymptomps []InitialSymptomps `json:"initialsymptomps,omitempty" gorm:"constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;"`
	Histories        []HistoryPatient   `json:"histories,omitempty" gorm:"constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;"`
}
