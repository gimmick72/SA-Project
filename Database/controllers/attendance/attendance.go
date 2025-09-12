package controllers

import (
	"net/http"
	"strconv"
	"time"

	"Database/configs"
	"Database/entity"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// CreateAttendance creates a new attendance record
func CreateAttendance(c *gin.Context) {
	var req entity.AttendanceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data", "details": err.Error()})
		return
	}

	// Create attendance record
	attendance := entity.Attendance{
		StaffID:      req.StaffID,
		Date:         req.Date,
		CheckInTime:  req.CheckInTime,
		CheckOutTime: req.CheckOutTime,
		Status:       req.Status,
		Notes:        req.Notes,
		Location:     req.Location,
	}

	// Calculate work hours and late status
	attendance.CalculateWorkHours()
	attendance.CheckLateStatus()

	if err := configs.DB.Create(&attendance).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create attendance", "details": err.Error()})
		return
	}

	// Load staff relation
	configs.DB.Preload("Staff").First(&attendance, attendance.ID)

	// Create response
	response := entity.AttendanceResponse{
		ID:           attendance.ID,
		StaffID:      attendance.StaffID,
		Date:         attendance.Date,
		CheckInTime:  attendance.CheckInTime,
		CheckOutTime: attendance.CheckOutTime,
		WorkHours:    attendance.WorkHours,
		Status:       attendance.Status,
		Notes:        attendance.Notes,
		Location:     attendance.Location,
		IsLate:       attendance.IsLate,
		LateMinutes:  attendance.LateMinutes,
		CreatedAt:    attendance.CreatedAt,
	}

	if attendance.Staff.ID != 0 {
		response.StaffName = attendance.Staff.FirstName + " " + attendance.Staff.LastName
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Attendance created successfully",
		"data":    response,
	})
}

// GetAttendances retrieves attendance records with filtering and pagination
func GetAttendances(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))
	staffID := c.Query("staff_id")
	status := c.Query("status")
	dateFrom := c.Query("date_from")
	dateTo := c.Query("date_to")

	offset := (page - 1) * pageSize

	var attendances []entity.Attendance
	var total int64

	query := configs.DB.Model(&entity.Attendance{})

	// Apply filters
	if staffID != "" {
		query = query.Where("staff_id = ?", staffID)
	}
	if status != "" {
		query = query.Where("status = ?", status)
	}
	if dateFrom != "" {
		if parsedDate, err := time.Parse("2006-01-02", dateFrom); err == nil {
			query = query.Where("date >= ?", parsedDate)
		}
	}
	if dateTo != "" {
		if parsedDate, err := time.Parse("2006-01-02", dateTo); err == nil {
			query = query.Where("date <= ?", parsedDate)
		}
	}

	query.Count(&total)

	if err := query.Preload("Staff").Offset(offset).Limit(pageSize).
		Order("date DESC, created_at DESC").Find(&attendances).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve attendances", "details": err.Error()})
		return
	}

	var responses []entity.AttendanceResponse
	for _, attendance := range attendances {
		response := entity.AttendanceResponse{
			ID:           attendance.ID,
			StaffID:      attendance.StaffID,
			Date:         attendance.Date,
			CheckInTime:  attendance.CheckInTime,
			CheckOutTime: attendance.CheckOutTime,
			WorkHours:    attendance.WorkHours,
			Status:       attendance.Status,
			Notes:        attendance.Notes,
			Location:     attendance.Location,
			IsLate:       attendance.IsLate,
			LateMinutes:  attendance.LateMinutes,
			CreatedAt:    attendance.CreatedAt,
		}

		if attendance.Staff.ID != 0 {
			response.StaffName = attendance.Staff.FirstName + " " + attendance.Staff.LastName
		}

		responses = append(responses, response)
	}

	c.JSON(http.StatusOK, gin.H{
		"data": responses,
		"pagination": gin.H{
			"page":       page,
			"page_size":  pageSize,
			"total":      total,
			"total_pages": (total + int64(pageSize) - 1) / int64(pageSize),
		},
	})
}

// GetAttendance retrieves a specific attendance record
func GetAttendance(c *gin.Context) {
	id := c.Param("id")

	var attendance entity.Attendance
	if err := configs.DB.Preload("Staff").First(&attendance, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Attendance record not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve attendance", "details": err.Error()})
		return
	}

	response := entity.AttendanceResponse{
		ID:           attendance.ID,
		StaffID:      attendance.StaffID,
		Date:         attendance.Date,
		CheckInTime:  attendance.CheckInTime,
		CheckOutTime: attendance.CheckOutTime,
		WorkHours:    attendance.WorkHours,
		Status:       attendance.Status,
		Notes:        attendance.Notes,
		Location:     attendance.Location,
		IsLate:       attendance.IsLate,
		LateMinutes:  attendance.LateMinutes,
		CreatedAt:    attendance.CreatedAt,
	}

	if attendance.Staff.ID != 0 {
		response.StaffName = attendance.Staff.FirstName + " " + attendance.Staff.LastName
	}

	c.JSON(http.StatusOK, gin.H{"data": response})
}

