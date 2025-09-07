package entity
import (
	"gorm.io/gorm"
	"time"
)


type Queue struct {
	gorm.Model
	Username     string
	QueueBooking time.Time

	PatientId uint
	Patient   Patient `gorm:"foreignKey:PatientId;references:ID"`

	ServiceID uint
	Service   Service `gorm:"foreignKey:ServiceID;references:ID"`

	TimeslotID uint
	Timeslot   Timeslot `gorm:"foreignKey:TimeslotID;references:ID"`
}

type Timeslot struct{
	gorm.Model
	Slot time.Time
	SlotAvaliable int
}