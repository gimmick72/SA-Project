package entity
import (
	"gorm.io/gorm"
	"time"
)


type Queue struct{
	gorm.Model
	Username string
	QueueBooking time.Time
	
	PatientId uint
	Patient Patient `gorm:"foreignKey"`
	
	ServiceID uint
	Service Service `gorm:"foreignKey"`
	
	Timeslot uint
	Timerslot Timeslot `gorm:"foreignKey"`
}

type Timeslot struct{
	gorm.Model
	Slot time.Time
	SlotAvaliable int
}