// UpdateAttendance updates an attendance record
func UpdateAttendance(c *gin.Context) {
	id := c.Param("id")

	var attendance entity.Attendance
	if err := configs.DB.First(&attendance, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Attendance record not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find attendance", "details": err.Error()})
		return
	}

	var req entity.AttendanceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data", "details": err.Error()})
		return
	}

	// Update fields
	attendance.StaffID = req.StaffID
	attendance.Date = req.Date
	attendance.CheckInTime = req.CheckInTime
	attendance.CheckOutTime = req.CheckOutTime
	attendance.Status = req.Status
	attendance.Notes = req.Notes
	attendance.Location = req.Location

	// Recalculate work hours and late status
	attendance.CalculateWorkHours()
	attendance.CheckLateStatus()

	if err := configs.DB.Save(&attendance).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update attendance", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Attendance updated successfully"})
}

// DeleteAttendance deletes an attendance record
func DeleteAttendance(c *gin.Context) {
	id := c.Param("id")

	var attendance entity.Attendance
	if err := configs.DB.First(&attendance, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Attendance record not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find attendance", "details": err.Error()})
		return
	}

	if err := configs.DB.Delete(&attendance).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete attendance", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Attendance deleted successfully"})
}

// CheckIn handles staff check-in
func CheckIn(c *gin.Context) {
	var req entity.CheckInRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data", "details": err.Error()})
		return
	}

	today := time.Now().Truncate(24 * time.Hour)
	now := time.Now()

	// Check if already checked in today
	var existingAttendance entity.Attendance
	if err := configs.DB.Where("staff_id = ? AND date = ?", req.StaffID, today).First(&existingAttendance).Error; err == nil {
		if existingAttendance.CheckInTime != nil {
			c.JSON(http.StatusConflict, gin.H{"error": "Already checked in today"})
			return
		}
	}

	// Create or update attendance record
	attendance := entity.Attendance{
		StaffID:     req.StaffID,
		Date:        today,
		CheckInTime: &now,
		Status:      "present",
		Notes:       req.Notes,
		Location:    req.Location,
	}

	// Check late status
	attendance.CheckLateStatus()

	if err := configs.DB.Create(&attendance).Error; err != nil {
		// If record exists, update it
		if err := configs.DB.Model(&existingAttendance).Updates(map[string]interface{}{
			"check_in_time": now,
			"status":        attendance.Status,
			"notes":         req.Notes,
			"location":      req.Location,
			"is_late":       attendance.IsLate,
			"late_minutes":  attendance.LateMinutes,
		}).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check in", "details": err.Error()})
			return
		}
		attendance = existingAttendance
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Checked in successfully",
		"data": gin.H{
			"check_in_time": now,
			"is_late":       attendance.IsLate,
			"late_minutes":  attendance.LateMinutes,
		},
	})
}

// CheckOut handles staff check-out
func CheckOut(c *gin.Context) {
	var req entity.CheckOutRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data", "details": err.Error()})
		return
	}

	today := time.Now().Truncate(24 * time.Hour)
	now := time.Now()

	// Find today's attendance record
	var attendance entity.Attendance
	if err := configs.DB.Where("staff_id = ? AND date = ?", req.StaffID, today).First(&attendance).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "No check-in record found for today"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find attendance record", "details": err.Error()})
		return
	}

	if attendance.CheckInTime == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Must check in before checking out"})
		return
	}

	if attendance.CheckOutTime != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Already checked out today"})
		return
	}

	// Update check-out time and calculate work hours
	attendance.CheckOutTime = &now
	attendance.Notes = req.Notes
	attendance.CalculateWorkHours()

	if err := configs.DB.Save(&attendance).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check out", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Checked out successfully",
		"data": gin.H{
			"check_out_time": now,
			"work_hours":     attendance.WorkHours,
		},
	})
}

// GetAttendanceStats retrieves attendance statistics
func GetAttendanceStats(c *gin.Context) {
	dateFrom := c.DefaultQuery("date_from", time.Now().AddDate(0, 0, -30).Format("2006-01-02"))
	dateTo := c.DefaultQuery("date_to", time.Now().Format("2006-01-02"))

	var stats entity.AttendanceStats

	// Parse dates
	fromDate, err := time.Parse("2006-01-02", dateFrom)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date_from format"})
		return
	}

	toDate, err := time.Parse("2006-01-02", dateTo)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date_to format"})
		return
	}

	// Get attendance records in date range
	var attendances []entity.Attendance
	if err := configs.DB.Where("date BETWEEN ? AND ?", fromDate, toDate).Find(&attendances).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve attendance data", "details": err.Error()})
		return
	}

	// Calculate statistics
	statusCounts := make(map[string]int)
	var totalHours float64

	for _, attendance := range attendances {
		statusCounts[attendance.Status]++
		totalHours += attendance.WorkHours
	}

	stats.TotalStaff = len(attendances)
	stats.PresentCount = statusCounts["present"]
	stats.LateCount = statusCounts["late"]
	stats.AbsentCount = statusCounts["absent"]
	stats.HalfDayCount = statusCounts["half_day"]
	stats.TotalHours = totalHours

	if len(attendances) > 0 {
		stats.AverageHours = totalHours / float64(len(attendances))
	}

	c.JSON(http.StatusOK, gin.H{
		"data": stats,
		"date_range": gin.H{
			"from": dateFrom,
			"to":   dateTo,
		},
	})
}
