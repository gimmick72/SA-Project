package entity

import (
	"time"
	"gorm.io/gorm"
)

type Schedule struct {
	gorm.Model
	StaffID     uint         `json:"staff_id" gorm:"not null"`
	Staff       PersonalData `json:"staff" gorm:"foreignKey:StaffID;references:ID"`
	Date        time.Time    `json:"date" gorm:"not null"`
	StartTime   time.Time    `json:"start_time" gorm:"not null"`
	EndTime     time.Time    `json:"end_time" gorm:"not null"`
	ShiftType   string       `json:"shift_type" gorm:"type:varchar(20);not null"` // morning, afternoon, evening, night, full_day
	Status      string       `json:"status" gorm:"type:varchar(20);default:'scheduled'"` // scheduled, confirmed, cancelled
	Notes       string       `json:"notes" gorm:"type:text"`
	CreatedBy   uint         `json:"created_by"`
	UpdatedBy   uint         `json:"updated_by"`
}

// ScheduleRequest represents the request structure for creating/updating schedules
type ScheduleRequest struct {
	StaffID   uint   `json:"staff_id" binding:"required"`
	Date      string `json:"date" binding:"required"` // YYYY-MM-DD format
	StartTime string `json:"start_time" binding:"required"` // HH:MM format
	EndTime   string `json:"end_time" binding:"required"`   // HH:MM format
	ShiftType string `json:"shift_type" binding:"required"`
	Status    string `json:"status"`
	Notes     string `json:"notes"`
}

// ScheduleResponse represents the response structure for schedules
type ScheduleResponse struct {
	ID        uint         `json:"id"`
	StaffID   uint         `json:"staff_id"`
	Staff     *PersonalData `json:"staff,omitempty"`
	StaffName string       `json:"staff_name"`
	Date      string       `json:"date"`      // YYYY-MM-DD format
	StartTime string       `json:"start_time"` // HH:MM format
	EndTime   string       `json:"end_time"`   // HH:MM format
	ShiftType string       `json:"shift_type"`
	Status    string       `json:"status"`
	Notes     string       `json:"notes"`
	CreatedAt time.Time    `json:"created_at"`
	UpdatedAt time.Time    `json:"updated_at"`
}

// WeeklyScheduleRequest for generating weekly schedules
type WeeklyScheduleRequest struct {
	StaffIDs  []uint `json:"staff_ids" binding:"required"`
	StartDate string `json:"start_date" binding:"required"` // YYYY-MM-DD format
	EndDate   string `json:"end_date" binding:"required"`   // YYYY-MM-DD format
	ShiftType string `json:"shift_type"`
	StartTime string `json:"start_time"`
	EndTime   string `json:"end_time"`
}

// ScheduleStatsResponse for schedule statistics
type ScheduleStatsResponse struct {
	TotalSchedules     int64 `json:"total_schedules"`
	ConfirmedSchedules int64 `json:"confirmed_schedules"`
	PendingSchedules   int64 `json:"pending_schedules"`
	CancelledSchedules int64 `json:"cancelled_schedules"`
	StaffCount         int64 `json:"staff_count"`
}

// ToResponse converts Schedule to ScheduleResponse
func (s *Schedule) ToResponse() ScheduleResponse {
	staffName := ""
	if s.Staff.FirstName != "" || s.Staff.LastName != "" {
		staffName = s.Staff.FirstName + " " + s.Staff.LastName
	}
	
	return ScheduleResponse{
		ID:        s.ID,
		StaffID:   s.StaffID,
		Staff:     &s.Staff,
		StaffName: staffName,
		Date:      s.Date.Format("2006-01-02"),
		StartTime: s.StartTime.Format("15:04"),
		EndTime:   s.EndTime.Format("15:04"),
		ShiftType: s.ShiftType,
		Status:    s.Status,
		Notes:     s.Notes,
		CreatedAt: s.CreatedAt,
		UpdatedAt: s.UpdatedAt,
	}
}

// TableName sets the table name for Schedule
func (Schedule) TableName() string {
	return "schedules"
}
