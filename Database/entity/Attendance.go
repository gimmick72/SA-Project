package entity

import (
	"time"

	"gorm.io/gorm"
)

// Attendance represents staff attendance records
type Attendance struct {
	gorm.Model
	StaffID     uint         `json:"staff_id" gorm:"not null"`
	Staff       PersonalData `json:"staff,omitempty" gorm:"foreignKey:StaffID;references:ID"`
	Date        time.Time    `json:"date" gorm:"not null"`
	CheckInTime *time.Time   `json:"check_in_time"`
	CheckOutTime *time.Time  `json:"check_out_time"`
	WorkHours   float64      `json:"work_hours" gorm:"default:0"`
	Status      string       `json:"status" gorm:"default:present"` // present, late, absent, half_day
	Notes       string       `json:"notes"`
	Location    string       `json:"location"`
	IsLate      bool         `json:"is_late" gorm:"default:false"`
	LateMinutes int          `json:"late_minutes" gorm:"default:0"`
}

// AttendanceRequest for creating attendance records
type AttendanceRequest struct {
	StaffID     uint   `json:"staff_id" binding:"required"`
	Date        string `json:"date" binding:"required"` // Accept date as string (YYYY-MM-DD)
	CheckInTime *time.Time `json:"check_in_time"`
	CheckOutTime *time.Time `json:"check_out_time"`
	Status      string `json:"status" binding:"oneof=present late absent half_day scheduled"`
	Notes       string `json:"notes"`
	Location    string `json:"location"`
}

// AttendanceResponse for API responses
type AttendanceResponse struct {
	ID           uint      `json:"id"`
	StaffID      uint      `json:"staff_id"`
	StaffName    string    `json:"staff_name"`
	Date         time.Time `json:"date"`
	CheckInTime  *time.Time `json:"check_in_time"`
	CheckOutTime *time.Time `json:"check_out_time"`
	WorkHours    float64   `json:"work_hours"`
	Status       string    `json:"status"`
	Notes        string    `json:"notes"`
	Location     string    `json:"location"`
	IsLate       bool      `json:"is_late"`
	LateMinutes  int       `json:"late_minutes"`
	CreatedAt    time.Time `json:"created_at"`
}

// CheckInRequest for staff check-in
type CheckInRequest struct {
	StaffID  uint   `json:"staff_id" binding:"required"`
	Location string `json:"location"`
	Notes    string `json:"notes"`
}

// CheckOutRequest for staff check-out
type CheckOutRequest struct {
	StaffID uint   `json:"staff_id" binding:"required"`
	Notes   string `json:"notes"`
}

// AttendanceStats for statistics
type AttendanceStats struct {
	TotalStaff    int     `json:"total_staff"`
	PresentCount  int     `json:"present_count"`
	LateCount     int     `json:"late_count"`
	AbsentCount   int     `json:"absent_count"`
	HalfDayCount  int     `json:"half_day_count"`
	AverageHours  float64 `json:"average_hours"`
	TotalHours    float64 `json:"total_hours"`
}

// AttendanceFilter for filtering attendance records
type AttendanceFilter struct {
	StaffID   uint      `json:"staff_id"`
	Status    string    `json:"status"`
	DateFrom  time.Time `json:"date_from"`
	DateTo    time.Time `json:"date_to"`
	Page      int       `json:"page"`
	PageSize  int       `json:"page_size"`
}

// Calculate work hours based on check-in and check-out times
func (a *Attendance) CalculateWorkHours() {
	if a.CheckInTime != nil && a.CheckOutTime != nil {
		duration := a.CheckOutTime.Sub(*a.CheckInTime)
		a.WorkHours = duration.Hours()
	}
}

// Check if staff is late (assuming work starts at 8:00 AM)
func (a *Attendance) CheckLateStatus() {
	if a.CheckInTime != nil {
		workStartTime := time.Date(a.Date.Year(), a.Date.Month(), a.Date.Day(), 8, 0, 0, 0, a.Date.Location())
		if a.CheckInTime.After(workStartTime) {
			a.IsLate = true
			a.LateMinutes = int(a.CheckInTime.Sub(workStartTime).Minutes())
			if a.Status == "present" {
				a.Status = "late"
			}
		}
	}
}
