package entity

import (
	"time"
)

type DentistManagement struct {
	ID      uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	Room    string    `json:"room"`
	TimeIn  time.Time `json:"time_in"`
	TimeOut time.Time `json:"time_out"`
	Dentist string    `json:"dentist"`
}