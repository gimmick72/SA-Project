package entity

import (
	"time"
	"gorm.io/gorm"
)

type DentistMenagement struct {
	gorm.Model	`gorm:"primaryKey"`

	// DentiatID uint
	// Dentist Dentist `gorm:"forreignKey"`

	ServiceID uint 
	Service	Service	`grom:"foreignKey"`

	Date time.Time
	Timein time.Time
}