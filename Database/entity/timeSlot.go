package entity

import (
	"gorm.io/gorm"
	"time"
)

type Timeslot struct{
	gorm.Model
	Slot time.Time `json:timeslot`
	SlotAvaliable int `json:slotAvaliable`
}
