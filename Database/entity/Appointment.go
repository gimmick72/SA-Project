package entity

import "time"

type Appointment struct {
	ID          uint      `gorm:"primaryKey"`
	Date        time.Time `gorm:"uniqueIndex:uniq_slot,priority:1"`
	RoomID      string    `gorm:"uniqueIndex:uniq_slot,priority:2"`
	Time        string    `gorm:"uniqueIndex:uniq_slot,priority:3"` // "HH:MM"

	PatientID   string    `gorm:"index"`
	PatientName string
	Type        string                    // "appointment" | "walkin"
	CaseCode    *string
	Note        *string
	DurationMin *int
}
