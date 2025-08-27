package entity

import (
	"time"

	"gorm.io/gorm"
)

type Shifts struct {
	gorm.Model
	ShiftsName           string
	StartTime            time.Time
	EndTime              time.Time
	BreakDurationMinutes time.Time
	StandardHours        int
}

type Schedules struct {
	gorm.Model
	SchedulesDate time.Time

	ShiftsID uint
	Shifts   Shifts

	PersonalDataID uint
	PersonalData   PersonalData
}
