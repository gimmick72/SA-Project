//Database/entity/ContactPerson.go
package entity
import (
	"gorm.io/gorm"
)
type ContactPerson struct {
	gorm.Model
	Relationship   string
	ContactperPhone string

	PatientID uint
	Patient   Patient `gorm:"foreignKey:PatientID;references:ID"`
}
