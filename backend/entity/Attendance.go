package entity

import (
	"time"
	"gorm.io/gorm"
)

// Attendance represents staff attendance records
type Attendance struct {
	gorm.Model
	StaffID    string    `json:"staff_id" gorm:"not null"`
	StaffName  string    `json:"staff_name" gorm:"not null"`
	Position   string    `json:"position" gorm:"not null"`
	Date       time.Time `json:"date" gorm:"not null"`
	CheckIn    *string   `json:"check_in,omitempty"`
	CheckOut   *string   `json:"check_out,omitempty"`
	WorkHours  *float64  `json:"work_hours,omitempty"`
	Status     string    `json:"status" gorm:"not null;default:'present'"` // present, late, absent, half-day
	Notes      string    `json:"notes,omitempty"`
	CreatedBy  *uint     `json:"created_by,omitempty"`
	UpdatedBy  *uint     `json:"updated_by,omitempty"`
}

// AttendanceRequest represents the request payload for creating/updating attendance
type AttendanceRequest struct {
	StaffID   string `json:"staff_id" binding:"required"`
	StaffName string `json:"staff_name" binding:"required"`
	Position  string `json:"position" binding:"required"`
	Date      string `json:"date" binding:"required"` // Format: YYYY-MM-DD
	CheckIn   string `json:"check_in,omitempty"`      // Format: HH:mm
	CheckOut  string `json:"check_out,omitempty"`     // Format: HH:mm
	Status    string `json:"status" binding:"required,oneof=present late absent half-day"`
	Notes     string `json:"notes,omitempty"`
}

// AttendanceResponse represents the response payload for attendance operations
type AttendanceResponse struct {
	ID        uint      `json:"id"`
	StaffID   string    `json:"staff_id"`
	StaffName string    `json:"staff_name"`
	Position  string    `json:"position"`
	Date      string    `json:"date"`
	CheckIn   *string   `json:"check_in,omitempty"`
	CheckOut  *string   `json:"check_out,omitempty"`
	WorkHours *float64  `json:"work_hours,omitempty"`
	Status    string    `json:"status"`
	Notes     string    `json:"notes,omitempty"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// AttendanceListResponse represents paginated attendance list response
type AttendanceListResponse struct {
	Data       []AttendanceResponse `json:"data"`
	Total      int64                `json:"total"`
	Page       int                  `json:"page"`
	PageSize   int                  `json:"page_size"`
	TotalPages int                  `json:"total_pages"`
}

// AttendanceStatsResponse represents attendance statistics
type AttendanceStatsResponse struct {
	TotalStaff   int64 `json:"total_staff"`
	PresentStaff int64 `json:"present_staff"`
	LateStaff    int64 `json:"late_staff"`
	AbsentStaff  int64 `json:"absent_staff"`
	HalfDayStaff int64 `json:"half_day_staff"`
	Date         string `json:"date"`
}

// AttendanceFilter represents filter options for attendance queries
type AttendanceFilter struct {
	StartDate string `json:"start_date,omitempty"`
	EndDate   string `json:"end_date,omitempty"`
	Status    string `json:"status,omitempty"`
	StaffID   string `json:"staff_id,omitempty"`
	Position  string `json:"position,omitempty"`
}
