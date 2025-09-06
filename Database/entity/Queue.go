//Queue.go
package entity
import (
	"gorm.io/gorm"
	"time"
)

type Queue struct{
	gorm.Model
	Username string
	QueueBooking time.Time
	
	PatientID uint
	Patient Patient `gorm:"foreignKey:PatientID;references:ID"`
	
	ServiceID uint
	Service Service `gorm:"foreignKey:ServiceID;references:ID"`
	
	TimeslotID uint
	Timerslot Timeslot `gorm:"foreignKey:TimeslotID;references:ID"`
}

type Timeslot struct{
	gorm.Model
	Slot time.Time
	SlotAvaliable int
}