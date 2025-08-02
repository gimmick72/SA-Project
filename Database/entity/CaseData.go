package entity
import (
	"gorm.io/gorm"
	"time"
)

type CaseData struct{
	gorm.Model
	FollowUpDate time.Time
	Note string
	
	PersonalDataID uint
	PersonalData PersonalData `gorm:"foreignKey"`

	PatientID uint
	Patient Patient `gorm:"foreignKey"`

	TreatmentToothID uint
	TreatmentTooth TreatmentTooth `gorm:"foreignKey"`
}

type ToothNumber struct{
	gorm.Model
	Number int
}

type ToothPodition struct{
	gorm.Model
	Position string
}

type Treatment struct{
	gorm.Model
	TreatmentName string
}


//ระบุฟัน ชี่ไหน ทำอะไร
type TreatmentTooth struct{
	gorm.Model
	TreatmentDate time.Time

	ToothPoditionID uint
	ToothPodition ToothPodition `gorm:"foreignKey"`

	ToothNumberID uint
	ToothNumber ToothNumber `gorm:"foreignKey"`

	TreatmentID uint
	Treatment Treatment `gorm:"foreignKey"`
}