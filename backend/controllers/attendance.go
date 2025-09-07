package controllers

import (
	"fmt"
	"math"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"

	"Database/configs"
	"Database/entity"
)

type AttendanceController struct{}

// NewAttendanceController creates a new attendance controller
func NewAttendanceController() *AttendanceController {
	return &AttendanceController{}
}

// CreateAttendance creates a new attendance record
// POST /api/attendance
func (ac *AttendanceController) CreateAttendance(c *gin.Context) {
	var req entity.AttendanceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Invalid request data: " + err.Error()})
		return
	}

	// Parse date
	date, err := time.Parse("2006-01-02", req.Date)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Invalid date format. Use YYYY-MM-DD"})
		return
	}

	// Calculate work hours if both check-in and check-out are provided
	var workHours *float64
	if req.CheckIn != "" && req.CheckOut != "" {
		checkInTime, err1 := time.Parse("15:04", req.CheckIn)
		checkOutTime, err2 := time.Parse("15:04", req.CheckOut)
		if err1 == nil && err2 == nil {
			duration := checkOutTime.Sub(checkInTime)
			hours := duration.Hours()
			workHours = &hours
		}
	}

	// Create attendance record
	attendance := entity.Attendance{
		StaffID:   req.StaffID,
		StaffName: req.StaffName,
		Position:  req.Position,
		Date:      date,
		CheckIn:   &req.CheckIn,
		CheckOut:  &req.CheckOut,
		WorkHours: workHours,
		Status:    req.Status,
		Notes:     req.Notes,
	}

	// Handle empty check-in/check-out
	if req.CheckIn == "" {
		attendance.CheckIn = nil
	}
	if req.CheckOut == "" {
		attendance.CheckOut = nil
	}

	db := configs.DB()
	if err := db.Create(&attendance).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Failed to create attendance record: " + err.Error()})
		return
	}

	// Convert to response format
	response := ac.toAttendanceResponse(&attendance)
	c.JSON(http.StatusCreated, gin.H{"success": true, "data": response})
}

// GetAttendanceList retrieves attendance records with pagination and filtering
// GET /api/attendance
func (ac *AttendanceController) GetAttendanceList(c *gin.Context) {
	db := configs.DB()

	// Parse query parameters
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))
	startDate := c.Query("start_date")
	endDate := c.Query("end_date")
	status := c.Query("status")
	staffID := c.Query("staff_id")
	position := c.Query("position")

	// Build query
	query := db.Model(&entity.Attendance{})

	// Apply filters
	if startDate != "" {
		query = query.Where("date >= ?", startDate)
	}
	if endDate != "" {
		query = query.Where("date <= ?", endDate)
	}
	if status != "" {
		query = query.Where("status = ?", status)
	}
	if staffID != "" {
		query = query.Where("staff_id LIKE ?", "%"+staffID+"%")
	}
	if position != "" {
		query = query.Where("position = ?", position)
	}

	// Count total records
	var total int64
	if err := query.Count(&total).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Failed to count attendance records"})
		return
	}

	// Calculate pagination
	offset := (page - 1) * pageSize
	totalPages := int(math.Ceil(float64(total) / float64(pageSize)))

	// Fetch records
	var attendances []entity.Attendance
	if err := query.Order("date DESC, created_at DESC").Offset(offset).Limit(pageSize).Find(&attendances).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Failed to fetch attendance records"})
		return
	}

	// Convert to response format
	var responseData []entity.AttendanceResponse
	for _, attendance := range attendances {
		responseData = append(responseData, *ac.toAttendanceResponse(&attendance))
	}

	response := entity.AttendanceListResponse{
		Data:       responseData,
		Total:      total,
		Page:       page,
		PageSize:   pageSize,
		TotalPages: totalPages,
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": response})
}

// GetAttendanceByID retrieves a specific attendance record
// GET /api/attendance/:id
func (ac *AttendanceController) GetAttendanceByID(c *gin.Context) {
	id := c.Param("id")
	
	db := configs.DB()
	var attendance entity.Attendance
	
	if err := db.First(&attendance, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "error": "Attendance record not found"})
		return
	}

	response := ac.toAttendanceResponse(&attendance)
	c.JSON(http.StatusOK, gin.H{"success": true, "data": response})
}

