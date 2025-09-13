package entity

import (
	"gorm.io/gorm"
)

type WorkSchedule struct {
	gorm.Model
	StaffID     uint   `json:"staff_id" gorm:"not null"`
	Date        string `json:"date" gorm:"not null"`
	StartTime   string `json:"start_time" gorm:"not null"`
	EndTime     string `json:"end_time" gorm:"not null"`
	ShiftType   string `json:"shift_type" gorm:"default:'morning'"`
	Notes       string `json:"notes"`
	IsActive    bool   `json:"is_active" gorm:"default:true"`
	
	// Relations
	Staff *PersonalData `json:"staff,omitempty" gorm:"foreignKey:StaffID"`
}

// TableName specifies the table name for WorkSchedule
func (WorkSchedule) TableName() string {
	return "work_schedules"
}
