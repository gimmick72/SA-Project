package bookingQueue

import (
	"gorm.io/gorm"
	"time"
)

type Timeslot struct{
	gorm.Model
	Slot time.Time
	SlotAvaliable int
}
