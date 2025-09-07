package entity

import (
	"time"
	"gorm.io/gorm"
)

type DentistManagement struct {
	gorm.Model
	Room string
	TimeIn time.Time
	TimeOut time.Time
	Dentist string
}