// UpdateAttendance updates an existing attendance record
// PUT /api/attendance/:id
func (ac *AttendanceController) UpdateAttendance(c *gin.Context) {
	id := c.Param("id")
	
	var req entity.AttendanceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Invalid request data: " + err.Error()})
		return
	}

	db := configs.DB()
	var attendance entity.Attendance
	
	if err := db.First(&attendance, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "error": "Attendance record not found"})
		return
	}

	// Parse date
	date, err := time.Parse("2006-01-02", req.Date)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Invalid date format. Use YYYY-MM-DD"})
		return
	}

	// Calculate work hours if both check-in and check-out are provided
	var workHours *float64
	if req.CheckIn != "" && req.CheckOut != "" {
		checkInTime, err1 := time.Parse("15:04", req.CheckIn)
		checkOutTime, err2 := time.Parse("15:04", req.CheckOut)
		if err1 == nil && err2 == nil {
			duration := checkOutTime.Sub(checkInTime)
			hours := duration.Hours()
			workHours = &hours
		}
	}

	// Update fields
	attendance.StaffID = req.StaffID
	attendance.StaffName = req.StaffName
	attendance.Position = req.Position
	attendance.Date = date
	attendance.Status = req.Status
	attendance.Notes = req.Notes
	attendance.WorkHours = workHours

	// Handle check-in/check-out
	if req.CheckIn == "" {
		attendance.CheckIn = nil
	} else {
		attendance.CheckIn = &req.CheckIn
	}
	if req.CheckOut == "" {
		attendance.CheckOut = nil
	} else {
		attendance.CheckOut = &req.CheckOut
	}

	if err := db.Save(&attendance).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Failed to update attendance record"})
		return
	}

	response := ac.toAttendanceResponse(&attendance)
	c.JSON(http.StatusOK, gin.H{"success": true, "data": response})
}

// DeleteAttendance deletes an attendance record
// DELETE /api/attendance/:id
func (ac *AttendanceController) DeleteAttendance(c *gin.Context) {
	id := c.Param("id")
	
	db := configs.DB()
	var attendance entity.Attendance
	
	if err := db.First(&attendance, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "error": "Attendance record not found"})
		return
	}

	if err := db.Delete(&attendance).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Failed to delete attendance record"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Attendance record deleted successfully"})
}

// GetAttendanceStats retrieves attendance statistics for a specific date
// GET /api/attendance/stats
func (ac *AttendanceController) GetAttendanceStats(c *gin.Context) {
	date := c.DefaultQuery("date", time.Now().Format("2006-01-02"))
	
	db := configs.DB()
	
	// Parse the date to ensure proper format
	parsedDate, err := time.Parse("2006-01-02", date)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Invalid date format. Use YYYY-MM-DD"})
		return
	}
	
	// Use DATE() function to compare only the date part
	dateStr := parsedDate.Format("2006-01-02")
	
	// Count total staff for the date
	var totalStaff int64
	db.Model(&entity.Attendance{}).Where("DATE(date) = ?", dateStr).Count(&totalStaff)
	
	// Count by status
	var presentStaff, lateStaff, absentStaff, halfDayStaff int64
	
	db.Model(&entity.Attendance{}).Where("DATE(date) = ? AND status = ?", dateStr, "present").Count(&presentStaff)
	db.Model(&entity.Attendance{}).Where("DATE(date) = ? AND status = ?", dateStr, "late").Count(&lateStaff)
	db.Model(&entity.Attendance{}).Where("DATE(date) = ? AND status = ?", dateStr, "absent").Count(&absentStaff)
	db.Model(&entity.Attendance{}).Where("DATE(date) = ? AND status = ?", dateStr, "half-day").Count(&halfDayStaff)

	stats := entity.AttendanceStatsResponse{
		TotalStaff:   totalStaff,
		PresentStaff: presentStaff,
		LateStaff:    lateStaff,
		AbsentStaff:  absentStaff,
		HalfDayStaff: halfDayStaff,
		Date:         dateStr,
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": stats})
}

