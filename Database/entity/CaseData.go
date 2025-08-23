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
	PersonalData PersonalData `gorm:"foreignKey:PerdonalDataID;references:ID"`

	PatientID uint
	Patient Patient `gorm:"foreignKey:PatientID;references:ID"`

	TreatmentToothID uint
	TreatmentTooth TreatmentTooth `gorm:"foreignKey:TreatmentToothID;references:ID"`
}

type ToothNumber struct{
	gorm.Model
	Number int
}

type ToothPosition struct{
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

	ToothPositionID uint
	ToothPosition ToothPosition `gorm:"foreignKey:ToothPositionID;references:ID"`

	ToothNumberID uint
	ToothNumber ToothNumber `gorm:"foreignKey:ToothNumberID;references:ID"`

	TreatmentID uint
	Treatment Treatment `gorm:"foreignKey:TreatmentID;references:ID"`
}