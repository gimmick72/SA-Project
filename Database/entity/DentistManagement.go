package entity

import (
	"time"
	"gorm.io/gorm"
)

type DentistMenagement struct {
	gorm.Model	`gorm:"primaryKey"`
	Room string
	Date time.Time
	Timein time.Time
	TimeOut time.Time
}