package entity

import (
	"time"

	"gorm.io/gorm"
)

type Room struct{
	gorm.Model
	RoomName string
}

type RoomReservation struct{
	gorm.Model
	Date time.Time
	Time time.Time
	StatusRoom string
	
	RoomID uint
	Room Room

	DentistManagementID uint
	DentistManagement DentistManagement
}