package entity

import "time"

type Appointment struct {
	ID          uint      `gorm:"primaryKey"`
	// เก็บเป็นเที่ยงคืน UTC ของวันนั้นเสมอ (ช่วงวันเดียวกันเทียบด้วย >= start AND < end)
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
