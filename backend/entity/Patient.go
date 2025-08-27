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
}

type ContactPerson struct{
	gorm.Model
	Relationship string
	ContactperPhone string

	PatientID uint
	Patient Patient
}

type Address struct{
	gorm.Model
	HouseNumber string
	Moo string
	Subdistrict string
	District string
	Provice string
	Postcod string

	PatientID uint
	Patient Patient
}

type InitialSymptomps struct{
	gorm.Model
	Symptomps string
	BloodPressure string
	Visit time.Time
	HeartRate string
	weight float64
	Height float64
	
	ServiceID uint
	Service Service

	PatientID uint
	Patient Patient
}

type HistoryPatien struct{
	gorm.Model
	
	PatientID uint
	Patient []Patient

	ServiceID uint
	Service []Service

}