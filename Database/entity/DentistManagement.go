package entity

import (
	"time"
	"gorm.io/gorm"
)

type DentistMenagement struct {
	gorm.Model
	Room string
	Date time.Time
	Timein time.Time
	TimeOut time.Time
}