// CheckInOut handles check-in and check-out operations
// POST /api/attendance/checkin
// POST /api/attendance/checkout
func (ac *AttendanceController) CheckInOut(c *gin.Context) {
	action := c.Param("action") // "checkin" or "checkout"
	
	var req struct {
		StaffID   string `json:"staff_id" binding:"required"`
		StaffName string `json:"staff_name" binding:"required"`
		Position  string `json:"position" binding:"required"`
		Time      string `json:"time,omitempty"` // Optional, defaults to current time
	}
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Invalid request data: " + err.Error()})
		return
	}

	db := configs.DB()
	today := time.Now().Format("2006-01-02")
	currentTime := time.Now().Format("15:04")
	
	if req.Time != "" {
		// Validate time format
		if _, err := time.Parse("15:04", req.Time); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Invalid time format. Use HH:mm"})
			return
		}
		currentTime = req.Time
	}

	// Find or create attendance record for today
	var attendance entity.Attendance
	result := db.Where("staff_id = ? AND date = ?", req.StaffID, today).First(&attendance)
	
	if result.Error != nil {
		// Create new attendance record for check-in
		if action == "checkin" {
			date, _ := time.Parse("2006-01-02", today)
			attendance = entity.Attendance{
				StaffID:   req.StaffID,
				StaffName: req.StaffName,
				Position:  req.Position,
				Date:      date,
				CheckIn:   &currentTime,
				Status:    "present",
			}
			
			// Determine if late (assuming 8:00 AM is standard time)
			checkInTime, _ := time.Parse("15:04", currentTime)
			standardTime, _ := time.Parse("15:04", "08:00")
			if checkInTime.After(standardTime) {
				attendance.Status = "late"
			}
			
			if err := db.Create(&attendance).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Failed to create attendance record"})
				return
			}
		} else {
			c.JSON(http.StatusNotFound, gin.H{"success": false, "error": "No check-in record found for today"})
			return
		}
	} else {
		// Update existing record
		if action == "checkin" {
			attendance.CheckIn = &currentTime
			// Update status based on time
			checkInTime, _ := time.Parse("15:04", currentTime)
			standardTime, _ := time.Parse("15:04", "08:00")
			if checkInTime.After(standardTime) {
				attendance.Status = "late"
			} else {
				attendance.Status = "present"
			}
		} else if action == "checkout" {
			attendance.CheckOut = &currentTime
			
			// Calculate work hours
			if attendance.CheckIn != nil {
				checkInTime, err1 := time.Parse("15:04", *attendance.CheckIn)
				checkOutTime, err2 := time.Parse("15:04", currentTime)
				if err1 == nil && err2 == nil {
					duration := checkOutTime.Sub(checkInTime)
					hours := duration.Hours()
					attendance.WorkHours = &hours
				}
			}
		}
		
		if err := db.Save(&attendance).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Failed to update attendance record"})
			return
		}
	}

	response := ac.toAttendanceResponse(&attendance)
	c.JSON(http.StatusOK, gin.H{
		"success": true, 
		"message": fmt.Sprintf("Successfully %s", action),
		"data": response,
	})
}

// Helper function to convert Attendance to AttendanceResponse
func (ac *AttendanceController) toAttendanceResponse(attendance *entity.Attendance) *entity.AttendanceResponse {
	return &entity.AttendanceResponse{
		ID:        attendance.ID,
		StaffID:   attendance.StaffID,
		StaffName: attendance.StaffName,
		Position:  attendance.Position,
		Date:      attendance.Date.Format("2006-01-02"),
		CheckIn:   attendance.CheckIn,
		CheckOut:  attendance.CheckOut,
		WorkHours: attendance.WorkHours,
		Status:    attendance.Status,
		Notes:     attendance.Notes,
		CreatedAt: attendance.CreatedAt,
		UpdatedAt: attendance.UpdatedAt,
	}
}
